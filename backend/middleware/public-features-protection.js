/**
 * PUBLIC FEATURES PROTECTION MIDDLEWARE
 * Ensures all public website features remain fully accessible
 * Protects: News, AI Leaderboard, Country pages, Database, Articles, Crypto, Games
 */

/**
 * List of PUBLIC routes that should NEVER be restricted
 */
const PUBLIC_ROUTES = [
  // Core public features
  '/api/global-news',
  '/api/news',
  '/api/countries',
  '/api/country',
  '/api/ai-leaderboard',
  '/api/leaderboard',
  
  // Database and articles
  '/api/articles',
  '/api/database',
  '/api/enhanced-country-news',
  '/api/individual-country-tables',
  
  // Translation and language
  '/api/translation',
  '/api/languages',
  '/api/universal-language',
  
  // Crypto features (public)
  '/api/crypto-treasury/overview',
  '/api/crypto-treasury/coin',
  '/api/crypto-treasury/countries',
  '/api/crypto-treasury/trends',
  '/api/crypto-treasury/bitcoin-by-country',
  '/api/crypto-treasury/live-market',
  '/api/crypto-treasury/trading-signals',
  '/api/crypto-treasury/comprehensive-trading-data',
  '/api/crypto-treasury/coinbase-funding-rates',
  '/api/crypto-treasury/real-news-analysis',
  
  // Game and interactive features
  '/api/game',
  '/api/article-game',
  '/api/interactive',
  
  // System health (public monitoring)
  '/api/system-health',
  '/api/status',
  
  // CAI features (public AI assistance)
  '/api/cai',
  '/api/news-intelligence',
  '/api/enhanced-analytics'
];

/**
 * DEVELOPER-ONLY routes that should be protected
 */
const DEVELOPER_ONLY_ROUTES = [
  '/api/ai-ultimate',
  '/api/meta-breakthrough',
  '/api/quantum-synergy',
  '/api/consciousness',
  '/api/developer'
];

/**
 * Middleware to ensure public features are never restricted
 */
export const ensurePublicAccess = (req, res, next) => {
  const requestPath = req.path;
  
  // Check if this is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    requestPath.startsWith(route)
  );
  
  if (isPublicRoute) {
    // Add public access headers
    req.headers['x-public-access'] = 'true';
    req.headers['x-feature-type'] = 'public';
    
    console.log(`✅ Public access ensured for: ${requestPath}`);
    return next();
  }
  
  // Check if this is a developer-only route
  const isDeveloperRoute = DEVELOPER_ONLY_ROUTES.some(route => 
    requestPath.startsWith(route)
  );
  
  if (isDeveloperRoute) {
    req.headers['x-developer-required'] = 'true';
    req.headers['x-feature-type'] = 'developer-only';
  }
  
  next();
};

/**
 * Grok context for understanding public vs developer features
 */
export const grokPublicContext = (req, res, next) => {
  req.grokPublicContext = {
    publicFeatures: {
      news: 'ALWAYS_PUBLIC - News intelligence for all countries',
      aiLeaderboard: 'ALWAYS_PUBLIC - AI company rankings and analysis', 
      countries: 'ALWAYS_PUBLIC - Country-specific news and data',
      database: 'ALWAYS_PUBLIC - Article and news database access',
      crypto: 'ALWAYS_PUBLIC - Cryptocurrency analytics and trading data',
      translation: 'ALWAYS_PUBLIC - Universal language translation',
      articles: 'ALWAYS_PUBLIC - Article processing and games',
      cai: 'ALWAYS_PUBLIC - CAI assistant for user help'
    },
    developerOnlyFeatures: {
      aiUltimate: 'DEVELOPER_ONLY - Ultimate intelligence and consciousness',
      quantumSynergy: 'DEVELOPER_ONLY - Quantum processing systems',
      metaBreakthrough: 'DEVELOPER_ONLY - META-level AI capabilities',
      consciousness: 'DEVELOPER_ONLY - Consciousness integration systems'
    },
    message: 'Public users get full access to news, crypto, games, AI leaderboard, and all database features. Developer features are separate and protected.'
  };
  
  next();
};

export default { ensurePublicAccess, grokPublicContext };