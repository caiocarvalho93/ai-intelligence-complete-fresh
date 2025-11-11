import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const COUNTRY_CODE_REGEX = /^[a-z]{2}$/i;

function normalizeCountryCode(country) {
  const value = (country || "").toString().trim().toLowerCase();
  if (!COUNTRY_CODE_REGEX.test(value)) {
    const error = new Error("Invalid country code");
    error.code = "INVALID_COUNTRY_CODE";
    throw error;
  }
  return value;
}

// PostgreSQL connection - Railway best practices
let pool = null;

export async function initializePool(force = false) {
  if (pool && !force) {
    return true;
  }

  if (pool && force) {
    try {
      await pool.end();
    } catch (error) {
      console.warn("⚠️ Failed to close existing PostgreSQL pool:", error.message);
    }
    pool = null;
  }

  const databaseUrl = process.env.DATABASE_URL;

  console.log(`🔍 DATABASE_URL check: ${databaseUrl ? 'CONFIGURED' : 'MISSING'}`);

  if (!databaseUrl || databaseUrl.includes("${{") || databaseUrl === "your_db_url_here") {
    console.error("❌ Database: No DATABASE_URL configured - PostgreSQL is required!");
    console.log("💡 To fix: Add DATABASE_URL in Railway Dashboard → Variables");
    console.log("💡 Example: postgresql://postgres:password@host:port/database");
    
    // Don't throw error immediately - allow server to start in degraded mode
    console.log("🚨 Starting in DEGRADED MODE - database features disabled");
    return false;
  }
  
  try {
    console.log("🔗 Connecting to Railway PostgreSQL...");
    
    // Railway PostgreSQL connection - following Railway best practices
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }, // Required for Railway SSL
      max: 20, // Increased pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000, // Increased timeout
      acquireTimeoutMillis: 60000 // Add acquire timeout
    });
    
    // Test connection with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time');
        client.release();
        
        console.log("✅ Database: Railway PostgreSQL connected successfully");
        console.log(`📊 Server Time: ${result.rows[0].current_time}`);
        
        return true;
      } catch (error) {
        retries--;
        if (retries > 0) {
          console.log(`⚠️ Database connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("❌ Database: PostgreSQL connection failed:", error.message);
    console.error("🚨 Starting in DEGRADED MODE - database features disabled");
    pool = null;
    return false; // Don't throw, allow server to start
  }
}

export function isPostgresAvailable() {
  return !!pool;
}

// Initialize connection asynchronously
initializePool().catch(error => {
  console.warn("⚠️ Database initialization failed:", error.message);
});



/**
 * ENTERPRISE-GRADE ARTICLE STORAGE
 * Store articles with comprehensive metadata, deduplication, and analytics
 */
export async function storeArticles(country, articles) {
  if (pool) {
    try {
      const client = await pool.connect();
      let storedCount = 0;
      let updatedCount = 0;
      let duplicateCount = 0;
      
      console.log(`📊 Storing ${articles.length} articles for ${country} in PostgreSQL...`);
      
      for (const article of articles) {
        try {
          // Enhanced article storage with full metadata
          const result = await client.query(
            `INSERT INTO articles (
              id, title, url, source, author, published_at, description, content,
              country, category, rel_score, ana_score, einstein_score, topic_category,
              provenance, search_query, sentiment_score, word_count, tags, is_premium
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (url) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              rel_score = EXCLUDED.rel_score,
              ana_score = EXCLUDED.ana_score,
              einstein_score = EXCLUDED.einstein_score,
              topic_category = EXCLUDED.topic_category,
              updated_at = CURRENT_TIMESTAMP
            RETURNING (xmax = 0) AS inserted`,
            [
              article.id || `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              article.title,
              article.url,
              article.source,
              article.author,
              article.publishedAt,
              article.description,
              article.content || article.description, // Use description as content fallback
              country,
              article.category,
              article.relScore || 0,
              article.anaScore || 0,
              article.__einsteinScore || null,
              article.__topicCategory?.category || null,
              article.provenance || 'api',
              article.searchQuery || null,
              article.sentimentScore || null,
              article.wordCount || (article.description ? article.description.split(' ').length : 0),
              article.tags || [],
              article.isPremium || false
            ]
          );
          
          if (result.rows[0].inserted) {
            storedCount++;
          } else {
            updatedCount++;
          }
          
          // Update news source statistics
          await client.query(
            `INSERT INTO news_sources (name, domain, article_count, last_article_date)
             VALUES ($1, $2, 1, $3)
             ON CONFLICT (name) DO UPDATE SET
               article_count = news_sources.article_count + 1,
               last_article_date = GREATEST(news_sources.last_article_date, EXCLUDED.last_article_date)`,
            [
              article.source,
              article.url ? new URL(article.url).hostname : null,
              article.publishedAt
            ]
          );
          
        } catch (articleError) {
          if (articleError.code === '23505') { // Unique constraint violation
            duplicateCount++;
          } else {
            console.warn(`⚠️ Failed to store article "${article.title}":`, articleError.message);
          }
        }
      }
      
      // Log API usage for cost tracking
      await client.query(
        `INSERT INTO api_usage_log (api_provider, endpoint, articles_returned, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        ['batch_storage', `/store/${country}`, articles.length]
      );
      
      client.release();
      
      console.log(`✅ PostgreSQL Storage Complete for ${country}:`);
      console.log(`   📝 New articles: ${storedCount}`);
      console.log(`   🔄 Updated articles: ${updatedCount}`);
      console.log(`   🔁 Duplicates skipped: ${duplicateCount}`);
      
      return true;
    } catch (error) {
      console.error("❌ PostgreSQL storage failed:", error.message);
      throw error;
    }
  } else {
    throw new Error("Database not available - PostgreSQL connection required");
  }
}

/**
 * Retrieve articles with automatic fallback
 */
export async function getArticles(country = null, limit = 300) {
  if (pool) {
    try {
      const client = await pool.connect();
      const query = country 
        ? "SELECT * FROM articles WHERE country = $1 ORDER BY published_at DESC LIMIT $2"
        : "SELECT * FROM articles ORDER BY published_at DESC LIMIT $1";
      
      const params = country ? [country, limit] : [limit];
      const result = await client.query(query, params);
      client.release();
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        url: row.url,
        source: row.source,
        author: row.author,
        publishedAt: row.published_at,
        description: row.description,
        country: row.country,
        category: row.category,
        relScore: row.rel_score,
        anaScore: row.ana_score
      }));
    } catch (error) {
      console.error("❌ PostgreSQL read failed:", error.message);
      return []; // Return empty array instead of throwing
    }
  } else {
    console.warn("⚠️ Database not available, returning empty articles array");
    return [];
  }
}

/**
 * FORTUNE 500 DATABASE SCHEMA - PRODUCTION READY
 * Complete enterprise-grade database architecture for AI Intelligence Platform
 */
export async function initializeDatabase() {
  if (!pool) return false;
  
  try {
    const client = await pool.connect();
    
    console.log("🏗️ Creating Fortune 500-level database schema...");
    
    // ==================== CORE NEWS & INTELLIGENCE TABLES ====================
    
    // 1. ARTICLES - Core news storage with full metadata
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT UNIQUE NOT NULL,
        source VARCHAR(255),
        author VARCHAR(255),
        published_at TIMESTAMP,
        description TEXT,
        content TEXT, -- Full article content for analysis
        country VARCHAR(10),
        category VARCHAR(50),
        rel_score INTEGER CHECK (rel_score >= 0 AND rel_score <= 100),
        ana_score INTEGER CHECK (ana_score >= 0 AND ana_score <= 100),
        einstein_score DECIMAL(5,2), -- Einstein filter score
        topic_category VARCHAR(100), -- AI subcategory (models, hardware, policy, etc.)
        provenance VARCHAR(100), -- Source tracking (newsdata-api, newsapi, manual, etc.)
        search_query TEXT, -- Original search query that found this article
        language VARCHAR(10) DEFAULT 'en',
        sentiment_score DECIMAL(3,2), -- -1.0 to 1.0 sentiment analysis
        readability_score INTEGER, -- 0-100 readability score
        word_count INTEGER,
        image_url TEXT,
        tags TEXT[], -- Array of tags for categorization
        is_premium BOOLEAN DEFAULT FALSE, -- Premium/high-quality content flag
        is_breaking BOOLEAN DEFAULT FALSE, -- Breaking news flag
        view_count INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        archived_at TIMESTAMP, -- For soft deletion
        
        -- Full-text search
        search_vector tsvector
      )
    `);
    
    // 2. ARTICLE_VERSIONS - Track article updates and changes
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_versions (
        id SERIAL PRIMARY KEY,
        article_id VARCHAR(255) REFERENCES articles(id),
        version_number INTEGER NOT NULL,
        title TEXT,
        description TEXT,
        content TEXT,
        rel_score INTEGER,
        ana_score INTEGER,
        changed_fields TEXT[],
        change_reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255)
      )
    `);
    
    // 3. NEWS_SOURCES - Track and rate news sources
    await client.query(`
      CREATE TABLE IF NOT EXISTS news_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        domain VARCHAR(255),
        credibility_score INTEGER CHECK (credibility_score >= 0 AND credibility_score <= 100),
        bias_score DECIMAL(3,2), -- -1.0 (left) to 1.0 (right)
        focus_areas TEXT[], -- AI, tech, business, etc.
        api_source VARCHAR(50), -- newsapi, newsdata, manual
        is_premium BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        article_count INTEGER DEFAULT 0,
        avg_quality_score DECIMAL(5,2),
        last_article_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // ==================== USER ENGAGEMENT & ANALYTICS ====================
    
    // 4. USER_RATINGS - User feedback on articles
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        article_id VARCHAR(255) REFERENCES articles(id),
        user_id VARCHAR(255) NOT NULL,
        user_ip INET,
        rel_score INTEGER CHECK (rel_score >= 0 AND rel_score <= 100),
        ana_score INTEGER CHECK (ana_score >= 0 AND ana_score <= 100),
        overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
        feedback_text TEXT,
        is_helpful BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(article_id, user_id) -- One rating per user per article
      )
    `);
    
    // 5. USER_INTERACTIONS - Track all user interactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_interactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        user_ip INET,
        user_agent TEXT,
        interaction_type VARCHAR(50), -- view, click, share, rate, search, etc.
        target_type VARCHAR(50), -- article, country, leaderboard, etc.
        target_id VARCHAR(255),
        metadata JSONB, -- Flexible data storage
        country_context VARCHAR(10),
        referrer TEXT,
        duration_seconds INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 6. SEARCH_QUERIES - Track user searches for analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS search_queries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        query_text TEXT NOT NULL,
        query_type VARCHAR(50), -- article_search, country_search, etc.
        results_count INTEGER,
        clicked_result_id VARCHAR(255),
        country_filter VARCHAR(10),
        category_filter VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // ==================== AI FANS RACE GAME SYSTEM ====================
    
    // 7. GAME_SCORES - Country leaderboard (enhanced)
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_scores (
        country VARCHAR(10) PRIMARY KEY,
        score INTEGER DEFAULT 0,
        total_submissions INTEGER DEFAULT 0,
        unique_contributors INTEGER DEFAULT 0,
        avg_points_per_submission DECIMAL(5,2),
        last_submission_at TIMESTAMP,
        rank_position INTEGER,
        rank_change INTEGER DEFAULT 0, -- Change from previous day
        daily_score INTEGER DEFAULT 0, -- Today's score
        weekly_score INTEGER DEFAULT 0,
        monthly_score INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0, -- Consecutive days with submissions
        achievements TEXT[], -- Array of earned achievements
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 8. GAME_SUBMISSIONS - Enhanced submission tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_submissions (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        country VARCHAR(10) NOT NULL,
        user_id VARCHAR(255),
        user_ip INET,
        points INTEGER DEFAULT 1,
        point_breakdown JSONB, -- Detailed scoring breakdown
        article_title TEXT,
        article_source VARCHAR(255),
        quality_score INTEGER, -- Automated quality assessment
        is_duplicate BOOLEAN DEFAULT FALSE,
        duplicate_of INTEGER REFERENCES game_submissions(id),
        moderator_approved BOOLEAN,
        moderator_notes TEXT,
        submission_method VARCHAR(50), -- web, api, mobile
        user_agent TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP,
        
        UNIQUE(url) -- Prevent exact URL duplicates
      )
    `);
    
    // 9. GAME_ACHIEVEMENTS - Achievement system
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        points_required INTEGER,
        submissions_required INTEGER,
        streak_required INTEGER,
        country_specific BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        rarity VARCHAR(20), -- common, rare, epic, legendary
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 10. USER_ACHIEVEMENTS - Track user achievements
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        achievement_id INTEGER REFERENCES game_achievements(id),
        country VARCHAR(10),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(user_id, achievement_id)
      )
    `);
    
    // ==================== SYSTEM MONITORING & ANALYTICS ====================
    
    // 11. API_USAGE_LOG - Track API calls and costs
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_usage_log (
        id SERIAL PRIMARY KEY,
        api_provider VARCHAR(50), -- newsapi, newsdata, openai, etc.
        api_key_index INTEGER, -- Which key was used
        endpoint VARCHAR(255),
        query_params JSONB,
        response_status INTEGER,
        response_size INTEGER,
        response_time_ms INTEGER,
        cost_estimate DECIMAL(10,4), -- Estimated cost in USD
        articles_returned INTEGER,
        error_message TEXT,
        rate_limited BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 12. SYSTEM_METRICS - Daily system performance metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_metrics (
        id SERIAL PRIMARY KEY,
        metric_date DATE UNIQUE NOT NULL,
        total_articles_processed INTEGER DEFAULT 0,
        total_api_calls INTEGER DEFAULT 0,
        total_api_cost DECIMAL(10,4) DEFAULT 0,
        unique_users INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 0,
        game_submissions INTEGER DEFAULT 0,
        avg_response_time_ms INTEGER,
        error_count INTEGER DEFAULT 0,
        uptime_percentage DECIMAL(5,2),
        database_size_mb INTEGER,
        cache_hit_rate DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 13. ERROR_LOG - Comprehensive error tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS error_log (
        id SERIAL PRIMARY KEY,
        error_type VARCHAR(100),
        error_message TEXT,
        stack_trace TEXT,
        request_url TEXT,
        request_method VARCHAR(10),
        request_body TEXT,
        user_id VARCHAR(255),
        user_ip INET,
        user_agent TEXT,
        severity VARCHAR(20), -- low, medium, high, critical
        resolved BOOLEAN DEFAULT FALSE,
        resolved_at TIMESTAMP,
        resolved_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 14. CACHE_STATUS - Track cache performance
    await client.query(`
      CREATE TABLE IF NOT EXISTS cache_status (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        cache_type VARCHAR(50), -- news, leaderboard, country, etc.
        last_updated TIMESTAMP,
        update_frequency_hours INTEGER,
        size_bytes INTEGER,
        hit_count INTEGER DEFAULT 0,
        miss_count INTEGER DEFAULT 0,
        is_stale BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // ==================== CONTENT MANAGEMENT ====================
    
    // 15. CONTENT_MODERATION - Track moderated content
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_moderation (
        id SERIAL PRIMARY KEY,
        content_type VARCHAR(50), -- article, submission, comment
        content_id VARCHAR(255),
        moderator_id VARCHAR(255),
        action VARCHAR(50), -- approved, rejected, flagged, edited
        reason VARCHAR(255),
        notes TEXT,
        automated BOOLEAN DEFAULT FALSE, -- AI vs human moderation
        confidence_score DECIMAL(5,2), -- AI confidence if automated
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 16. FEATURE_FLAGS - A/B testing and feature rollouts
    await client.query(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        id SERIAL PRIMARY KEY,
        flag_name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        is_enabled BOOLEAN DEFAULT FALSE,
        rollout_percentage INTEGER DEFAULT 0,
        target_countries TEXT[],
        target_user_types TEXT[],
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ==================== JOB SEARCH SYSTEM ====================
    
    // 17. JOB_POSTINGS - Cached job search results
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        company VARCHAR(255) NOT NULL,
        location TEXT,
        salary_min DECIMAL(10,2),
        salary_max DECIMAL(10,2),
        salary_display TEXT,
        description TEXT,
        url TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'adzuna',
        contract_type VARCHAR(50),
        category VARCHAR(100),
        country VARCHAR(10) DEFAULT 'us',
        search_keywords TEXT,
        search_location TEXT,
        date_posted TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        view_count INTEGER DEFAULT 0,
        click_count INTEGER DEFAULT 0,
        quality_score INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
        
        -- Full-text search for jobs
        search_vector tsvector
      )
    `);
    
    // 18. JOB_SEARCH_QUERIES - Track job search patterns
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_search_queries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        user_ip INET,
        keywords TEXT NOT NULL,
        location TEXT,
        country VARCHAR(10) DEFAULT 'us',
        page INTEGER DEFAULT 0,
        results_count INTEGER DEFAULT 0,
        cache_hit BOOLEAN DEFAULT FALSE,
        response_time_ms INTEGER,
        clicked_job_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 19. JOB_INTERACTIONS - Track job clicks and applications
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_interactions (
        id SERIAL PRIMARY KEY,
        job_id VARCHAR(255) REFERENCES job_postings(id),
        user_id VARCHAR(255),
        user_ip INET,
        interaction_type VARCHAR(50), -- view, click, apply, save, share
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 20. AI_JOB_IMPACT_CARDS - Daily AI job impact analysis
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_job_impact_cards (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        country VARCHAR(10) NOT NULL,
        headline JSONB NOT NULL,
        opportunity JSONB NOT NULL,
        message_for_users TEXT NOT NULL,
        layoff_data JSONB,
        trend_data JSONB,
        data_sources JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(date, country)
      )
    `);
    
    // 21. AI_JOB_TRENDS - Historical trend tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_job_trends (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        ai_job_count INTEGER NOT NULL,
        ml_job_count INTEGER DEFAULT 0,
        data_job_count INTEGER DEFAULT 0,
        total_ai_jobs INTEGER NOT NULL,
        pct_change_daily DECIMAL(5,2),
        pct_change_weekly DECIMAL(5,2),
        top_companies TEXT[],
        hot_titles JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(date)
      )
    `);
    
    // ==================== COMPREHENSIVE INDEXES ====================
    
    console.log("📊 Creating performance indexes...");
    
    // Articles indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_country ON articles(country);
      CREATE INDEX IF NOT EXISTS idx_articles_published_desc ON articles(published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
      CREATE INDEX IF NOT EXISTS idx_articles_scores ON articles(rel_score DESC, ana_score DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_einstein ON articles(einstein_score DESC) WHERE einstein_score IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_articles_premium ON articles(is_premium) WHERE is_premium = TRUE;
      CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
      CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(search_vector);
      CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
      CREATE INDEX IF NOT EXISTS idx_articles_country_published ON articles(country, published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
    `);
    
    // User engagement indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_ratings_article ON user_ratings(article_id);
      CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON user_ratings(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_created ON user_interactions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_search_queries_user ON search_queries(user_id);
      CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at DESC);
    `);
    
    // Game system indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_game_scores_score_desc ON game_scores(score DESC);
      CREATE INDEX IF NOT EXISTS idx_game_scores_daily ON game_scores(daily_score DESC);
      CREATE INDEX IF NOT EXISTS idx_game_submissions_country ON game_submissions(country);
      CREATE INDEX IF NOT EXISTS idx_game_submissions_user ON game_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_game_submissions_submitted ON game_submissions(submitted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_game_submissions_points ON game_submissions(points DESC);
      CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
    `);
    
    // System monitoring indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage_log(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage_log(api_provider);
      CREATE INDEX IF NOT EXISTS idx_system_metrics_date ON system_metrics(metric_date DESC);
      CREATE INDEX IF NOT EXISTS idx_error_log_created ON error_log(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_error_log_severity ON error_log(severity);
      CREATE INDEX IF NOT EXISTS idx_error_log_resolved ON error_log(resolved);
    `);
    
    // Job search indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_postings_keywords ON job_postings(search_keywords);
      CREATE INDEX IF NOT EXISTS idx_job_postings_location ON job_postings(search_location);
      CREATE INDEX IF NOT EXISTS idx_job_postings_country ON job_postings(country);
      CREATE INDEX IF NOT EXISTS idx_job_postings_expires ON job_postings(expires_at);
      CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active) WHERE is_active = TRUE;
      CREATE INDEX IF NOT EXISTS idx_job_postings_search ON job_postings USING GIN(search_vector);
      CREATE INDEX IF NOT EXISTS idx_job_postings_created ON job_postings(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_job_postings_quality ON job_postings(quality_score DESC);
      CREATE INDEX IF NOT EXISTS idx_job_search_queries_keywords ON job_search_queries(keywords);
      CREATE INDEX IF NOT EXISTS idx_job_search_queries_created ON job_search_queries(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_job_interactions_job ON job_interactions(job_id);
      CREATE INDEX IF NOT EXISTS idx_job_interactions_user ON job_interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_job_interactions_type ON job_interactions(interaction_type);
    `);
    
    // ==================== TRIGGERS & FUNCTIONS ====================
    
    console.log("⚙️ Creating database triggers and functions...");
    
    // Update search vector trigger for articles
    await client.query(`
      CREATE OR REPLACE FUNCTION update_article_search_vector() RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', 
          COALESCE(NEW.title, '') || ' ' || 
          COALESCE(NEW.description, '') || ' ' || 
          COALESCE(NEW.content, '') || ' ' ||
          COALESCE(array_to_string(NEW.tags, ' '), '')
        );
        NEW.updated_at := CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS trigger_update_article_search_vector ON articles;
      CREATE TRIGGER trigger_update_article_search_vector
        BEFORE INSERT OR UPDATE ON articles
        FOR EACH ROW EXECUTE FUNCTION update_article_search_vector();
    `);
    
    // Auto-update game scores trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_game_scores() RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO game_scores (country, score, total_submissions, last_submission_at, updated_at)
        VALUES (NEW.country, NEW.points, 1, NEW.submitted_at, CURRENT_TIMESTAMP)
        ON CONFLICT (country) DO UPDATE SET
          score = game_scores.score + NEW.points,
          total_submissions = game_scores.total_submissions + 1,
          last_submission_at = NEW.submitted_at,
          updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS trigger_update_game_scores ON game_submissions;
      CREATE TRIGGER trigger_update_game_scores
        AFTER INSERT ON game_submissions
        FOR EACH ROW EXECUTE FUNCTION update_game_scores();
    `);
    
    // Update search vector trigger for job postings
    await client.query(`
      CREATE OR REPLACE FUNCTION update_job_search_vector() RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', 
          COALESCE(NEW.title, '') || ' ' || 
          COALESCE(NEW.company, '') || ' ' || 
          COALESCE(NEW.description, '') || ' ' ||
          COALESCE(NEW.search_keywords, '') || ' ' ||
          COALESCE(NEW.category, '')
        );
        NEW.updated_at := CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS trigger_update_job_search_vector ON job_postings;
      CREATE TRIGGER trigger_update_job_search_vector
        BEFORE INSERT OR UPDATE ON job_postings
        FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();
    `);
    
    // ==================== INITIAL DATA ====================
    
    console.log("🎮 Inserting initial game achievements...");
    
    await client.query(`
      INSERT INTO game_achievements (name, description, icon, points_required, submissions_required, rarity) VALUES
      ('First Submission', 'Submit your first AI article', '🎯', 0, 1, 'common'),
      ('AI Enthusiast', 'Submit 5 AI articles', '🤖', 0, 5, 'common'),
      ('Country Champion', 'Submit 10 articles for your country', '🏆', 0, 10, 'rare'),
      ('Quality Contributor', 'Achieve 50+ total points', '⭐', 50, 0, 'rare'),
      ('AI Expert', 'Submit 25 high-quality AI articles', '🧠', 0, 25, 'epic'),
      ('Global Leader', 'Achieve 100+ total points', '👑', 100, 0, 'epic'),
      ('AI Pioneer', 'Submit 50 AI articles', '🚀', 0, 50, 'legendary'),
      ('Point Master', 'Achieve 200+ total points', '💎', 200, 0, 'legendary')
      ON CONFLICT (name) DO NOTHING;
    `);
    
    console.log("📊 Inserting initial news sources...");
    
    await client.query(`
      INSERT INTO news_sources (name, domain, credibility_score, focus_areas, api_source, is_premium) VALUES
      ('TechCrunch', 'techcrunch.com', 88, ARRAY['AI', 'startups', 'technology'], 'newsapi', true),
      ('MIT Technology Review', 'technologyreview.com', 96, ARRAY['AI', 'research', 'deep tech'], 'newsapi', true),
      ('Wired', 'wired.com', 85, ARRAY['AI', 'tech culture', 'innovation'], 'newsapi', true),
      ('Reuters Technology', 'reuters.com', 94, ARRAY['global tech', 'business', 'AI'], 'newsapi', true),
      ('Bloomberg Technology', 'bloomberg.com', 95, ARRAY['fintech', 'AI', 'business'], 'newsapi', true),
      ('The Verge', 'theverge.com', 82, ARRAY['consumer tech', 'AI', 'reviews'], 'newsapi', false),
      ('Financial Times', 'ft.com', 93, ARRAY['business tech', 'AI policy', 'economics'], 'newsapi', true),
      ('Wall Street Journal', 'wsj.com', 91, ARRAY['enterprise tech', 'AI business', 'markets'], 'newsapi', true)
      ON CONFLICT (name) DO NOTHING;
    `);

    // 17. TRANSLATIONS - Universal Language System
    await client.query(`
      CREATE TABLE IF NOT EXISTS translations (
        id SERIAL PRIMARY KEY,
        original_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        source_language VARCHAR(10) NOT NULL DEFAULT 'en',
        target_language VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        usage_count INTEGER DEFAULT 1,
        ai_provider VARCHAR(50) DEFAULT 'openai',
        confidence_score DECIMAL(3,2) DEFAULT 0.95,
        UNIQUE(original_text, target_language, source_language)
      );
    `);

    // Create indexes for translation performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_translations_lookup 
      ON translations(original_text, target_language, source_language);
      
      CREATE INDEX IF NOT EXISTS idx_translations_language 
      ON translations(target_language);
      
      CREATE INDEX IF NOT EXISTS idx_translations_usage 
      ON translations(usage_count DESC);
    `);
    
    // 22. CAI_GROK_AUDIT - NASA-Grade Strategic Decision Audit Trail
    await client.query(`
      CREATE TABLE IF NOT EXISTS cai_grok_audit (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id VARCHAR(255) NOT NULL,
        actor VARCHAR(255) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        request_payload JSONB NOT NULL,
        grok_response JSONB,
        decision_text VARCHAR(50),
        risk_score INTEGER DEFAULT 0,
        moat_value VARCHAR(20) DEFAULT 'unknown',
        status VARCHAR(50) NOT NULL,
        executed BOOLEAN DEFAULT false,
        executed_by VARCHAR(255),
        execution_timestamp TIMESTAMPTZ,
        processing_time_ms INTEGER,
        error_message TEXT,
        signature VARCHAR(255), -- Cryptographic signature for audit integrity
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 23. MISSION_CONTROL_METRICS - Real-time telemetry
    await client.query(`
      CREATE TABLE IF NOT EXISTS mission_control_metrics (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL,
        metric_type VARCHAR(100) NOT NULL, -- 'decision_count', 'avg_risk', 'cost_total', etc.
        metric_value NUMERIC NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 24. HUMAN_OVERRIDES - Track manual interventions
    await client.query(`
      CREATE TABLE IF NOT EXISTS human_overrides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id VARCHAR(255) NOT NULL,
        override_token VARCHAR(255) NOT NULL,
        override_reason TEXT NOT NULL,
        caio_signature VARCHAR(255) NOT NULL,
        granted_at TIMESTAMPTZ DEFAULT NOW(),
        used_at TIMESTAMPTZ,
        expires_at TIMESTAMPTZ NOT NULL,
        status VARCHAR(50) DEFAULT 'active' -- 'active', 'used', 'expired'
      )
    `);

    // Indexes for NASA-grade audit queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cai_grok_audit_request_id 
      ON cai_grok_audit(request_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cai_grok_audit_actor_timestamp 
      ON cai_grok_audit(actor, timestamp DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cai_grok_audit_decision_risk 
      ON cai_grok_audit(decision_text, risk_score)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cai_grok_audit_status_timestamp 
      ON cai_grok_audit(status, timestamp DESC)
    `);

    // Indexes for mission control metrics
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_control_metrics_type_timestamp 
      ON mission_control_metrics(metric_type, timestamp DESC)
    `);

    // Indexes for human overrides
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_human_overrides_token 
      ON human_overrides(override_token)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_human_overrides_status_expires 
      ON human_overrides(status, expires_at)
    `);

    // ==================== INDIVIDUAL COUNTRY TABLES INITIALIZATION ====================
    
    console.log("🌍 Initializing individual country tables system...");
    
    try {
      const { individualCountryTables } = await import('./services/individual-country-tables.js');
      const countryTablesCreated = await individualCountryTables.createCountryTables();
      
      if (countryTablesCreated) {
        console.log("✅ Individual country tables created successfully!");
      } else {
        console.warn("⚠️ Some individual country tables failed to create");
      }
    } catch (error) {
      console.warn("⚠️ Individual country tables initialization failed:", error.message);
    }
    
    client.release();
    console.log("✅ NASA-grade database schema created successfully!");
    console.log("📊 Total tables created: 19+ (including Mission Control + Individual Country Tables)");
    console.log("🔍 Total indexes created: 32+");
    console.log("⚙️ Triggers and functions: Active");
    console.log("🧠 Cai-Grok Brain audit trail: NASA-GRADE");
    console.log("🚀 Mission Control telemetry: ENABLED");
    console.log("🔐 Human override system: OPERATIONAL");
    console.log("🎮 Initial data: Loaded");
    console.log("🌍 Individual Country Tables: Dedicated tables for massive country-specific news");
    
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    return false;
  }
}

/**
 * GAME DATA PERSISTENCE - Never lose scores on deployment!
 */

/**
 * ENTERPRISE GAME SUBMISSION SYSTEM
 * Store game submissions with comprehensive analytics and fraud detection
 */
export async function storeGameSubmission(submission) {
  if (pool) {
    try {
      const client = await pool.connect();
      
      // Enhanced fraud detection and validation
      const userIp = submission.userIp || '0.0.0.0';
      const userAgent = submission.userAgent || 'Unknown';
      
      // Check for recent submissions from same IP (rate limiting)
      const recentSubmissions = await client.query(
        `SELECT COUNT(*) as count FROM game_submissions 
         WHERE user_ip = $1 AND submitted_at > NOW() - INTERVAL '1 hour'`,
        [userIp]
      );
      
      if (parseInt(recentSubmissions.rows[0].count) > 10) {
        throw new Error('Rate limit exceeded: Too many submissions from this IP');
      }
      
      // Analyze URL for quality scoring
      const qualityScore = calculateUrlQualityScore(submission.url, submission.articleTitle);
      const pointBreakdown = {
        basePoints: 1,
        qualityBonus: qualityScore > 80 ? 2 : qualityScore > 60 ? 1 : 0,
        sourceBonus: isPremiumSource(submission.url) ? 1 : 0,
        total: submission.points
      };
      
      // Store enhanced submission
      const submissionResult = await client.query(
        `INSERT INTO game_submissions (
          url, country, user_id, user_ip, points, point_breakdown,
          article_title, article_source, quality_score, user_agent, submission_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`,
        [
          submission.url,
          submission.country,
          submission.userId,
          userIp,
          submission.points,
          JSON.stringify(pointBreakdown),
          submission.articleTitle || extractTitleFromUrl(submission.url),
          extractSourceFromUrl(submission.url),
          qualityScore,
          userAgent,
          submission.submissionMethod || 'web'
        ]
      );
      
      const submissionId = submissionResult.rows[0].id;
      
      // The trigger will automatically update game_scores, but we can also track daily scores
      await client.query(
        `UPDATE game_scores SET 
           daily_score = daily_score + $2,
           unique_contributors = (
             SELECT COUNT(DISTINCT user_id) 
             FROM game_submissions 
             WHERE country = $1 AND user_id IS NOT NULL
           )
         WHERE country = $1`,
        [submission.country, submission.points]
      );
      
      // Check for achievements
      await checkAndAwardAchievements(client, submission.userId, submission.country);
      
      // Log user interaction
      await client.query(
        `INSERT INTO user_interactions (
          user_id, user_ip, user_agent, interaction_type, target_type, target_id,
          metadata, country_context
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          submission.userId,
          userIp,
          userAgent,
          'game_submission',
          'article_url',
          submissionId.toString(),
          JSON.stringify({ points: submission.points, quality_score: qualityScore }),
          submission.country
        ]
      );
      
      client.release();
      
      console.log(`🎮 Enhanced game submission stored:`);
      console.log(`   🏆 ${submission.country}: +${submission.points} points`);
      console.log(`   📊 Quality Score: ${qualityScore}/100`);
      console.log(`   🎯 Submission ID: ${submissionId}`);
      
      return {
        success: true,
        submissionId,
        qualityScore,
        pointBreakdown,
        achievements: [] // Will be populated by achievement check
      };
    } catch (error) {
      console.warn("⚠️ PostgreSQL game storage failed:", error.message);
      
      throw error;
    }
  } else {
    throw new Error("Database not available - PostgreSQL connection required");
  }
}

