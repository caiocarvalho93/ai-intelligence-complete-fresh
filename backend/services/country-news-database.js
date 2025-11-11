// Country-Specific News Database - Brand New Dedicated Tables
// Designed to store and manage country-specific news with enhanced filtering

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Initialize Country-Specific News Database Tables
 */
export async function initializeCountryNewsTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    console.log('🌍 Creating country-specific news database tables...');

    // 1. COUNTRY_NEWS - Dedicated table for country-specific articles
    await client.query(`
      CREATE TABLE IF NOT EXISTS country_news (
        id SERIAL PRIMARY KEY,
        article_id VARCHAR(255) UNIQUE NOT NULL,
        country_code VARCHAR(3) NOT NULL,
        country_name VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        source VARCHAR(255),
        author VARCHAR(255),
        published_at TIMESTAMPTZ,
        category VARCHAR(50) DEFAULT 'technology',
        language VARCHAR(10) DEFAULT 'en',
        relevance_score INTEGER DEFAULT 0,
        analysis_score INTEGER DEFAULT 0,
        country_relevance INTEGER DEFAULT 0, -- How relevant to specific country
        api_source VARCHAR(50), -- newsdata, newsapi, etc.
        provenance VARCHAR(100),
        keywords JSONB DEFAULT '[]',
        companies_mentioned JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 2. COUNTRY_NEWS_SOURCES - Track news sources by country
    await client.query(`
      CREATE TABLE IF NOT EXISTS country_news_sources (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        source_name VARCHAR(255) NOT NULL,
        source_url VARCHAR(500),
        reliability_score INTEGER DEFAULT 50,
        article_count INTEGER DEFAULT 0,
        last_fetch TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(country_code, source_name)
      )
    `);

    // 3. COUNTRY_KEYWORDS - Country-specific keywords for filtering
    await client.query(`
      CREATE TABLE IF NOT EXISTS country_keywords (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        keyword VARCHAR(255) NOT NULL,
        keyword_type VARCHAR(50), -- company, city, technology, etc.
        weight INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(country_code, keyword)
      )
    `);

    // 4. COUNTRY_NEWS_STATS - Track statistics per country
    await client.query(`
      CREATE TABLE IF NOT EXISTS country_news_stats (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        date DATE NOT NULL,
        total_articles INTEGER DEFAULT 0,
        high_relevance_articles INTEGER DEFAULT 0,
        unique_sources INTEGER DEFAULT 0,
        avg_relevance_score DECIMAL(5,2) DEFAULT 0,
        api_calls_made INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(country_code, date)
      )
    `);

    // Create indexes for optimal performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_country_news_country_published 
      ON country_news(country_code, published_at DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_country_news_relevance 
      ON country_news(country_code, country_relevance DESC, relevance_score DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_country_news_source 
      ON country_news(country_code, api_source, created_at DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_country_keywords_active 
      ON country_keywords(country_code, is_active, weight DESC)
    `);

    // Insert initial country keywords
    await insertInitialCountryKeywords(client);

    client.release();
    await pool.end();

    console.log('✅ Country-specific news database tables created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Failed to create country news tables:', error.message);
    await pool.end();
    return false;
  }
}

/**
 * Insert initial country-specific keywords
 */
async function insertInitialCountryKeywords(client) {
  const countryKeywords = {
    KR: [
      { keyword: 'Samsung', type: 'company', weight: 10 },
      { keyword: 'LG', type: 'company', weight: 9 },
      { keyword: 'SK Hynix', type: 'company', weight: 8 },
      { keyword: 'Naver', type: 'company', weight: 7 },
      { keyword: 'Kakao', type: 'company', weight: 7 },
      { keyword: 'Seoul', type: 'city', weight: 6 },
      { keyword: 'Korean tech', type: 'technology', weight: 8 },
      { keyword: 'K-tech', type: 'technology', weight: 6 },
      { keyword: 'Korean AI', type: 'technology', weight: 8 },
      { keyword: 'Korean startup', type: 'business', weight: 5 }
    ],
    JP: [
      { keyword: 'Sony', type: 'company', weight: 10 },
      { keyword: 'Nintendo', type: 'company', weight: 9 },
      { keyword: 'Toyota', type: 'company', weight: 8 },
      { keyword: 'SoftBank', type: 'company', weight: 8 },
      { keyword: 'Rakuten', type: 'company', weight: 7 },
      { keyword: 'Tokyo', type: 'city', weight: 6 },
      { keyword: 'Japanese tech', type: 'technology', weight: 8 },
      { keyword: 'Japanese AI', type: 'technology', weight: 8 },
      { keyword: 'robotics Japan', type: 'technology', weight: 7 }
    ],
    CN: [
      { keyword: 'Alibaba', type: 'company', weight: 10 },
      { keyword: 'Tencent', type: 'company', weight: 10 },
      { keyword: 'Baidu', type: 'company', weight: 9 },
      { keyword: 'Huawei', type: 'company', weight: 9 },
      { keyword: 'Xiaomi', type: 'company', weight: 8 },
      { keyword: 'ByteDance', type: 'company', weight: 8 },
      { keyword: 'Beijing', type: 'city', weight: 6 },
      { keyword: 'Shanghai', type: 'city', weight: 6 },
      { keyword: 'Chinese tech', type: 'technology', weight: 8 },
      { keyword: 'Chinese AI', type: 'technology', weight: 8 }
    ],
    DE: [
      { keyword: 'SAP', type: 'company', weight: 10 },
      { keyword: 'Siemens', type: 'company', weight: 9 },
      { keyword: 'BMW', type: 'company', weight: 8 },
      { keyword: 'Mercedes', type: 'company', weight: 8 },
      { keyword: 'Berlin', type: 'city', weight: 6 },
      { keyword: 'Munich', type: 'city', weight: 5 },
      { keyword: 'German tech', type: 'technology', weight: 8 },
      { keyword: 'German AI', type: 'technology', weight: 7 }
    ],
    FR: [
      { keyword: 'Dassault', type: 'company', weight: 8 },
      { keyword: 'Thales', type: 'company', weight: 8 },
      { keyword: 'Orange', type: 'company', weight: 7 },
      { keyword: 'Capgemini', type: 'company', weight: 7 },
      { keyword: 'Paris', type: 'city', weight: 6 },
      { keyword: 'French tech', type: 'technology', weight: 8 },
      { keyword: 'French AI', type: 'technology', weight: 7 }
    ],
    GB: [
      { keyword: 'ARM', type: 'company', weight: 9 },
      { keyword: 'DeepMind', type: 'company', weight: 9 },
      { keyword: 'Rolls-Royce', type: 'company', weight: 8 },
      { keyword: 'London', type: 'city', weight: 6 },
      { keyword: 'Cambridge', type: 'city', weight: 5 },
      { keyword: 'British tech', type: 'technology', weight: 8 },
      { keyword: 'UK tech', type: 'technology', weight: 8 }
    ]
  };

  for (const [countryCode, keywords] of Object.entries(countryKeywords)) {
    for (const keywordData of keywords) {
      try {
        await client.query(`
          INSERT INTO country_keywords (country_code, keyword, keyword_type, weight)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (country_code, keyword) DO NOTHING
        `, [countryCode, keywordData.keyword, keywordData.type, keywordData.weight]);
      } catch (error) {
        console.warn(`⚠️ Failed to insert keyword ${keywordData.keyword} for ${countryCode}`);
      }
    }
  }

  console.log('✅ Initial country keywords inserted');
}

