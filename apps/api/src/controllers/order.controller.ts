import { Request, Response } from 'express';
import { Order, IOrder, IOrderItem, OrderStatus } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta, generateOrderNumber, escapeRegExp } from '@toys/utils';
import { reserveStock, commitReservedStock, releaseStock } from '../services/stock.service';
import { emailService } from '../services/email.service';
import type { AuthRequest } from '../middleware/auth';

const getShippingCost = (method: string, subtotal: number): number => {
  // Simplified shipping logic (settings integration can enhance this later)
  if (subtotal >= 3000) return 0; // Free over Rs. 3000
  switch (method) {
    case 'same_day':
      return 800;
    case 'express':
      return 500;
    default:
      return 200;
  }
};

// @desc    Create order
// @route   POST /api/v1/orders
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    shippingAddress,
    shippingMethod = 'standard',
    paymentMethod,
    couponCode,
    isGift = false,
    giftMessage,
    giftWrapping = false,
    recipientName,
    recipientAddress,
    customerNotes,
    isGuestOrder = false,
    guestEmail,
    guestPhone,
    guestName,
    loyaltyPointsToRedeem = 0,
    sessionId,
  } = req.body;

  const cart = await Cart.findOne(
    req.user ? { user: req.user._id } : { sessionId },
  );
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400);
  }

  // Validate and build order items with current prices
  const orderItems: any[] = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      throw new AppError(`Product not found: ${item.product}`, 404);
    }

    let price = product.salePrice || product.price;
    let variantName: string | undefined;
    let sku = product.sku;
    let image = product.images[0]?.url || '';

    if (item.variant) {
      const variant = product.variants.id(item.variant);
      if (!variant || !variant.isActive) {
        throw new AppError('Variant not found', 404);
      }
      price = variant.salePrice || variant.price;
      variantName = variant.name;
      sku = variant.sku;
      image = variant.images[0]?.url || image;
    }

    orderItems.push({
      product: product._id,
      productName: product.name,
      productImage: image,
      variant: item.variant,
      variantName,
      sku,
      quantity: item.quantity,
      price,
      salePrice: product.salePrice,
      total: price * item.quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  // Coupon application
  let couponDiscount = cart.couponDiscount || 0;
  let usedCouponCode: string | undefined = cart.couponCode;

  if (couponCode && !cart.couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      if (coupon.startDate <= now && coupon.endDate >= now) {
        if (subtotal >= coupon.minimumOrder) {
          if (coupon.type === 'percentage') {
            couponDiscount = (subtotal * coupon.value) / 100;
            if (coupon.maximumDiscount) couponDiscount = Math.min(couponDiscount, coupon.maximumDiscount);
          } else if (coupon.type === 'fixed') {
            couponDiscount = Math.min(coupon.value, subtotal);
          }
          usedCouponCode = coupon.code;
        }
      }
    }
  }

  // Loyalty points discount (1000 points = Rs. 100)
  let loyaltyDiscount = 0;
  let loyaltyRedeemed = 0;
  if (req.user && loyaltyPointsToRedeem > 0) {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found', 404);
    const maxRedeemable = Math.floor(user.loyaltyPoints / 1000) * 100;
    loyaltyRedeemed = Math.min(loyaltyPointsToRedeem, user.loyaltyPoints);
    loyaltyDiscount = Math.min(maxRedeemable, subtotal - couponDiscount);
  }

  const discountTotal = couponDiscount + loyaltyDiscount;
  const shippingCost = getShippingCost(shippingMethod, subtotal - discountTotal);
  const tax = 0; // Configurable
  const total = Math.max(0, subtotal - discountTotal) + shippingCost + tax;

  // Reserve stock (throws if insufficient)
  await reserveStock(
    orderItems.map((item) => ({
      productId: item.product,
      variantId: item.variant,
      quantity: item.quantity,
      productName: item.productName,
    })),
  );

  let orderNumber = generateOrderNumber();

  let customerId = req.user?._id;
  let customerInfo = {
    name: req.user?.name || guestName || '',
    email: req.user?.email || guestEmail || '',
    phone: req.user?.phone || guestPhone || '',
  };

  // Guest checkout - create a lightweight user record
  if (isGuestOrder && !req.user) {
    const existing = await User.findOne({ email: guestEmail });
    if (existing) {
      customerId = existing._id;
    } else {
      const guest = await User.create({
        name: guestName || 'Guest',
        email: guestEmail,
        phone: guestPhone,
        password: Math.random().toString(36).slice(2),
        referralCode: 'TOY' + Math.random().toString(16).slice(2, 8).toUpperCase(),
      });
      customerId = guest._id;
    }
  }

  const order = await Order.create({
    orderNumber,
    customer: customerId,
    customerInfo,
    isGuestOrder,
    items: orderItems,
    subtotal,
    discount: discountTotal,
    couponCode: usedCouponCode,
    couponDiscount,
    shippingCost,
    tax,
    total,
    loyaltyPointsEarned: Math.floor(total / 100),
    loyaltyPointsRedeemed: loyaltyRedeemed,
    shippingAddress,
    shippingMethod,
    status: 'pending',
    statusHistory: [{ status: 'pending', timestamp: new Date() }],
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    isGift,
    giftMessage: isGift ? giftMessage : undefined,
    giftWrapping: isGift ? giftWrapping : false,
    recipientName: isGift ? recipientName : undefined,
    recipientAddress: isGift ? recipientAddress : undefined,
    customerNotes,
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
    riskScore: 0,
  });

  // Update coupon usage
  if (usedCouponCode) {
    const coupon = await Coupon.findOne({ code: usedCouponCode });
    if (coupon) {
      coupon.usageCount += 1;
      if (req.user) {
        const usage = coupon.usedBy.find((u) => String(u.user) === String(req.user._id));
        if (usage) usage.count += 1;
        else coupon.usedBy.push({ user: req.user._id, count: 1 });
      }
      await coupon.save();
    }
  }

  // Deduct loyalty points if redeemed
  if (req.user && loyaltyRedeemed > 0) {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: -loyaltyRedeemed },
    });
  }

  // Clear cart
  cart.items = [] as any;
  cart.couponCode = undefined;
  cart.couponDiscount = 0;
  cart.totalItems = 0;
  cart.totalAmount = 0;
  await cart.save();

  // Send confirmation email
  emailService
    .sendOrderConfirmation(
      customerInfo.email,
      orderNumber,
      total,
    )
    .catch(() => {});

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get user orders
// @route   GET /api/v1/orders
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = { customer: req.user._id };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get order by order number
// @route   GET /api/v1/orders/:orderNumber
export const getOrderByNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    .populate('items.product', 'name slug images')
    .lean();

  if (!order) throw new AppError('Order not found', 404);

  const STAFF_ROLES = ['admin', 'manager', 'order_manager', 'inventory_manager', 'support', 'marketing', 'content'];
  const isStaff = !!req.user && STAFF_ROLES.includes(req.user.role);
  if (!isStaff && String(order.customer) !== String(req.user._id)) {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({ success: true, data: order });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (String(order.customer) !== String(req.user._id)) {
    throw new AppError('Not authorized to cancel this order', 403);
  }

  const cancellableStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing'];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(`Order cannot be cancelled in current status: ${order.status}`, 400);
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason;
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: req.body.reason,
  });
  await order.save();

  // Release stock
  await releaseStock(
    order.items.map((item) => ({
      productId: String(item.product),
      variantId: item.variant ? String(item.variant) : undefined,
      quantity: item.quantity,
    })),
  );

  // Send cancellation email
  const customerDoc = await User.findById(order.customer);
  if (customerDoc?.email) {
    emailService.sendOrderCancellation(customerDoc.email, order.orderNumber, req.body.reason || 'Customer requested cancellation').catch(() => {});
  }

  res.status(200).json({ success: true, data: order });
});

