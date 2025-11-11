import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  askCaiCareerNinja,
  getCaiCareerPersona,
  getCaiCareerToolPolicy,
  getCaiCareerTools,
  getCaiCareerScenarios
} from '../services/cai-career-ninja.js';

const router = express.Router();

const askLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'RATE_LIMIT',
    message: 'Too many CAI requests. Try again in a minute.'
  }
});

router.get('/prompt', (req, res) => {
  res.json({
    success: true,
    persona: getCaiCareerPersona(),
    toolPolicy: getCaiCareerToolPolicy(),
    tools: getCaiCareerTools(),
    scenarios: getCaiCareerScenarios()
  });
});

router.get('/scenarios', (req, res) => {
  res.json({
    success: true,
    scenarios: getCaiCareerScenarios()
  });
});

router.post('/ask', askLimiter, async (req, res) => {
  const { question, location, role, country, sessionId } = req.body || {};

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_REQUEST',
      message: 'A job search question is required for CAI.'
    });
  }

  try {
    const response = await askCaiCareerNinja(question, {
      location,
      role,
      country,
      sessionId,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    const statusCode = response.success ? 200 : response.error === 'openai_unconfigured' ? 503 : 200;
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('❌ CAI career ask endpoint failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'CAI mission control hit an unexpected error.'
    });
  }
});

export default router;
