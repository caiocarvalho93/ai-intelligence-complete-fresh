/**
 * 🧠 QUANTUM INTELLIGENCE CACHE SYSTEM
 * Stores Alpha Vantage intelligence data in PostgreSQL for weekly updates
 */

import pg from 'pg';

const { Pool } = pg;

// Use Railway PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 🗄️ CREATE QUANTUM INTELLIGENCE TABLE
export async function createQuantumIntelligenceTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS quantum_intelligence (
      id SERIAL PRIMARY KEY,
      country_code VARCHAR(3) NOT NULL UNIQUE,
      country_name VARCHAR(100) NOT NULL,
      flag VARCHAR(10) NOT NULL,
      
      -- 🧠 CONSCIOUSNESS METRICS
      consciousness DECIMAL(5,2) NOT NULL,
      transcendence DECIMAL(5,2) NOT NULL,
      neural_activity DECIMAL(5,2) NOT NULL,
      quantum_supremacy DECIMAL(5,2) NOT NULL,
      singularity_proximity DECIMAL(5,2) NOT NULL,
      innovation_index DECIMAL(5,2) NOT NULL,
      
      -- 📈 MARKET INTELLIGENCE
      market_sentiment VARCHAR(50) NOT NULL,
      crypto_correlation DECIMAL(5,2),
      economic_impact DECIMAL(5,2),
      
      -- 🏢 COMPANY DATA
      ai_companies JSONB NOT NULL,
      focus VARCHAR(200) NOT NULL,
      exchanges JSONB NOT NULL,
      stock_analysis JSONB,
      sector_analysis JSONB,
      
      -- 🌟 BREAKTHROUGH DATA
      breakthroughs JSONB NOT NULL,
      total_breakthroughs INTEGER DEFAULT 0,
      
      -- 📊 METADATA
      data_sources JSONB NOT NULL,
      raw_intelligence JSONB NOT NULL,
      
      -- ⏰ CACHE MANAGEMENT
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      is_fresh BOOLEAN DEFAULT true,
      
      -- 🔍 INDEXES
      CONSTRAINT unique_country UNIQUE(country_code)
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_quantum_country ON quantum_intelligence(country_code);
    CREATE INDEX IF NOT EXISTS idx_quantum_fresh ON quantum_intelligence(is_fresh);
    CREATE INDEX IF NOT EXISTS idx_quantum_expires ON quantum_intelligence(expires_at);
    
    -- Create update trigger
    CREATE OR REPLACE FUNCTION update_quantum_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS quantum_update_trigger ON quantum_intelligence;
    CREATE TRIGGER quantum_update_trigger
      BEFORE UPDATE ON quantum_intelligence
      FOR EACH ROW
      EXECUTE FUNCTION update_quantum_timestamp();
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Quantum intelligence table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create quantum intelligence table:', error);
    throw error;
  }
}

// 💾 STORE QUANTUM INTELLIGENCE DATA
export async function storeQuantumIntelligence(countryCode, intelligenceData) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

  const insertQuery = `
    INSERT INTO quantum_intelligence (
      country_code, country_name, flag,
      consciousness, transcendence, neural_activity, quantum_supremacy,
      singularity_proximity, innovation_index, market_sentiment,
      crypto_correlation, economic_impact,
      ai_companies, focus, exchanges, stock_analysis, sector_analysis,
      breakthroughs, total_breakthroughs,
      data_sources, raw_intelligence, expires_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
    )
    ON CONFLICT (country_code) 
    DO UPDATE SET
      country_name = EXCLUDED.country_name,
      flag = EXCLUDED.flag,
      consciousness = EXCLUDED.consciousness,
      transcendence = EXCLUDED.transcendence,
      neural_activity = EXCLUDED.neural_activity,
      quantum_supremacy = EXCLUDED.quantum_supremacy,
      singularity_proximity = EXCLUDED.singularity_proximity,
      innovation_index = EXCLUDED.innovation_index,
      market_sentiment = EXCLUDED.market_sentiment,
      crypto_correlation = EXCLUDED.crypto_correlation,
      economic_impact = EXCLUDED.economic_impact,
      ai_companies = EXCLUDED.ai_companies,
      focus = EXCLUDED.focus,
      exchanges = EXCLUDED.exchanges,
      stock_analysis = EXCLUDED.stock_analysis,
      sector_analysis = EXCLUDED.sector_analysis,
      breakthroughs = EXCLUDED.breakthroughs,
      total_breakthroughs = EXCLUDED.total_breakthroughs,
      data_sources = EXCLUDED.data_sources,
      raw_intelligence = EXCLUDED.raw_intelligence,
      expires_at = EXCLUDED.expires_at,
      is_fresh = true,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id;
  `;

  const values = [
    countryCode,
    intelligenceData.countryName,
    intelligenceData.flag,
    parseFloat(intelligenceData.consciousness),
    parseFloat(intelligenceData.transcendence),
    parseFloat(intelligenceData.neuralActivity),
    parseFloat(intelligenceData.quantumSupremacy),
    parseFloat(intelligenceData.singularityProximity),
    parseFloat(intelligenceData.innovationIndex),
    intelligenceData.marketSentiment,
    parseFloat(intelligenceData.cryptoCorrelation || 0),
    parseFloat(intelligenceData.economicImpact || 0),
    JSON.stringify(intelligenceData.aiCompanies),
    intelligenceData.focus,
    JSON.stringify(intelligenceData.exchanges),
    JSON.stringify(intelligenceData.stockAnalysis || {}),
    JSON.stringify(intelligenceData.sectorAnalysis || {}),
    JSON.stringify(intelligenceData.breakthroughs),
    intelligenceData.totalBreakthroughs,
    JSON.stringify(intelligenceData.dataSources),
    JSON.stringify(intelligenceData),
    expiresAt
  ];

  try {
    const result = await pool.query(insertQuery, values);
    console.log(`✅ Quantum intelligence stored for ${countryCode} (expires: ${expiresAt.toISOString()})`);
    return result.rows[0];
  } catch (error) {
    console.error(`❌ Failed to store quantum intelligence for ${countryCode}:`, error);
    throw error;
  }
}

