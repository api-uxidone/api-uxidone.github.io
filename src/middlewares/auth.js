const { API_KEY_PREFIX } = require('../utils/constants');

module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide an API key with the UXIDONE prefix'
    });
  }

  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    return res.status(403).json({ 
      error: 'Invalid API key format',
      message: 'API key must start with UXIDONE'
    });
  }

  // In a real implementation, you would validate against a database
  if (apiKey !== process.env.VALID_API_KEY) {
    return res.status(403).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  next();
};
