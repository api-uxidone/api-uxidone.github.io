const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const projectController = require('../controllers/projectController');

// All routes require API key authentication
router.use(auth);

// Project endpoints
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);

module.exports = router;
