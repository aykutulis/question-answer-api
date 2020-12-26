const express = require('express');
const dotenv = require('dotenv');
const routers = require('./routers');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require('./middlewares/errors/customErrorHandler');
const path = require('path');

// Environment
dotenv.config({
  path: './config/env/config.env',
});

// MongoDB Connection
connectDatabase();

const app = express();

// Express - Body Middleware
app.use(express.json());

// Routers Middlewares
app.use('/api', routers);

// Error Handler
app.use(customErrorHandler);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// PORT Config
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Started on: ${PORT} : ${process.env.NODE_ENV}`);
});
