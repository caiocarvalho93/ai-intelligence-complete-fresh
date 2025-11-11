const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('rate-limiter-flexible');
const NodeCache = require('node-cache');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Translation cache
const translationCache = new NodeCache({ stdTTL: 3600 });

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: process.env.RATE_LIMIT_POINTS || 100,
  duration: process.env.RATE_LIMIT_DURATION || 60,
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      success: false,
      error: 'Too many requests'
    });
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Supported languages
const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'br', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'nl',
  'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt',
  'el', 'cy', 'ga', 'eu', 'ca', 'gl', 'th', 'vi', 'id', 'ms', 'tl', 'he', 'fa', 'ur', 'bn',
  'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ne', 'si', 'my', 'km', 'lo', 'ka', 'hy', 'az',
  'kk', 'ky', 'uz', 'mn', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg',
  'sn', 'ny', 'mg'
];

const LANGUAGE_NAMES = {
  'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
  'pt': 'Portuguese', 'br': 'Brazilian Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
  'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish'
};

// Translation function
async function translateText(text, targetLang, sourceLang = 'en') {
  if (targetLang === 'en') return text;
  
  const cacheKey = `${text}-${sourceLang}-${targetLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    let translation = text;

    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Translate from ${sourceLang} to ${targetLang}. Return only the translation.`
          },
          { role: 'user', content: text }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      translation = response.data.choices[0].message.content.trim();
    } else {
      translation = `[${targetLang.toUpperCase()}] ${text}`;
    }

    translationCache.set(cacheKey, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
}

// API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    supportedLanguages: SUPPORTED_LANGUAGES.length
  });
});

app.get('/api/languages', (req, res) => {
  res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    count: SUPPORTED_LANGUAGES.length
  });
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    if (!targetLanguage || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid target language'
      });
    }

    const translation = await translateText(text, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      translation,
      originalText: text,
      targetLanguage,
      sourceLanguage
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/translate/batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Texts must be a non-empty array'
      });
    }

    const results = await Promise.all(
      texts.map(async (text) => {
        try {
          const translation = await translateText(text, targetLanguage, sourceLanguage);
          return {
            success: true,
            originalText: text,
            translation
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
      sourceLanguage
    });
  } catch (error) {
    console.error('Batch API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌍 CAI News running on port ${PORT}`);
  console.log(`🚀 Supporting ${SUPPORTED_LANGUAGES.length} languages`);
  console.log(`💫 ONE LOVE`);
});
