import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/database';

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (env.EMAIL_USER && env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });
    }
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    attachments?: { filename: string; content: Buffer | string }[],
  ): Promise<void> {
    if (!this.transporter) {
      console.log(`[Email skipped - no SMTP config] To: ${to}, Subject: ${subject}`);
      return;
    }
    const from =
      env.EMAIL_FROM ||
      `${'Toy Shop'} <${env.EMAIL_USER}>`;

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
  }

  private layout(content: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:8px;">
        <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #f43f5e;">
          <h1 style="color:#f43f5e;margin:0;">🧸 Toy Shop</h1>
        </div>
        <div style="padding:24px 0;">${content}</div>
        <div style="text-align:center;padding-top:16px;border-top:1px solid #eee;color:#888;font-size:12px;">
          <p>© ${new Date().getFullYear()} Toy Shop. All rights reserved.</p>
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    `;
  }

  async sendWelcome(email: string, name: string): Promise<void> {
    const html = this.layout(`
      <h2>Welcome to Toy Shop, ${name}!</h2>
      <p>We're so glad to have you. Get ready to discover amazing toys for your little ones.</p>
      <p>Start exploring our <a href="${env.CUSTOMER_URL}/shop">collection</a> today.</p>
    `);
    await this.send(email, 'Welcome to Toy Shop!', html);
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string,
    total: number,
  ): Promise<void> {
    const html = this.layout(`
      <h2>Order Confirmed!</h2>
      <p>Your order <strong>${orderNumber}</strong> has been received.</p>
      <p>Order Total: <strong>Rs. ${total.toLocaleString()}</strong></p>
      <a href="${env.CUSTOMER_URL}/account/orders/${orderNumber}" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">View Order</a>
    `);
    await this.send(email, `Order Confirmed: ${orderNumber}`, html);
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    const html = this.layout(`
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
      <a href="${resetUrl}" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Reset Password</a>
      <p style="margin-top:16px;color:#888;">If you didn't request this, you can ignore this email.</p>
    `);
    await this.send(email, 'Reset Your Password', html);
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const html = this.layout(`
      <h2>Your Verification Code</h2>
      <p>Use the code below to verify your account:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#f43f5e;text-align:center;">${otp}</p>
      <p style="color:#888;">This code expires in 10 minutes.</p>
    `);
    await this.send(email, 'Your Verification Code', html);
  }

  async sendShippingUpdate(email: string, orderNumber: string, status: string, trackingNumber?: string): Promise<void> {
    const tracking = trackingNumber
      ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>`
      : '';
    const html = this.layout(`
      <h2>Order Update: ${orderNumber}</h2>
      <p>Your order status is now: <strong style="text-transform:capitalize;">${status.replace('_', ' ')}</strong></p>
      ${tracking}
      <a href="${env.CUSTOMER_URL}/orders/track/${orderNumber}" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Track Order</a>
    `);
    await this.send(email, `Update: Your order ${orderNumber} is ${status.replace('_', ' ')}`, html);
  }

  async sendOrderCancellation(email: string, orderNumber: string, reason: string): Promise<void> {
    const html = this.layout(`
      <h2>Order Cancelled</h2>
      <p>Your order <strong>${orderNumber}</strong> has been cancelled.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you paid online, your refund will be processed within 5-7 business days.</p>
      <a href="${env.CUSTOMER_URL}/shop" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Continue Shopping</a>
    `);
    await this.send(email, `Order Cancelled: ${orderNumber}`, html);
  }

  async sendRefundProcessed(email: string, orderNumber: string, amount: number): Promise<void> {
    const html = this.layout(`
      <h2>Refund Processed</h2>
      <p>Your refund for order <strong>${orderNumber}</strong> has been processed.</p>
      <p>Refund Amount: <strong>Rs. ${amount.toLocaleString()}</strong></p>
      <p>The amount will be credited to your original payment method within 5-7 business days.</p>
      <a href="${env.CUSTOMER_URL}/account/orders" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">View Orders</a>
    `);
    await this.send(email, `Refund Processed for Order ${orderNumber}`, html);
  }

  async sendReviewRequest(email: string, name: string, orderNumber: string, productNames: string[]): Promise<void> {
    const productList = productNames.map((n) => `<li>${n}</li>`).join('');
    const html = this.layout(`
      <h2>How was your experience?</h2>
      <p>Hi ${name},</p>
      <p>We hope you're enjoying your recent purchase! We'd love to hear your feedback.</p>
      <p>Products purchased:</p>
      <ul>${productList}</ul>
      <a href="${env.CUSTOMER_URL}/account/orders" style="background:#f43f5e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Leave a Review</a>
      <p style="margin-top:16px;color:#888;">Your reviews help other parents make better choices!</p>
    `);
    await this.send(email, `Share your feedback on order ${orderNumber}`, html);
  }
}

export const emailService = new EmailService();
