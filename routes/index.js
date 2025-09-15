const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User Management Service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
