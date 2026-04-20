# Rioma Bakes

This repo is now set up for a single-host deployment on Netlify.

The live site uses:

- React frontend from `frontend/`
- Netlify Functions for `/api/*`
- Netlify Blobs for simple persistent storage of orders, custom requests, contact messages, and chat history

## Local Development

Frontend:

```powershell
cd frontend
npm ci
npm start
```

For local Netlify-style development, use `netlify dev` if you have the Netlify CLI installed.

## Netlify Frontend

This repo includes [netlify.toml](C:/Users/msafw/Downloads/RiomaBakes-main/RiomaBakes-main/netlify.toml) for SPA hosting.

Netlify settings:

- Base directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `build`
- Functions directory: `frontend/netlify/functions`

No separate backend host is required.