/**
 * Get all game scores
 */
export async function getGameScores() {
  if (pool) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT country, score FROM game_scores ORDER BY score DESC"
      );
      client.release();
      
      const scores = {};
      result.rows.forEach(row => {
        scores[row.country] = row.score;
      });
      
      return scores;
    } catch (error) {
      console.error("❌ PostgreSQL game read failed:", error.message);
      throw error;
    }
  } else {
    throw new Error("Database not available - PostgreSQL connection required");
  }
}

/**
 * Get game submissions
 */
export async function getGameSubmissions(limit = 100) {
  if (pool) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM game_submissions ORDER BY submitted_at DESC LIMIT $1",
        [limit]
      );
      client.release();
      
      return result.rows.map(row => ({
        id: row.id.toString(),
        url: row.url,
        country: row.country,
        userId: row.user_id,
        points: row.points,
        timestamp: row.submitted_at
      }));
    } catch (error) {
      console.error("❌ PostgreSQL submissions read failed:", error.message);
      throw error;
    }
  } else {
    throw new Error("Database not available - PostgreSQL connection required");
  }
}

/**
 * HELPER FUNCTIONS FOR ENTERPRISE FEATURES
 */

// Calculate URL quality score based on domain and content indicators
function calculateUrlQualityScore(url, title = '') {
  let score = 50; // Base score
  
  try {
    const domain = new URL(url).hostname.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Premium domains get higher scores
    const premiumDomains = {
      'techcrunch.com': 25,
      'wired.com': 25,
      'technologyreview.com': 30,
      'reuters.com': 30,
      'bloomberg.com': 30,
      'ft.com': 25,
      'wsj.com': 25,
      'theverge.com': 20,
      'arstechnica.com': 25,
      'ieee.org': 30
    };
    
    // Check for premium domains
    for (const [premiumDomain, bonus] of Object.entries(premiumDomains)) {
      if (domain.includes(premiumDomain)) {
        score += bonus;
        break;
      }
    }
    
    // AI/Tech keywords in title boost score
    const aiKeywords = ['artificial intelligence', 'ai ', 'machine learning', 'neural network', 'deep learning'];
    const techKeywords = ['breakthrough', 'innovation', 'research', 'development', 'technology'];
    
    aiKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score += 10;
    });
    
    techKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score += 5;
    });
    
    // Penalize low-quality indicators
    const lowQualityKeywords = ['deal', 'sale', 'discount', 'review', 'unboxing', 'specs'];
    lowQualityKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score -= 15;
    });
    
    return Math.max(0, Math.min(100, score));
  } catch (error) {
    return 50; // Default score if URL parsing fails
  }
}

