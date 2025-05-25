import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import { upsertDraftPicks, getDraftPicksByTeam, getAllDraftPicks, getTeamByName } from './db/operations.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Add request logging middleware
app.use((req, res, next) => {
  console.log('=== Request Details ===');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('=== End Request Details ===');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== Error Details ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  console.error('=== End Error Details ===');
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://lakers-project.vercel.app', 'https://lakers-project-git-main-tariqr.vercel.app']
    : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
};

console.log('CORS configuration:', corsOptions);
app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

const BASE_URL = 'https://basketball.realgm.com/nba/draft/future_drafts/team';

// Function to parse the draft picks table for a team
const parseDraftPicks = ($, table) => {
  const picks = [];
  
  $(table).find('tr').each((_, row) => {
    // Skip header row
    if ($(row).find('th').length > 0) return;
    
    const year = $(row).find('td:nth-child(1)').text().trim();
    const firstRound = $(row).find('td:nth-child(2)').text().trim();
    const secondRound = $(row).find('td:nth-child(3)').text().trim();
    
    if (year) {  // Only add if we have a year (to skip empty rows)
      picks.push({
        year,
        firstRound,
        secondRound
      });
    }
  });
  
  return picks;
};

// Function to extract team name from table header
const getTeamName = ($, table) => {
  const headerText = $(table).prevAll('h2').first().text().trim();
  return headerText.replace(' Future NBA Draft Picks', '');
};

// Endpoint to refresh data from RealGM
app.post('/api/refresh-data', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);
    
    // Find all draft pick tables
    $('table.table').each(async (_, table) => {
      const teamName = getTeamName($, table);
      if (teamName) {
        const team = await getTeamByName(teamName);
        if (team) {
          const picks = parseDraftPicks($, table);
          await upsertDraftPicks(team.id, picks);
        }
      }
    });
    
    res.json({ message: 'Data refresh initiated' });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

// Endpoint to get draft picks for a specific team
app.get('/api/draft-picks/:team', async (req, res) => {
  try {
    const { team } = req.params;
    const teamData = await getTeamByName(team);
    
    if (!teamData) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const picks = await getDraftPicksByTeam(teamData.id);
    res.json({
      team: teamData.name,
      picks
    });
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).json({ error: 'Failed to fetch draft picks data' });
  }
});

// Endpoint to get draft picks for all teams
app.get('/api/draft-picks', async (req, res) => {
  console.log('GET /api/draft-picks - Request received');
  try {
    console.log('Attempting to fetch all draft picks');
    const picks = await getAllDraftPicks();
    console.log(`Successfully retrieved ${picks.length} draft picks`);
    
    // Group by team
    const teamGroups = picks.reduce((acc, pick) => {
      if (!acc[pick.team_name]) {
        acc[pick.team_name] = {
          team: pick.team_name,
          picks: []
        };
      }
      
      acc[pick.team_name].picks.push({
        season: pick.season,
        firstRound: pick.first_rd,
        secondRound: pick.second_rd,
        lastUpdated: pick.last_updated
      });
      
      return acc;
    }, {});
    
    console.log(`Grouped picks into ${Object.keys(teamGroups).length} teams`);
    res.json(Object.values(teamGroups));
  } catch (error) {
    console.error('Error in /api/draft-picks:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to fetch draft picks data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Only start the server in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Development server running on port ${PORT}`);
  });
}

export default app; 