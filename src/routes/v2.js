const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const projectController = require('../controllers/projectController');
const completionsController = require('../controllers/completionsController');

// All routes require API key authentication
router.use(auth);

// Project endpoints
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);

// Completions endpoint
router.post('/completions', completionsController.createCompletion);

module.exports = router;
