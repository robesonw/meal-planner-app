import React, { useState } from 'react';
import './MenuDisplay.css';

interface MealInfo {
  name: string;
  calories: string;
  nutrients: string;
  prepTip: string;
}

interface DayMealPlan {
  day: string;
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
}

interface MenuDisplayProps {
  menu: DayMealPlan[];
  searchTerm: string;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu, searchTerm }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (index: number): void => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const highlightText = (text: string, highlight: string): JSX.Element | string => {
    if (!highlight || !text) return text;
    
    try {
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return (
        <>
          {parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase() ? 
              <mark key={i} className="highlight">{part}</mark> : part
          )}
        </>
      );
    } catch (error) {
      console.warn('Error highlighting text:', error);
      return text;
    }
  };

  // Validate menu data
  if (!menu || !Array.isArray(menu)) {
    return (
      <div className="menu-display">
        <div className="menu-error">
          <p>⚠️ Invalid menu data. Please try selecting a different diet.</p>
        </div>
      </div>
    );
  }

  if (menu.length === 0) {
    if (searchTerm) {
      return (
        <div className="menu-display">
          <div className="no-results">
            <p>No meals found containing "{searchTerm}". Try a different ingredient!</p>
          </div>
        </div>
      );
    }
    return (
      <div className="menu-display">
        <div className="menu-error">
          <p>No meal plan available. Please select a diet type.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-display">
      <h3>Your 7-Day Meal Plan</h3>
      <div className="accordion-container">
        {menu.map((dayPlan, index) => (
          <div key={index} className="accordion-item">
            <div 
              className={`accordion-header ${expandedDay === index ? 'expanded' : ''}`}
              onClick={() => toggleDay(index)}
            >
              <h4>{dayPlan.day}</h4>
              <span className="accordion-icon">
                {expandedDay === index ? '−' : '+'}
              </span>
            </div>
            {expandedDay === index && (
              <div className="accordion-content">
                <div className={`meal-item ${dayPlan.breakfast.isMatch ? 'matched' : ''} ${dayPlan.breakfast.isModified ? 'modified' : ''}`}>
                  <div className="meal-header">
                    <strong>🌅 Breakfast:</strong>
                    <div className="meal-badges">
                      <span className="calories">{dayPlan.breakfast.calories}</span>
                      {dayPlan.breakfast.isModified && <span className="modified-badge">Modified</span>}
                    </div>
                  </div>
                  <p className="meal-name">{highlightText(dayPlan.breakfast.name, searchTerm)}</p>
                  <div className="meal-details">
                    <div className="nutrients">
                      <strong>💊 Nutrients:</strong> {dayPlan.breakfast.nutrients}
                    </div>
                    <div className="prep-tip">
                      <strong>👨‍🍳 Prep Tip:</strong> {dayPlan.breakfast.prepTip}
                    </div>
                  </div>
                </div>
                <div className={`meal-item ${dayPlan.lunch.isMatch ? 'matched' : ''} ${dayPlan.lunch.isModified ? 'modified' : ''}`}>
                  <div className="meal-header">
                    <strong>☀️ Lunch:</strong>
                    <div className="meal-badges">
                      <span className="calories">{dayPlan.lunch.calories}</span>
                      {dayPlan.lunch.isModified && <span className="modified-badge">Modified</span>}
                    </div>
                  </div>
                  <p className="meal-name">{highlightText(dayPlan.lunch.name, searchTerm)}</p>
                  <div className="meal-details">
                    <div className="nutrients">
                      <strong>💊 Nutrients:</strong> {dayPlan.lunch.nutrients}
                    </div>
                    <div className="prep-tip">
                      <strong>👨‍🍳 Prep Tip:</strong> {dayPlan.lunch.prepTip}
                    </div>
                  </div>
                </div>
                <div className={`meal-item ${dayPlan.dinner.isMatch ? 'matched' : ''} ${dayPlan.dinner.isModified ? 'modified' : ''}`}>
                  <div className="meal-header">
                    <strong>🌙 Dinner:</strong>
                    <div className="meal-badges">
                      <span className="calories">{dayPlan.dinner.calories}</span>
                      {dayPlan.dinner.isModified && <span className="modified-badge">Modified</span>}
                    </div>
                  </div>
                  <p className="meal-name">{highlightText(dayPlan.dinner.name, searchTerm)}</p>
                  <div className="meal-details">
                    <div className="nutrients">
                      <strong>💊 Nutrients:</strong> {dayPlan.dinner.nutrients}
                    </div>
                    <div className="prep-tip">
                      <strong>👨‍🍳 Prep Tip:</strong> {dayPlan.dinner.prepTip}
                    </div>
                  </div>
                </div>
                {dayPlan.snacks && (
                  <div className={`meal-item ${dayPlan.snacks.isMatch ? 'matched' : ''} ${dayPlan.snacks.isModified ? 'modified' : ''}`}>
                    <div className="meal-header">
                      <strong>🍎 Snacks:</strong>
                      <div className="meal-badges">
                        <span className="calories">{dayPlan.snacks.calories}</span>
                        {dayPlan.snacks.isModified && <span className="modified-badge">Modified</span>}
                      </div>
                    </div>
                    <p className="meal-name">{highlightText(dayPlan.snacks.name, searchTerm)}</p>
                    <div className="meal-details">
                      <div className="nutrients">
                        <strong>💊 Nutrients:</strong> {dayPlan.snacks.nutrients}
                      </div>
                      <div className="prep-tip">
                        <strong>👨‍🍳 Prep Tip:</strong> {dayPlan.snacks.prepTip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;