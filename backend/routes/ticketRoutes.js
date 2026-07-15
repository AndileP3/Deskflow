const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createTicket,
  getTickets,
  updateTicket
} = require('../controllers/ticketController');

const router = express.Router();

/**
 * @openapi
 * /api/tickets:
 *   post:
 *     summary: Create a new IT service ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, priority]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Laptop won't power on
 *               description:
 *                 type: string
 *                 example: Pressed the power button, no lights, tried a different outlet.
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *   get:
 *     summary: Get tickets (Employees see own, Admins see all)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, In Progress, Resolved]
 *         description: Optional filter by ticket status
 *     responses:
 *       200:
 *         description: List of tickets
 *       401:
 *         description: Not authorized
 */
router
  .route('/')
  .post(
    protect,
    authorize('Employee'),
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('description').trim().notEmpty().withMessage('Description is required'),
      body('priority')
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High')
    ],
    createTicket
  )
  .get(protect, authorize('Employee', 'Admin'), getTickets);

/**
 * @openapi
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket's status
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Open, In Progress, Resolved]
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Ticket updated
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admins only
 *       404:
 *         description: Ticket not found
 */
router.put(
  '/:id',
  protect,
  authorize('Admin'),
  [
    body('status')
      .isIn(['Open', 'In Progress', 'Resolved'])
      .withMessage('Status must be Open, In Progress, or Resolved')
  ],
  updateTicket
);

module.exports = router;
