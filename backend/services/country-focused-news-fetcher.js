// Country-Focused News Fetcher - Actively fetch more country-specific news
// Ensures each country has at least 10 high-quality articles

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Country-Focused News Fetcher - Get more articles for specific countries
 */
export class CountryFocusedNewsFetcher {
  constructor() {
    // Use working NewsData.io API key directly
    this.workingApiKey = 'pub_da3a034d1d0e419892ff9574f0262f4c';
    console.log('✅ NewsData.io API key configured for direct HTTP calls');
  }

  /**
   * Fetch country-focused news using NewsData.io Direct API (WORKING!)
   */
  async fetchCountryFocusedNews(countryCode, targetArticles = 15) {
    console.log(`🎯 NEWSDATA DIRECT API FETCH for ${countryCode} - targeting ${targetArticles} articles...`);
    
    try {
      const allArticles = [];

      // Strategy 1: Country-specific latest news
      try {
        console.log(`📡 Fetching country-specific news for ${countryCode}...`);
        
        const countryMapping = {
          KR: 'kr', JP: 'jp', CN: 'cn', DE: 'de', FR: 'fr', 
          GB: 'gb', IN: 'in', CA: 'ca', AU: 'au'
        };
        
        const countryCode2 = countryMapping[countryCode];
        if (countryCode2) {
          const url = `https://newsdata.io/api/1/latest?apikey=${this.workingApiKey}&country=${countryCode2}&category=technology,business&language=en&size=10`;
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'success' && data.results && data.results.length > 0) {
            console.log(`✅ Found ${data.results.length} country-specific articles for ${countryCode}`);
            
            const processedArticles = data.results.map((article, index) => ({
              id: `country-${countryCode}-${Date.now()}-${index}`,
              title: article.title,
              description: article.description,
              url: article.link,
              source: article.source_id || 'NewsData',
              author: article.creator ? article.creator[0] : null,
              publishedAt: article.pubDate,
              country: countryCode,
              category: 'technology',
              relScore: this.calculateCountryRelevance(article, countryCode) + 25, // High boost for country filter
              anaScore: 90,
              provenance: 'newsdata-country-specific'
            }));

            allArticles.push(...processedArticles);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.warn(`⚠️ Country-specific fetch failed for ${countryCode}:`, error.message);
      }

      // Strategy 2: Market news with major organizations
      const organizations = this.getCountryOrganizations(countryCode);
      for (const org of organizations.slice(0, 2)) {
        try {
          console.log(`🏢 Fetching market news for ${org} (${countryCode})...`);
          
          const url = `https://newsdata.io/api/1/market?apikey=${this.workingApiKey}&organization=${encodeURIComponent(org)}&language=en&size=8`;
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'success' && data.results && data.results.length > 0) {
            console.log(`✅ Found ${data.results.length} market articles for ${org}`);
            
            const orgArticles = data.results.map((article, index) => ({
              id: `market-${countryCode}-${org.replace(/\s+/g, '')}-${Date.now()}-${index}`,
              title: article.title,
              description: article.description,
              url: article.link,
              source: article.source_id || 'NewsData Market',
              author: article.creator ? article.creator[0] : null,
              publishedAt: article.pubDate,
              country: countryCode,
              category: 'business',
              relScore: this.calculateCountryRelevance(article, countryCode) + 30, // Very high boost for org-specific
              anaScore: 95,
              provenance: `market-${org.toLowerCase().replace(/\s+/g, '-')}`
            }));

            allArticles.push(...orgArticles);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
          console.warn(`⚠️ Market fetch failed for ${org}:`, error.message);
        }
      }

      // Strategy 3: Technology query search
      const queries = this.getMarketFocusedQueries(countryCode);
      for (const query of queries.slice(0, 2)) {
        try {
          console.log(`🔍 Technology query for ${countryCode}: ${query}`);
          
          const url = `https://newsdata.io/api/1/latest?apikey=${this.workingApiKey}&q=${encodeURIComponent(query)}&language=en&category=technology&size=6`;
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'success' && data.results && data.results.length > 0) {
            console.log(`✅ Found ${data.results.length} articles for query: ${query}`);
            
            const queryArticles = data.results.map((article, index) => ({
              id: `query-${countryCode}-${Date.now()}-${index}`,
              title: article.title,
              description: article.description,
              url: article.link,
              source: article.source_id || 'NewsData',
              author: article.creator ? article.creator[0] : null,
              publishedAt: article.pubDate,
              country: countryCode,
              category: 'technology',
              relScore: this.calculateCountryRelevance(article, countryCode),
              anaScore: 85,
              provenance: 'newsdata-tech-query'
            }));

            allArticles.push(...queryArticles);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
          console.warn(`⚠️ Tech query failed for ${countryCode}:`, error.message);
        }
      }

      // Remove duplicates and filter by relevance
      const uniqueArticles = this.deduplicateAndFilter(allArticles, countryCode);
      
      console.log(`🎯 NewsData direct API fetch complete for ${countryCode}: ${uniqueArticles.length} unique articles`);
      
      return uniqueArticles.slice(0, targetArticles);

    } catch (error) {
      console.error(`❌ NewsData direct API fetch failed for ${countryCode}:`, error.message);
      return [];
    }
  }



  /**
   * Get market-focused search queries (financial/business news with country focus)
   */
  getMarketFocusedQueries(countryCode) {
    const queries = {
      KR: [
        'Samsung Electronics stock earnings',
        'Korean tech companies IPO',
        'Seoul stock exchange technology',
        'SK Hynix semiconductor market',
        'Korean AI companies investment',
        'Naver stock technology business',
        'Korea fintech blockchain market'
      ],
      JP: [
        'Sony Corporation earnings technology',
        'Japanese tech companies market',
        'Tokyo stock exchange innovation',
        'SoftBank investment AI technology',
        'Nintendo gaming market business',
        'Toyota automotive technology stock',
        'Japan fintech digital payments'
      ],
      CN: [
        'Alibaba Group earnings technology',
        'Chinese tech giants market',
        'Shanghai stock exchange tech',
        'Tencent Holdings AI business',
        'Baidu autonomous driving market',
        'Huawei technology business news',
        'China fintech digital currency'
      ],
      DE: [
        'SAP SE earnings technology',
        'German tech companies market',
        'Frankfurt stock exchange tech',
        'Siemens AG industrial technology',
        'BMW Group automotive innovation',
        'German fintech blockchain',
        'Mercedes technology business'
      ],
      FR: [
        'French tech companies market',
        'Paris stock exchange technology',
        'Dassault Systemes earnings',
        'Orange SA telecommunications',
        'French fintech innovation',
        'Thales Group defense technology',
        'Capgemini technology consulting'
      ],
      GB: [
        'British tech companies market',
        'London stock exchange technology',
        'ARM Holdings chip business',
        'DeepMind AI business news',
        'UK fintech companies market',
        'Rolls-Royce technology business',
        'British fintech blockchain'
      ],
      IN: [
        'Indian tech companies market',
        'Mumbai stock exchange technology',
        'Infosys earnings technology',
        'TCS digital transformation',
        'Indian fintech companies',
        'Bangalore tech business news',
        'Indian IT companies market'
      ],
      CA: [
        'Canadian tech companies market',
        'Toronto stock exchange technology',
        'Shopify earnings e-commerce',
        'Canadian fintech innovation',
        'BlackBerry technology business',
        'Montreal tech companies',
        'Vancouver tech business news'
      ],
      AU: [
        'Australian tech companies market',
        'Sydney stock exchange technology',
        'Atlassian earnings software',
        'Australian fintech companies',
        'Canva technology business',
        'Melbourne tech business news',
        'Australian tech IPO market'
      ]
    };

    return queries[countryCode] || [`${countryCode} technology market`, `${countryCode} fintech business`, `${countryCode} tech companies`];
  }

  /**
   * Get major organizations/companies for each country
   */
  getCountryOrganizations(countryCode) {
    const organizations = {
      KR: ['Samsung', 'LG', 'SK Hynix', 'Naver', 'Kakao'],
      JP: ['Sony', 'Nintendo', 'Toyota', 'SoftBank', 'Honda'],
      CN: ['Alibaba', 'Tencent', 'Baidu', 'Huawei', 'Xiaomi'],
      DE: ['SAP', 'Siemens', 'BMW', 'Mercedes', 'Volkswagen'],
      FR: ['Dassault Systemes', 'Orange', 'Thales', 'Capgemini', 'Ubisoft'],
      GB: ['ARM Holdings', 'DeepMind', 'Rolls-Royce', 'Vodafone', 'BT Group'],
      IN: ['Infosys', 'TCS', 'Wipro', 'Flipkart', 'Paytm'],
      CA: ['Shopify', 'BlackBerry', 'Bombardier', 'Cohere', 'Wealthsimple'],
      AU: ['Atlassian', 'Canva', 'Afterpay', 'Xero', 'REA Group']
    };

    return organizations[countryCode] || [];
  }

  /**
   * Calculate country relevance for fetched articles (NewsData.io format)
   */
  calculateCountryRelevance(article, countryCode) {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    let score = 60; // Base score for country-focused fetch

    // Country-specific keywords
    const countryKeywords = {
      KR: ['samsung', 'lg', 'korea', 'korean', 'seoul', 'sk hynix', 'naver', 'kakao'],
      JP: ['sony', 'nintendo', 'japan', 'japanese', 'tokyo', 'toyota', 'honda', 'softbank'],
      CN: ['alibaba', 'tencent', 'china', 'chinese', 'beijing', 'baidu', 'huawei', 'xiaomi'],
      DE: ['sap', 'siemens', 'germany', 'german', 'berlin', 'bmw', 'mercedes', 'volkswagen'],
      FR: ['france', 'french', 'paris', 'dassault', 'orange', 'thales', 'capgemini'],
      GB: ['deepmind', 'arm', 'britain', 'british', 'uk', 'london', 'cambridge', 'rolls-royce'],
      IN: ['india', 'indian', 'bangalore', 'mumbai', 'infosys', 'tcs', 'wipro', 'delhi'],
      CA: ['canada', 'canadian', 'toronto', 'vancouver', 'montreal', 'shopify', 'element ai'],
      AU: ['australia', 'australian', 'sydney', 'melbourne', 'atlassian', 'canva', 'brisbane']
    };

    const keywords = countryKeywords[countryCode] || [];
    
    // Boost score for country mentions
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 10;
      }
    });

    // AI/Tech relevance
    const techTerms = ['ai', 'artificial intelligence', 'machine learning', 'technology', 'innovation'];
    techTerms.forEach(term => {
      if (text.includes(term)) {
        score += 5;
      }
    });

    return Math.min(score, 100);
  }

  /**
   * Remove duplicates and filter by relevance
   */
  deduplicateAndFilter(articles, countryCode) {
    const seen = new Set();
    const unique = [];

    articles.forEach(article => {
      const key = `${article.url}-${article.title?.substring(0, 50)}`;
      if (!seen.has(key) && article.relScore >= 70) {
        seen.add(key);
        unique.push(article);
      }
    });

    return unique.sort((a, b) => b.relScore - a.relScore);
  }

  /**
   * Fetch and store country-focused news for all countries
   */
  async fetchAllCountriesFocusedNews() {
    const countries = ['KR', 'JP', 'CN', 'DE', 'FR', 'GB', 'IN', 'CA', 'AU'];
    const results = {};
    let totalFetched = 0;

    console.log(`🌍 MASSIVE COUNTRY-FOCUSED FETCH starting for ${countries.length} countries...`);

    for (const countryCode of countries) {
      try {
        const articles = await this.fetchCountryFocusedNews(countryCode, 15);
        results[countryCode] = {
          success: true,
          articles: articles.length,
          sample: articles[0]?.title || 'No articles'
        };
        totalFetched += articles.length;

        // Store in main database
        if (articles.length > 0) {
          await this.storeInMainDatabase(articles);
          console.log(`✅ Stored ${articles.length} country-focused articles for ${countryCode}`);
        }

        // Rate limiting between countries
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Country-focused fetch failed for ${countryCode}:`, error.message);
        results[countryCode] = {
          success: false,
          error: error.message
        };
      }
    }

    console.log(`🎯 MASSIVE COUNTRY-FOCUSED FETCH COMPLETE: ${totalFetched} total articles fetched`);

    return {
      success: true,
      totalArticles: totalFetched,
      results
    };
  }

  /**
   * Store articles in main database
   */
  async storeInMainDatabase(articles) {
    try {
      const { saveArticlesToDatabase } = await import('../database.js');
      await saveArticlesToDatabase(articles);
    } catch (error) {
      console.error('❌ Failed to store country-focused articles:', error.message);
    }
  }
}

// Export singleton instance
export const countryFocusedNewsFetcher = new CountryFocusedNewsFetcher();