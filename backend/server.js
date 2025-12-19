const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mainRouter = require('./routes/index');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Mount all routes under /api
app.use('/api', mainRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});