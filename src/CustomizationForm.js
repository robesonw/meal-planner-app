import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './CustomizationForm.css';

const CustomizationForm = ({ generatedMenu, setGeneratedMenu, setShowGeneratedMenu }) => {
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).likes || '' : '';
    } catch {
      return '';
    }
  });
  const [dislikes, setDislikes] = useState(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).dislikes || '' : '';
    } catch {
      return '';
    }
  });
  const [duration, setDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).duration || 'Full Week' : 'Full Week';
    } catch {
      return 'Full Week';
    }
  });
  const [mealFocus, setMealFocus] = useState(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).mealFocus || 'Full Meals' : 'Full Meals';
    } catch {
      return 'Full Meals';
    }
  });
  const [dietNotes, setDietNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).dietNotes || '' : '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      const preferences = {
        likes,
        dislikes,
        duration,
        mealFocus,
        dietNotes
      };
      localStorage.setItem('menuPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error);
    }
  }, [likes, dislikes, duration, mealFocus, dietNotes]);

  const generateMenu = async () => {
    setLoading(true);
    setError('');
    setGeneratedMenu('');
    setShowGeneratedMenu(false);

    try {
      // Build the prompt
      const prompt = `Create a ${duration} liver-centric fatty liver diet menu, include ${likes}, strictly avoid ${dislikes}, focus on ${mealFocus}. Use Mediterranean style, healthy fats, veggies, lean proteins. ${dietNotes ? `Additional notes: ${dietNotes}` : ''}`;

      // Check if running locally or in production
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocal) {
        // Use Google Generative AI directly for local development
        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        if (!apiKey) {
          throw new Error('Google API key not found. Please check your .env file.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // First, try to list available models
        let availableModels = [];
        try {
          const models = await genAI.listModels();
          availableModels = models.map(model => model.name);
          console.log('Available models:', availableModels);
        } catch (listError) {
          console.warn('Could not list models:', listError.message);
        }
        
        // Try current 2025 models first, then fallback to older ones
        const modelNamesToTry = [
          'gemini-3-flash-preview',
          'gemini-2.5-flash',
          ...availableModels,
          'gemini-1.5-pro-latest',
          'gemini-1.5-pro',
          'gemini-pro',
          'models/gemini-3-flash-preview',
          'models/gemini-2.5-flash',
          'models/gemini-1.5-pro-latest',
          'models/gemini-1.5-pro',
          'models/gemini-pro'
        ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        let result;
        let lastError;
        
        for (const modelName of modelNamesToTry) {
          try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            // Add system instruction in the prompt instead
            const fullPrompt = `You are a nutrition expert specializing in liver-friendly Mediterranean diets for NAFLD. Always output as a clean markdown table with columns: Day, Breakfast, Lunch, Dinner, Snacks. Include approximate calories and why it's liver-healthy.

            ${prompt}`;

            result = await model.generateContent(fullPrompt);
            console.log(`Success with model: ${modelName}`);
            break; // Success, exit loop
          } catch (err) {
            console.log(`Failed with model ${modelName}:`, err.message);
            lastError = err;
            continue; // Try next model
          }
        }
        
        if (!result) {
          throw new Error(`All available models failed. Available models were: ${availableModels.join(', ')}. Last error: ${lastError?.message}`);
        }
        const response = await result.response;
        const menu = response.text();
        setGeneratedMenu(menu);
      } else {
        // Use serverless function for production
        const response = await fetch('/api/generate-menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate menu');
        }

        const data = await response.json();
        setGeneratedMenu(data.menu);
      }
    } catch (err) {
      setError(`Failed to generate personalized menu: ${err.message}`);
      console.error('Error generating menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMenu();
  };

  return (
    <div className="customization-form">
      <h2>🧬 AI-Powered Menu Customization</h2>
      <p className="form-description">
        Create a personalized liver-friendly menu using AI. Tell us your preferences!
        {(likes || dislikes || dietNotes) && (
          <span className="saved-indicator"> ✨ Preferences saved automatically</span>
        )}
      </p>

      <form onSubmit={handleSubmit} className="customization-inputs">
        <div className="input-group">
          <label htmlFor="likes">Foods I Like:</label>
          <textarea
            id="likes"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="e.g., chicken, berries, spinach, quinoa"
            rows="3"
            className="textarea-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="dislikes">Foods to Avoid:</label>
          <textarea
            id="dislikes"
            value={dislikes}
            onChange={(e) => setDislikes(e.target.value)}
            placeholder="e.g., steak, salmon, mushrooms, onions"
            rows="3"
            className="textarea-input"
          />
        </div>

        <div className="dropdown-group">
          <div className="input-group">
            <label htmlFor="duration">Duration:</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="select-input"
            >
              <option value="Single Day">Single Day</option>
              <option value="Full Week">Full Week</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="mealFocus">Meal Focus:</label>
            <select
              id="mealFocus"
              value={mealFocus}
              onChange={(e) => setMealFocus(e.target.value)}
              className="select-input"
            >
              <option value="Full Meals">Full Meals</option>
              <option value="Breakfast Only">Breakfast Only</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="dietNotes">Additional Dietary Notes:</label>
          <textarea
            id="dietNotes"
            value={dietNotes}
            onChange={(e) => setDietNotes(e.target.value)}
            placeholder="Any allergies, special requirements, or preferences..."
            rows="2"
            className="textarea-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`generate-button ${loading ? 'loading' : ''}`}
        >
          {loading ? '🤖 Generating Menu...' : '✨ Generate Personalized Menu'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default CustomizationForm;