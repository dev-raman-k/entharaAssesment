const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Middleware to protect all routes
router.use(protect);

// Validation rules
const taskValidation = [
  body('title', 'Task title is required').notEmpty().trim(),
  body('projectId', 'Project ID is required').notEmpty(),
  body('assignedTo', 'Assigned user is required').notEmpty(),
  body('dueDate', 'Due date is required').isISO8601(),
];

// Routes
router.post('/', taskValidation, handleValidationErrors, createTask);
router.get('/my-tasks', getMyTasks);
router.get('/dashboard/stats', getDashboardStats);
router.get('/project/:projectId', getProjectTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
