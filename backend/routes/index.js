const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const tournamentRoutes = require('./tournamentRoutes');
const contentRoutes = require('./contentRoutes');

// --- Mount Routes Matching Frontend Usage ---

// Auth & Users
// Frontend: api.post('/login'), api.get('/profile')
router.use('/', authRoutes);
router.use('/', userRoutes);

// Tournaments
// Frontend: api.get('/tournaments'), api.post('/tournaments/create')
router.use('/tournaments', tournamentRoutes);

// Content
// Frontend: api.get('/documents'), api.post('/content/create')
// We mount content routes at root to match /api/documents
router.use('/', contentRoutes); 
// We also alias /content for creation if your frontend uses /api/content/create
router.use('/content', contentRoutes); 

module.exports = router;