// Check if URL is from a premium source
function isPremiumSource(url) {
  const premiumDomains = [
    'techcrunch.com', 'wired.com', 'technologyreview.com', 'reuters.com',
    'bloomberg.com', 'ft.com', 'wsj.com', 'arstechnica.com', 'ieee.org'
  ];
  
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return premiumDomains.some(premium => domain.includes(premium));
  } catch (error) {
    return false;
  }
}

// Extract title from URL (basic implementation)
function extractTitleFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop().replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
  } catch (error) {
    return 'Unknown Article';
  }
}

// Extract source from URL
function extractSourceFromUrl(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (error) {
    return 'Unknown Source';
  }
}

// Check and award achievements to users
async function checkAndAwardAchievements(client, userId, country) {
  if (!userId) return [];
  
  try {
    // Get user's submission stats
    const userStats = await client.query(
      `SELECT 
         COUNT(*) as total_submissions,
         SUM(points) as total_points,
         COUNT(DISTINCT country) as countries_submitted
       FROM game_submissions 
       WHERE user_id = $1`,
      [userId]
    );
    
    const stats = userStats.rows[0];
    const achievements = [];
    
    // Check for achievements based on stats
    const achievementChecks = [
      { name: 'First Submission', condition: stats.total_submissions >= 1 },
      { name: 'AI Enthusiast', condition: stats.total_submissions >= 5 },
      { name: 'Country Champion', condition: stats.total_submissions >= 10 },
      { name: 'Quality Contributor', condition: stats.total_points >= 50 },
      { name: 'AI Expert', condition: stats.total_submissions >= 25 },
      { name: 'Global Leader', condition: stats.total_points >= 100 },
      { name: 'AI Pioneer', condition: stats.total_submissions >= 50 },
      { name: 'Point Master', condition: stats.total_points >= 200 }
    ];
    
    for (const check of achievementChecks) {
      if (check.condition) {
        // Try to award achievement (will be ignored if already earned)
        try {
          await client.query(
            `INSERT INTO user_achievements (user_id, achievement_id, country)
             SELECT $1, id, $2 FROM game_achievements WHERE name = $3
             ON CONFLICT (user_id, achievement_id) DO NOTHING`,
            [userId, country, check.name]
          );
          achievements.push(check.name);
        } catch (error) {
          // Achievement already exists or other error
        }
      }
    }
    
    return achievements;
  } catch (error) {
    console.warn('⚠️ Achievement check failed:', error.message);
    return [];
  }
}

