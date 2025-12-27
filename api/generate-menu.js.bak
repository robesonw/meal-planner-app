const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview'
    });

    // Add system instruction in the prompt instead
    const fullPrompt = `You are a nutrition expert specializing in liver-friendly Mediterranean diets for NAFLD. Always output as a clean markdown table with columns: Day, Breakfast, Lunch, Dinner, Snacks. Include approximate calories and why it's liver-healthy.

    ${prompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const menu = response.text();

    return res.status(200).json({ menu });

  } catch (error) {
    console.error('Error generating menu:', error);
    return res.status(500).json({ error: 'Failed to generate menu' });
  }
}