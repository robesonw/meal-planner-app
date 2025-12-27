import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './CustomizationForm.css';

interface CustomizationFormProps {
  generatedMenu: string;
  setGeneratedMenu: (menu: string) => void;
  setShowGeneratedMenu: (show: boolean) => void;
  selectedDiet: string;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ 
  generatedMenu, 
  setGeneratedMenu, 
  setShowGeneratedMenu, 
  selectedDiet 
}) => {
  const [likes, setLikes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).likes || '' : '';
    } catch {
      return '';
    }
  });
  const [dislikes, setDislikes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).dislikes || '' : '';
    } catch {
      return '';
    }
  });
  const [duration, setDuration] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).duration || 'Full Week' : 'Full Week';
    } catch {
      return 'Full Week';
    }
  });
  const [mealFocus, setMealFocus] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).mealFocus || 'Full Meals' : 'Full Meals';
    } catch {
      return 'Full Meals';
    }
  });
  const [dietNotes, setDietNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('menuPreferences');
      return saved ? JSON.parse(saved).dietNotes || '' : '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Dynamic system prompts based on diet type
  const getDietSystemPrompt = (dietType) => {
    switch (dietType) {
      case 'Liver-Centric':
        return 'You are a nutrition expert specializing in liver-friendly Mediterranean diets for NAFLD (Non-Alcoholic Fatty Liver Disease). Focus on foods that support liver health, reduce inflammation, and promote liver detoxification. Always respond with well-formatted markdown tables.';
      case 'Low-Sugar':
        return 'You are a nutrition expert specializing in diabetic-friendly and low-glycemic diets. Focus on blood sugar management, insulin sensitivity, and metabolic health. Emphasize foods with low glycemic index and stable blood sugar response. Always respond with well-formatted markdown tables.';
      case 'Vegetarian':
        return 'You are a nutrition expert specializing in balanced vegetarian diets. Focus on plant-based protein sources, complete amino acid profiles, and nutrient density. Ensure adequate B12, iron, and omega-3 fatty acids. Always respond with well-formatted markdown tables.';
      default:
        return 'You are a nutrition expert specializing in healthy, balanced meal planning. Always respond with well-formatted markdown tables.';
    }
  };

  const getDietFocus = (dietType) => {
    switch (dietType) {
      case 'Liver-Centric':
        return 'Mediterranean diet principles and liver health';
      case 'Low-Sugar':
        return 'low-glycemic foods and blood sugar management';
      case 'Vegetarian':
        return 'plant-based nutrition and protein balance';
      default:
        return 'balanced nutrition principles';
    }
  };

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
      // Build the prompt with dynamic diet focus
      const dietFocus = getDietFocus(selectedDiet);
      const prompt = `Create a ${duration} ${selectedDiet.toLowerCase()} diet menu, include ${likes}, strictly avoid ${dislikes}, focus on ${mealFocus}. Focus on ${dietFocus}. ${dietNotes ? `Additional notes: ${dietNotes}` : ''}`;
      
      // Get dynamic system prompt based on selected diet
      const systemPrompt = getDietSystemPrompt(selectedDiet);
      
      // Use our Vercel serverless function with Groq AI
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          dietType: selectedDiet,
          systemPrompt: systemPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate menu');
      }

      const data = await response.json();
      setGeneratedMenu(data.menu);
      setShowGeneratedMenu(true);
      
      // Save the generated menu to localStorage
      localStorage.setItem('lastGeneratedMenu', data.menu);
      localStorage.setItem('lastMenuTimestamp', new Date().toISOString());
      
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