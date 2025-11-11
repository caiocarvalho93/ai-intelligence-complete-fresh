// Country News Distributor - Smart filtering from main articles table
// Distributes existing news data to country-specific views without affecting global feed

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Country News Distributor - Filters main articles table intelligently
 */
export class CountryNewsDistributor {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  /**
   * Initialize country-specific materialized views
   */
  async initializeCountryViews() {
    try {
      const client = await this.pool.connect();
      
      console.log('🌍 Creating country-specific materialized views...');

      // Create country filtering function
      await client.query(`
        CREATE OR REPLACE FUNCTION calculate_country_relevance(
          article_title TEXT,
          article_description TEXT,
          target_country VARCHAR(3)
        ) RETURNS INTEGER AS $$
        DECLARE
          relevance_score INTEGER := 0;
          content_text TEXT;
        BEGIN
          content_text := LOWER(COALESCE(article_title, '') || ' ' || COALESCE(article_description, ''));
          
          -- Country-specific keyword matching with weights
          CASE target_country
            WHEN 'KR' THEN
              IF content_text ~ '(samsung|lg|sk hynix|naver|kakao|korean|korea|seoul)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(korean tech|k-tech|korean ai|korean startup)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'JP' THEN
              IF content_text ~ '(sony|nintendo|toyota|honda|softbank|rakuten|japanese|japan|tokyo)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(japanese tech|japanese ai|robotics japan)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'CN' THEN
              IF content_text ~ '(alibaba|tencent|baidu|huawei|xiaomi|bytedance|chinese|china|beijing|shanghai)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(chinese tech|chinese ai|wechat|tiktok)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'DE' THEN
              IF content_text ~ '(sap|siemens|bmw|mercedes|volkswagen|bosch|german|germany|berlin)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(german tech|german ai|industry 4.0)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'FR' THEN
              IF content_text ~ '(dassault|thales|orange|capgemini|ubisoft|french|france|paris)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(french tech|french ai)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'GB' THEN
              IF content_text ~ '(arm|deepmind|rolls-royce|vodafone|british|britain|uk|london|cambridge)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(british tech|uk tech|british ai)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'IN' THEN
              IF content_text ~ '(infosys|tcs|wipro|flipkart|paytm|indian|india|bangalore|mumbai)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(indian tech|indian ai|indian startup)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'CA' THEN
              IF content_text ~ '(shopify|blackberry|canadian|canada|toronto|vancouver)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(canadian tech|canadian ai)' THEN
                relevance_score := relevance_score + 30;
              END IF;
            WHEN 'AU' THEN
              IF content_text ~ '(atlassian|canva|afterpay|australian|australia|sydney|melbourne)' THEN
                relevance_score := relevance_score + 50;
              END IF;
              IF content_text ~ '(australian tech|australian ai)' THEN
                relevance_score := relevance_score + 30;
              END IF;
          END CASE;
          
          -- General tech relevance boost
          IF content_text ~ '(artificial intelligence|ai|technology|innovation|startup|digital)' THEN
            relevance_score := relevance_score + 20;
          END IF;
          
          RETURN LEAST(relevance_score, 100);
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
      `);

      // Create country-specific materialized views
      const countries = ['KR', 'JP', 'CN', 'DE', 'FR', 'GB', 'IN', 'CA', 'AU'];
      
      for (const country of countries) {
        await client.query(`
          DROP MATERIALIZED VIEW IF EXISTS country_news_${country.toLowerCase()};
          
          CREATE MATERIALIZED VIEW country_news_${country.toLowerCase()} AS
          SELECT 
            id,
            title,
            description,
            url,
            source,
            author,
            published_at,
            category,
            rel_score,
            ana_score,
            country,
            provenance,
            calculate_country_relevance(title, description, '${country}') as country_relevance,
            created_at
          FROM articles
          WHERE 
            (
              country = '${country}' OR
              calculate_country_relevance(title, description, '${country}') >= 60 OR
              LOWER(title || ' ' || COALESCE(description, '')) ~ '${this.getCountryPattern(country)}'
            )
            AND published_at >= NOW() - INTERVAL '7 days'
            AND (category = 'technology' OR category = 'ai' OR category IS NULL)
          ORDER BY 
            country_relevance DESC,
            published_at DESC,
            rel_score DESC
          LIMIT 50;
        `);

        // Create index for performance
        await client.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_country_news_${country.toLowerCase()}_id 
          ON country_news_${country.toLowerCase()}(id);
        `);

        console.log(`✅ Created materialized view for ${country}`);
      }

      // Create refresh function
      await client.query(`
        CREATE OR REPLACE FUNCTION refresh_country_views() RETURNS VOID AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_kr;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_jp;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_cn;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_de;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_fr;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_gb;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_in;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_ca;
          REFRESH MATERIALIZED VIEW CONCURRENTLY country_news_au;
        END;
        $$ LANGUAGE plpgsql;
      `);

      client.release();
      console.log('✅ Country-specific materialized views created successfully!');
      return true;

    } catch (error) {
      console.error('❌ Failed to create country views:', error.message);
      return false;
    }
  }

  /**
   * Get country-specific pattern for regex matching
   */
  getCountryPattern(country) {
    const patterns = {
      KR: '(samsung|lg|sk hynix|naver|kakao|korean|korea|seoul|busan)',
      JP: '(sony|nintendo|toyota|honda|softbank|rakuten|japanese|japan|tokyo|osaka)',
      CN: '(alibaba|tencent|baidu|huawei|xiaomi|bytedance|chinese|china|beijing|shanghai)',
      DE: '(sap|siemens|bmw|mercedes|volkswagen|bosch|german|germany|berlin|munich)',
      FR: '(dassault|thales|orange|capgemini|ubisoft|french|france|paris|lyon)',
      GB: '(arm|deepmind|rolls-royce|vodafone|british|britain|uk|london|cambridge)',
      IN: '(infosys|tcs|wipro|flipkart|paytm|indian|india|bangalore|mumbai|delhi)',
      CA: '(shopify|blackberry|canadian|canada|toronto|vancouver|montreal)',
      AU: '(atlassian|canva|afterpay|australian|australia|sydney|melbourne)'
    };
    return patterns[country] || country.toLowerCase();
  }

  /**
   * Get country-specific news from materialized view
   */
  async getCountrySpecificNews(countryCode, limit = 20) {
    try {
      const client = await this.pool.connect();
      
      const query = `
        SELECT 
          id, title, description, url, source, author,
          published_at as "publishedAt", category, 
          rel_score as "relScore", ana_score as "anaScore",
          country, provenance, country_relevance as "countryRelevance",
          created_at
        FROM country_news_${countryCode.toLowerCase()}
        ORDER BY country_relevance DESC, published_at DESC
        LIMIT $1
      `;

      const result = await client.query(query, [limit]);
      client.release();

      console.log(`✅ Retrieved ${result.rows.length} articles for ${countryCode} from materialized view`);
      return result.rows;

    } catch (error) {
      console.error(`❌ Failed to get country news for ${countryCode}:`, error.message);
      return [];
    }
  }

  /**
   * Refresh country views with latest data
   */
  async refreshCountryViews() {
    try {
      const client = await this.pool.connect();
      
      console.log('🔄 Refreshing country materialized views...');
      await client.query('SELECT refresh_country_views()');
      
      client.release();
      console.log('✅ Country views refreshed successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to refresh country views:', error.message);
      return false;
    }
  }

  /**
   * Get statistics for all country views
   */
  async getCountryViewStats() {
    try {
      const client = await this.pool.connect();
      const countries = ['KR', 'JP', 'CN', 'DE', 'FR', 'GB', 'IN', 'CA', 'AU'];
      const stats = {};

      for (const country of countries) {
        try {
          const result = await client.query(`
            SELECT 
              COUNT(*) as total_articles,
              COUNT(CASE WHEN country_relevance >= 80 THEN 1 END) as high_relevance,
              AVG(country_relevance) as avg_relevance,
              MAX(published_at) as latest_article,
              COUNT(DISTINCT source) as unique_sources
            FROM country_news_${country.toLowerCase()}
          `);

          stats[country] = result.rows[0];
        } catch (error) {
          stats[country] = { error: error.message };
        }
      }

      client.release();
      return stats;

    } catch (error) {
      console.error('❌ Failed to get country view stats:', error.message);
      return {};
    }
  }

  /**
   * Distribute fresh articles to country views
   */
  async distributeLatestArticles() {
    try {
      console.log('📊 Analyzing main articles table for distribution...');
      
      const client = await this.pool.connect();
      
      // Get count of recent articles
      const recentCount = await client.query(`
        SELECT COUNT(*) as count
        FROM articles 
        WHERE published_at >= NOW() - INTERVAL '24 hours'
      `);

      console.log(`📈 Found ${recentCount.rows[0].count} articles from last 24 hours`);

      // Refresh views to include latest articles
      await this.refreshCountryViews();

      // Get updated stats
      const stats = await this.getCountryViewStats();

      client.release();

      return {
        success: true,
        recentArticles: parseInt(recentCount.rows[0].count),
        countryStats: stats,
        message: 'Articles distributed to country views successfully'
      };

    } catch (error) {
      console.error('❌ Failed to distribute articles:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const countryNewsDistributor = new CountryNewsDistributor();