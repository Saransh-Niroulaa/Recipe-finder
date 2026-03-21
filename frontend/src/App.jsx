import { useState } from 'react';
import Navbar from './components/Navbar';
import RecipeCard from './components/RecipeCard';
import RecipeDetails from './components/RecipeDetails';
import './App.css';

function App() {
  // State variables: track user input, current tab, recipes, loading, error, and selected recipe
  const [currentTab, setCurrentTab] = useState('ingredients'); // 'ingredients', 'name', or 'random'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // stores recipe ID when viewing details
  const [searchInput, setSearchInput] = useState(''); // text typed by user
  const [recipes, setRecipes] = useState([]); // list of recipes fetched from backend
  const [loading, setLoading] = useState(false); // shows loading state
  const [error, setError] = useState(null); // stores error messages

  // Function to fetch recipes from backend
  const searchRecipes = async (e) => {
    if (e) e.preventDefault(); // prevent page reload on form submit

    // If input is empty for name/ingredients search, do nothing
    if (currentTab !== 'random' && !searchInput.trim()) return;

    setLoading(true); // start loading
    setError(null); // clear previous error
    setRecipes([]); // clear previous results

    try {
      // Base API URL from environment variable or default to localhost
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Remove trailing slash if it exists to prevent double slashes in endpoints
      if (API_URL.endsWith('/')) {
        API_URL = API_URL.slice(0, -1);
      }

      // Choose API endpoint based on current tab
      let endpoint = '';
      if (currentTab === 'ingredients') {
        endpoint = `${API_URL}/api/recipes/search?ingredients=${encodeURIComponent(searchInput)}`;
      } else if (currentTab === 'name') {
        endpoint = `${API_URL}/api/recipes/search?name=${encodeURIComponent(searchInput)}`;
      } else if (currentTab === 'random') {
        endpoint = `${API_URL}/api/recipes/random`;
      }

      const response = await fetch(endpoint); // make API request
      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRecipes(data); // save recipes to state
    } catch (err) {
      setError(err.message); // display error
    } finally {
      setLoading(false); // stop loading
    }
  };

  // Function to switch between tabs (ingredients, name, random)
  const handleTabChange = (tab) => {
    setCurrentTab(tab); // change current tab
    setSearchInput(''); // clear search input
    setRecipes([]); // clear current recipes
    setSelectedRecipeId(null); // go back from recipe details
    setError(null); // clear errors

    // If tab is 'random', fetch random recipes automatically
    if (tab === 'random') {
      searchRecipes();
    }
  };

  // Show recipe details page if a recipe is selected
  if (selectedRecipeId) {
    return (
      <div className="app-container">
        <RecipeDetails 
          recipeId={selectedRecipeId} 
          onBack={() => setSelectedRecipeId(null)} 
        />
      </div>
    );
  }

  // Main search page
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Recipe Finder</h1>
        <p>Feed your soul, one bite at a time.</p>
      </header>

      {/* Tabs navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Search form (hidden for random tab) */}
      {currentTab !== 'random' && (
        <form className="search-form" onSubmit={searchRecipes}>
          <input
            type="text"
            placeholder={currentTab === 'ingredients' ? "e.g. apples, flour" : "e.g. Pasta, Burger"}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      )}

      {/* Show error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Show loading message for random recipes */}
      {loading && currentTab === 'random' && <div className="loading-message">Fetching random recipes...</div>}

      {/* Recipes list */}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={setSelectedRecipeId} 
          />
        ))}

        {/* Show empty state if no recipes */}
        {recipes.length === 0 && !loading && !error && currentTab !== 'random' && (
          <div className="empty-state">
            Try searching for some {currentTab === 'ingredients' ? 'ingredients' : 'recipes'} above!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;