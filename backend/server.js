'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');
const papersRouter = require('./routes/papers');
const messagesRouter = require('./routes/messages');
const { API_ROUTES, ERROR_CODES } = require('./constants');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust first proxy (Nginx) - required for express-rate-limit behind reverse proxy
app.set('trust proxy', 1);

// Connect to MongoDB
connectDatabase();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: ERROR_CODES.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middlewares
app.use(cors({
  origin: '*', // 모든 출처 허용
  credentials: false
}));
app.use(express.json());
app.use(limiter);

// Health check route
app.get(`${API_ROUTES.BASE}${API_ROUTES.HEALTH}`, (req, res) => {
  res.json({ status: 'ok', message: 'RollingPacer API is running' });
});

// API routes
app.use(`${API_ROUTES.BASE}${API_ROUTES.PAPERS}`, papersRouter);
app.use(`${API_ROUTES.BASE}${API_ROUTES.MESSAGES}`, messagesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: ERROR_CODES.SERVER_ERROR
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
