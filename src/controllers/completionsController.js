const { generateCompletion } = require('../services/completionService');

exports.createCompletion = async (req, res) => {
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
      temperature: parseFloat(temperature)
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
        prompt_tokens: prompt.length / 4,
        completion_tokens: completion.length / 4,
        total_tokens: (prompt.length + completion.length) / 4
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Completion failed',
      message: error.message 
    });
  }
};
