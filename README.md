# Personal Dietary Meal Planner

A React-based meal planning application that helps users create personalized 7-day meal plans based on their dietary preferences.

## Features

### 🥗 Diet Types
- **Liver-Centric**: Focus on liver health with organ meats and detox-friendly foods
- **Low-Sugar**: Protein-rich, low-carb meals for blood sugar management
- **Vegetarian**: Plant-based nutrition with complete proteins

### 📋 Meal Planning
- 7-day weekly meal plans with detailed information
- Breakfast, lunch, and dinner for each day
- Calorie estimates (400-570 kcal range per meal)
- Key nutrients and health benefits
- Step-by-step preparation tips

### 🔍 Search & Filter
- Search meals by ingredient (e.g., "salmon", "quinoa", "tofu")
- Real-time filtering with highlighting
- Shows matching days with relevant meals

### 📝 Custom Dietary Modifications
- Add personal dietary notes and restrictions
- Smart ingredient replacements (e.g., "Replace beef with tofu")
- Automatic substitutions for common restrictions
- Visual indicators for modified meals

### 🖨️ Print & Export
- Generate PDF meal plans
- Print-optimized layouts
- Professional formatting for easy reference

### 📱 Mobile-Friendly Design
- Responsive design for all screen sizes
- Touch-optimized interface
- Smooth animations and transitions
- Accordion-style meal display

## Technology Stack

- **React 18** - Modern React with hooks
- **CSS3** - Custom styling with gradients and animations
- **react-to-print** - PDF generation and printing
- **Responsive Design** - Mobile-first approach

## Installation

1. Clone the repository
```bash
git clone https://github.com/robesonw/meal-planner-app.git
cd meal-planner-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view in browser

## Usage

1. **Select Diet Type**: Choose from Liver-Centric, Low-Sugar, or Vegetarian
2. **Search Ingredients**: Use the search bar to find meals with specific ingredients
3. **Customize Diet**: Add dietary notes to modify meals (e.g., "No dairy", "Replace chicken with tofu")
4. **View Details**: Click on any day to expand and see detailed meal information
5. **Print/Export**: Use the print button to generate a PDF of your meal plan

## Project Structure

```
src/
├── App.js              # Main application component
├── App.css             # Main application styles
├── MenuDisplay.js      # Meal plan display component
├── MenuDisplay.css     # Menu display styles
├── index.js           # App entry point
└── index.css          # Global styles
```

## Author

Created by [robesonw](https://github.com/robesonw)

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
