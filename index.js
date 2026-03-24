require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

// Routes
const webhookRoutes = require('./src/routes/webhooks');
const adminRoutes = require('./src/routes/admin');
const courseRoutes = require('./src/routes/courses');
const mediaRoutes = require('./src/routes/media');
const progressRoutes = require('./src/routes/progress');
const studentRoutes = require('./src/routes/student');
const testimonialRoutes = require('./src/routes/testimonials');

// Initialize
const app = express();
connectDB();

// ── Security & Logging ──────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';
app.use(cors({ origin: allowedOrigins }));

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// ── Body Parsing ────────────────────────────────────────────────────────────
// Stash raw body for webhook signature verification (Stripe / Clerk / Razorpay).
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1/hooks', webhookRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);

// Student / Frontend-compatible routes (no v1 prefix to match client)
app.use('/api', studentRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'API Running' }));

// ── Centralized Error Handler (must be last) ────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info('SERVER', `Running on port ${PORT}`));