/**
 * Store country-specific news article
 */
export async function storeCountryNews(article, countryCode) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO country_news (
        article_id, country_code, country_name, title, description, url,
        source, author, published_at, category, language, relevance_score,
        analysis_score, country_relevance, api_source, provenance, keywords,
        companies_mentioned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (article_id) DO UPDATE SET
        updated_at = NOW(),
        relevance_score = EXCLUDED.relevance_score,
        analysis_score = EXCLUDED.analysis_score,
        country_relevance = EXCLUDED.country_relevance
      RETURNING id
    `;

    const values = [
      article.id,
      countryCode,
      article.country_name || countryCode,
      article.title,
      article.description,
      article.url,
      article.source,
      article.author,
      article.publishedAt,
      article.category || 'technology',
      article.language || 'en',
      article.relScore || 0,
      article.anaScore || 0,
      article.countryRelevance || 0,
      article.apiSource || 'unknown',
      article.provenance || 'country-news-processor',
      JSON.stringify(article.keywords || []),
      JSON.stringify(article.companies || [])
    ];

    const result = await client.query(query, values);
    
    client.release();
    await pool.end();

    return result.rows[0];

  } catch (error) {
    console.error('❌ Failed to store country news:', error.message);
    await pool.end();
    return null;
  }
}

/**
 * Get country-specific news with enhanced filtering
 */
export async function getCountryNews(countryCode, limit = 20, minRelevance = 60) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();

    const query = `
      SELECT 
        article_id as id, title, description, url, source, author,
        published_at as "publishedAt", category, relevance_score as "relScore",
        analysis_score as "anaScore", country_relevance as "countryRelevance",
        api_source as "apiSource", provenance, keywords, companies_mentioned as companies,
        created_at
      FROM country_news
      WHERE country_code = $1 
        AND country_relevance >= $2
        AND published_at >= NOW() - INTERVAL '7 days'
      ORDER BY country_relevance DESC, relevance_score DESC, published_at DESC
      LIMIT $3
    `;

    const result = await client.query(query, [countryCode, minRelevance, limit]);
    
    client.release();
    await pool.end();

    return result.rows.map(row => ({
      ...row,
      keywords: JSON.parse(row.keywords || '[]'),
      companies: JSON.parse(row.companies || '[]')
    }));

  } catch (error) {
    console.error('❌ Failed to get country news:', error.message);
    await pool.end();
    return [];
  }
}

/**
 * Update country news statistics
 */
export async function updateCountryNewsStats(countryCode, stats) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO country_news_stats (
        country_code, date, total_articles, high_relevance_articles,
        unique_sources, avg_relevance_score, api_calls_made
      ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6)
      ON CONFLICT (country_code, date) DO UPDATE SET
        total_articles = EXCLUDED.total_articles,
        high_relevance_articles = EXCLUDED.high_relevance_articles,
        unique_sources = EXCLUDED.unique_sources,
        avg_relevance_score = EXCLUDED.avg_relevance_score,
        api_calls_made = country_news_stats.api_calls_made + EXCLUDED.api_calls_made
    `;

    await client.query(query, [
      countryCode,
      stats.totalArticles || 0,
      stats.highRelevanceArticles || 0,
      stats.uniqueSources || 0,
      stats.avgRelevanceScore || 0,
      stats.apiCallsMade || 0
    ]);

    client.release();
    await pool.end();

    return true;

  } catch (error) {
    console.error('❌ Failed to update country news stats:', error.message);
    await pool.end();
    return false;
  }
}

/**
 * Get country keywords for enhanced filtering
 */
export async function getCountryKeywords(countryCode) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT keyword, keyword_type, weight
      FROM country_keywords
      WHERE country_code = $1 AND is_active = true
      ORDER BY weight DESC, keyword
    `, [countryCode]);

    client.release();
    await pool.end();

    return result.rows;

  } catch (error) {
    console.error('❌ Failed to get country keywords:', error.message);
    await pool.end();
    return [];
  }
}