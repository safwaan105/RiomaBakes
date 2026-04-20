# Rioma Bakes

Rioma Bakes is a boutique bakery storefront with a React frontend and a FastAPI backend. The site includes product browsing, cart and checkout flows, custom order and contact forms, gallery pages, and a lightweight in-house chat concierge.

## Stack

- Frontend: React, CRACO, Tailwind CSS, React Router
- Backend: FastAPI, Motor, MongoDB
- Deployment: GitHub Pages workflow for the frontend

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

Create a `backend/.env` file with:

```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=rioma_bakes
CORS_ORIGINS=http://localhost:3000
```

## GitHub Pages

This repository includes a GitHub Actions workflow that deploys the frontend to GitHub Pages on pushes to `main`.

Expected Pages URL:

`https://safwaan105.github.io/RiomaBakes/`

Notes:

- The GitHub Pages deployment is frontend-only.
- The backend and MongoDB are not hosted by GitHub Pages.
- Interactive features that depend on the backend require a separate backend deployment and a configured `REACT_APP_BACKEND_URL`.