// @desc    Request return
// @route   POST /api/v1/orders/:id/return
export const requestReturn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (String(order.customer) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  if (order.status === 'delivered' || order.status === 'refund_requested') {
    order.status = 'refund_requested';
  } else {
    // Allow return only for delivered or shipped orders
    if (!['delivered', 'shipped', 'refund_requested'].includes(order.status)) {
      throw new AppError('Orders can only be returned after delivery', 400);
    }
    order.status = 'refund_requested';
  }

  order.returnReason = req.body.reason;
  order.returnImages = req.body.images || [];
  order.statusHistory.push({
    status: 'refund_requested',
    timestamp: new Date(),
    note: `Return requested: ${req.body.reason}`,
  });
  await order.save();

  res.status(200).json({ success: true, data: order });
});

// @desc    Track order by ID (owner only)
// @route   GET /api/v1/orders/:id/track
export const trackOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id).select(
    'orderNumber status statusHistory trackingNumber courierService estimatedDelivery deliveredAt',
  );
  if (!order) throw new AppError('Order not found', 404);

  if (String(order.customer) !== String(req.user._id)) {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({ success: true, data: order });
});

// @desc    Public order tracking by order number (no PII)
// @route   GET /api/v1/orders/public/:orderNumber/track
export const publicTrackOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).select(
    'orderNumber status statusHistory trackingNumber courierService estimatedDelivery deliveredAt shippingMethod createdAt items.productName items.productImage items.quantity',
  );
  if (!order) throw new AppError('Order not found', 404);

  res.status(200).json({ success: true, data: order });
});

