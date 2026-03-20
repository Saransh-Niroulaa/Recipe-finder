const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API key helper
const checkApiKey = (res) => {
  const API_KEY = process.env.SPOONACULAR_API_KEY;
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    res.status(500).json({ error: 'API key is not configured' });
    return null;
  }
  return API_KEY;
};

// Search by name or ingredients
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { ingredients, name } = req.query;
    const API_KEY = checkApiKey(res);
    if (!API_KEY) return;

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        query: name || '',
        includeIngredients: ingredients || '',
        addRecipeNutrition: true,
        addRecipeInformation: true,
        fillIngredients: true,
        number: 10,
        apiKey: API_KEY
      }
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error searching recipes:', error.message);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

// Random recipes
app.get('/api/recipes/random', async (req, res) => {
  try {
    const API_KEY = checkApiKey(res);
    if (!API_KEY) return;

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        sort: 'random',
        addRecipeNutrition: true,
        addRecipeInformation: true,
        fillIngredients: true,
        number: 10,
        apiKey: API_KEY
      }
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching random recipes:', error.message);
    res.status(500).json({ error: 'Failed to fetch random recipes' });
  }
});

// Recipe details
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const API_KEY = checkApiKey(res);
    if (!API_KEY) return;

    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
      params: {
        includeNutrition: true, 
        apiKey: API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching recipe ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