/**
 * ANALYTICS AND REPORTING FUNCTIONS
 */

// Log API usage for cost tracking
export async function logApiUsage(provider, endpoint, params, response, cost = 0) {
  if (!pool) return;
  
  try {
    const client = await pool.connect();
    
    await client.query(
      `INSERT INTO api_usage_log (
        api_provider, endpoint, query_params, response_status, response_size,
        response_time_ms, cost_estimate, articles_returned, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        provider,
        endpoint,
        JSON.stringify(params),
        response.status || 200,
        response.size || 0,
        response.responseTime || 0,
        cost,
        response.articlesReturned || 0,
        response.error || null
      ]
    );
    
    client.release();
  } catch (error) {
    console.warn('⚠️ Failed to log API usage:', error.message);
  }
}

// Track user interactions for analytics
export async function trackUserInteraction(interaction) {
  if (!pool) return;
  
  try {
    const client = await pool.connect();
    
    await client.query(
      `INSERT INTO user_interactions (
        user_id, session_id, user_ip, user_agent, interaction_type,
        target_type, target_id, metadata, country_context, referrer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        interaction.userId,
        interaction.sessionId,
        interaction.userIp,
        interaction.userAgent,
        interaction.type,
        interaction.targetType,
        interaction.targetId,
        JSON.stringify(interaction.metadata || {}),
        interaction.countryContext,
        interaction.referrer
      ]
    );
    
    client.release();
  } catch (error) {
    console.warn('⚠️ Failed to track user interaction:', error.message);
  }
}

