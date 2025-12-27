import Groq from "groq-sdk";

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
    const { prompt, dietType = '', systemPrompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Groq API key not configured. Please set GROQ_API_KEY in Vercel environment variables.' });
    }

    console.log('Initializing Groq AI...');
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Use dynamic system prompt if provided, otherwise use default
    const finalSystemPrompt = systemPrompt || 'You are a nutrition expert specializing in healthy meal planning. Always respond with well-formatted markdown tables.';

    // Build the full prompt with system instructions
    const fullPrompt = `${finalSystemPrompt}

Create a detailed meal plan based on this request: ${prompt}

Requirements:
- Output as a clean markdown table with columns: Day, Breakfast, Lunch, Dinner, Snacks
- Include approximate calories for each meal
- Explain why each meal is healthy for the ${dietType || 'chosen'} diet
- Focus on ${dietType === 'Low-Sugar' ? 'low-glycemic foods and blood sugar management' : dietType === 'Vegetarian' ? 'plant-based nutrition and protein balance' : dietType === 'Liver-Centric' ? 'Mediterranean diet principles and liver health' : 'balanced nutrition principles'}
- Avoid processed foods${dietType === 'Low-Sugar' ? ', refined sugars, and high-glycemic foods' : dietType === 'Vegetarian' ? ' and any animal products' : dietType === 'Liver-Centric' ? ', refined sugars, and excessive saturated fats' : ' and unhealthy ingredients'}
- Keep portions moderate and balanced

Please format as a proper markdown table.`;

    console.log('Generating content with Groq...');
    console.log('Diet type:', dietType);
    console.log('System prompt:', finalSystemPrompt);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: finalSystemPrompt
        },
        {
          role: "user", 
          content: fullPrompt
        }
      ],
      model: "llama-3.1-8b-instant", // Updated to current supported model
      temperature: 0.7,
      max_tokens: 2000
    });

    const menu = completion.choices[0]?.message?.content || "Unable to generate menu";
    console.log('Successfully generated menu');

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