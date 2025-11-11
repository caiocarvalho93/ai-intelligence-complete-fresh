// Enhanced Country-Specific News Processor - 100% REAL API DATA ONLY
// CRITICAL RULE: NEVER generate, modify, or create fake news content
// ALL data must come from real API sources: NewsAPI, NewsData.io

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import GrokCountryIntelligence from './grok-country-intelligence.js';

dotenv.config();

/**
 * Country-specific news configuration with local tech keywords and sources
 * ONLY used for filtering REAL API data - NEVER for generating content
 */
const COUNTRY_CONFIG = {
  KR: {
    name: 'South Korea',
    keywords: ['Samsung', 'LG', 'SK Hynix', 'Naver', 'Kakao', 'NCSOFT', 'Nexon',
               'Korean tech', 'Seoul', 'Busan', 'K-tech', 'chaebol', 'Korean AI',
               'Korean startup', 'Korean innovation', 'Korean semiconductor'],
    language: 'en',
    category: 'technology'
  },
  JP: {
    name: 'Japan',
    keywords: ['Sony', 'Nintendo', 'Toyota', 'Honda', 'Panasonic', 'Toshiba', 'Fujitsu',
               'Japanese tech', 'Tokyo', 'Osaka', 'J-tech', 'Japanese AI', 'robotics Japan',
               'Japanese startup', 'Japanese innovation', 'SoftBank', 'Rakuten'],
    language: 'en',
    category: 'technology'
  },
  CN: {
    name: 'China',
    keywords: ['Alibaba', 'Tencent', 'Baidu', 'Huawei', 'Xiaomi', 'ByteDance', 'TikTok',
               'Chinese tech', 'Beijing', 'Shanghai', 'Shenzhen', 'Chinese AI', 'WeChat',
               'Chinese startup', 'Chinese innovation', 'Ant Group', 'JD.com', 'Didi'],
    language: 'en',
    category: 'technology'
  },
  DE: {
    name: 'Germany',
    keywords: ['SAP', 'Siemens', 'BMW', 'Mercedes', 'Volkswagen', 'Bosch', 'ASML',
               'German tech', 'Berlin', 'Munich', 'Hamburg', 'German AI', 'Industry 4.0',
               'German startup', 'German innovation', 'Deutsche Telekom', 'Infineon'],
    language: 'en',
    category: 'technology'
  },
  FR: {
    name: 'France',
    keywords: ['Dassault', 'Thales', 'Orange', 'Capgemini', 'Atos', 'Ubisoft', 'Criteo',
               'French tech', 'Paris', 'Lyon', 'Toulouse', 'French AI', 'Station F',
               'French startup', 'French innovation', 'BlaBlaCar', 'Doctolib'],
    language: 'en',
    category: 'technology'
  },
  GB: {
    name: 'United Kingdom',
    keywords: ['ARM', 'DeepMind', 'Rolls-Royce', 'BAE Systems', 'Vodafone', 'BT Group',
               'British tech', 'London', 'Cambridge', 'Oxford', 'UK tech', 'British AI',
               'UK startup', 'British innovation', 'Revolut', 'Monzo', 'Deliveroo'],
    language: 'en',
    category: 'technology'
  },
  IN: {
    name: 'India',
    keywords: ['Infosys', 'TCS', 'Wipro', 'Flipkart', 'Paytm', 'Ola', 'Zomato',
               'Indian tech', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Indian AI',
               'Indian startup', 'Indian innovation', 'BYJU\'S', 'Swiggy', 'PhonePe'],
    language: 'en',
    category: 'technology'
  },
  CA: {
    name: 'Canada',
    keywords: ['Shopify', 'BlackBerry', 'Bombardier', 'Nortel', 'Element AI', 'Cohere',
               'Canadian tech', 'Toronto', 'Vancouver', 'Montreal', 'Canadian AI',
               'Canadian startup', 'Canadian innovation', 'Wealthsimple', 'Hootsuite'],
    language: 'en',
    category: 'technology'
  },
  AU: {
    name: 'Australia',
    keywords: ['Atlassian', 'Canva', 'Afterpay', 'Xero', 'REA Group', 'Seek',
               'Australian tech', 'Sydney', 'Melbourne', 'Brisbane', 'Australian AI',
               'Australian startup', 'Australian innovation', 'Zip Co', 'WiseTech'],
    language: 'en',
    category: 'technology'
  }
};

