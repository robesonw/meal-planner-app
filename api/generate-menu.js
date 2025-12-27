const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
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