// Get comprehensive analytics dashboard data
export async function getAnalyticsDashboard() {
  if (!pool) return { error: 'Database not available' };
  
  try {
    const client = await pool.connect();
    
    // Get key metrics
    const metrics = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM articles) as total_articles,
        (SELECT COUNT(*) FROM articles WHERE created_at > NOW() - INTERVAL '24 hours') as articles_today,
        (SELECT COUNT(*) FROM game_submissions) as total_submissions,
        (SELECT COUNT(*) FROM game_submissions WHERE submitted_at > NOW() - INTERVAL '24 hours') as submissions_today,
        (SELECT COUNT(DISTINCT user_id) FROM user_interactions WHERE created_at > NOW() - INTERVAL '24 hours') as active_users_today,
        (SELECT SUM(cost_estimate) FROM api_usage_log WHERE created_at > NOW() - INTERVAL '30 days') as monthly_api_cost
    `);
    
    // Get top countries by score
    const topCountries = await client.query(`
      SELECT country, score, total_submissions, unique_contributors
      FROM game_scores 
      ORDER BY score DESC 
      LIMIT 10
    `);
    
    // Get recent errors
    const recentErrors = await client.query(`
      SELECT error_type, error_message, created_at, severity
      FROM error_log 
      WHERE created_at > NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    client.release();
    
    return {
      metrics: metrics.rows[0],
      topCountries: topCountries.rows,
      recentErrors: recentErrors.rows,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to get analytics dashboard:', error.message);
    return { error: error.message };
  }
}

// Store user rating in PostgreSQL
export async function storeUserRating(rating) {
  if (!pool) throw new Error('Database not available');
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO user_ratings (article_id, user_id, user_ip, rel_score, ana_score, overall_rating, feedback_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (article_id, user_id) DO UPDATE SET
         rel_score = EXCLUDED.rel_score,
         ana_score = EXCLUDED.ana_score,
         overall_rating = EXCLUDED.overall_rating,
         feedback_text = EXCLUDED.feedback_text,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [rating.articleId, rating.userId, rating.userIp, rating.relScore, rating.anaScore, rating.overallRating, rating.feedbackText]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('❌ Failed to store user rating:', error.message);
    throw error;
  }
}

// Get user ratings for an article
export async function getUserRatings(articleId) {
  if (!pool) return { avgRelScore: 0, avgAnaScore: 0, totalRatings: 0 };
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT 
         AVG(rel_score) as avg_rel_score,
         AVG(ana_score) as avg_ana_score,
         AVG(overall_rating) as avg_overall_rating,
         COUNT(*) as total_ratings
       FROM user_ratings 
       WHERE article_id = $1`,
      [articleId]
    );
    
    client.release();
    
    const stats = result.rows[0];
    return {
      avgRelScore: Math.round(parseFloat(stats.avg_rel_score) || 0),
      avgAnaScore: Math.round(parseFloat(stats.avg_ana_score) || 0),
      avgOverallRating: Math.round(parseFloat(stats.avg_overall_rating) || 0),
      totalRatings: parseInt(stats.total_ratings) || 0
    };
  } catch (error) {
    console.error('❌ Failed to get user ratings:', error.message);
    return { avgRelScore: 0, avgAnaScore: 0, totalRatings: 0 };
  }
}

// Initialize schema asynchronously after pool is ready
setTimeout(async () => {
  if (pool) {
    try {
      await initializeDatabase();
    } catch (error) {
      console.warn("⚠️ Database schema initialization failed:", error.message);
    }
  }
}, 2000);
/**
 
* ENTERPRISE SEARCH FUNCTIONS
 */

// Advanced full-text search with filters
export async function searchArticles(searchParams) {
  if (!pool) return [];
  
  try {
    const client = await pool.connect();
    
    let query = `
      SELECT a.*, ts_rank(a.search_vector, plainto_tsquery('english', $1)) as rank
      FROM articles a
      WHERE a.search_vector @@ plainto_tsquery('english', $1)
    `;
    
    const params = [searchParams.query];
    let paramIndex = 2;
    
    // Add filters
    if (searchParams.country) {
      query += ` AND a.country = $${paramIndex}`;
      params.push(searchParams.country);
      paramIndex++;
    }
    
    if (searchParams.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(searchParams.category);
      paramIndex++;
    }
    
    if (searchParams.source) {
      query += ` AND a.source ILIKE $${paramIndex}`;
      params.push(`%${searchParams.source}%`);
      paramIndex++;
    }
    
    if (searchParams.minScore > 0) {
      query += ` AND (a.rel_score + a.ana_score) >= $${paramIndex}`;
      params.push(searchParams.minScore * 2); // Combined score
      paramIndex++;
    }
    
    query += ` ORDER BY rank DESC, a.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(searchParams.limit, searchParams.offset);
    
    const result = await client.query(query, params);
    client.release();
    
    return result.rows;
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
}

// Get enhanced leaderboard with achievements
export async function getEnhancedLeaderboard() {
  if (!pool) return [];
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        gs.*,
        COUNT(ua.id) as achievement_count,
        ARRAY_AGG(ga.name) FILTER (WHERE ga.name IS NOT NULL) as recent_achievements
      FROM game_scores gs
      LEFT JOIN game_submissions gsub ON gs.country = gsub.country
      LEFT JOIN user_achievements ua ON gsub.user_id = ua.user_id
      LEFT JOIN game_achievements ga ON ua.achievement_id = ga.id
      GROUP BY gs.country, gs.score, gs.total_submissions, gs.unique_contributors, 
               gs.last_submission_at, gs.rank_position, gs.daily_score, gs.weekly_score
      ORDER BY gs.score DESC
      LIMIT 20
    `);
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('❌ Enhanced leaderboard failed:', error.message);
    return [];
  }
}

// Get user profile with achievements and stats
export async function getUserProfile(userId) {
  if (!pool) return null;
  
  try {
    const client = await pool.connect();
    
    // Get user stats
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_submissions,
        SUM(points) as total_points,
        AVG(points) as avg_points,
        COUNT(DISTINCT country) as countries_contributed,
        MAX(submitted_at) as last_submission
      FROM game_submissions 
      WHERE user_id = $1
    `, [userId]);
    
    // Get user achievements
    const achievementsResult = await client.query(`
      SELECT ga.name, ga.description, ga.icon, ga.rarity, ua.earned_at
      FROM user_achievements ua
      JOIN game_achievements ga ON ua.achievement_id = ga.id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC
    `, [userId]);
    
    // Get user ratings
    const ratingsResult = await client.query(`
      SELECT COUNT(*) as total_ratings, AVG(overall_rating) as avg_rating
      FROM user_ratings 
      WHERE user_id = $1
    `, [userId]);
    
    client.release();
    
    return {
      userId,
      stats: statsResult.rows[0],
      achievements: achievementsResult.rows,
      ratings: ratingsResult.rows[0]
    };
  } catch (error) {
    console.error('❌ User profile failed:', error.message);
    return null;
  }
}

// Get trending topics analysis
export async function getTrendingTopics() {
  if (!pool) return [];
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        topic_category,
        COUNT(*) as article_count,
        AVG(rel_score + ana_score) as avg_score,
        MAX(published_at) as latest_article
      FROM articles 
      WHERE published_at > NOW() - INTERVAL '7 days'
        AND topic_category IS NOT NULL
      GROUP BY topic_category
      ORDER BY article_count DESC, avg_score DESC
      LIMIT 10
    `);
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('❌ Trending topics failed:', error.message);
    return [];
  }
}

// Get API cost analysis
export async function getApiCostAnalysis() {
  if (!pool) return {};
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        api_provider,
        COUNT(*) as total_calls,
        SUM(cost_estimate) as total_cost,
        AVG(response_time_ms) as avg_response_time,
        SUM(articles_returned) as total_articles
      FROM api_usage_log 
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY api_provider
      ORDER BY total_cost DESC
    `);
    
    client.release();
    return {
      providers: result.rows,
      period: '30 days',
      totalCost: result.rows.reduce((sum, p) => sum + parseFloat(p.total_cost || 0), 0)
    };
  } catch (error) {
    console.error('❌ API cost analysis failed:', error.message);
    return {};
  }
}

// Get comprehensive system health
export async function getSystemHealth() {
  if (!pool) return { status: 'Database unavailable' };
  
  try {
    const client = await pool.connect();
    
    // Database size and performance
    const dbStats = await client.query(`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as db_size,
        (SELECT COUNT(*) FROM articles) as total_articles,
        (SELECT COUNT(*) FROM game_submissions) as total_submissions,
        (SELECT COUNT(*) FROM user_interactions) as total_interactions
    `);
    
    // Recent errors
    const errorStats = await client.query(`
      SELECT severity, COUNT(*) as count
      FROM error_log 
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY severity
    `);
    
    // API performance
    const apiStats = await client.query(`
      SELECT 
        AVG(response_time_ms) as avg_response_time,
        COUNT(*) as total_calls_today
      FROM api_usage_log 
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `);
    
    client.release();
    
    return {
      status: 'Healthy',
      database: dbStats.rows[0],
      errors: errorStats.rows,
      api: apiStats.rows[0],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ System health check failed:', error.message);
    return { status: 'Unhealthy', error: error.message };
  }
}

// Content moderation function
export async function moderateContent(moderation) {
  if (!pool) throw new Error('Database not available');
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      INSERT INTO content_moderation (
        content_type, content_id, moderator_id, action, reason, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      moderation.contentType,
      moderation.contentId,
      moderation.moderatorId,
      moderation.action,
      moderation.reason,
      moderation.notes
    ]);
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('❌ Content moderation failed:', error.message);
    throw error;
  }
}

// Execute bulk operations for admin efficiency
export async function executeBulkOperation(operation, data) {
  if (!pool) throw new Error('Database not available');
  
  try {
    const client = await pool.connect();
    let result = {};
    
    switch (operation) {
      case 'delete_old_articles':
        const deleteResult = await client.query(`
          DELETE FROM articles 
          WHERE published_at < NOW() - INTERVAL '${data.days || 30} days'
        `);
        result = { deleted: deleteResult.rowCount };
        break;
        
      case 'update_scores':
        // Bulk update article scores
        for (const update of data.updates || []) {
          await client.query(`
            UPDATE articles 
            SET rel_score = $1, ana_score = $2 
            WHERE id = $3
          `, [update.relScore, update.anaScore, update.id]);
        }
        result = { updated: data.updates?.length || 0 };
        break;
        
      case 'reset_daily_scores':
        await client.query(`UPDATE game_scores SET daily_score = 0`);
        result = { message: 'Daily scores reset' };
        break;
        
      default:
        throw new Error(`Unknown bulk operation: ${operation}`);
    }
    
    client.release();
    return result;
  } catch (error) {
    console.error('❌ Bulk operation failed:', error.message);
    throw error;
  }
}
/**

 * 🚨 SAVE ARTICLES TO DATABASE - MEDIASTACK INTEGRATION
 * Saves fetched articles directly to PostgreSQL with full metadata
 */