/**
 * Enhanced Country News Processor Class - 100% REAL API DATA ONLY
 */
export class EnhancedCountryNewsProcessor {
  constructor() {
    this.apiKey = process.env.NEWSDATA_API_KEY;
    this.newsApiKey = process.env.NEWS_API_KEY; // Primary NewsAPI key
    this.fallbackKey = process.env.NEWS_API_KEY_FALLBACK;
    this.requestCount = 0;
    this.maxRequestsPerMinute = 10;
    this.grokIntelligence = new GrokCountryIntelligence();
    
    console.log(`🔑 API Keys Status:`);
    console.log(`   NewsData.io: ${this.apiKey ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`   NewsAPI Primary: ${this.newsApiKey ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`   NewsAPI Fallback: ${this.fallbackKey ? 'CONFIGURED' : 'MISSING'}`);
  }

  /**
   * Get country-specific tech news - 100% REAL API DATA ONLY
   */
  async getCountrySpecificNews(countryCode, limit = 5) {
    const country = countryCode.toUpperCase();
    const config = COUNTRY_CONFIG[country];
    
    // 🧠 GROK INTELLIGENCE: Analyze software state before proceeding
    const grokGuidance = await this.grokIntelligence.analyzeSoftwareAndProvideGuidance('fetch_country_news', {
      country,
      limit,
      hasConfig: !!config,
      apiKeysAvailable: {
        newsData: !!this.apiKey,
        newsApi: !!this.newsApiKey,
        fallback: !!this.fallbackKey
      }
    });
    
    console.log(`🧠 Grok guidance for ${country}:`, grokGuidance.recommendations?.slice(0, 2));
    
    console.log(`🔍 Fetching REAL API data for ${country}...`);
    
    if (!config) {
      console.log(`⚠️ No config for ${country}, trying generic real API data...`);
      return await this.getGenericTechNewsFromAPI(country, limit);
    }

    try {
      // Try multiple REAL API sources
      const results = await Promise.allSettled([
        this.fetchFromNewsDataIO(country, config, limit),
        this.fetchFromNewsAPI(country, config, limit)
      ]);

      // Combine REAL API results only
      const allArticles = [];
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
          allArticles.push(...result.value);
        }
      });

      if (allArticles.length === 0) {
        console.log(`⚠️ No real API data found for ${country}`);
        return [];
      }

      // Remove duplicates and filter REAL data only
      const uniqueArticles = this.deduplicateRealArticles(allArticles, config);

