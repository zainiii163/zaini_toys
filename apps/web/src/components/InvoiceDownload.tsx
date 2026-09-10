import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Order } from '../app/services/order'

interface Props {
  order: Order
}

export default function InvoiceDownload({ order }: Props) {
  const onDownload = () => {
    try {
      const items = order.items || []
      const subtotal = order.subtotal || items.reduce((s, i) => s + (i.total || i.price * i.quantity), 0)
      const discount = order.discount || order.couponDiscount || 0
      const shipping = order.shippingCost || 0
      const total = order.total || subtotal + shipping - discount

      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
  .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
  .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
  .title { font-size: 24px; font-weight: bold; margin: 20px 0; }
  .section { margin-bottom: 20px; }
  .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
  td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
  .total-row td { font-weight: bold; border-top: 2px solid #2563eb; font-size: 14px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
  .paid { background: #d1fae5; color: #065f46; }
  .pending { background: #fef3c7; color: #92400e; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 15px; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Toy Shop Pakistan</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">Pakistan's #1 Online Toy Store</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:#666;">INVOICE</div>
      <div style="font-size:18px;font-weight:bold;">#${order.orderNumber}</div>
      <div style="font-size:12px;color:#666;">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <div class="grid">
    <div class="section">
      <div class="label">Bill To</div>
      <div style="font-size:14px;font-weight:600;">${order.shippingAddress?.fullName || order.customerInfo?.name || ''}</div>
      <div style="font-size:13px;color:#555;">${order.shippingAddress?.address || ''}</div>
      <div style="font-size:13px;color:#555;">${order.shippingAddress?.area ? order.shippingAddress.area + ', ' : ''}${order.shippingAddress?.city || ''}</div>
      <div style="font-size:13px;color:#555;">Phone: ${order.shippingAddress?.phone || order.customerInfo?.phone || ''}</div>
      <div style="font-size:13px;color:#555;">Email: ${order.customerInfo?.email || ''}</div>
    </div>
    <div class="section">
      <div class="label">Payment</div>
      <div style="font-size:13px;">Method: ${order.paymentMethod?.toUpperCase() || 'COD'}</div>
      <div style="font-size:13px;">Status: <span class="badge ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}">${order.paymentStatus || 'pending'}</span></div>
      <div style="font-size:13px;">Shipping: ${(order.shippingMethod || 'standard').replace('_', ' ')}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>#</th><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    </thead>
    <tbody>
      ${items.map((item, i) => `<tr>
        <td>${i + 1}</td>
        <td>${item.productName || item.product || ''}</td>
        <td>${item.sku || '-'}</td>
        <td>${item.quantity}</td>
        <td>Rs. ${item.price?.toLocaleString()}</td>
        <td>Rs. ${(item.total || item.price * item.quantity)?.toLocaleString()}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div style="max-width:300px;margin-left:auto;">
    <table>
      <tr><td style="border:none;">Subtotal</td><td style="border:none;text-align:right;">Rs. ${subtotal.toLocaleString()}</td></tr>
      ${discount > 0 ? `<tr><td style="border:none;color:#16a34a;">Discount</td><td style="border:none;text-align:right;color:#16a34a;">-Rs. ${discount.toLocaleString()}</td></tr>` : ''}
      <tr><td style="border:none;">Shipping</td><td style="border:none;text-align:right;">${shipping === 0 ? 'Free' : 'Rs. ' + shipping.toLocaleString()}</td></tr>
      <tr class="total-row"><td style="border:none;">Total</td><td style="border:none;text-align:right;">Rs. ${total.toLocaleString()}</td></tr>
    </table>
  </div>

  <div class="footer">
    <p>Thank you for shopping with Toy Shop Pakistan!</p>
    <p>www.toys.pk | support@toys.pk | +92 300 1234567</p>
  </div>
</body>
</html>`

      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      if (win) {
        win.print()
      }
      URL.revokeObjectURL(url)
      toast.success('Invoice ready — use browser print dialog to save as PDF')
    } catch {
      toast.error('Failed to generate invoice')
    }
  }

  return (
    <button
      onClick={onDownload}
      className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
    >
      <FileText className="h-3.5 w-3.5" /> Invoice
    </button>
  )
}