export async function saveArticlesToDatabase(articles) {
  if (!articles || articles.length === 0) {
    throw new Error('No articles provided to save');
  }

  console.log(`💾 Saving ${articles.length} articles to database...`);

  if (pool) {
    try {
      const client = await pool.connect();
      let savedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      for (const article of articles) {
        try {
          // Enhanced article storage with full Mediastack metadata
          const result = await client.query(
            `INSERT INTO articles (
              id, title, url, source, author, published_at, description,
              country, category, rel_score, ana_score, provenance, language, image_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (url) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              rel_score = EXCLUDED.rel_score,
              ana_score = EXCLUDED.ana_score,
              updated_at = CURRENT_TIMESTAMP
            RETURNING (xmax = 0) AS inserted`,
            [
              article.id,
              article.title,
              article.url,
              article.source,
              article.author,
              article.publishedAt,
              article.description,
              article.country,
              article.category || 'ai',
              article.relScore || 75,
              article.anaScore || 70,
              article.provenance || 'mediastack-api',
              article.language || 'en',
              article.image
            ]
          );

          if (result.rows[0].inserted) {
            savedCount++;
          } else {
            updatedCount++;
          }

        } catch (articleError) {
          console.warn(`⚠️ Failed to save article "${article.title}":`, articleError.message);
          errorCount++;
        }
      }

      // Log the operation
      await client.query(
        `INSERT INTO api_usage_log (api_provider, endpoint, articles_returned, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        ['mediastack', '/batch_save', articles.length]
      );

      client.release();

      console.log(`✅ Database save complete:`);
      console.log(`   📝 New articles saved: ${savedCount}`);
      console.log(`   🔄 Articles updated: ${updatedCount}`);
      console.log(`   ❌ Errors: ${errorCount}`);

      return {
        success: true,
        saved: savedCount,
        updated: updatedCount,
        errors: errorCount,
        total: articles.length
      };

    } catch (error) {
      console.error("❌ PostgreSQL save failed:", error.message);
      return {
        success: false,
        saved: 0,
        updated: 0,
        errors: articles.length,
        total: articles.length,
        error: error.message
      };
    }
  } else {
    console.warn("⚠️ Database not available, cannot save articles");
    return {
      success: false,
      saved: 0,
      updated: 0,
      errors: articles.length,
      total: articles.length,
      error: "Database not available"
    };
  }
}

// 🌍 UNIVERSAL LANGUAGES - Translation Database Functions
export async function getTranslation(originalText, targetLanguage, sourceLanguage = 'en') {
  if (!pool) return null;
  
  try {
    const result = await pool.query(
      `SELECT * FROM translations 
       WHERE original_text = $1 AND target_language = $2 AND source_language = $3`,
      [originalText, targetLanguage, sourceLanguage]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting translation:', error);
    return null;
  }
}

export async function saveTranslation(originalText, translatedText, targetLanguage, sourceLanguage = 'en') {
  if (!pool) return false;
  
  try {
    await pool.query(
      `INSERT INTO translations (original_text, translated_text, target_language, source_language, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (original_text, target_language, source_language) 
       DO UPDATE SET translated_text = $2, updated_at = NOW()`,
      [originalText, translatedText, targetLanguage, sourceLanguage]
    );
    
    console.log(`🌍 Translation saved: ${sourceLanguage} -> ${targetLanguage}`);
    return true;
  } catch (error) {
    console.error('Error saving translation:', error);
    return false;
  }
}

// ==================== JOB SEARCH DATABASE FUNCTIONS ====================

/**
 * Store job postings in database with caching
 */
export async function storeJobPostings(jobs, searchParams) {
  if (!pool || !jobs || jobs.length === 0) return { success: false, stored: 0 };
  
  try {
    const client = await pool.connect();
    let storedCount = 0;
    let updatedCount = 0;
    
    console.log(`💾 Storing ${jobs.length} job postings to database...`);
    
    for (const job of jobs) {
      try {
        const result = await client.query(
          `INSERT INTO job_postings (
            id, title, company, location, salary_min, salary_max, salary_display,
            description, url, source, contract_type, category, country,
            search_keywords, search_location, date_posted, quality_score
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            location = EXCLUDED.location,
            salary_display = EXCLUDED.salary_display,
            description = EXCLUDED.description,
            updated_at = CURRENT_TIMESTAMP,
            expires_at = CURRENT_TIMESTAMP + INTERVAL '24 hours'
          RETURNING (xmax = 0) AS inserted`,
          [
            job.id,
            job.title,
            job.company,
            job.location,
            job.salary_min || null,
            job.salary_max || null,
            job.salary,
            job.metadata,
            job.url,
            job.source || 'adzuna',
            job.contract_type || 'Not specified',
            job.category || 'General',
            searchParams.country || 'us',
            searchParams.keywords,
            searchParams.location,
            job.date_posted || new Date(),
            calculateJobQualityScore(job)
          ]
        );
        
        if (result.rows[0].inserted) {
          storedCount++;
        } else {
          updatedCount++;
        }
      } catch (jobError) {
        console.warn(`⚠️ Failed to store job "${job.title}":`, jobError.message);
      }
    }
    
    client.release();
    
    console.log(`✅ Job storage complete: ${storedCount} new, ${updatedCount} updated`);
    
    return {
      success: true,
      stored: storedCount,
      updated: updatedCount,
      total: jobs.length
    };
  } catch (error) {
    console.error('❌ Job storage failed:', error.message);
    return { success: false, stored: 0, error: error.message };
  }
}

/**
 * Get cached job postings from database with pagination and custom cache duration
 */
export async function getCachedJobPostings(searchParams, cacheDurationMs = 24 * 60 * 60 * 1000) {
  if (!pool) return null;
  
  try {
    const client = await pool.connect();
    
    // First, check if we have ANY jobs for this search (regardless of page)
    // Use custom cache duration instead of fixed expires_at
    let countQuery = `
      SELECT COUNT(*) as total_count, MIN(created_at) as oldest_cache
      FROM job_postings 
      WHERE is_active = TRUE 
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '${Math.floor(cacheDurationMs / 1000)} seconds'
        AND search_keywords = $1
    `;
    
    const countParams = [searchParams.keywords];
    let paramIndex = 2;
    
    // Add location filter if provided
    if (searchParams.location && searchParams.location.trim()) {
      countQuery += ` AND search_location = $${paramIndex}`;
      countParams.push(searchParams.location.trim());
      paramIndex++;
    } else {
      countQuery += ` AND (search_location IS NULL OR search_location = '')`;
    }
    
    // Add country filter
    countQuery += ` AND country = $${paramIndex}`;
    countParams.push(searchParams.country || 'us');
    
    const countResult = await client.query(countQuery, countParams);
    const totalCached = parseInt(countResult.rows[0].total_count);
    
    if (totalCached === 0) {
      client.release();
      return null; // No cached results found
    }
    
    console.log(`📊 Found ${totalCached} total cached jobs for this search`);
    
    // Now get the specific page
    let query = `
      SELECT * FROM job_postings 
      WHERE is_active = TRUE 
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '${Math.floor(cacheDurationMs / 1000)} seconds'
        AND search_keywords = $1
    `;
    
    const params = [searchParams.keywords];
    paramIndex = 2;
    
    // Add location filter if provided
    if (searchParams.location && searchParams.location.trim()) {
      query += ` AND search_location = $${paramIndex}`;
      params.push(searchParams.location.trim());
      paramIndex++;
    } else {
      query += ` AND (search_location IS NULL OR search_location = '')`;
    }
    
    // Add country filter
    query += ` AND country = $${paramIndex}`;
    params.push(searchParams.country || 'us');
    paramIndex++;
    
    // Order by quality and recency, then paginate
    query += ` ORDER BY quality_score DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(10, (searchParams.page || 0) * 10);
    
    const result = await client.query(query, params);
    client.release();
    
    if (result.rows.length > 0) {
      console.log(`🎯 Serving page ${searchParams.page || 0}: ${result.rows.length} jobs from cache`);
      
      // Convert database rows to job format
      const jobs = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        salary: row.salary_display,
        salary_min: row.salary_min,
        salary_max: row.salary_max,
        metadata: row.description,
        url: row.url,
        source: row.source,
        contract_type: row.contract_type,
        category: row.category,
        date: formatJobDate(row.date_posted),
        date_posted: row.date_posted,
        quality_score: row.quality_score
      }));
      
      const cacheAge = Math.floor((Date.now() - new Date(countResult.rows[0].oldest_cache).getTime()) / 1000 / 60);
      
      return {
        success: true,
        source: 'database_cache',
        query: searchParams.keywords,
        location: searchParams.location,
        jobs: jobs,
        count: jobs.length,
        total_results: totalCached,
        has_more: ((searchParams.page || 0) + 1) * 10 < totalCached,
        page: searchParams.page || 0,
        cached: true,
        cache_age: cacheAge
      };
    }
    
    return null; // No results for this specific page
  } catch (error) {
    console.error('❌ Failed to get cached jobs:', error.message);
    return null;
  }
}

/**
 * Log job search query for analytics
 */
export async function logJobSearchQuery(searchParams, result, userInfo = {}) {
  if (!pool) return;
  
  try {
    const client = await pool.connect();
    
    await client.query(
      `INSERT INTO job_search_queries (
        user_id, user_ip, keywords, location, country, page,
        results_count, cache_hit, response_time_ms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userInfo.userId || null,
        userInfo.userIp || null,
        searchParams.keywords,
        searchParams.location || null,
        searchParams.country || 'us',
        searchParams.page || 0,
        result.count || 0,
        result.cached || false,
        result.responseTime || 0
      ]
    );
    
    client.release();
  } catch (error) {
    console.warn('⚠️ Failed to log job search query:', error.message);
  }
}

/**
 * Track job interaction (click, view, etc.)
 */
export async function trackJobInteraction(jobId, interactionType, userInfo = {}, metadata = {}) {
  if (!pool) return;
  
  try {
    const client = await pool.connect();
    
    // Log the interaction
    await client.query(
      `INSERT INTO job_interactions (job_id, user_id, user_ip, interaction_type, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [jobId, userInfo.userId || null, userInfo.userIp || null, interactionType, JSON.stringify(metadata)]
    );
    
    // Update job statistics
    if (interactionType === 'click') {
      await client.query(
        `UPDATE job_postings SET click_count = click_count + 1 WHERE id = $1`,
        [jobId]
      );
    } else if (interactionType === 'view') {
      await client.query(
        `UPDATE job_postings SET view_count = view_count + 1 WHERE id = $1`,
        [jobId]
      );
    }
    
    client.release();
  } catch (error) {
    console.warn('⚠️ Failed to track job interaction:', error.message);
  }
}

/**
 * Clean up expired job postings
 */
export async function cleanupExpiredJobs() {
  if (!pool) return;
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `DELETE FROM job_postings WHERE expires_at < CURRENT_TIMESTAMP`
    );
    
    client.release();
    
    if (result.rowCount > 0) {
      console.log(`🧹 Cleaned up ${result.rowCount} expired job postings`);
    }
    
    return result.rowCount;
  } catch (error) {
    console.error('❌ Failed to cleanup expired jobs:', error.message);
    return 0;
  }
}

