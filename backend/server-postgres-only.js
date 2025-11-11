import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

// PostgreSQL only imports
import {
  getArticles,
  isPostgresAvailable,
  initializePool,
  fetchCountryNewsRows,
  fetchLatestJobAnalytics,
} from './database.js';

// Import route handlers
import translationRoutes from './routes/translation-routes.js';
import websiteChatRoutes from './routes/website-chat-routes.js';
import cryptoTreasuryRoutes from './routes/crypto-treasury-routes.js';
import jobSearchRoutes from './routes/job-search-routes.js';
import aiJobImpactRoutes from './routes/ai-job-impact-routes.js';
import caiCareerRoutes from './routes/cai-career-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.ALLOWED_ORIGIN || "https://website-project-ai.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

// Mount route handlers
app.use('/api/translation', translationRoutes);
app.use('/api/website-chat', websiteChatRoutes);
app.use('/api/jobs', jobSearchRoutes);
app.use('/api/cai-career', caiCareerRoutes);
app.use('/api/ai-job-impact', aiJobImpactRoutes);
app.use('/api/crypto-treasury', cryptoTreasuryRoutes);

// Health check endpoint
app.get("/health", async (_, res) => {
  try {
    const memUsage = process.memoryUsage();
    
    res.status(200).json({
      ok: true,
      service: "AI Intelligence Network",
      ts: new Date().toISOString(),
      status: "OPERATIONAL",
      uptime: Math.floor(process.uptime()),
      port: PORT,
      env: process.env.NODE_ENV || "production",
      database: {
        type: "PostgreSQL Railway",
        status: isPostgresAvailable() ? "connected" : "disconnected"
      },
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + "MB",
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      ts: new Date().toISOString(),
    });
  }
});

// Global news endpoint
app.get("/api/global-news", async (_, res) => {
  try {
    console.log("📡 Global news request - fetching from PostgreSQL...");

    const articles = await getArticles(null, 500);
    console.log(`📊 Retrieved ${articles.length} articles from PostgreSQL`);

    // Group articles by country
    const countriesWithNews = {};
    const globalArticles = [];

    articles.forEach((article) => {
      if (article.country && article.country !== "GLOBAL") {
        if (!countriesWithNews[article.country]) {
          countriesWithNews[article.country] = [];
        }
        countriesWithNews[article.country].push(article);
      } else {
        globalArticles.push(article);
      }
    });

    res.json({
      success: true,
      countries: countriesWithNews,
      global: globalArticles,
      totalArticles: articles.length,
      lastUpdate: new Date().toISOString(),
      source: "postgresql",
    });
  } catch (error) {
    console.error("Failed to get global news:", error.message);
    res.status(500).json({
      success: false,
      error: "Service unavailable",
      message: error.message,
    });
  }
});

// Country-specific news endpoint
app.get("/api/country-news/:country", async (req, res) => {
  try {
    const country = req.params.country.toUpperCase();
    console.log(`📡 Fetching news for ${country} from PostgreSQL...`);

    const articles = await getArticles(country, 300);
    console.log(`📊 ${country}: Retrieved ${articles.length} articles`);

    res.json({
      success: true,
      country: country,
      articles: articles,
      count: articles.length,
      source: "postgresql",
      lastUpdate: new Date().toISOString(),
    });

    console.log(`✅ ${country}: Served ${articles.length} articles to client`);
  } catch (error) {
    console.error(`❌ Country news failed for ${req.params.country}:`, error.message);
    res.json({
      success: false,
      country: req.params.country.toUpperCase(),
      articles: [],
      count: 0,
      source: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/country/:country/news", async (req, res) => {
  if (!isPostgresAvailable()) {
    return res.status(503).json({
      success: false,
      country: req.params.country?.toUpperCase?.() || "",
      message: "PostgreSQL unavailable",
    });
  }

  const { country } = req.params;
  const category = req.query.category || null;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

  try {
    const items = await fetchCountryNewsRows(country, { category, limit });

    if (!items) {
      return res.status(404).json({
        success: false,
        message: "Country not configured",
      });
    }

    return res.json({
      success: true,
      country: country.toUpperCase(),
      category: category || "all",
      items,
      count: items.length,
      source: "postgresql",
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Country news feed failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load country news",
    });
  }
});

// Database test endpoint
app.get("/api/test", async (req, res) => {
  try {
    const articles = await getArticles(null, 10);

    res.json({
      message: "PostgreSQL connected!",
      serverTime: new Date().toISOString(),
      articleCount: articles.length,
      databaseStatus: isPostgresAvailable() ? "connected" : "disconnected",
    });
  } catch (err) {
    console.error("Database test failed:", err);
    res.status(500).json({
      error: "Database connection failed",
      details: err.message,
    });
  }
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🛰️ AI Intelligence Network API running on port ${PORT}`);
  console.log("✅ System operational - PostgreSQL Edition");

  // Initialize PostgreSQL connection
  try {
    const connected = await initializePool();
    if (connected) {
      console.log("🎯 Ready for production deployment!");
    } else {
      console.warn("⚠️ PostgreSQL connection failed - running in degraded mode");
    }
  } catch (error) {
    console.warn("⚠️ PostgreSQL initialization failed:", error.message);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
