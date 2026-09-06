import { Request, Response } from 'express';
import { SupportTicket, ISupportTicket } from '../models/SupportTicket';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

const generateTicketNumber = () => `TK-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

// @desc    Create support ticket
// @route   POST /api/v1/support
export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subject, message, category, priority, order } = req.body;

  const ticket = await SupportTicket.create({
    ticketNumber: generateTicketNumber(),
    user: req.user._id,
    order,
    subject,
    message,
    category: category || 'other',
    priority: priority || 'medium',
    messages: [{ sender: req.user._id, message }],
  });

  res.status(201).json({ success: true, data: ticket });
});

// @desc    Get user's tickets
// @route   GET /api/v1/support
export const getMyTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const [tickets, total] = await Promise.all([
    SupportTicket.find({ user: req.user._id }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    SupportTicket.countDocuments({ user: req.user._id }),
  ]);
  res.status(200).json({ success: true, data: tickets, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Get a single ticket (user)
// @route   GET /api/v1/support/:id
export const getTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id });
  if (!ticket) throw new AppError('Ticket not found', 404);
  res.status(200).json({ success: true, data: ticket });
});

// @desc    Add message to ticket
// @route   POST /api/v1/support/:id/messages
export const addMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id });
  if (!ticket) throw new AppError('Ticket not found', 404);

  if (ticket.status === 'closed') {
    throw new AppError('Ticket is closed', 400);
  }

  ticket.messages.push({
    sender: req.user._id,
    message: req.body.message,
    attachments: req.body.attachments,
    createdAt: new Date(),
  });
  ticket.status = ticket.status === 'resolved' ? 'open' : ticket.status;
  await ticket.save();

  res.status(200).json({ success: true, data: ticket });
});

// @desc    Admin: Get all tickets
// @route   GET /api/v1/support/admin/all
export const adminGetTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { status, priority, category } = req.query;

  const filter: any = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email'),
    SupportTicket.countDocuments(filter),
  ]);
  res.status(200).json({ success: true, data: tickets, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Admin: Update ticket status
// @route   PUT /api/v1/support/admin/:id/status
export const adminUpdateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status, assignedTo: req.body.assignedTo } },
    { new: true },
  );
  if (!ticket) throw new AppError('Ticket not found', 404);
  res.status(200).json({ success: true, data: ticket });
});

// @desc    Admin: Reply to ticket
// @route   POST /api/v1/support/admin/:id/reply
export const adminReply = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) throw new AppError('Ticket not found', 404);

  ticket.messages.push({
    sender: req.user._id,
    message: req.body.message,
    createdAt: new Date(),
  });
  if (req.body.status) ticket.status = req.body.status;
  await ticket.save();

  res.status(200).json({ success: true, data: ticket });
});

// @desc    Admin: Assign ticket
// @route   PUT /api/v1/support/admin/:id/assign
export const adminAssign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { $set: { assignedTo: req.body.userId, status: 'in_progress' } },
    { new: true },
  );
  if (!ticket) throw new AppError('Ticket not found', 404);
  res.status(200).json({ success: true, data: ticket });
});
