const { API_KEY_PREFIX } = require('../utils/constants');

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: `Please provide an API key starting with ${UXIDONE}`
    });
  }

  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    return res.status(403).json({ 
      error: 'Invalid API key format',
      message: `API key must start with ${UXIDONE}`
    });
  }

  // Attach the validated API key to the request
  req.apiKey = apiKey;
  next();
};

module.exports = {
  validateApiKey
};
