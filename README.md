# Lakers Project - NBA Draft Assets Viewer

A full-stack application to view and analyze NBA teams' draft assets.

## Project Structure

```
lakers-project/
├── backend/           # Express.js backend
│   ├── src/
│   │   └── server.js # API endpoints and scraping logic
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend (to be created)
├── package.json      # Root package.json for project management
└── README.md        # This file
```

## Setup

1. Install all dependencies (backend and frontend):
```bash
npm run install:all
```

2. Start both backend and frontend in development mode:
```bash
npm run dev
```

This will start:
- Backend server on port 3001
- Frontend development server on port 3000 (when created)

## Development

- To run only the backend: `npm run backend`
- To run only the frontend: `npm run frontend`
- To run both simultaneously: `npm run dev`

## API Endpoints

### Get Draft Picks for All Teams
```
GET http://localhost:3001/api/draft-picks
```

### Get Draft Picks for a Specific Team
```
GET http://localhost:3001/api/draft-picks/:team
```
Replace `:team` with the team name (e.g., Lakers, Celtics, Warriors, etc.) 