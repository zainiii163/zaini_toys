import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import {
  safepayInitiatePayment,
  jazzcashInitiatePayment,
  easypaisaInitiatePayment,
  raastInitiatePayment,
  verifySafepayWebhook,
} from '../services/payment.service';
import type { AuthRequest } from '../middleware/auth';

// @desc    Initiate payment for an order
// @route   POST /api/v1/payments/initiate
export const initiatePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId, method, redirectUrls } = req.body;

  const order = await Order.findOne({ _id: orderId, customer: req.user._id });
  if (!order) throw new AppError('Order not found', 404);

  if (order.paymentStatus === 'paid') {
    throw new AppError('Order already paid', 400);
  }

  if (order.paymentMethod !== method) {
    order.paymentMethod = method;
    await order.save();
  }

  const baseUrl = process.env.PAYMENT_REDIRECT_BASE || `http://localhost:${process.env.PORT || 5000}`;
  const successUrl =
    redirectUrls?.successUrl || `${baseUrl}/api/v1/payments/success/${order.orderNumber}`;
  const cancelUrl = redirectUrls?.cancelUrl || `${baseUrl}/api/v1/payments/cancel/${order.orderNumber}`;

  let paymentResult: { paymentId: string; paymentUrl: string };

  switch (method) {
    case 'cod':
      order.paymentStatus = 'pending';
      order.paymentDetails = { provider: 'cod', note: 'Cash on Delivery' };
      await order.save();
      res.status(200).json({
        success: true,
        data: { paymentId: `COD-${order.orderNumber}`, paymentUrl: null, orderNumber: order.orderNumber },
      });
      return;

    case 'card':
      paymentResult = await safepayInitiatePayment({
        amount: order.total,
        orderNumber: order.orderNumber,
        firstName: req.user.name?.split(' ')[0],
        lastName: req.user.name?.split(' ').slice(1).join(' '),
        email: req.user.email,
        phone: order.customerInfo.phone,
        successUrl,
        cancelUrl,
      });
      break;

    case 'jazzcash':
      paymentResult = await jazzcashInitiatePayment({
        amount: order.total,
        orderNumber: order.orderNumber,
        redirectUrl: successUrl,
      });
      break;

    case 'easypaisa':
      paymentResult = await easypaisaInitiatePayment({
        amount: order.total,
        orderNumber: order.orderNumber,
        redirectUrl: successUrl,
      });
      break;

    case 'raast':
      paymentResult = await raastInitiatePayment({
        amount: order.total,
        orderNumber: order.orderNumber,
        redirectUrl: successUrl,
      });
      break;

    default:
      throw new AppError('Unsupported payment method', 400);
  }

  order.paymentId = paymentResult.paymentId;
  order.paymentDetails = { provider: method, initiatedAt: new Date() };
  await order.save();

  res.status(200).json({
    success: true,
    data: { ...paymentResult, orderNumber: order.orderNumber },
  });
});

// @desc    Payment success callback (redirect from gateway)
// @route   GET /api/v1/payments/success/:orderNumber
// The gateway redirects the browser here after payment. The order is only
// marked as paid when the redirect carries the provider reference that matches
// the stored paymentId (or the order was already confirmed paid).
export const paymentSuccess = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) throw new AppError('Order not found', 404);

  if (order.paymentStatus !== 'paid') {
    const reference = (req.query.reference as string) || (req.query.token as string) || (req.query.paymentId as string);
    const isConfirmedPaid = Boolean(reference) && reference === order.paymentId;

    if (isConfirmedPaid) {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails = {
        ...(order.paymentDetails || {}),
        paidAt: new Date(),
        redirectSuccess: true,
        redirectReference: reference,
      };
      await order.save();
    } else if (order.paymentDetails?.redirectSuccess !== true) {
      // No proof yet — keep it pending; only a verified webhook or a matching
      // reference can confirm payment.
      order.paymentDetails = {
        ...(order.paymentDetails || {}),
        redirectReceivedAt: new Date(),
      };
      await order.save();
    }
  }

  res.redirect(`${process.env.CUSTOMER_URL || 'http://localhost:5173'}/order-success/${order.orderNumber}`);
});

// @desc    Payment cancel callback
// @route   GET /api/v1/payments/cancel/:orderNumber
export const paymentCancel = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (order && order.paymentStatus !== 'paid') {
    order.paymentStatus = 'pending';
    order.paymentDetails = { ...(order.paymentDetails || {}), cancelled: true };
    await order.save();
  }
  res.redirect(`${process.env.CUSTOMER_URL || 'http://localhost:5173'}/checkout?cancelled=true`);
});

// @desc    Payment webhook (from gateway)
// @route   POST /api/v1/payments/webhook
export const paymentWebhook = asyncHandler(async (req: Request, res: Response) => {
  const rawBody = (req as any).rawBody as Buffer | undefined;
  const headerSignature = (req.headers['x-safepay-signature'] as string) || undefined;

  const { verified, transactionStatus, reference, error } = verifySafepayWebhook(
    rawBody,
    headerSignature,
    req.body,
  );

  if (!verified) {
    console.error('[Payment] Webhook rejected:', error || 'signature verification failed');
    throw new AppError('Webhook signature verification failed', 401);
  }

  const orderNumber = req.body?.data?.order?.meta?.custom_inputs?.order_number;
  if (!orderNumber) {
    res.status(200).json({ success: true });
    return;
  }

  const order = await Order.findOne({ orderNumber });
  if (!order) {
    // Unknown order — acknowledge but don't act (prevents blind marking)
    res.status(200).json({ success: true, ack: true });
    return;
  }

  const previousReference = order.paymentDetails?.webhookReference as string | undefined;
  const previousStatus = order.paymentDetails?.webhookStatus as string | undefined;

  // Replay protection: ignore identical webhook deliveries already processed
  if (reference && previousReference === reference && previousStatus === transactionStatus) {
    res.status(200).json({ success: true, duplicate: true });
    return;
  }

  if (order) {
    switch (transactionStatus) {
      case 'successfully_initiated':
      case 'paid':
      case 'completed':
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        break;
      case 'cancelled':
      case 'failed':
        order.paymentStatus = 'failed';
        order.status = 'failed';
        break;
      default:
        break;
    }
    order.paymentDetails = {
      ...(order.paymentDetails || {}),
      webhookReference: reference,
      webhookStatus: transactionStatus,
    };
    await order.save();
  }

  res.status(200).json({ success: true });
});

// @desc    Check payment status
// @route   GET /api/v1/payments/status/:orderNumber
export const paymentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({
    orderNumber: req.params.orderNumber,
    customer: req.user._id,
  }).select('orderNumber paymentMethod paymentStatus paymentId total status');
  if (!order) throw new AppError('Order not found', 404);

  res.status(200).json({ success: true, data: order });
});
