// 🧠💾 ENHANCED AI ANALYTICS DATABASE - Brand New Tables
// COMPLETELY SEPARATE from existing database tables
import pg from 'pg';

const { Pool } = pg;

// Create connection pool lazily
let pool = null;

function getPool() {
  if (!pool) {
    // Use hardcoded connection to avoid interfering with existing systems
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:ylQFKAOHIAJlNvOciiXAPbFuPThxzTxX@ballast.proxy.rlwy.net:49633/railway';
    pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 3, // Limit connections to avoid interference
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

/**
 * Initialize Enhanced AI Analytics tables - BRAND NEW SCHEMA
 */
export async function initializeEnhancedAnalyticsTables() {
  try {
    console.log('🏗️ Creating Enhanced AI Analytics tables (BRAND NEW - NON-INTERFERING)...');
    
    // Test connection first without interfering with main system
    const testClient = await getPool().connect();
    await testClient.query('SELECT 1');
    testClient.release();
    
    const client = await getPool().connect();
    
    // Smart Translation Cache table - SAVES MONEY!
    await client.query(`
      CREATE TABLE IF NOT EXISTS smart_translation_cache (
        id SERIAL PRIMARY KEY,
        original_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        source_language VARCHAR(10) NOT NULL,
        target_language VARCHAR(10) NOT NULL,
        confidence DECIMAL(4,3) DEFAULT 0.95,
        usage_count INTEGER DEFAULT 1,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        api_source VARCHAR(50) DEFAULT 'public_api',
        UNIQUE(original_text, source_language, target_language)
      )
    `);
    
    // Create indexes for fast cache lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_lookup 
      ON smart_translation_cache(original_text, source_language, target_language)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_popularity 
      ON smart_translation_cache(usage_count DESC, last_used DESC)
    `);
    
    // Enhanced Country Analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS enhanced_country_analytics (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        analysis_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        economic_data JSONB NOT NULL,
        job_market_data JSONB NOT NULL,
        impact_metrics JSONB NOT NULL,
        ai_insights JSONB NOT NULL,
        data_quality JSONB,
        recommendations JSONB,
        fred_data_available BOOLEAN DEFAULT FALSE,
        job_api_data_available BOOLEAN DEFAULT FALSE,
        openai_analysis_available BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Economic Indicators History table
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_indicators_history (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        indicator_type VARCHAR(50) NOT NULL,
        indicator_value DECIMAL(15,4),
        indicator_date DATE,
        fred_series_id VARCHAR(50),
        data_source VARCHAR(50) DEFAULT 'FRED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Job Market Trends table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_market_trends (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        job_category VARCHAR(50) NOT NULL,
        total_jobs INTEGER DEFAULT 0,
        average_salary DECIMAL(12,2),
        top_companies JSONB,
        locations JSONB,
        trend_direction VARCHAR(20),
        analysis_date DATE DEFAULT CURRENT_DATE,
        data_source VARCHAR(50) DEFAULT 'job_search_api',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // AI Impact Metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_impact_metrics (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        ai_adoption_score INTEGER DEFAULT 0,
        job_displacement_risk INTEGER DEFAULT 0,
        opportunity_index INTEGER DEFAULT 0,
        economic_resilience INTEGER DEFAULT 0,
        skill_demand_shift INTEGER DEFAULT 0,
        overall_impact_score INTEGER DEFAULT 0,
        metric_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // OpenAI Analysis Cache table
    await client.query(`
      CREATE TABLE IF NOT EXISTS openai_analysis_cache (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        analysis_type VARCHAR(50) NOT NULL,
        prompt_hash VARCHAR(64) NOT NULL,
        analysis_content TEXT,
        tokens_used INTEGER,
        model_used VARCHAR(50) DEFAULT 'gpt-4',
        cache_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_enhanced_analytics_country_date 
      ON enhanced_country_analytics(country_code, analysis_timestamp DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_economic_indicators_country_type 
      ON economic_indicators_history(country_code, indicator_type, indicator_date DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_trends_country_category 
      ON job_market_trends(country_code, job_category, analysis_date DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_metrics_country_date 
      ON ai_impact_metrics(country_code, metric_date DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_openai_cache_country_type 
      ON openai_analysis_cache(country_code, analysis_type, cache_expires_at)
    `);
    
    client.release();
    console.log('✅ Enhanced AI Analytics tables created successfully (BRAND NEW SCHEMA)');
    
  } catch (error) {
    console.error('❌ Failed to create Enhanced AI Analytics tables:', error.message);
    throw error;
  }
}

/**
 * Store enhanced country analysis
 */
export async function storeEnhancedCountryAnalysis(countryCode, analysisData) {
  try {
    const client = await getPool().connect();
    
    const query = `
      INSERT INTO enhanced_country_analytics (
        country_code, economic_data, job_market_data, impact_metrics, 
        ai_insights, data_quality, recommendations,
        fred_data_available, job_api_data_available, openai_analysis_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    
    const values = [
      countryCode.toUpperCase(),
      JSON.stringify(analysisData.economicData),
      JSON.stringify(analysisData.jobMarketData),
      JSON.stringify(analysisData.impactMetrics),
      JSON.stringify(analysisData.aiInsights),
      JSON.stringify(analysisData.dataQuality),
      JSON.stringify(analysisData.recommendations),
      analysisData.economicData && Object.keys(analysisData.economicData).length > 0,
      analysisData.jobMarketData && Object.keys(analysisData.jobMarketData).length > 0,
      !!(analysisData.aiInsights && analysisData.aiInsights.phase1)
    ];
    
    const result = await client.query(query, values);
    client.release();
    
    console.log(`✅ Enhanced analysis stored for ${countryCode.toUpperCase()}`);
    return { success: true, id: result.rows[0].id };
    
  } catch (error) {
    console.error('❌ Failed to store enhanced analysis:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Store economic indicators history
 */
export async function storeEconomicIndicators(countryCode, economicData) {
  try {
    const client = await getPool().connect();
    
    for (const [indicatorType, data] of Object.entries(economicData)) {
      if (data.current !== undefined) {
        const query = `
          INSERT INTO economic_indicators_history (
            country_code, indicator_type, indicator_value, 
            indicator_date, fred_series_id
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT DO NOTHING
        `;
        
        const values = [
          countryCode.toUpperCase(),
          indicatorType,
          data.current,
          data.lastUpdated || new Date().toISOString().split('T')[0],
          data.seriesId || null
        ];
        
        await client.query(query, values);
      }
    }
    
    client.release();
    console.log(`✅ Economic indicators stored for ${countryCode.toUpperCase()}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to store economic indicators:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Store job market trends
 */
export async function storeJobMarketTrends(countryCode, jobMarketData) {
  try {
    const client = await getPool().connect();
    
    for (const [category, data] of Object.entries(jobMarketData)) {
      const query = `
        INSERT INTO job_market_trends (
          country_code, job_category, total_jobs, average_salary,
          top_companies, locations, trend_direction
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `;
      
      const values = [
        countryCode.toUpperCase(),
        category,
        data.totalJobs || 0,
        data.averageSalary || 0,
        JSON.stringify(data.topCompanies || []),
        JSON.stringify(data.locations || []),
        data.trends || 'stable'
      ];
      
      await client.query(query, values);
    }
    
    client.release();
    console.log(`✅ Job market trends stored for ${countryCode.toUpperCase()}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to store job market trends:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Store AI impact metrics
 */
export async function storeAIImpactMetrics(countryCode, metrics) {
  try {
    const client = await getPool().connect();
    
    const query = `
      INSERT INTO ai_impact_metrics (
        country_code, ai_adoption_score, job_displacement_risk,
        opportunity_index, economic_resilience, skill_demand_shift,
        overall_impact_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    
    const overallScore = Math.round(
      (metrics.aiAdoptionScore + metrics.opportunityIndex + metrics.economicResilience + 
       (100 - metrics.jobDisplacementRisk) + metrics.skillDemandShift) / 5
    );
    
    const values = [
      countryCode.toUpperCase(),
      metrics.aiAdoptionScore || 0,
      metrics.jobDisplacementRisk || 0,
      metrics.opportunityIndex || 0,
      metrics.economicResilience || 0,
      metrics.skillDemandShift || 0,
      overallScore
    ];
    
    const result = await client.query(query, values);
    client.release();
    
    console.log(`✅ AI impact metrics stored for ${countryCode.toUpperCase()}`);
    return { success: true, id: result.rows[0]?.id };
    
  } catch (error) {
    console.error('❌ Failed to store AI impact metrics:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get latest enhanced analysis for country
 */
export async function getLatestEnhancedAnalysis(countryCode) {
  try {
    const client = await getPool().connect();
    
    const query = `
      SELECT * FROM enhanced_country_analytics 
      WHERE country_code = $1 
      ORDER BY analysis_timestamp DESC 
      LIMIT 1
    `;
    
    const result = await client.query(query, [countryCode.toUpperCase()]);
    client.release();
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        ...row,
        economic_data: typeof row.economic_data === 'string' ? JSON.parse(row.economic_data) : row.economic_data,
        job_market_data: typeof row.job_market_data === 'string' ? JSON.parse(row.job_market_data) : row.job_market_data,
        impact_metrics: typeof row.impact_metrics === 'string' ? JSON.parse(row.impact_metrics) : row.impact_metrics,
        ai_insights: typeof row.ai_insights === 'string' ? JSON.parse(row.ai_insights) : row.ai_insights,
        data_quality: typeof row.data_quality === 'string' ? JSON.parse(row.data_quality) : row.data_quality,
        recommendations: typeof row.recommendations === 'string' ? JSON.parse(row.recommendations) : row.recommendations
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Failed to get enhanced analysis:', error.message);
    return null;
  }
}

/**
 * Get economic indicators history
 */
export async function getEconomicIndicatorsHistory(countryCode, days = 90) {
  try {
    const client = await getPool().connect();
    
    const query = `
      SELECT * FROM economic_indicators_history 
      WHERE country_code = $1 AND indicator_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY indicator_date DESC, indicator_type
    `;
    
    const result = await client.query(query, [countryCode.toUpperCase()]);
    client.release();
    
    return result.rows;
    
  } catch (error) {
    console.error('❌ Failed to get economic indicators history:', error.message);
    return [];
  }
}

/**
 * Get AI impact metrics history
 */
export async function getAIImpactMetricsHistory(countryCode, days = 30) {
  try {
    const client = await getPool().connect();
    
    const query = `
      SELECT * FROM ai_impact_metrics 
      WHERE country_code = $1 AND metric_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY metric_date DESC
    `;
    
    const result = await client.query(query, [countryCode.toUpperCase()]);
    client.release();
    
    return result.rows;
    
  } catch (error) {
    console.error('❌ Failed to get AI impact metrics history:', error.message);
    return [];
  }
}

export default {
  initializeEnhancedAnalyticsTables,
  storeEnhancedCountryAnalysis,
  storeEconomicIndicators,
  storeJobMarketTrends,
  storeAIImpactMetrics,
  getLatestEnhancedAnalysis,
  getEconomicIndicatorsHistory,
  getAIImpactMetricsHistory
};

/**
 * 💰 SMART TRANSLATION CACHE METHODS - SAVE MONEY ON OPENAI CALLS
 */

/**
 * Find existing translation in cache
 */
export async function findTranslation(originalText, sourceLanguage, targetLanguage) {
  try {
    const client = await getPool().connect();
    
    const result = await client.query(`
      UPDATE smart_translation_cache 
      SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP
      WHERE original_text = $1 AND source_language = $2 AND target_language = $3
      RETURNING translated_text, confidence, created_at, usage_count
    `, [originalText, sourceLanguage, targetLanguage]);
    
    client.release();
    
    if (result.rows.length > 0) {
      console.log('💚 Cache HIT - Saved OpenAI call!');
      return result.rows[0];
    }
    
    return null;
  } catch (error) {
    console.error('Find translation error:', error);
    return null;
  }
}

/**
 * Store new translation in cache
 */
export async function storeTranslation(translationData) {
  try {
    const client = await getPool().connect();
    
    // Use UPSERT to handle duplicates
    await client.query(`
      INSERT INTO smart_translation_cache 
      (original_text, translated_text, source_language, target_language, confidence, api_source)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (original_text, source_language, target_language)
      DO UPDATE SET 
        usage_count = smart_translation_cache.usage_count + 1,
        last_used = CURRENT_TIMESTAMP
    `, [
      translationData.originalText,
      translationData.translatedText,
      translationData.sourceLanguage,
      translationData.targetLanguage,
      translationData.confidence || 0.95,
      translationData.apiSource || 'public_api'
    ]);
    
    client.release();
    console.log('💾 Translation stored in cache for future use');
    return true;
  } catch (error) {
    console.error('Store translation error:', error);
    return false;
  }
}

/**
 * Get popular translations for preloading
 */
export async function getPopularTranslations(limit = 1000) {
  try {
    const client = await getPool().connect();
    
    const result = await client.query(`
      SELECT original_text, translated_text, source_language, target_language, confidence, created_at
      FROM smart_translation_cache
      ORDER BY usage_count DESC, last_used DESC
      LIMIT $1
    `, [limit]);
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Get popular translations error:', error);
    return [];
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStatistics() {
  try {
    const client = await getPool().connect();
    
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_cached_translations,
        SUM(usage_count) as total_cache_hits,
        AVG(confidence) as average_confidence,
        COUNT(DISTINCT source_language || '-' || target_language) as language_pairs
      FROM smart_translation_cache
    `);
    
    const popular = await client.query(`
      SELECT source_language, target_language, COUNT(*) as count
      FROM smart_translation_cache
      GROUP BY source_language, target_language
      ORDER BY count DESC
      LIMIT 10
    `);
    
    client.release();
    
    return {
      overview: stats.rows[0],
      popularPairs: popular.rows
    };
  } catch (error) {
    console.error('Get cache statistics error:', error);
    return null;
  }
}