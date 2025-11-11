// Enhanced Multi-Country News Processor - Maximum Country-Specific Coverage
// Uses multiple API strategies and dedicated database tables for rich country content

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { 
  storeCountryNews, 
  getCountryNews, 
  updateCountryNewsStats, 
  getCountryKeywords 
} from './country-news-database.js';

dotenv.config();

/**
 * Enhanced Multi-Country News Processor
 * Designed to get maximum country-specific news coverage
 */
export class EnhancedMultiCountryProcessor {
  constructor() {
    this.newsDataKey = process.env.NEWSDATA_API_KEY;
    this.newsApiKey = process.env.NEWS_API_KEY_FALLBACK;
    this.requestCount = 0;
    this.dailyLimit = 400; // Conservative daily limit
  }

  /**
   * Get comprehensive country-specific news using multiple strategies
   */
  async getComprehensiveCountryNews(countryCode, targetArticles = 15) {
    const country = countryCode.toUpperCase();
    console.log(`🌍 Getting comprehensive news for ${country} - target: ${targetArticles} articles`);

    try {
      // Get country-specific keywords from database
      const keywords = await getCountryKeywords(country);
      console.log(`📋 Found ${keywords.length} keywords for ${country}`);

      // Multiple API strategies for maximum coverage
      const strategies = [
        this.fetchByCountryCode(country, Math.ceil(targetArticles * 0.4)),
        this.fetchByTopCompanies(country, keywords, Math.ceil(targetArticles * 0.3)),
        this.fetchByTechKeywords(country, keywords, Math.ceil(targetArticles * 0.3))
      ];

      const results = await Promise.allSettled(strategies);
      
      // Combine all results
      const allArticles = [];
      let totalApiCalls = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allArticles.push(...result.value.articles);
          totalApiCalls += result.value.apiCalls || 0;
          console.log(`✅ Strategy ${index + 1}: ${result.value.articles.length} articles`);
        } else {
          console.warn(`⚠️ Strategy ${index + 1} failed:`, result.reason?.message);
        }
      });

      // Enhanced deduplication and scoring
      const uniqueArticles = this.enhancedDeduplication(allArticles, keywords);
      
      // Store in dedicated country news database
      const storedCount = await this.storeArticlesInCountryDB(uniqueArticles, country);

      // Update statistics
      await updateCountryNewsStats(country, {
        totalArticles: uniqueArticles.length,
        highRelevanceArticles: uniqueArticles.filter(a => a.countryRelevance >= 80).length,
        uniqueSources: [...new Set(uniqueArticles.map(a => a.source))].length,
        avgRelevanceScore: uniqueArticles.reduce((sum, a) => sum + (a.countryRelevance || 0), 0) / uniqueArticles.length,
        apiCallsMade: totalApiCalls
      });

      console.log(`✅ ${country}: ${uniqueArticles.length} unique articles, ${storedCount} stored`);
      
      return {
        success: true,
        country,
        articles: uniqueArticles.slice(0, targetArticles),
        totalFound: uniqueArticles.length,
        stored: storedCount,
        apiCalls: totalApiCalls
      };

    } catch (error) {
      console.error(`❌ Comprehensive news fetch failed for ${country}:`, error.message);
      return {
        success: false,
        country,
        articles: [],
        error: error.message
      };
    }
  }

  /**
   * Strategy 1: Fetch by country code with tech focus
   */
  async fetchByCountryCode(countryCode, limit) {
    const articles = [];
    let apiCalls = 0;

    // NewsData.io with country parameter
    if (this.newsDataKey) {
      try {
        const countryParam = this.getCountryParam(countryCode);
        if (countryParam) {
          const url = `https://newsdata.io/api/1/latest?apikey=${this.newsDataKey}&country=${countryParam}&category=technology&language=en&size=${Math.min(limit, 50)}`;
          
          console.log(`📡 NewsData.io country query: ${countryParam}`);
          
          const response = await fetch(url);
          const data = await response.json();
          apiCalls++;

          if (data.results && data.results.length > 0) {
            const processedArticles = data.results.map(article => this.processNewsDataArticle(article, countryCode));
            articles.push(...processedArticles);
            console.log(`✅ NewsData.io country: ${processedArticles.length} articles for ${countryCode}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ NewsData.io country fetch failed: ${error.message}`);
      }
    }

    // NewsAPI with country parameter
    if (this.newsApiKey && articles.length < limit) {
      try {
        const countryParam = this.getNewsApiCountryParam(countryCode);
        if (countryParam) {
          const url = `https://newsapi.org/v2/top-headlines?country=${countryParam}&category=technology&apiKey=${this.newsApiKey}&pageSize=${Math.min(limit, 20)}`;
          
          console.log(`📡 NewsAPI country query: ${countryParam}`);
          
          const response = await fetch(url);
          const data = await response.json();
          apiCalls++;

          if (data.articles && data.articles.length > 0) {
            const processedArticles = data.articles.map(article => this.processNewsApiArticle(article, countryCode));
            articles.push(...processedArticles);
            console.log(`✅ NewsAPI country: ${processedArticles.length} articles for ${countryCode}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ NewsAPI country fetch failed: ${error.message}`);
      }
    }

    return { articles, apiCalls };
  }

  /**
   * Strategy 2: Fetch by top companies for the country
   */
  async fetchByTopCompanies(countryCode, keywords, limit) {
    const articles = [];
    let apiCalls = 0;

    // Get top company keywords
    const companyKeywords = keywords
      .filter(k => k.keyword_type === 'company')
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(k => k.keyword);

    if (companyKeywords.length === 0) return { articles, apiCalls };

    // NewsData.io company search
    if (this.newsDataKey) {
      try {
        const query = `(${companyKeywords.join(' OR ')}) AND (technology OR AI OR innovation)`;
        const url = `https://newsdata.io/api/1/latest?apikey=${this.newsDataKey}&q=${encodeURIComponent(query)}&language=en&category=technology&size=${Math.min(limit, 50)}`;
        
        console.log(`📡 NewsData.io companies: ${companyKeywords.join(', ')}`);
        
        const response = await fetch(url);
        const data = await response.json();
        apiCalls++;

        if (data.results && data.results.length > 0) {
          const processedArticles = data.results.map(article => {
            const processed = this.processNewsDataArticle(article, countryCode);
            processed.countryRelevance = this.calculateCountryRelevance(processed, keywords);
            return processed;
          });
          articles.push(...processedArticles);
          console.log(`✅ NewsData.io companies: ${processedArticles.length} articles`);
        }
      } catch (error) {
        console.warn(`⚠️ NewsData.io company search failed: ${error.message}`);
      }
    }

    // NewsAPI company search
    if (this.newsApiKey && articles.length < limit) {
      try {
        const query = `(${companyKeywords.join(' OR ')}) AND (technology OR AI)`;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${Math.min(limit, 20)}&apiKey=${this.newsApiKey}`;
        
        console.log(`📡 NewsAPI companies: ${companyKeywords.join(', ')}`);
        
        const response = await fetch(url);
        const data = await response.json();
        apiCalls++;

        if (data.articles && data.articles.length > 0) {
          const processedArticles = data.articles.map(article => {
            const processed = this.processNewsApiArticle(article, countryCode);
            processed.countryRelevance = this.calculateCountryRelevance(processed, keywords);
            return processed;
          });
          articles.push(...processedArticles);
          console.log(`✅ NewsAPI companies: ${processedArticles.length} articles`);
        }
      } catch (error) {
        console.warn(`⚠️ NewsAPI company search failed: ${error.message}`);
      }
    }

    return { articles, apiCalls };
  }

  /**
   * Strategy 3: Fetch by technology keywords + country name
   */
  async fetchByTechKeywords(countryCode, keywords, limit) {
    const articles = [];
    let apiCalls = 0;

    const countryNames = this.getCountryNames(countryCode);
    const techKeywords = keywords
      .filter(k => k.keyword_type === 'technology')
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 2)
      .map(k => k.keyword);

    if (countryNames.length === 0) return { articles, apiCalls };

    // NewsData.io tech + country search
    if (this.newsDataKey) {
      try {
        const query = `("${countryNames[0]}" OR "${countryNames[1] || countryNames[0]}") AND (AI OR "artificial intelligence" OR technology OR innovation)`;
        const url = `https://newsdata.io/api/1/latest?apikey=${this.newsDataKey}&q=${encodeURIComponent(query)}&language=en&category=technology&size=${Math.min(limit, 50)}`;
        
        console.log(`📡 NewsData.io tech+country: ${countryNames[0]}`);
        
        const response = await fetch(url);
        const data = await response.json();
        apiCalls++;

        if (data.results && data.results.length > 0) {
          const processedArticles = data.results.map(article => {
            const processed = this.processNewsDataArticle(article, countryCode);
            processed.countryRelevance = this.calculateCountryRelevance(processed, keywords);
            return processed;
          });
          articles.push(...processedArticles);
          console.log(`✅ NewsData.io tech+country: ${processedArticles.length} articles`);
        }
      } catch (error) {
        console.warn(`⚠️ NewsData.io tech search failed: ${error.message}`);
      }
    }

    return { articles, apiCalls };
  }

  /**
   * Process NewsData.io article
   */
  processNewsDataArticle(article, countryCode) {
    return {
      id: `newsdata-${countryCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title, // REAL API DATA - NEVER MODIFIED
      description: article.description, // REAL API DATA - NEVER MODIFIED
      url: article.link, // REAL API DATA - NEVER MODIFIED
      source: article.source_id || 'NewsData.io', // REAL API DATA - NEVER MODIFIED
      author: article.creator ? article.creator[0] : null, // REAL API DATA - NEVER MODIFIED
      publishedAt: article.pubDate, // REAL API DATA - NEVER MODIFIED
      country: countryCode,
      category: 'technology',
      language: 'en',
      apiSource: 'newsdata',
      provenance: 'enhanced-multi-country-processor',
      keywords: this.extractKeywords(article.title + ' ' + article.description),
      companies: this.extractCompanies(article.title + ' ' + article.description, countryCode)
    };
  }

  /**
   * Process NewsAPI article
   */
  processNewsApiArticle(article, countryCode) {
    return {
      id: `newsapi-${countryCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title, // REAL API DATA - NEVER MODIFIED
      description: article.description, // REAL API DATA - NEVER MODIFIED
      url: article.url, // REAL API DATA - NEVER MODIFIED
      source: article.source.name, // REAL API DATA - NEVER MODIFIED
      author: article.author, // REAL API DATA - NEVER MODIFIED
      publishedAt: article.publishedAt, // REAL API DATA - NEVER MODIFIED
      country: countryCode,
      category: 'technology',
      language: 'en',
      apiSource: 'newsapi',
      provenance: 'enhanced-multi-country-processor',
      keywords: this.extractKeywords(article.title + ' ' + article.description),
      companies: this.extractCompanies(article.title + ' ' + article.description, countryCode)
    };
  }

  /**
   * Calculate country relevance score
   */
  calculateCountryRelevance(article, keywords) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    let score = 0;

    keywords.forEach(keywordData => {
      if (text.includes(keywordData.keyword.toLowerCase())) {
        score += keywordData.weight * 5; // Weight multiplier
      }
    });

    // Bonus for country-specific sources
    const countryDomains = ['.kr', '.jp', '.cn', '.de', '.fr', '.co.uk'];
    if (countryDomains.some(domain => article.url?.includes(domain))) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Enhanced deduplication with country relevance
   */
  enhancedDeduplication(articles, keywords) {
    const seen = new Set();
    const unique = [];

    articles.forEach(article => {
      const key = `${article.url}-${article.title?.substring(0, 30)}`;
      if (!seen.has(key) && this.passesQualityFilter(article)) {
        seen.add(key);
        
        // Calculate scores
        article.relScore = this.calculateRelevanceScore(article);
        article.anaScore = this.calculateAnalysisScore(article);
        article.countryRelevance = article.countryRelevance || this.calculateCountryRelevance(article, keywords);
        
        unique.push(article);
      }
    });

    // Sort by country relevance first, then other scores
    return unique.sort((a, b) => {
      const scoreA = (a.countryRelevance || 0) * 2 + (a.relScore || 0) + (a.anaScore || 0);
      const scoreB = (b.countryRelevance || 0) * 2 + (b.relScore || 0) + (b.anaScore || 0);
      return scoreB - scoreA;
    });
  }

  /**
   * Store articles in country-specific database
   */
  async storeArticlesInCountryDB(articles, countryCode) {
    let storedCount = 0;
    
    for (const article of articles) {
      try {
        const stored = await storeCountryNews(article, countryCode);
        if (stored) storedCount++;
      } catch (error) {
        console.warn(`⚠️ Failed to store article: ${error.message}`);
      }
    }
    
    return storedCount;
  }

  /**
   * Get country parameter for NewsData.io
   */
  getCountryParam(countryCode) {
    const mapping = {
      KR: 'kr', JP: 'jp', CN: 'cn', DE: 'de', FR: 'fr', 
      GB: 'gb', IN: 'in', CA: 'ca', AU: 'au', BR: 'br'
    };
    return mapping[countryCode];
  }

  /**
   * Get country parameter for NewsAPI
   */
  getNewsApiCountryParam(countryCode) {
    const mapping = {
      KR: 'kr', JP: 'jp', DE: 'de', FR: 'fr', 
      GB: 'gb', IN: 'in', CA: 'ca', AU: 'au', BR: 'br'
      // Note: NewsAPI doesn't support CN (China)
    };
    return mapping[countryCode];
  }

  /**
   * Get country names for search
   */
  getCountryNames(countryCode) {
    const names = {
      KR: ['South Korea', 'Korea'],
      JP: ['Japan', 'Japanese'],
      CN: ['China', 'Chinese'],
      DE: ['Germany', 'German'],
      FR: ['France', 'French'],
      GB: ['United Kingdom', 'Britain', 'UK'],
      IN: ['India', 'Indian'],
      CA: ['Canada', 'Canadian'],
      AU: ['Australia', 'Australian'],
      BR: ['Brazil', 'Brazilian']
    };
    return names[countryCode] || [countryCode];
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    const techKeywords = ['AI', 'artificial intelligence', 'machine learning', 'technology', 'innovation', 'startup', 'digital', 'software'];
    const found = [];
    
    techKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    });
    
    return found;
  }

  /**
   * Extract company mentions from text
   */
  extractCompanies(text, countryCode) {
    const companyPatterns = {
      KR: ['Samsung', 'LG', 'SK Hynix', 'Naver', 'Kakao'],
      JP: ['Sony', 'Nintendo', 'Toyota', 'SoftBank', 'Rakuten'],
      CN: ['Alibaba', 'Tencent', 'Baidu', 'Huawei', 'Xiaomi'],
      DE: ['SAP', 'Siemens', 'BMW', 'Mercedes'],
      FR: ['Dassault', 'Thales', 'Orange'],
      GB: ['ARM', 'DeepMind', 'Rolls-Royce']
    };
    
    const companies = companyPatterns[countryCode] || [];
    const found = [];
    
    companies.forEach(company => {
      if (text.includes(company)) {
        found.push(company);
      }
    });
    
    return found;
  }

  /**
   * Calculate relevance score
   */
  calculateRelevanceScore(article) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    let score = 50;

    const techTerms = ['ai', 'artificial intelligence', 'technology', 'innovation', 'startup'];
    techTerms.forEach(term => {
      if (text.includes(term)) score += 10;
    });

    return Math.min(score, 100);
  }

  /**
   * Calculate analysis score
   */
  calculateAnalysisScore(article) {
    let score = 60;

    if (article.title && article.title.length > 20) score += 10;
    if (article.description && article.description.length > 50) score += 10;
    
    const reputableSources = ['techcrunch', 'reuters', 'bloomberg', 'venturebeat', 'wired'];
    if (reputableSources.some(source => article.source?.toLowerCase().includes(source))) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Quality filter
   */
  passesQualityFilter(article) {
    if (!article.title || !article.description) return false;
    if (article.title.length < 10) return false;
    if (article.description.length < 20) return false;
    
    return true;
  }
}

// Export singleton instance
export const enhancedMultiCountryProcessor = new EnhancedMultiCountryProcessor();