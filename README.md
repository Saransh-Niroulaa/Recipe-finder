# Recipe Finder

A full-stack recipe search application powered by the Spoonacular API.

## Deployed at

- **Frontend:** [https://recipe-finder-tau-wheat.vercel.app/](https://recipe-finder-tau-wheat.vercel.app/)
- **Backend:** [https://recipe-finder-dojv.onrender.com/](https://recipe-finder-dojv.onrender.com/)

## Features

- Search recipes by ingredients.
- Search recipes by name.
- Fetch random recipes.
- Detailed recipe information including ingredients and instructions.
- Fully responsive design.

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express, Axios
- **API:** [Spoonacular API](https://spoonacular.com/food-api)

## Local Setup

### Prerequisites
- Node.js installed on your machine.
- A Spoonacular API key.

### Backend
1. Navigate to the `backend` folder.
2. Create a `.env` file and add:
   ```env
   SPOONACULAR_API_KEY=your_api_key_here
   PORT=5000
   ```
3. Run `npm install`.
4. Run `npm start`.

### Frontend
1. Navigate to the `frontend` folder.
2. Run `npm install`.
3. Create a `.env` file (optional for local) or rely on the default `localhost:5000`.
4. Run `npm run dev`.
