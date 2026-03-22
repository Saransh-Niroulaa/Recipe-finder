import { useState } from 'react';
import Navbar from './components/Navbar';
import RecipeCard from './components/RecipeCard';
import RecipeDetails from './components/RecipeDetails';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('ingredients');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (e) => {
    if (e) e.preventDefault();

    if (currentTab !== 'random' && !searchInput.trim()) return;

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      if (API_URL.endsWith('/')) {
        API_URL = API_URL.slice(0, -1);
      }

      let endpoint = '';
      if (currentTab === 'ingredients') {
        endpoint = `${API_URL}/api/recipes/search?ingredients=${encodeURIComponent(searchInput)}`;
      } else if (currentTab === 'name') {
        endpoint = `${API_URL}/api/recipes/search?name=${encodeURIComponent(searchInput)}`;
      } else if (currentTab === 'random') {
        endpoint = `${API_URL}/api/recipes/random`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSearchInput('');
    setRecipes([]);
    setSelectedRecipeId(null);
    setError(null);

    if (tab === 'random') {
      searchRecipes();
    }
  };

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

  return (
    <div className="app-container">
      <header className="header">
        <h1>Recipe Finder</h1>
        <p>Feed your soul, one bite at a time.</p>
      </header>

      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

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

      {error && <div className="error-message">{error}</div>}

      {loading && currentTab === 'random' && <div className="loading-message">Fetching random recipes...</div>}

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={setSelectedRecipeId} 
          />
        ))}

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