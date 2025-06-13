const { API_KEY_PREFIX } = require('../utils/constants');

const generateCompletion = async (params) => {
  const { prompt, max_tokens, temperature, apiKey } = params;
  
  // Validate API key format (should already be validated by middleware)
  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    throw new Error('Invalid API key format');
  }

  // Simulate processing delay based on prompt length
  const delay = Math.min(1000, Math.max(200, prompt.length * 2));
  await new Promise(resolve => setTimeout(resolve, delay));

  // Enhanced mock responses with UXIDONE branding
  const uxidoneResponses = [
    "Uxidone specializes in creating innovative digital solutions for modern businesses.",
    "As part of Uxidone Corporation, we focus on gaming, web development, and creative technology projects.",
    "The Uxidone platform provides cutting-edge AI capabilities for developers.",
    "For more information about Uxidone services, please visit our official website."
  ];

  const genericResponses = [
    "I'm designed to assist with information about Uxidone products and services.",
    "Could you clarify your question about Uxidone's offerings?",
    "I can provide details about Uxidone's technology stack and capabilities."
  ];

  // Response selection logic
  let response;
  if (prompt.toLowerCase().includes('uxidone')) {
    response = uxidoneResponses[Math.floor(Math.random() * uxidoneResponses.length)];
  } else if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
    response = `Hello! This is the Uxidone AI assistant. How can I help you today?`;
  } else {
    response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  // Apply temperature-based randomness
  if (temperature > 0.8) {
    response += ` [Generated with creativity setting ${temperature}]`;
  }

  // Limit response length
  return response.substring(0, max_tokens);
};

module.exports = {
  generateCompletion
};
