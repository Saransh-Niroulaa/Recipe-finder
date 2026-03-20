import { useState, useEffect } from 'react';
import './RecipeDetails.css';

function RecipeDetails({ recipeId, onBack }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/recipes/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch details');
        
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recipeId]); 

  if (loading) return <div className="loading-message">Loading recipe details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="recipe-details">
      <button className="back-button" onClick={onBack}>&larr; Back to Results</button>
      
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="details-image" />
      
      {recipe.summary && (
        <div 
          className="recipe-full-summary" 
          dangerouslySetInnerHTML={{ __html: recipe.summary }} 
        />
      )}
      
      <div className="details-container">
        <div className="ingredients-section">
          <h3>Ingredients You Need</h3>
          <ul>
            {recipe.extendedIngredients?.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
        </div>
        
        <div className="instructions-section">
          <h3>How to Make It</h3>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions provided.' }} />
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
