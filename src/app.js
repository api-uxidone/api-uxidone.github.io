require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const { API_KEY_PREFIX } = require('./utils/constants');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Routes
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// API information endpoint
app.get('/api', (req, res) => {
  res.json({
    api: 'Uxidone API',
    versions: {
      v1: '/api/v1',
      v2: '/api/v2'
    },
    authentication: {
      type: 'API Key',
      format: `Starts with ${API_KEY_PREFIX}`,
      header: 'X-API-Key'
    },
    documentation: 'https://api-uxidone.github.io/docs'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Uxidone API running on port ${PORT}`);
  console.log(`Valid API keys must start with: ${API_KEY_PREFIX}`);
});