// 🔍 GET CACHED QUANTUM INTELLIGENCE
export async function getCachedQuantumIntelligence(countryCode) {
  const selectQuery = `
    SELECT * FROM quantum_intelligence 
    WHERE country_code = $1 
    AND expires_at > CURRENT_TIMESTAMP 
    AND is_fresh = true
    ORDER BY updated_at DESC 
    LIMIT 1;
  `;

  try {
    const result = await pool.query(selectQuery, [countryCode]);
    
    if (result.rows.length === 0) {
      console.log(`📭 No fresh quantum intelligence found for ${countryCode}`);
      return null;
    }

    const cached = result.rows[0];
    console.log(`✅ Fresh quantum intelligence found for ${countryCode} (updated: ${cached.updated_at})`);
    
    // Transform back to the expected format
    return {
      success: true,
      timestamp: cached.updated_at,
      country: cached.country_code,
      countryName: cached.country_name,
      flag: cached.flag,
      consciousness: cached.consciousness.toString(),
      transcendence: cached.transcendence.toString(),
      neuralActivity: cached.neural_activity.toString(),
      quantumSupremacy: cached.quantum_supremacy.toString(),
      singularityProximity: cached.singularity_proximity.toString(),
      innovationIndex: cached.innovation_index.toString(),
      marketSentiment: cached.market_sentiment,
      cryptoCorrelation: cached.crypto_correlation?.toString(),
      economicImpact: cached.economic_impact?.toString(),
      aiCompanies: cached.ai_companies,
      focus: cached.focus,
      exchanges: cached.exchanges,
      stockAnalysis: cached.stock_analysis,
      sectorAnalysis: cached.sector_analysis,
      breakthroughs: cached.breakthroughs,
      totalBreakthroughs: cached.total_breakthroughs,
      dataSources: cached.data_sources,
      cached: true,
      cacheAge: Math.floor((new Date() - new Date(cached.updated_at)) / (1000 * 60 * 60)), // hours
      expiresIn: Math.floor((new Date(cached.expires_at) - new Date()) / (1000 * 60 * 60 * 24)) // days
    };
  } catch (error) {
    console.error(`❌ Failed to get cached quantum intelligence for ${countryCode}:`, error);
    return null;
  }
}

// 🔄 REFRESH EXPIRED INTELLIGENCE
export async function getExpiredIntelligenceCountries() {
  const selectQuery = `
    SELECT country_code, country_name, updated_at, expires_at
    FROM quantum_intelligence 
    WHERE expires_at <= CURRENT_TIMESTAMP OR is_fresh = false
    ORDER BY updated_at ASC;
  `;

  try {
    const result = await pool.query(selectQuery);
    console.log(`🔄 Found ${result.rows.length} countries needing intelligence refresh`);
    return result.rows;
  } catch (error) {
    console.error('❌ Failed to get expired intelligence:', error);
    return [];
  }
}

// 📊 GET INTELLIGENCE CACHE STATUS
export async function getIntelligenceCacheStatus() {
  const statusQuery = `
    SELECT 
      COUNT(*) as total_countries,
      COUNT(CASE WHEN expires_at > CURRENT_TIMESTAMP AND is_fresh = true THEN 1 END) as fresh_countries,
      COUNT(CASE WHEN expires_at <= CURRENT_TIMESTAMP OR is_fresh = false THEN 1 END) as expired_countries,
      MIN(updated_at) as oldest_update,
      MAX(updated_at) as newest_update
    FROM quantum_intelligence;
  `;

  try {
    const result = await pool.query(statusQuery);
    const status = result.rows[0];
    
    console.log(`📊 Quantum Intelligence Cache Status:
      Total Countries: ${status.total_countries}
      Fresh: ${status.fresh_countries}
      Expired: ${status.expired_countries}
      Oldest Update: ${status.oldest_update}
      Newest Update: ${status.newest_update}
    `);
    
    return status;
  } catch (error) {
    console.error('❌ Failed to get cache status:', error);
    return null;
  }
}

// 🧹 CLEANUP OLD INTELLIGENCE DATA
export async function cleanupOldIntelligence() {
  const cleanupQuery = `
    DELETE FROM quantum_intelligence 
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
  `;

  try {
    const result = await pool.query(cleanupQuery);
    console.log(`🧹 Cleaned up ${result.rowCount} old intelligence records`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Failed to cleanup old intelligence:', error);
    return 0;
  }
}