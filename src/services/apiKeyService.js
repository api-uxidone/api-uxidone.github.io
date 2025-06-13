const { API_KEY_PREFIX } = require('../utils/constants');
const crypto = require('crypto');

module.exports = {
  generateApiKey: () => {
    const randomString = crypto.randomBytes(16).toString('hex');
    return `${API_KEY_PREFIX}_${randomString}`;
  },

  validateApiKey: (apiKey) => {
    if (!apiKey.startsWith(API_KEY_PREFIX)) {
      return false;
    }
    // Add additional validation logic here
    return true;
  }
};
