const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://uxidone.github.io', 'https://api-uxidone.github.io']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Versioned root endpoint
app.get('/api', (req, res) => {
  res.json({
    api: 'Uxidone API',
    versions: {
      v1: '/api/v1',
      v2: '/api/v2'
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
});
