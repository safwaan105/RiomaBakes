# Rioma Bakes

This repo is now set up for:

- local frontend development against `http://localhost:8000`
- frontend deployment on Netlify
- backend deployment on any FastAPI-friendly host

## Local Development

Frontend:

```powershell
cd frontend
npm ci
npm start
```

The frontend defaults to `http://localhost:8000` when `REACT_APP_BACKEND_URL` is not set.

Backend:

```powershell
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Create `backend/.env` from `backend/.env.example` before starting the API.

## Netlify Frontend

This repo includes [netlify.toml](C:/Users/msafw/Downloads/RiomaBakes-main/RiomaBakes-main/netlify.toml) for SPA hosting.

Netlify settings:

- Base directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `build`

Netlify environment variable:

- `REACT_APP_BACKEND_URL=https://your-backend-host`

## Backend Environment

Set these on your backend host:

- `MONGO_URL=...`
- `DB_NAME=rioma_bakes`
- `CORS_ORIGINS=http://localhost:3000,https://your-site-name.netlify.app`
- `EMERGENT_LLM_KEY=...` for AI chat only
