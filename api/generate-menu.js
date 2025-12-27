import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
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

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Initializing Google Generative AI...');
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // First, list available models
    console.log('Listing available models...');
    let availableModels = [];
    try {
      const models = await genAI.listModels();
      availableModels = models.map(model => model.name);
      console.log('Available models:', availableModels);
    } catch (listError) {
      console.log('Could not list models:', listError.message);
    }
    
    // Try available models first, then fallback to common names
    const modelNamesToTry = [
      ...availableModels,
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-pro'
    ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    console.log('Models to try:', modelNamesToTry);
    
    let result;
    let lastError;
    
    for (const modelName of modelNamesToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Add system instruction in the prompt instead
        const fullPrompt = `You are a nutrition expert specializing in liver-friendly Mediterranean diets for NAFLD. Always output as a clean markdown table with columns: Day, Breakfast, Lunch, Dinner, Snacks. Include approximate calories and why it's liver-healthy.

        ${prompt}`;

        // Generate content
        console.log('Generating content...');
        result = await model.generateContent(fullPrompt);
        console.log(`Success with model: ${modelName}`);
        break;
      } catch (modelError) {
        console.log(`Failed with model ${modelName}:`, modelError.message);
        lastError = modelError;
        continue;
      }
    }
    
    if (!result) {
      throw new Error(`All models failed. Available models were: ${availableModels.join(', ')}. Last error: ${lastError?.message}`);
    }

    const response = await result.response;
    const menu = response.text();

    return res.status(200).json({ menu });

  } catch (error) {
    console.error('Error generating menu:', error);
    console.error('Error stack:', error.stack);
    console.error('API Key present:', !!process.env.GEMINI_API_KEY);
    return res.status(500).json({ 
      error: `Failed to generate menu: ${error.message}`,
      details: error.stack?.substring(0, 200)
    });
  }
}