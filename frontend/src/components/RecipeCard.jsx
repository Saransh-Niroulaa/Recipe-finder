import './RecipeCard.css';

function RecipeCard({ recipe, onClick }) {
  // Get macro nutrient by name
  const getMacro = (macroName) => {
    if (!recipe.nutrition || !recipe.nutrition.nutrients) return 'N/A';
    const nutrient = recipe.nutrition.nutrients.find(n => n.name === macroName);
    return nutrient ? `${Math.round(nutrient.amount)}${nutrient.unit}` : 'N/A';
  };

  const calories = getMacro('Calories');
  const protein = getMacro('Protein');
  const carbs = getMacro('Carbohydrates');
  const fat = getMacro('Fat');

  return (
    <div className="recipe-card" onClick={() => onClick(recipe.id)}>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        
        <div className="macros-container">
          <span className="macro"> {calories}</span>
          <span className="macro"> {protein} Prot</span>
          <span className="macro"> {carbs} Carb</span>
          <span className="macro"> {fat} Fat</span>
        </div>

        {/* Clean summary preview */}
        {recipe.summary && (
          <p className="recipe-summary">
            {recipe.summary.replace(/<[^>]+>/g, '').substring(0, 100)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