// @desc    Admin: Get a user's orders
// @route   GET /api/v1/orders/admin/user/:userId
export const adminGetUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = { customer: req.params.userId };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Reorder
// @route   POST /api/v1/orders/:id/reorder
export const reorder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);
  if (String(order.customer) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, sessionId: 'x' });
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) continue;

    const exists = cart.items.find(
      (ci) => String(ci.product) === String(item.product) && String(ci.variant || '') === String(item.variant || ''),
    );
    if (exists) {
      exists.quantity += item.quantity;
    } else {
      cart.items.push({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: product.salePrice || product.price,
        addedAt: new Date(),
      });
    }
  }

  cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalAmount = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});

// @desc    Admin: Get all orders
// @route   GET /api/v1/orders/admin/all
export const adminGetOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { status, paymentStatus, search, startDate, endDate } = req.query;

  const filter: any = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: escapeRegExp(String(search)), $options: 'i' } },
      { 'customerInfo.name': { $regex: escapeRegExp(String(search)), $options: 'i' } },
      { 'customerInfo.email': { $regex: escapeRegExp(String(search)), $options: 'i' } },
    ];
  }
  if (startDate || endDate) {
    filter.createdAt = {
      ...(startDate && { $gte: new Date(startDate as string) }),
      ...(endDate && { $lte: new Date(endDate as string) }),
    };
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Admin: Update order status
// @route   PUT /api/v1/orders/admin/:id/status
export const adminUpdateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  const { status, note, trackingNumber, courierService } = req.body;

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy: req.user._id,
  });

  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierService) order.courierService = courierService;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
    await commitReservedStock(
      order.items.map((item) => ({
        productId: String(item.product),
        variantId: item.variant ? String(item.variant) : undefined,
        quantity: item.quantity,
      })),
    );
  }

  if (status === 'cancelled' || status === 'failed') {
    await releaseStock(
      order.items.map((item) => ({
        productId: String(item.product),
        variantId: item.variant ? String(item.variant) : undefined,
        quantity: item.quantity,
      })),
    );
  }

  await order.save();

  // Send shipping update notification
  if (['shipped', 'out_for_delivery', 'delivered'].includes(status)) {
    emailService
      .sendShippingUpdate(
        order.customerInfo.email,
        order.orderNumber,
        status,
        order.trackingNumber,
      )
      .catch(() => {});
  }

  res.status(200).json({ success: true, data: order });
});

// @desc    Admin: Add notes
// @route   PUT /api/v1/orders/admin/:id/notes
export const adminAddNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { adminNotes: req.body.notes },
    { new: true },
  );
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});

// @desc    Admin: Order stats
// @route   GET /api/v1/orders/admin/stats
export const adminOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const pipeline: any[] = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$total' },
      },
    },
  ];

  const stats = await Order.aggregate(pipeline);

  const totalOrders = await Order.countDocuments();
  const pendingOrders = stats.find((s) => s._id === 'pending')?.count || 0;
  const totalRevenue = stats.reduce((sum: number, s: any) => sum + s.revenue, 0);

  res.status(200).json({
    success: true,
    data: {
      stats,
      totalOrders,
      pendingOrders,
      totalRevenue,
      byStatus: stats,
    },
  });
});

// @desc    Admin: Daily order/revenue stats
// @route   GET /api/v1/orders/admin/stats/daily?period=7d|30d|90d
export const adminDailyOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const period = String(req.query.period || '7d');
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const pipeline: any[] = [
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', revenue: 1, orders: 1 } },
  ];

  const daily = await Order.aggregate(pipeline);
  res.status(200).json({ success: true, data: daily });
});