/**
 * Get job search analytics
 */
export async function getJobSearchAnalytics() {
  if (!pool) return {};

  try {
    const client = await pool.connect();
    
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_searches,
        COUNT(DISTINCT keywords) as unique_keywords,
        COUNT(*) FILTER (WHERE cache_hit = true) as cache_hits,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as searches_today,
        AVG(response_time_ms) as avg_response_time
      FROM job_search_queries
      WHERE created_at > NOW() - INTERVAL '7 days'
    `);
    
    const topKeywords = await client.query(`
      SELECT keywords, COUNT(*) as search_count
      FROM job_search_queries
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY keywords
      ORDER BY search_count DESC
      LIMIT 10
    `);
    
    const jobStats = await client.query(`
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(*) FILTER (WHERE is_active = true) as active_jobs,
        COUNT(*) FILTER (WHERE expires_at > CURRENT_TIMESTAMP) as valid_jobs,
        AVG(quality_score) as avg_quality_score
      FROM job_postings
    `);
    
    client.release();
    
    return {
      searches: stats.rows[0],
      topKeywords: topKeywords.rows,
      jobs: jobStats.rows[0],
      cacheHitRate: stats.rows[0].cache_hits / stats.rows[0].total_searches * 100
    };
  } catch (error) {
    console.error('❌ Failed to get job analytics:', error.message);
    return {};
  }
}

function buildJobWhereClause({ keyword, country, location, requireSalary = false }) {
  const conditions = ['is_active = TRUE'];
  const params = [];
  let paramIndex = 1;

  if (keyword) {
    conditions.push(`(LOWER(title) LIKE $${paramIndex} OR LOWER(search_keywords) LIKE $${paramIndex})`);
    params.push(`%${keyword.toLowerCase()}%`);
    paramIndex++;
  }

  if (country) {
    conditions.push(`LOWER(country) = $${paramIndex}`);
    params.push(country.toLowerCase());
    paramIndex++;
  }

  if (location) {
    conditions.push(`LOWER(location) LIKE $${paramIndex}`);
    params.push(`%${location.toLowerCase()}%`);
    paramIndex++;
  }

  if (requireSalary) {
    conditions.push('(salary_min IS NOT NULL OR salary_max IS NOT NULL)');
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return { whereClause, params };
}

export async function getSalaryBandInsights({
  keyword = '',
  country = null,
  location = null,
  sampleLimit = 200
} = {}) {
  if (!pool) {
    return { success: false, reason: 'postgres_unavailable' };
  }

  const sanitizedLimit = Math.max(10, Math.min(sampleLimit || 200, 500));
  const previewLimit = Math.min(12, sanitizedLimit);
  const { whereClause, params } = buildJobWhereClause({
    keyword,
    country,
    location,
    requireSalary: true
  });

  const statsLimitIndex = params.length + 1;

  const salaryStatsQuery = `
    WITH salary_samples AS (
      SELECT
        CASE
          WHEN salary_min IS NOT NULL AND salary_max IS NOT NULL THEN (salary_min + salary_max) / 2.0
          WHEN salary_min IS NOT NULL THEN salary_min
          WHEN salary_max IS NOT NULL THEN salary_max
          ELSE NULL
        END AS salary_mid,
        salary_min,
        salary_max,
        salary_display,
        title,
        company,
        location,
        created_at
      FROM job_postings
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${statsLimitIndex}
    )
    SELECT
      COUNT(*) AS sample_size,
      MIN(salary_mid) AS min_salary,
      MAX(salary_mid) AS max_salary,
      AVG(salary_mid) AS avg_salary,
      PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary_mid) AS p25_salary,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary_mid) AS median_salary,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY salary_mid) AS p75_salary
    FROM salary_samples
    WHERE salary_mid IS NOT NULL;
  `;

  const salaryPreviewQuery = `
    SELECT title, company, location, salary_min, salary_max, salary_display, created_at
    FROM (
      SELECT
        title,
        company,
        location,
        salary_min,
        salary_max,
        salary_display,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY company ORDER BY created_at DESC) AS rn
      FROM job_postings
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${statsLimitIndex}
    ) ranked
    WHERE rn = 1
      AND (salary_min IS NOT NULL OR salary_max IS NOT NULL)
    ORDER BY created_at DESC
    LIMIT $${statsLimitIndex + 1};
  `;

  const companyStatsQuery = `
    SELECT
      company,
      COUNT(*) AS postings,
      AVG(
        CASE
          WHEN salary_min IS NOT NULL AND salary_max IS NOT NULL THEN (salary_min + salary_max) / 2.0
          WHEN salary_min IS NOT NULL THEN salary_min
          WHEN salary_max IS NOT NULL THEN salary_max
          ELSE NULL
        END
      ) AS avg_salary
    FROM job_postings
    ${whereClause}
    GROUP BY company
    HAVING COUNT(*) > 0
    ORDER BY avg_salary DESC NULLS LAST
    LIMIT $${statsLimitIndex};
  `;

  try {
    const client = await pool.connect();

    const [statsResult, previewResult, companiesResult] = await Promise.all([
      client.query(salaryStatsQuery, [...params, sanitizedLimit]),
      client.query(salaryPreviewQuery, [...params, sanitizedLimit, previewLimit]),
      client.query(companyStatsQuery, [...params, 8])
    ]);

    client.release();

    const statsRow = statsResult.rows[0] || {};

    return {
      success: true,
      keyword,
      country,
      location,
      samplesAnalyzed: Number(statsRow.sample_size || 0),
      salary: {
        average: statsRow.avg_salary ? Number(statsRow.avg_salary) : null,
        median: statsRow.median_salary ? Number(statsRow.median_salary) : null,
        percentile25: statsRow.p25_salary ? Number(statsRow.p25_salary) : null,
        percentile75: statsRow.p75_salary ? Number(statsRow.p75_salary) : null,
        min: statsRow.min_salary ? Number(statsRow.min_salary) : null,
        max: statsRow.max_salary ? Number(statsRow.max_salary) : null
      },
      sampleRoles: previewResult.rows.map(row => ({
        title: row.title,
        company: row.company,
        location: row.location,
        salaryMin: row.salary_min ? Number(row.salary_min) : null,
        salaryMax: row.salary_max ? Number(row.salary_max) : null,
        salaryDisplay: row.salary_display,
        postedAt: row.created_at
      })),
      topEmployers: companiesResult.rows.map(row => ({
        company: row.company,
        postings: Number(row.postings || 0),
        averageSalary: row.avg_salary ? Number(row.avg_salary) : null
      }))
    };
  } catch (error) {
    console.error('❌ Failed to compute salary insights:', error.message);
    return { success: false, reason: 'query_failed', error: error.message };
  }
}

export async function getCountryDemandInsights({ keyword = '', limit = 10 } = {}) {
  if (!pool) {
    return { success: false, reason: 'postgres_unavailable' };
  }

  const sanitizedLimit = Math.max(3, Math.min(limit || 10, 25));
  const { whereClause, params } = buildJobWhereClause({ keyword, country: null, location: null, requireSalary: false });

  const countryLimitIndex = params.length + 1;

  const countryDemandQuery = `
    SELECT
      country,
      COUNT(*) AS postings,
      COUNT(DISTINCT company) AS company_count,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') AS postings_last_7d,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') AS postings_last_30d
    FROM job_postings
    ${whereClause}
    GROUP BY country
    ORDER BY postings DESC
    LIMIT $${countryLimitIndex};
  `;

  const locationDemandQuery = `
    SELECT
      country,
      location,
      COUNT(*) AS postings
    FROM job_postings
    ${whereClause ? `${whereClause} AND` : 'WHERE'} location IS NOT NULL AND TRIM(location) <> ''
    GROUP BY country, location
    ORDER BY postings DESC
    LIMIT $${countryLimitIndex};
  `;

  try {
    const client = await pool.connect();

    const [countryRows, locationRows] = await Promise.all([
      client.query(countryDemandQuery, [...params, sanitizedLimit]),
      client.query(locationDemandQuery, [...params, sanitizedLimit * 3])
    ]);

    client.release();

    const totals = countryRows.rows.reduce(
      (acc, row) => {
        const postings = Number(row.postings || 0);
        const last7 = Number(row.postings_last_7d || 0);
        const last30 = Number(row.postings_last_30d || 0);

        acc.totalPostings += postings;
        acc.last7d += last7;
        acc.last30d += last30;
        return acc;
      },
      { totalPostings: 0, last7d: 0, last30d: 0 }
    );

    return {
      success: true,
      keyword,
      totals,
      countries: countryRows.rows.map(row => ({
        country: row.country,
        postings: Number(row.postings || 0),
        companies: Number(row.company_count || 0),
        last7d: Number(row.postings_last_7d || 0),
        last30d: Number(row.postings_last_30d || 0)
      })),
      locations: locationRows.rows.map(row => ({
        country: row.country,
        location: row.location,
        postings: Number(row.postings || 0)
      }))
    };
  } catch (error) {
    console.error('❌ Failed to compute country demand insights:', error.message);
    return { success: false, reason: 'query_failed', error: error.message };
  }
}

// Helper functions
function calculateJobQualityScore(job) {
  let score = 50; // Base score
  
  // Company reputation boost
  const topCompanies = ['google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'tesla', 'boeing', 'lockheed martin'];
  if (topCompanies.some(company => job.company.toLowerCase().includes(company))) {
    score += 20;
  }
  
  // Salary information boost
  if (job.salary && job.salary !== 'Salary not specified') {
    score += 15;
  }
  
  // Title quality
  const qualityTitles = ['senior', 'lead', 'principal', 'architect', 'engineer', 'developer', 'scientist'];
  if (qualityTitles.some(title => job.title.toLowerCase().includes(title))) {
    score += 10;
  }
  
  // Description length (more detailed = higher quality)
  if (job.metadata && job.metadata.length > 100) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

function formatJobDate(datePosted) {
  if (!datePosted) return 'Recent';
  
  const now = new Date();
  const posted = new Date(datePosted);
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return 'Over a month ago';
}

// ==================== AI JOB IMPACT DATABASE FUNCTIONS ====================

/**
 * Store daily AI job impact card
 */
export async function storeJobImpactCard(cardData, country = 'us') {
  if (!pool) return { success: false, error: 'Database not available' };
  
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];
    
    const result = await client.query(
      `INSERT INTO ai_job_impact_cards (
        date, country, headline, opportunity, message_for_users, layoff_data, trend_data, data_sources
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (date, country) DO UPDATE SET
        headline = EXCLUDED.headline,
        opportunity = EXCLUDED.opportunity,
        message_for_users = EXCLUDED.message_for_users,
        layoff_data = EXCLUDED.layoff_data,
        trend_data = EXCLUDED.trend_data,
        data_sources = EXCLUDED.data_sources,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        today,
        country,
        JSON.stringify(cardData.headline),
        JSON.stringify(cardData.opportunity),
        cardData.message_for_users,
        JSON.stringify(cardData.layoff_data || {}),
        JSON.stringify(cardData.trend_data || {}),
        JSON.stringify(cardData.data_sources || {})
      ]
    );
    
    client.release();
    
    console.log('✅ Job impact card stored successfully');
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ Failed to store job impact card:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get latest AI job impact card
 */