      console.log(`✅ Found ${uniqueArticles.length} real articles for ${country}`);
      return uniqueArticles.slice(0, limit);

    } catch (error) {
      console.error(`❌ Error fetching REAL data for ${country}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch from NewsData.io - 100% REAL API DATA ONLY
   */
  async fetchFromNewsDataIO(countryCode, config, limit) {
    if (!this.apiKey) {
      console.log(`⚠️ NewsData.io API key not configured`);
      return [];
    }

    try {
      // Try multiple REAL query strategies
      const queries = [
        this.buildCountryQuery(config),
        `${config.keywords[0]} AND technology`,
        `"${config.name}" AND (AI OR tech OR innovation)`
      ];

      for (const query of queries) {
        try {
          const url = `https://newsdata.io/api/1/latest?apikey=${this.apiKey}&q=${encodeURIComponent(query)}&language=${config.language}&category=${config.category}&size=${Math.min(limit * 2, 10)}`;
          
          console.log(`📡 NewsData.io REAL API query for ${config.name}: ${query}`);
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'error') {
            console.warn(`⚠️ NewsData.io query failed: ${data.message}`);
            continue;
          }

          if (data.results && data.results.length > 0) {
            console.log(`✅ NewsData.io REAL data: ${data.results.length} articles for ${config.name}`);
            
            // Return REAL API data - NEVER MODIFIED
            return data.results.map(article => ({
              id: `newsdata-${countryCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: article.title, // REAL API DATA - NEVER MODIFIED
              description: article.description, // REAL API DATA - NEVER MODIFIED
              url: article.link, // REAL API DATA - NEVER MODIFIED
              source: article.source_id || 'NewsData.io', // REAL API DATA - NEVER MODIFIED
              author: article.creator ? article.creator[0] : null, // REAL API DATA - NEVER MODIFIED
              publishedAt: article.pubDate, // REAL API DATA - NEVER MODIFIED
              country: countryCode,
              category: 'technology',
              relScore: this.calculateRelevanceScore(article, config),
              anaScore: this.calculateAnalysisScore(article, config),
              provenance: 'newsdata-real-api'
            }));
          }
        } catch (queryError) {
          console.warn(`⚠️ NewsData.io query error: ${queryError.message}`);
          continue;
        }
      }

      return [];
    } catch (error) {
      console.error(`❌ NewsData.io fetch failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch from NewsAPI - 100% REAL API DATA ONLY
   */
  async fetchFromNewsAPI(countryCode, config, limit) {
    const apiKey = this.newsApiKey || this.fallbackKey;
    if (!apiKey) {
      console.log(`⚠️ NewsAPI key not configured`);
      return [];
    }

    try {
      // Try multiple REAL query strategies
      const queries = [
        this.buildCountryQuery(config),
        `${config.keywords[0]} OR ${config.keywords[1]}`,
        `"${config.name}" AND (technology OR AI OR innovation)`
      ];

      for (const query of queries) {
        try {
          const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${config.language}&sortBy=publishedAt&pageSize=${Math.min(limit * 2, 20)}&apiKey=${apiKey}`;
          
          console.log(`📡 NewsAPI REAL API query for ${config.name}: ${query}`);
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'error') {
            console.warn(`⚠️ NewsAPI query failed: ${data.message}`);
            continue;
          }

          if (data.articles && data.articles.length > 0) {
            console.log(`✅ NewsAPI REAL data: ${data.articles.length} articles for ${config.name}`);
            
            // Return REAL API data - NEVER MODIFIED
            return data.articles.map(article => ({
              id: `newsapi-${countryCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: article.title, // REAL API DATA - NEVER MODIFIED
              description: article.description, // REAL API DATA - NEVER MODIFIED
              url: article.url, // REAL API DATA - NEVER MODIFIED
              source: article.source.name, // REAL API DATA - NEVER MODIFIED
              author: article.author, // REAL API DATA - NEVER MODIFIED
              publishedAt: article.publishedAt, // REAL API DATA - NEVER MODIFIED
              country: countryCode,
              category: 'technology',
              relScore: this.calculateRelevanceScore(article, config),
              anaScore: this.calculateAnalysisScore(article, config),
              provenance: 'newsapi-real-api'
            }));
          }
        } catch (queryError) {
          console.warn(`⚠️ NewsAPI query error: ${queryError.message}`);
          continue;
        }
      }

      return [];
    } catch (error) {
      console.error(`❌ NewsAPI fetch failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Build intelligent country-specific query for REAL API calls
   */
  buildCountryQuery(config) {
    const topKeywords = config.keywords.slice(0, 3);
    const techTerms = ['AI', 'artificial intelligence', 'technology', 'innovation'];
    return `(${topKeywords.join(' OR ')}) AND (${techTerms.join(' OR ')})`;
  }

  /**
   * Calculate relevance score based on country-specific keywords
   */
  calculateRelevanceScore(article, config) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    let score = 50;

    config.keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    const techKeywords = ['ai', 'artificial intelligence', 'machine learning', 'technology', 'innovation', 'startup'];
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 5;
      }
    });

    return Math.min(score, 100);
  }

  /**
   * Calculate analysis score based on content quality
   */
  calculateAnalysisScore(article, config) {
    let score = 60;

    if (article.title && article.title.length > 20) score += 10;
    if (article.description && article.description.length > 50) score += 10;

    const reputableSources = ['techcrunch', 'reuters', 'bloomberg', 'venturebeat', 'wired'];
    if (reputableSources.some(source => article.source?.toLowerCase().includes(source))) {
      score += 15;
    }

    const publishedDate = new Date(article.publishedAt);
    const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished <= 1) score += 10;
    else if (daysSincePublished <= 7) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Deduplicate REAL articles only
   */
  deduplicateRealArticles(articles, config) {
    const seen = new Set();
    const unique = [];

    articles.forEach(article => {
      const key = `${article.url}-${article.title?.substring(0, 50)}`;
      if (!seen.has(key) && this.passesQualityFilter(article, config)) {
        seen.add(key);
        unique.push(article);
      }
    });

    return unique.sort((a, b) => {
      const scoreA = (a.relScore || 0) + (a.anaScore || 0);
      const scoreB = (b.relScore || 0) + (b.anaScore || 0);
      return scoreB - scoreA;
    });
  }

  /**
   * Quality filter for REAL articles
   */
  passesQualityFilter(article, config) {
    if (!article.title || !article.description) return false;
    if ((article.relScore || 0) < 60) return false;

    const text = `${article.title} ${article.description}`.toLowerCase();
    const techIndicators = ['tech', 'ai', 'artificial', 'innovation', 'startup', 'digital', 'software', 'hardware'];
    return techIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * Generic tech news from REAL API - NO FALLBACK GENERATION
   */
  async getGenericTechNewsFromAPI(countryCode, limit) {
    console.log(`🔄 Generic REAL API tech news for ${countryCode}`);
    
    // Try NewsAPI first since we have working keys
    const apiKey = this.newsApiKey || this.fallbackKey;
    if (!apiKey) {
      console.log(`⚠️ No API key - returning empty array (NO FAKE DATA)`);
      return [];
    }

    try {
      const query = 'artificial intelligence OR technology OR innovation';
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${Math.min(limit, 20)}&apiKey=${apiKey}`;
      
      console.log(`📡 Generic NewsAPI call: ${query}`);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'error' || !data.articles) {
        console.log(`⚠️ No REAL API data available - returning empty array`);
        return [];
      }

      console.log(`✅ Generic NewsAPI: Found ${data.articles.length} articles`);

      return data.articles.slice(0, limit).map(article => ({
        id: `generic-${countryCode}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: article.title, // REAL API DATA - NEVER MODIFIED
        description: article.description, // REAL API DATA - NEVER MODIFIED
        url: article.url, // REAL API DATA - NEVER MODIFIED
        source: article.source.name, // REAL API DATA - NEVER MODIFIED
        author: article.author, // REAL API DATA - NEVER MODIFIED
        publishedAt: article.publishedAt, // REAL API DATA - NEVER MODIFIED
        country: countryCode,
        category: 'technology',
        relScore: 70,
        anaScore: 65,
        provenance: 'generic-real-api-data'
      }));

    } catch (error) {
      console.error(`❌ Generic REAL API failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Process news for multiple countries - 100% REAL API DATA ONLY
   */
  async processMultipleCountries(countries, articlesPerCountry = 5) {
    console.log(`🌍 Processing REAL API data for ${countries.length} countries...`);
    
    const results = {};
    for (const country of countries) {
      try {
        const articles = await this.getCountrySpecificNews(country, articlesPerCountry);
        results[country] = articles;
        console.log(`✅ ${country}: ${articles.length} REAL articles processed`);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to process ${country}:`, error.message);
        results[country] = [];
      }
    }

    return results;
  }
}

// Export singleton instance
export const enhancedCountryNewsProcessor = new EnhancedCountryNewsProcessor();