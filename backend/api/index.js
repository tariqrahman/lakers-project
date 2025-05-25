import express from 'express';
import cors from 'cors';
import { getAllDraftPicks } from '../src/db/operations.js';

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Basic test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Main draft picks endpoint
app.get('/api/draft-picks', async (req, res) => {
  try {
    const picks = await getAllDraftPicks();
    res.json(picks);
  } catch (error) {
    console.error('Error fetching draft picks:', error);
    res.status(500).json({ error: 'Failed to fetch draft picks' });
  }
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl
  });
});

export default app; 