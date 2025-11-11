const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('rate-limiter-flexible');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Translation cache - 1 hour TTL
const translationCache = new NodeCache({ stdTTL: 3600 });

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000)
    });
  }
});

// Supported languages
const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'br', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'nl',
  'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt',
  'el', 'cy', 'ga', 'eu', 'ca', 'gl', 'th', 'vi', 'id', 'ms', 'tl', 'he', 'fa', 'ur', 'bn',
  'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ne', 'si', 'my', 'km', 'lo', 'ka', 'hy', 'az',
  'kk', 'ky', 'uz', 'mn', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg',
  'sn', 'ny', 'mg', 'es-AR', 'es-CL', 'es-UY', 'es-MX', 'es-CO'
];

// Mock translation function (replace with actual translation service)
async function translateText(text, targetLang, sourceLang = 'en') {
  // Return original text for English
  if (targetLang === 'en') return text;
  
  // Check cache first
  const cacheKey = `${text}-${sourceLang}-${targetLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    // Mock translation - replace with actual service (Google Translate, Azure, etc.)
    const mockTranslations = {
      'es': { 'Hello': 'Hola', 'World': 'Mundo', 'Welcome': 'Bienvenido' },
      'fr': { 'Hello': 'Bonjour', 'World': 'Monde', 'Welcome': 'Bienvenue' },
      'de': { 'Hello': 'Hallo', 'World': 'Welt', 'Welcome': 'Willkommen' },
      'pt': { 'Hello': 'Olá', 'World': 'Mundo', 'Welcome': 'Bem-vindo' },
      'it': { 'Hello': 'Ciao', 'World': 'Mondo', 'Welcome': 'Benvenuto' }
    };

    const translation = mockTranslations[targetLang]?.[text] || `[${targetLang.toUpperCase()}] ${text}`;
    
    // Cache the result
    translationCache.set(cacheKey, translation);
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original on error
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    supportedLanguages: SUPPORTED_LANGUAGES.length
  });
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    count: SUPPORTED_LANGUAGES.length
  });
});

// Single translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a string'
      });
    }

    if (!targetLanguage || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid target language',
        supportedLanguages: SUPPORTED_LANGUAGES
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (max 5000 characters)'
      });
    }

    const translation = await translateText(text, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      translation,
      originalText: text,
      targetLanguage,
      sourceLanguage,
      cached: translationCache.has(`${text}-${sourceLanguage}-${targetLanguage}`)
    });

  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Batch translation endpoint
app.post('/api/translate/batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

    // Validation
    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Texts must be a non-empty array'
      });
    }

    if (texts.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Too many texts (max 100 per batch)'
      });
    }

    if (!targetLanguage || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid target language'
      });
    }

    // Process all translations
    const results = await Promise.all(
      texts.map(async (text) => {
        try {
          if (typeof text !== 'string' || text.length > 1000) {
            return {
              success: false,
              originalText: text,
              error: 'Invalid text or too long (max 1000 chars per text)'
            };
          }

          const translation = await translateText(text, targetLanguage, sourceLanguage);
          return {
            success: true,
            originalText: text,
            translation,
            cached: translationCache.has(`${text}-${sourceLanguage}-${targetLanguage}`)
          };
        } catch (error) {
          return {
            success: false,
            originalText: text,
            error: error.message
          };
        }
      })
    );

    res.json({
      success: true,
      results,
      targetLanguage,
      sourceLanguage,
      processedCount: results.length,
      successCount: results.filter(r => r.success).length
    });

  } catch (error) {
    console.error('Batch translation API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Cache statistics
app.get('/api/cache/stats', (req, res) => {
  const stats = translationCache.getStats();
  res.json({
    success: true,
    cache: {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits / (stats.hits + stats.misses) || 0
    }
  });
});

// Clear cache (admin endpoint)
app.delete('/api/cache', (req, res) => {
  const { adminKey } = req.body;
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  translationCache.flushAll();
  res.json({
    success: true,
    message: 'Cache cleared'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🌍 CAI Universal Translation API running on port ${PORT}`);
  console.log(`🚀 Supporting ${SUPPORTED_LANGUAGES.length} languages`);
  console.log(`💫 ONE LOVE - Connecting the world through language`);
});

module.exports = app;