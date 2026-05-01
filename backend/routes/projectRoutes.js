const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Middleware to protect all routes
router.use(protect);

// Validation rules
const projectValidation = [
  body('name', 'Project name is required').notEmpty().trim(),
  body('startDate', 'Start date is required').isISO8601(),
  body('endDate', 'End date is required').isISO8601(),
];

// Routes
router.post('/', projectValidation, handleValidationErrors, createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', projectValidation, handleValidationErrors, updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
