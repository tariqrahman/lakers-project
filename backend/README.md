# NBA Draft Assets Scraper

This project scrapes NBA draft pick data from basketball.realgm.com and provides it through a REST API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## API Endpoints

### Get Draft Picks for All Teams
```
GET /api/draft-picks
```

### Get Draft Picks for a Specific Team
```
GET /api/draft-picks/:team
```
Replace `:team` with the team name (e.g., Lakers, Celtics, Warriors, etc.)

## Response Format

The API returns JSON data in the following format:

```json
{
  "team": "TeamName",
  "picks": [
    {
      "year": "2025",
      "firstRound": "Description of first round pick",
      "secondRound": "Description of second round pick"
    },
    // ... more years
  ]
}
```

## Notes

- The server includes CORS support for frontend integration
- Error handling is implemented for failed requests
- The scraper respects the HTML structure of basketball.realgm.com 