const express = require('express');
const router = express.Router();
const completionsRouter = require('./completions');
const projectsRouter = require('./projects');

// Mount the completions router
router.use('/completions', completionsRouter);

// Mount other v2 routes
router.use('/projects', projectsRouter);

module.exports = router;
