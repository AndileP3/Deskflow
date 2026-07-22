require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const swaggerSpec = require('./swagger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Connect to database
connectDB();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running"
  });
});

// ============================
// API Routes (MUST COME BEFORE 404)
// ============================

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);


// ============================
// Serve React frontend build
// ============================

const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
const indexHtmlPath = path.join(frontendBuildPath, 'index.html');

console.log("Frontend build path:", frontendBuildPath);
console.log("Index HTML path:", indexHtmlPath);
console.log("Index exists:", fs.existsSync(indexHtmlPath));

if (fs.existsSync(indexHtmlPath)) {

  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res, next) => {
    // Do not send React app for API routes
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(indexHtmlPath);
  });
}


// ============================
// Error handling (MUST BE LAST)
// ============================

app.use(notFound);
app.use(errorHandler);


// ============================
// Start Server
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] DeskFlow API running on port ${PORT}`);
  console.log(`[SERVER] Swagger docs at http://localhost:${PORT}/api-docs`);
});

module.exports = app;