const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Employee
const createTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get tickets (Employees see own tickets, Admins see all)
// @route   GET /api/tickets
// @access  Employee, Admin
const getTickets = async (req, res, next) => {
  try {
    const filter = {};

    // Role-based scoping
    if (req.user.role === 'Employee') {
      filter.createdBy = req.user._id;
    }

    // Optional status filter, e.g. GET /api/tickets?status=Open
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a ticket's status
// @route   PUT /api/tickets/:id
// @access  Admin
const updateTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with id: ${req.params.id}`
      });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, getTickets, updateTicket };
