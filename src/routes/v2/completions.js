const express = require('express');
const router = express.Router();
const { generateCompletion } = require('../../services/completionService');
const { validateApiKey } = require('../../middlewares/auth');
const { API_KEY_PREFIX } = require('../../utils/constants');

// Middleware for API key validation
router.use(validateApiKey);

/**
 * @swagger
 * /v2/completions:
 *   post:
 *     summary: Generate text completions
 *     description: Returns AI-generated text based on the provided prompt
 *     tags: [Completions]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The input text to generate completions for
 *               max_tokens:
 *                 type: integer
 *                 default: 100
 *                 description: Maximum number of tokens to generate
 *               temperature:
 *                 type: number
 *                 default: 0.7
 *                 description: Controls randomness (0-1)
 *     responses:
 *       200:
 *         description: Successful completion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Completion'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Missing API key
 *       403:
 *         description: Forbidden - Invalid API key
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, max_tokens = 100, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required',
        message: 'Please provide a prompt for completion'
      });
    }

    const completion = await generateCompletion({
      prompt,
      max_tokens: parseInt(max_tokens),
      temperature: parseFloat(temperature),
      apiKey: req.apiKey // Pass the validated API key
    });

    res.json({
      id: `cmpl-${Date.now()}`,
      object: 'text_completion',
      created: Math.floor(Date.now() / 1000),
      model: 'uxidone-model-v2',
      choices: [{
        text: completion,
        index: 0,
        logprobs: null,
        finish_reason: 'length'
      }],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil(completion.length / 4),
        total_tokens: Math.ceil((prompt.length + completion.length) / 4)
      },
      api_key_prefix: UXIDONE
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Completion failed',
      message: error.message 
    });
  }
});

module.exports = router;
