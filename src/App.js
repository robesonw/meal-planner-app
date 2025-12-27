import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './App.css';
import MenuDisplay from './MenuDisplay';

function App() {
  const [selectedDiet, setSelectedDiet] = useState('');
  const [mealPlan, setMealPlan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [originalMealPlan, setOriginalMealPlan] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const componentRef = useRef();

  // Sample meal plans for different dietary types
  const mealPlans = {
    'Liver-Centric': [
      { 
        day: 'Monday', 
        breakfast: { 
          name: 'Beef liver with scrambled eggs', 
          calories: '450-500 kcal', 
          nutrients: 'High in iron, vitamin A, and B-vitamins for liver regeneration', 
          prepTip: 'Soak liver in milk for 30 mins before cooking to reduce strong taste' 
        },
        lunch: { 
          name: 'Chicken liver pate with vegetables', 
          calories: '350-400 kcal', 
          nutrients: 'Rich in folate and choline for liver detox', 
          prepTip: 'Blend cooked liver with herbs and garlic for smooth pate' 
        },
        dinner: { 
          name: 'Grilled salmon with liver-friendly greens', 
          calories: '500-550 kcal', 
          nutrients: 'Omega-3 fatty acids support liver health and reduce inflammation', 
          prepTip: 'Grill salmon 4-6 mins per side, serve with steamed broccoli and spinach' 
        }
      },
      { 
        day: 'Tuesday', 
        breakfast: { 
          name: 'Liver and onions with toast', 
          calories: '400-450 kcal', 
          nutrients: 'High protein and vitamin B12 for energy metabolism', 
          prepTip: 'Cook onions until caramelized, add liver for 3-4 mins per side' 
        },
        lunch: { 
          name: 'Liver smoothie with berries', 
          calories: '300-350 kcal', 
          nutrients: 'Antioxidants from berries plus liver nutrients', 
          prepTip: 'Blend cooked liver with frozen berries, yogurt, and honey' 
        },
        dinner: { 
          name: 'Turkey meatballs with detox vegetables', 
          calories: '450-500 kcal', 
          nutrients: 'Lean protein with fiber for liver cleansing', 
          prepTip: 'Bake meatballs at 400°F for 20 mins, serve with roasted Brussels sprouts' 
        }
      },
      { 
        day: 'Wednesday', 
        breakfast: { 
          name: 'Chicken liver omelet', 
          calories: '380-420 kcal', 
          nutrients: 'Complete amino acids and liver-supporting nutrients', 
          prepTip: 'Sauté diced liver first, then add beaten eggs and fold' 
        },
        lunch: { 
          name: 'Beef liver stir-fry', 
          calories: '400-450 kcal', 
          nutrients: 'Iron and zinc for immune function', 
          prepTip: 'Cut liver thin, stir-fry quickly over high heat with vegetables' 
        },
        dinner: { 
          name: 'Baked cod with artichokes', 
          calories: '350-400 kcal', 
          nutrients: 'Low fat protein with liver-cleansing artichokes', 
          prepTip: 'Bake cod at 375°F for 12-15 mins, steam artichokes separately' 
        }
      },
      { 
        day: 'Thursday', 
        breakfast: { 
          name: 'Liver pate on whole grain bread', 
          calories: '320-370 kcal', 
          nutrients: 'Complex carbs with liver nutrients', 
          prepTip: 'Spread homemade pate on toasted bread, garnish with herbs' 
        },
        lunch: { 
          name: 'Grilled chicken with liver-cleansing herbs', 
          calories: '400-450 kcal', 
          nutrients: 'Lean protein with milk thistle and dandelion benefits', 
          prepTip: 'Marinate chicken with herbs, grill 6-8 mins per side' 
        },
        dinner: { 
          name: 'Quinoa with roasted vegetables', 
          calories: '380-430 kcal', 
          nutrients: 'Complete protein and fiber for liver support', 
          prepTip: 'Roast vegetables at 425°F for 25 mins, serve over cooked quinoa' 
        }
      },
      { 
        day: 'Friday', 
        breakfast: { 
          name: 'Liver and mushroom scramble', 
          calories: '420-470 kcal', 
          nutrients: 'Selenium from mushrooms supports liver detox enzymes', 
          prepTip: 'Sauté mushrooms first, add diced liver and scrambled eggs' 
        },
        lunch: { 
          name: 'Liver curry with rice', 
          calories: '450-500 kcal', 
          nutrients: 'Turmeric and spices enhance liver function', 
          prepTip: 'Simmer liver in coconut milk with curry spices for 20 mins' 
        },
        dinner: { 
          name: 'Grilled mackerel with steamed broccoli', 
          calories: '480-530 kcal', 
          nutrients: 'Omega-3s and sulforaphane for liver protection', 
          prepTip: 'Grill mackerel 3-4 mins per side, steam broccoli for 5 mins' 
        }
      },
      { 
        day: 'Saturday', 
        breakfast: { 
          name: 'Beef liver hash', 
          calories: '460-510 kcal', 
          nutrients: 'High protein breakfast for sustained energy', 
          prepTip: 'Dice liver and potatoes, fry together until crispy' 
        },
        lunch: { 
          name: 'Chicken liver salad', 
          calories: '350-400 kcal', 
          nutrients: 'Fresh greens with concentrated nutrients', 
          prepTip: 'Pan-fry liver quickly, serve warm over mixed greens' 
        },
        dinner: { 
          name: 'Herb-crusted lamb with asparagus', 
          calories: '520-570 kcal', 
          nutrients: 'Iron and B-vitamins with detoxifying asparagus', 
          prepTip: 'Coat lamb with herb crust, roast at 400°F for 15-20 mins' 
        }
      },
      { 
        day: 'Sunday', 
        breakfast: { 
          name: 'Liver pancakes with berries', 
          calories: '390-440 kcal', 
          nutrients: 'Antioxidants from berries with liver nutrients', 
          prepTip: 'Blend cooked liver into pancake batter, cook until golden' 
        },
        lunch: { 
          name: 'Liver soup with vegetables', 
          calories: '320-370 kcal', 
          nutrients: 'Easy-to-digest nutrients in warming broth', 
          prepTip: 'Simmer liver with vegetables in bone broth for 30 mins' 
        },
        dinner: { 
          name: 'Grilled trout with quinoa', 
          calories: '450-500 kcal', 
          nutrients: 'Omega-3s and complete proteins for liver repair', 
          prepTip: 'Grill trout 4-5 mins per side, serve with herbed quinoa' 
        }
      }
    ],
    'Low-Sugar': [
      { 
        day: 'Monday', 
        breakfast: { 
          name: 'Greek yogurt with nuts', 
          calories: '280-320 kcal', 
          nutrients: 'High protein and healthy fats to stabilize blood sugar', 
          prepTip: 'Choose plain Greek yogurt, add almonds or walnuts for crunch' 
        },
        lunch: { 
          name: 'Grilled chicken salad', 
          calories: '350-400 kcal', 
          nutrients: 'Lean protein with fiber-rich vegetables', 
          prepTip: 'Season chicken with herbs, serve over mixed greens with olive oil dressing' 
        },
        dinner: { 
          name: 'Baked salmon with steamed vegetables', 
          calories: '450-500 kcal', 
          nutrients: 'Omega-3s and low-glycemic vegetables', 
          prepTip: 'Bake salmon at 400°F for 12-15 mins, steam broccoli and carrots' 
        }
      },
      { 
        day: 'Tuesday', 
        breakfast: { 
          name: 'Scrambled eggs with spinach', 
          calories: '250-300 kcal', 
          nutrients: 'Complete protein with iron and folate', 
          prepTip: 'Scramble eggs in coconut oil, wilt fresh spinach at the end' 
        },
        lunch: { 
          name: 'Turkey and avocado wrap', 
          calories: '380-430 kcal', 
          nutrients: 'Healthy fats and protein for sustained energy', 
          prepTip: 'Use low-carb tortilla, add plenty of vegetables for fiber' 
        },
        dinner: { 
          name: 'Lean beef stir-fry with broccoli', 
          calories: '420-470 kcal', 
          nutrients: 'Iron and fiber with minimal carbohydrates', 
          prepTip: 'Stir-fry beef quickly over high heat, add broccoli last' 
        }
      },
      { 
        day: 'Wednesday', 
        breakfast: { 
          name: 'Cottage cheese with cucumber', 
          calories: '200-250 kcal', 
          nutrients: 'Casein protein for slow digestion and blood sugar stability', 
          prepTip: 'Add herbs and pepper for flavor, cucumber adds hydration' 
        },
        lunch: { 
          name: 'Tuna salad with mixed greens', 
          calories: '320-370 kcal', 
          nutrients: 'Omega-3s and protein with low carb vegetables', 
          prepTip: 'Use olive oil instead of mayo, add celery for crunch' 
        },
        dinner: { 
          name: 'Grilled pork chops with cauliflower mash', 
          calories: '450-500 kcal', 
          nutrients: 'High protein with low-carb vegetable substitute', 
          prepTip: 'Steam cauliflower until soft, mash with butter and herbs' 
        }
      },
      { 
        day: 'Thursday', 
        breakfast: { 
          name: 'Omelet with mushrooms and cheese', 
          calories: '300-350 kcal', 
          nutrients: 'Protein and healthy fats with minimal carbs', 
          prepTip: 'Sauté mushrooms first, add beaten eggs and cheese' 
        },
        lunch: { 
          name: 'Chicken soup with vegetables', 
          calories: '280-330 kcal', 
          nutrients: 'Hydrating protein with low-glycemic vegetables', 
          prepTip: 'Simmer chicken with celery, carrots, and herbs in broth' 
        },
        dinner: { 
          name: 'Baked cod with green beans', 
          calories: '350-400 kcal', 
          nutrients: 'Lean protein with fiber and minimal sugars', 
          prepTip: 'Season cod with lemon and herbs, steam green beans until tender' 
        }
      },
      { 
        day: 'Friday', 
        breakfast: { 
          name: 'Avocado and egg bowl', 
          calories: '320-370 kcal', 
          nutrients: 'Healthy fats and protein for blood sugar control', 
          prepTip: 'Poach or fry eggs, serve over sliced avocado with seasoning' 
        },
        lunch: { 
          name: 'Grilled shrimp salad', 
          calories: '300-350 kcal', 
          nutrients: 'Low-calorie protein with antioxidant-rich vegetables', 
          prepTip: 'Grill shrimp for 2-3 mins per side, toss with leafy greens' 
        },
        dinner: { 
          name: 'Turkey meatballs with zucchini noodles', 
          calories: '400-450 kcal', 
          nutrients: 'Lean protein with vegetable noodle substitute', 
          prepTip: 'Spiralize zucchini, bake turkey meatballs at 375°F for 20 mins' 
        }
      },
      { 
        day: 'Saturday', 
        breakfast: { 
          name: 'Protein smoothie with berries', 
          calories: '280-330 kcal', 
          nutrients: 'Antioxidants with low sugar content and protein', 
          prepTip: 'Blend protein powder with unsweetened almond milk and frozen berries' 
        },
        lunch: { 
          name: 'Chicken and vegetable soup', 
          calories: '320-370 kcal', 
          nutrients: 'Hydrating meal with balanced nutrients', 
          prepTip: 'Use bone broth base, add diced chicken and low-carb vegetables' 
        },
        dinner: { 
          name: 'Grilled steak with roasted Brussels sprouts', 
          calories: '500-550 kcal', 
          nutrients: 'High protein with cruciferous vegetables for detox', 
          prepTip: 'Grill steak to preference, roast Brussels sprouts at 425°F for 20 mins' 
        }
      },
      { 
        day: 'Sunday', 
        breakfast: { 
          name: 'Cheese and veggie omelet', 
          calories: '320-370 kcal', 
          nutrients: 'Protein and healthy fats with vegetable fiber', 
          prepTip: 'Add bell peppers, onions, and cheese to beaten eggs' 
        },
        lunch: { 
          name: 'Salmon salad with mixed greens', 
          calories: '380-430 kcal', 
          nutrients: 'Omega-3 fatty acids with antioxidant vegetables', 
          prepTip: 'Flake cooked salmon over greens, dress with olive oil and lemon' 
        },
        dinner: { 
          name: 'Baked chicken with steamed asparagus', 
          calories: '400-450 kcal', 
          nutrients: 'Lean protein with asparagus for natural detox', 
          prepTip: 'Season chicken with herbs, bake at 375°F, steam asparagus for 4-5 mins' 
        }
      }
    ],
    'Vegetarian': [
      { 
        day: 'Monday', 
        breakfast: { 
          name: 'Oatmeal with fresh berries', 
          calories: '300-350 kcal', 
          nutrients: 'Complex carbs and antioxidants for sustained energy', 
          prepTip: 'Cook oats with plant milk, top with mixed berries and a drizzle of honey' 
        },
        lunch: { 
          name: 'Quinoa salad with chickpeas', 
          calories: '400-450 kcal', 
          nutrients: 'Complete protein and fiber for digestive health', 
          prepTip: 'Cool cooked quinoa, mix with roasted chickpeas and fresh herbs' 
        },
        dinner: { 
          name: 'Vegetable stir-fry with tofu', 
          calories: '380-430 kcal', 
          nutrients: 'Plant protein with variety of vitamins and minerals', 
          prepTip: 'Press tofu to remove water, stir-fry with colorful vegetables in sesame oil' 
        }
      },
      { 
        day: 'Tuesday', 
        breakfast: { 
          name: 'Greek yogurt with granola', 
          calories: '320-370 kcal', 
          nutrients: 'Probiotics and fiber for gut health', 
          prepTip: 'Choose low-sugar granola, add nuts and seeds for extra nutrition' 
        },
        lunch: { 
          name: 'Lentil soup with whole grain bread', 
          calories: '450-500 kcal', 
          nutrients: 'High protein legumes with complex carbohydrates', 
          prepTip: 'Simmer lentils with vegetables and herbs, serve with crusty bread' 
        },
        dinner: { 
          name: 'Eggplant parmesan with side salad', 
          calories: '420-470 kcal', 
          nutrients: 'Antioxidants from eggplant with calcium from cheese', 
          prepTip: 'Bread and bake eggplant slices, layer with marinara and cheese' 
        }
      },
      { 
        day: 'Wednesday', 
        breakfast: { 
          name: 'Smoothie bowl with banana and nuts', 
          calories: '350-400 kcal', 
          nutrients: 'Potassium and healthy fats for heart health', 
          prepTip: 'Blend frozen banana with plant milk, top with nuts and seeds' 
        },
        lunch: { 
          name: 'Black bean burrito bowl', 
          calories: '480-530 kcal', 
          nutrients: 'Plant protein and fiber with complex carbs', 
          prepTip: 'Layer rice, seasoned black beans, vegetables, and avocado' 
        },
        dinner: { 
          name: 'Mushroom and spinach pasta', 
          calories: '400-450 kcal', 
          nutrients: 'Iron from spinach with umami flavors from mushrooms', 
          prepTip: 'Sauté mushrooms until golden, wilt spinach, toss with pasta and garlic' 
        }
      },
      { 
        day: 'Thursday', 
        breakfast: { 
          name: 'Avocado toast with tomatoes', 
          calories: '280-330 kcal', 
          nutrients: 'Healthy fats and lycopene for heart health', 
          prepTip: 'Mash avocado with lime juice, spread on toast, top with sliced tomatoes' 
        },
        lunch: { 
          name: 'Caprese salad with quinoa', 
          calories: '380-430 kcal', 
          nutrients: 'Complete protein with fresh flavors and healthy fats', 
          prepTip: 'Layer fresh mozzarella, tomatoes, and basil over cooked quinoa' 
        },
        dinner: { 
          name: 'Vegetable curry with brown rice', 
          calories: '450-500 kcal', 
          nutrients: 'Anti-inflammatory spices with fiber-rich vegetables', 
          prepTip: 'Simmer vegetables in coconut milk with curry spices, serve over brown rice' 
        }
      },
      { 
        day: 'Friday', 
        breakfast: { 
          name: 'Chia pudding with fruit', 
          calories: '250-300 kcal', 
          nutrients: 'Omega-3s and fiber for digestive health', 
          prepTip: 'Soak chia seeds in plant milk overnight, top with fresh fruit' 
        },
        lunch: { 
          name: 'Hummus wrap with vegetables', 
          calories: '350-400 kcal', 
          nutrients: 'Plant protein with fresh vegetable nutrients', 
          prepTip: 'Spread hummus on tortilla, add cucumber, peppers, and sprouts' 
        },
        dinner: { 
          name: 'Stuffed bell peppers with rice', 
          calories: '420-470 kcal', 
          nutrients: 'Vitamin C from peppers with complete carbohydrates', 
          prepTip: 'Hollow out peppers, stuff with seasoned rice and vegetable mixture' 
        }
      },
      { 
        day: 'Saturday', 
        breakfast: { 
          name: 'Pancakes with fresh fruit', 
          calories: '380-430 kcal', 
          nutrients: 'Complex carbs with natural fruit sugars and vitamins', 
          prepTip: 'Make pancakes with whole wheat flour, serve with seasonal fruit' 
        },
        lunch: { 
          name: 'Mediterranean salad with feta', 
          calories: '400-450 kcal', 
          nutrients: 'Calcium from feta with antioxidants from vegetables', 
          prepTip: 'Combine olives, tomatoes, cucumber, and feta with olive oil dressing' 
        },
        dinner: { 
          name: 'Vegetable lasagna', 
          calories: '450-500 kcal', 
          nutrients: 'Protein from cheese with variety of vegetable nutrients', 
          prepTip: 'Layer pasta with ricotta, vegetables, and marinara sauce' 
        }
      },
      { 
        day: 'Sunday', 
        breakfast: { 
          name: 'French toast with berries', 
          calories: '350-400 kcal', 
          nutrients: 'Antioxidants from berries with satisfying carbohydrates', 
          prepTip: 'Dip bread in egg mixture, cook until golden, serve with fresh berries' 
        },
        lunch: { 
          name: 'Buddha bowl with tahini dressing', 
          calories: '420-470 kcal', 
          nutrients: 'Variety of nutrients from colorful vegetables and healthy fats', 
          prepTip: 'Arrange roasted vegetables over greens, drizzle with tahini sauce' 
        },
        dinner: { 
          name: 'Grilled portobello mushrooms with quinoa', 
          calories: '350-400 kcal', 
          nutrients: 'Umami flavors with complete protein from quinoa', 
          prepTip: 'Marinate mushrooms in balsamic, grill for 5-7 mins per side' 
        }
      }
    ]
  };

  const handleDietChange = (event) => {
    const diet = event.target.value;
    setSelectedDiet(diet);
    setError('');
    setSearchTerm('');
    setDietaryNotes('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNotesChange = (event) => {
    setDietaryNotes(event.target.value);
  };

  const applyDietaryModifications = (meals, notes) => {
    if (!notes.trim()) return meals;

    const modifications = [];
    const lines = notes.toLowerCase().split(/[,\n;]/).map(line => line.trim());

    // Parse dietary restrictions and replacements
    lines.forEach(line => {
      if (line.includes('replace') && line.includes('with')) {
        const match = line.match(/replace\s+(.+?)\s+with\s+(.+)/);
        if (match) {
          modifications.push({ from: match[1].trim(), to: match[2].trim() });
        }
      } else if (line.includes('no ') || line.includes('avoid ')) {
        const match = line.match(/(?:no|avoid)\s+(.+)/);
        if (match) {
          const ingredient = match[1].trim();
          // Common replacements for avoided ingredients
          const replacements = {
            'red meat': 'tofu',
            'meat': 'plant-based protein',
            'beef': 'lentils',
            'pork': 'tempeh',
            'chicken': 'chickpeas',
            'fish': 'tofu',
            'salmon': 'avocado',
            'dairy': 'plant-based alternative',
            'cheese': 'nutritional yeast',
            'milk': 'plant milk',
            'eggs': 'flax eggs',
            'gluten': 'gluten-free alternative',
            'wheat': 'quinoa',
            'rice': 'cauliflower rice',
            'pasta': 'zucchini noodles'
          };
          const replacement = replacements[ingredient] || 'suitable alternative';
          modifications.push({ from: ingredient, to: replacement });
        }
      }
    });

    // Apply modifications to meals
    const modifiedMeals = meals.map(day => ({
      ...day,
      breakfast: modifyMeal(day.breakfast, modifications),
      lunch: modifyMeal(day.lunch, modifications),
      dinner: modifyMeal(day.dinner, modifications)
    }));

    return modifiedMeals;
  };

  const modifyMeal = (meal, modifications) => {
    let modifiedName = meal.name;
    let modifiedNutrients = meal.nutrients;
    let modifiedPrepTip = meal.prepTip;

    modifications.forEach(({ from, to }) => {
      const regex = new RegExp(from, 'gi');
      modifiedName = modifiedName.replace(regex, to);
      modifiedNutrients = modifiedNutrients.replace(regex, to);
      modifiedPrepTip = modifiedPrepTip.replace(regex, to);
    });

    return {
      ...meal,
      name: modifiedName,
      nutrients: modifiedNutrients,
      prepTip: modifiedPrepTip,
      isModified: modifiedName !== meal.name
    };
  };

  const handleApplyNotes = () => {
    if (originalMealPlan.length > 0) {
      try {
        setIsLoading(true);
        setError('');
        const modifiedPlan = applyDietaryModifications(originalMealPlan, dietaryNotes);
        setMealPlan(modifiedPlan);
      } catch (err) {
        setError('Failed to apply dietary modifications. Please check your input and try again.');
        console.error('Error applying modifications:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetMenu = () => {
    if (originalMealPlan.length > 0) {
      try {
        setMealPlan(originalMealPlan);
        setDietaryNotes('');
        setError('');
      } catch (err) {
        setError('Failed to reset menu. Please refresh the page.');
        console.error('Error resetting menu:', err);
      }
    }
  };

  const filterMealsBySearch = (meals, search) => {
    if (!search.trim()) return meals;
    
    return meals.map(day => ({
      ...day,
      breakfast: { ...day.breakfast, isMatch: day.breakfast.name.toLowerCase().includes(search.toLowerCase()) },
      lunch: { ...day.lunch, isMatch: day.lunch.name.toLowerCase().includes(search.toLowerCase()) },
      dinner: { ...day.dinner, isMatch: day.dinner.name.toLowerCase().includes(search.toLowerCase()) }
    })).filter(day => 
      day.breakfast.isMatch || day.lunch.isMatch || day.dinner.isMatch
    );
  };

  // UseEffect to update displayed menu when diet changes
  useEffect(() => {
    if (selectedDiet) {
      try {
        setIsLoading(true);
        setError('');
        
        if (mealPlans[selectedDiet] && Array.isArray(mealPlans[selectedDiet]) && mealPlans[selectedDiet].length > 0) {
          const originalPlan = mealPlans[selectedDiet];
          setOriginalMealPlan(originalPlan);
          setMealPlan(originalPlan);
          setDietaryNotes('');
        } else {
          setError(`Menu not available yet for ${selectedDiet} diet. Please try another diet type or check back later.`);
          setMealPlan([]);
          setOriginalMealPlan([]);
        }
      } catch (err) {
        setError('Failed to load meal plan. Please refresh the page and try again.');
        console.error('Error loading meal plan:', err);
        setMealPlan([]);
        setOriginalMealPlan([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMealPlan([]);
      setOriginalMealPlan([]);
      setError('');
      setDietaryNotes('');
    }
  }, [selectedDiet]);

  const filteredMealPlan = filterMealsBySearch(mealPlan, searchTerm);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${selectedDiet} Diet - 7-Day Meal Plan`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Dietary Meal Planner</h1>
      </header>
      
      <main className="App-main">
        <div className="diet-selector">
          <label htmlFor="diet-select">
            <h3>Select Your Dietary Type:</h3>
          </label>
          <select 
            id="diet-select"
            value={selectedDiet} 
            onChange={handleDietChange}
            className="diet-dropdown"
          >
            <option value="">Choose a diet...</option>
            <option value="Liver-Centric">Liver-Centric</option>
            <option value="Low-Sugar">Low-Sugar</option>
            <option value="Vegetarian">Vegetarian</option>
          </select>
        </div>

        {selectedDiet && (
          <div className="search-section">
            <label htmlFor="search-input">
              <h4>🔍 Search meals by ingredient:</h4>
            </label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="e.g., salmon, chicken, quinoa..."
              className="search-input"
            />
            {searchTerm && (
              <p className="search-results">
                Showing {filteredMealPlan.length} day(s) with meals containing "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {selectedDiet && (
          <div className="dietary-notes-section">
            <label htmlFor="dietary-notes">
              <h4>📝 Custom Dietary Notes:</h4>
            </label>
            <textarea
              id="dietary-notes"
              value={dietaryNotes}
              onChange={handleNotesChange}
              placeholder="Enter dietary modifications, e.g.:&#10;- Replace beef with tofu&#10;- Avoid red meat&#10;- No dairy&#10;- Replace pasta with zucchini noodles"
              className="dietary-notes-textarea"
              rows="4"
              disabled={isLoading || mealPlan.length === 0}
            />
            <div className="notes-buttons">
              <button 
                onClick={handleApplyNotes}
                className="apply-notes-button"
                disabled={!dietaryNotes.trim() || isLoading || mealPlan.length === 0}
              >
                {isLoading ? '⏳ Applying...' : '✨ Apply Modifications'}
              </button>
              <button 
                onClick={handleResetMenu}
                className="reset-notes-button"
                disabled={JSON.stringify(mealPlan) === JSON.stringify(originalMealPlan) || isLoading}
              >
                🔄 Reset to Original
              </button>
            </div>
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
              </div>
            )}
            <div className="notes-help">
              <p><strong>Examples:</strong></p>
              <ul>
                <li>"Replace beef with tofu"</li>
                <li>"Avoid red meat"</li>
                <li>"No dairy, no gluten"</li>
                <li>"Replace chicken with chickpeas"</li>
              </ul>
            </div>
          </div>
        )}

        {mealPlan.length > 0 && !error && (
          <div className="print-section no-print">
            <button 
              onClick={handlePrint}
              className="print-button"
              title="Generate PDF or Print Menu"
              disabled={isLoading}
            >
              🖨️ Print / Download PDF
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading meal plan...</p>
          </div>
        ) : error ? (
          <div className="error-display">
            <p>⚠️ {error}</p>
            <button 
              onClick={() => setSelectedDiet('')}
              className="retry-button"
            >
              🔄 Try Another Diet
            </button>
          </div>
        ) : mealPlan.length > 0 ? (
          <div ref={componentRef}>
            <div className="print-header">
              <h2>{selectedDiet} Diet - 7-Day Meal Plan</h2>
              <p className="print-date">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <MenuDisplay menu={filteredMealPlan} searchTerm={searchTerm} />
          </div>
        ) : selectedDiet === '' ? (
          <div className="no-diet-message">
            <p>Select a diet to view your plan</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
