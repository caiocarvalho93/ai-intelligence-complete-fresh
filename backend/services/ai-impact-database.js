// 🧠💾 AI IMPACT ANALYTICS DATABASE - New System
import pg from 'pg';

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Initialize AI Impact Analytics tables
 */
export async function initializeAIImpactTables() {
  try {
    console.log('🏗️ Creating AI Impact Analytics tables...');
    
    const client = await pool.connect();
    
    // AI Impact Analysis Results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_impact_analysis (
        id SERIAL PRIMARY KEY,
        country VARCHAR(10) NOT NULL,
        analysis_data JSONB NOT NULL,
        impact_score INTEGER,
        opportunity_score INTEGER,
        total_jobs_analyzed INTEGER,
        ai_related_jobs INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // AI Market Trends table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_market_trends (
        id SERIAL PRIMARY KEY,
        country VARCHAR(10) NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        ai_jobs_count INTEGER,
        traditional_jobs_count INTEGER,
        average_ai_salary DECIMAL(10,2),
        top_companies JSONB,
        emerging_roles JSONB,
        trend_direction VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_impact_country_date 
      ON ai_impact_analysis(country, created_at DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_trends_country_date 
      ON ai_market_trends(country, date DESC)
    `);
    
    client.release();
    console.log('✅ AI Impact Analytics tables created successfully');
    
  } catch (error) {
    console.error('❌ Failed to create AI Impact Analytics tables:', error.message);
    throw error;
  }
}

/**
 * Store AI impact analysis results
 */
export async function storeAIImpactAnalysis(country, analysisData) {
  try {
    const client = await pool.connect();
    
    const query = `
      INSERT INTO ai_impact_analysis (
        country, analysis_data, impact_score, opportunity_score, 
        total_jobs_analyzed, ai_related_jobs
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (country) DO UPDATE SET
        analysis_data = $2,
        impact_score = $3,
        opportunity_score = $4,
        total_jobs_analyzed = $5,
        ai_related_jobs = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;
    
    const values = [
      country.toUpperCase(),
      JSON.stringify(analysisData),
      analysisData.summary?.impactScore || 0,
      analysisData.summary?.opportunityScore || 0,
      analysisData.summary?.totalJobsAnalyzed || 0,
      analysisData.summary?.aiRelatedJobs || 0
    ];
    
    const result = await client.query(query, values);
    client.release();
    
    console.log(`✅ AI impact analysis stored for ${country.toUpperCase()}`);
    return { success: true, id: result.rows[0].id };
    
  } catch (error) {
    console.error('❌ Failed to store AI impact analysis:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Store market trends data
 */
export async function storeMarketTrends(country, trendsData) {
  try {
    const client = await pool.connect();
    
    const query = `
      INSERT INTO ai_market_trends (
        country, ai_jobs_count, traditional_jobs_count, 
        average_ai_salary, top_companies, emerging_roles, trend_direction
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const values = [
      country.toUpperCase(),
      trendsData.aiJobs || 0,
      trendsData.traditionalJobs || 0,
      trendsData.salaryAnalysis?.averageAISalary || 0,
      JSON.stringify(trendsData.topCompanies || []),
      JSON.stringify(trendsData.jobTrends?.emergingRoles || []),
      trendsData.jobTrends?.aiGrowth || 'unknown'
    ];
    
    const result = await client.query(query, values);
    client.release();
    
    console.log(`✅ Market trends stored for ${country.toUpperCase()}`);
    return { success: true, id: result.rows[0].id };
    
  } catch (error) {
    console.error('❌ Failed to store market trends:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get latest AI impact analysis for country
 */
export async function getLatestAIImpactAnalysis(country) {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT * FROM ai_impact_analysis 
      WHERE country = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const result = await client.query(query, [country.toUpperCase()]);
    client.release();
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        ...row,
        analysis_data: typeof row.analysis_data === 'string' 
          ? JSON.parse(row.analysis_data) 
          : row.analysis_data
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Failed to get AI impact analysis:', error.message);
    return null;
  }
}

/**
 * Get AI market trends history
 */
export async function getAIMarketTrends(country, days = 30) {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT * FROM ai_market_trends 
      WHERE country = $1 AND date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY date DESC
    `;
    
    const result = await client.query(query, [country.toUpperCase()]);
    client.release();
    
    return result.rows.map(row => ({
      ...row,
      top_companies: typeof row.top_companies === 'string' 
        ? JSON.parse(row.top_companies) 
        : row.top_companies,
      emerging_roles: typeof row.emerging_roles === 'string' 
        ? JSON.parse(row.emerging_roles) 
        : row.emerging_roles
    }));
    
  } catch (error) {
    console.error('❌ Failed to get market trends:', error.message);
    return [];
  }
}

export default {
  initializeAIImpactTables,
  storeAIImpactAnalysis,
  storeMarketTrends,
  getLatestAIImpactAnalysis,
  getAIMarketTrends
};