export async function getLatestJobImpactCard(country = 'us') {
  if (!pool) return null;
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT * FROM ai_job_impact_cards 
       WHERE country = $1
       ORDER BY date DESC 
       LIMIT 1`,
      [country]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      timestamp: row.created_at,
      headline: row.headline,
      opportunity: row.opportunity,
      message_for_users: row.message_for_users,
      data_sources: row.data_sources,
      date: row.date
    };
  } catch (error) {
    console.error('❌ Failed to get job impact card:', error.message);
    return null;
  }
}

/**
 * Store AI job trend data for historical tracking
 */
export async function storeAIJobTrend(trendData) {
  if (!pool) return { success: false, error: 'Database not available' };
  
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];
    
    // Get yesterday's data for comparison
    const yesterdayResult = await client.query(
      `SELECT total_ai_jobs FROM ai_job_trends 
       WHERE date = $1 - INTERVAL '1 day'`,
      [today]
    );
    
    const yesterdayTotal = yesterdayResult.rows[0]?.total_ai_jobs || 0;
    const dailyPctChange = yesterdayTotal > 0 
      ? ((trendData.ai_job_openings_now - yesterdayTotal) / yesterdayTotal) * 100 
      : 0;
    
    const result = await client.query(
      `INSERT INTO ai_job_trends (
        date, ai_job_count, total_ai_jobs, pct_change_daily, pct_change_weekly,
        top_companies, hot_titles
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (date) DO UPDATE SET
        ai_job_count = EXCLUDED.ai_job_count,
        total_ai_jobs = EXCLUDED.total_ai_jobs,
        pct_change_daily = EXCLUDED.pct_change_daily,
        pct_change_weekly = EXCLUDED.pct_change_weekly,
        top_companies = EXCLUDED.top_companies,
        hot_titles = EXCLUDED.hot_titles
      RETURNING *`,
      [
        today,
        trendData.ai_job_openings_now,
        trendData.ai_job_openings_now,
        Math.round(dailyPctChange * 10) / 10,
        trendData.pct_change,
        trendData.top_hiring_companies,
        JSON.stringify(trendData.hot_titles)
      ]
    );
    
    client.release();
    
    console.log('✅ AI job trend stored successfully');
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ Failed to store AI job trend:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get AI job trend history
 */
export async function getAIJobTrendHistory(days = 30) {
  if (!pool) return [];
  
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT * FROM ai_job_trends 
       WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY date DESC`,
      []
    );
    
    client.release();
    
    return result.rows.map(row => ({
      date: row.date,
      total_jobs: row.total_ai_jobs,
      daily_change: row.pct_change_daily,
      weekly_change: row.pct_change_weekly,
      top_companies: row.top_companies,
      hot_titles: row.hot_titles
    }));
  } catch (error) {
    console.error('❌ Failed to get AI job trend history:', error.message);
    return [];
  }
}



// ==================== CAI-GROK BRAIN AUDIT FUNCTIONS ====================

/**
 * Store Cai-Grok Brain audit record for governance and analytics
 */
export async function storeAuditRecord(auditRecord) {
  if (!pool) return false;
  
  try {
    const query = `
      INSERT INTO cai_grok_audit (
        timestamp, actor, action, decision, rationale, 
        risk_score, moat_value, strategic_upgrades, 
        execution_result, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    
    const values = [
      auditRecord.timestamp,
      auditRecord.actor,
      auditRecord.action,
      auditRecord.decision,
      auditRecord.rationale,
      auditRecord.risk_score || 0,
      auditRecord.moat_value || 'unknown',
      JSON.stringify(auditRecord.strategic_upgrades || []),
      JSON.stringify(auditRecord.execution_result || {}),
      JSON.stringify(auditRecord.metadata || {})
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Failed to store Cai-Grok audit record:', error.message);
    return false;
  }
}

/**
 * Get Cai-Grok Brain audit records for analytics
 */
export async function getAuditRecords(actor = null, limit = 100) {
  if (!pool) return [];
  
  try {
    let query = `
      SELECT 
        id, timestamp, actor, action, decision, rationale,
        risk_score, moat_value, strategic_upgrades, 
        execution_result, metadata,
        created_at
      FROM cai_grok_audit
    `;
    
    const values = [];
    
    if (actor) {
      query += ` WHERE actor = $1`;
      values.push(actor);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1}`;
    values.push(limit);
    
    const result = await pool.query(query, values);
    
    // Parse JSON fields
    return result.rows.map(row => ({
      ...row,
      strategic_upgrades: JSON.parse(row.strategic_upgrades || '[]'),
      execution_result: JSON.parse(row.execution_result || '{}'),
      metadata: JSON.parse(row.metadata || '{}')
    }));
  } catch (error) {
    console.error('❌ Failed to get Cai-Grok audit records:', error.message);
    return [];
  }
}

/**
 * Get Cai-Grok Brain decision statistics
 */
export async function getCaiGrokStats() {
  if (!pool) return {};

  try {
    const query = `
      SELECT
        COUNT(*) as total_decisions,
        AVG(risk_score) as avg_risk_score,
        COUNT(CASE WHEN decision = 'approve' THEN 1 END) as approved,
        COUNT(CASE WHEN decision = 'revise' THEN 1 END) as revised,
        COUNT(CASE WHEN decision = 'reject' THEN 1 END) as rejected,
        COUNT(CASE WHEN moat_value = 'high' THEN 1 END) as high_moat,
        COUNT(CASE WHEN moat_value = 'medium' THEN 1 END) as medium_moat,
        COUNT(CASE WHEN moat_value = 'low' THEN 1 END) as low_moat,
        MAX(created_at) as last_decision
      FROM cai_grok_audit
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `;

    const result = await pool.query(query);
    return result.rows[0] || {};
  } catch (error) {
    console.error('❌ Failed to get Cai-Grok stats:', error.message);
    return {};
  }
}

export async function fetchCountryNewsRows(country, options = {}) {
  if (!pool) {
    throw new Error('PostgreSQL not available');
  }

  const cc = normalizeCountryCode(country);
  const limit = Number(options.limit) || 30;
  const category = options.category ? String(options.category).trim().toLowerCase() : null;

  const client = await pool.connect();
  try {
    const tableName = `news_country_${cc}`;
    const params = [];
    let query = `SELECT id, title, source, url, published_at, summary, category FROM ${tableName}`;

    if (category) {
      query += ` WHERE category = $1`;
      params.push(category);
    }

    query += ` ORDER BY published_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await client.query(query, params);
    return result.rows.map((row) => {
      const publishedAt = row.published_at instanceof Date
        ? row.published_at.toISOString()
        : row.published_at;

      return {
        ...row,
        published_at: publishedAt,
      };
    });
  } catch (error) {
    if (error.code === '42P01') {
      return null;
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function fetchLatestJobAnalytics(country) {
  if (!pool) {
    throw new Error('PostgreSQL not available');
  }

  const cc = normalizeCountryCode(country);
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT country, day, top_companies, top_titles, salary_stats, brief FROM job_analytics_latest WHERE country = $1`,
      [cc]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    const parseJson = (value, fallback) => {
      if (value == null) return fallback;
      if (Array.isArray(value) || typeof value === 'object') return value;
      try {
        return JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    };

    return {
      country: row.country?.toUpperCase() || cc.toUpperCase(),
      day: row.day instanceof Date ? row.day.toISOString().slice(0, 10) : row.day,
      top_companies: parseJson(row.top_companies, []),
      top_titles: parseJson(row.top_titles, []),
      salary_stats: parseJson(row.salary_stats, {}),
      brief: row.brief || null,
    };
  } finally {
    client.release();
  }
}