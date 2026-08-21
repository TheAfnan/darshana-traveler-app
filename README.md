# DarShana Traveler

DarShana Traveler is a React + TypeScript travel experience app for exploring Indian destinations, festivals, safety tools, travel planning, and companion features such as mood analysis and guidance flows.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Leaflet
- Firebase and other API integrations

## Project Structure

- `src/` - application source code
- `src/components/` - reusable UI and feature components
- `src/pages/` - route-level pages
- `src/services/` - API and integration helpers
- `src/context/` - app state providers
- `src/styles/` - shared styles
- `data/` - location and structured data
- `locales/` - translation files
- `models/` - face-api model assets used by camera/mood features
- `backend/` - backend service folder placeholder in this export

Generated bundles, backup files, and scratch test files were removed from this repo export so the repository stays source-focused.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deployment

This app is ready for Vercel on the frontend. If you connect a backend service later, point the frontend to it with `VITE_BACKEND_URL`.

Vercel settings:

- Build Command: `npm run build`
- Output Directory: `dist`

## Notes

- Keep secrets in environment variables, not in the repository.
- Large static assets such as face-api models are better served from a public CDN or object storage if deployment size becomes a problem.
