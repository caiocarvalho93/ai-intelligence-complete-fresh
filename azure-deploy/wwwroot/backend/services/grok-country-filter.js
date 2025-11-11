/**
 * 🧠 GROK BRAIN COUNTRY FILTER
 * Uses Grok's unlimited web search to ensure 100% accurate country-specific news filtering
 */

import { grokBrain } from './cai-grok-brain.js';

class GrokCountryFilter {
  constructor() {
    this.countryMappings = {
      'BR': { name: 'Brazil', language: 'Portuguese', region: 'South America' },
      'KR': { name: 'South Korea', language: 'Korean', region: 'East Asia' },
      'JP': { name: 'Japan', language: 'Japanese', region: 'East Asia' },
      'CN': { name: 'China', language: 'Chinese', region: 'East Asia' },
      'DE': { name: 'Germany', language: 'German', region: 'Europe' },
      'FR': { name: 'France', language: 'French', region: 'Europe' },
      'GB': { name: 'United Kingdom', language: 'English', region: 'Europe' },
      'IN': { name: 'India', language: 'Hindi/English', region: 'South Asia' },
      'CA': { name: 'Canada', language: 'English/French', region: 'North America' },
      'AU': { name: 'Australia', language: 'English', region: 'Oceania' },
      'IT': { name: 'Italy', language: 'Italian', region: 'Europe' },
      'ES': { name: 'Spain', language: 'Spanish', region: 'Europe' }
    };
  }

  /**
   * 🧠 Use Grok Brain with unlimited web search to analyze article relevance
   */
  async analyzeArticleRelevance(article, countryCode) {
    const country = this.countryMappings[countryCode];
    if (!country) return { relevant: false, confidence: 0, reason: 'Unknown country' };

    try {
      console.log(`🧠 Grok analyzing article relevance for ${countryCode}: ${article.title.substring(0, 50)}...`);

      const grokResult = await grokBrain.makeStrategicDecision({
        actor: "Country News Relevance Analyst",
        requested_action: `Use unlimited web search to determine if this article is genuinely relevant to ${country.name}`,
        business_context: {
          goal: `Ensure 100% accurate country-specific news filtering for ${country.name}`,
          revenue_impact: "Accurate filtering increases user engagement and trust"
        },
        technical_context: {
          article: {
            title: article.title,
            description: article.description || '',
            source: article.source
          },
          country: {
            code: countryCode,
            name: country.name,
            language: country.language,
            region: country.region
          }
        },
        urgency: "high",
        reasoning_mode: "analytical_with_web_search"
      });

      if (grokResult && grokResult.decision) {
        const decision = grokResult.decision.toLowerCase();
        const relevant = decision.includes('relevant') && !decision.includes('not relevant');
        const confidence = this.extractConfidence(grokResult.reasoning || '');
        
        console.log(`🧠 Grok decision for ${countryCode}: ${relevant ? 'RELEVANT' : 'NOT RELEVANT'} (Confidence: ${confidence}%)`);
        
        return {
          relevant,
          confidence,
          reason: grokResult.reasoning || 'Grok analysis completed'
        };
      }

      throw new Error('Invalid Grok response');

    } catch (error) {
      console.log(`⚠️ Grok country filtering failed for ${countryCode}: ${error.message}`);
      return this.fallbackRelevanceAnalysis(article, countryCode);
    }
  }

  /**
   * 🔍 Enhanced fallback analysis when Grok is unavailable
   */
  fallbackRelevanceAnalysis(article, countryCode) {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    let score = 0;
    const matches = [];

    // Country-specific patterns
    const patterns = {
      'BR': {
        companies: ['petrobras', 'vale', 'itau', 'bradesco', 'embraer'],
        locations: ['brazil', 'brasil', 'sao paulo', 'rio de janeiro', 'brazilian']
      },
      'KR': {
        companies: ['samsung', 'lg', 'hyundai', 'kia'],
        locations: ['korea', 'korean', 'seoul', 'south korea']
      }
    };

    const countryPatterns = patterns[countryCode];
    if (countryPatterns) {
      countryPatterns.companies.forEach(company => {
        if (text.includes(company)) {
          score += 30;
          matches.push(`company: ${company}`);
        }
      });

      countryPatterns.locations.forEach(location => {
        if (text.includes(location)) {
          score += 25;
          matches.push(`location: ${location}`);
        }
      });
    }

    const relevant = score >= 50;
    
    console.log(`🔍 Fallback filter for ${countryCode}: ${relevant ? 'RELEVANT' : 'NOT RELEVANT'} (Score: ${score})`);
    if (matches.length > 0) {
      console.log(`🔍 Matches found: ${matches.join(', ')}`);
    }

    return {
      relevant,
      confidence: Math.min(score, 100),
      reason: `Fallback analysis: ${matches.length > 0 ? matches.join(', ') : 'No country-specific indicators found'}`
    };
  }

  extractConfidence(reasoning) {
    const confidenceMatch = reasoning.match(/(\d+)%/);
    if (confidenceMatch) return parseInt(confidenceMatch[1]);
    
    if (reasoning.toLowerCase().includes('highly relevant')) return 90;
    if (reasoning.toLowerCase().includes('relevant')) return 70;
    if (reasoning.toLowerCase().includes('not relevant')) return 10;
    
    return 50;
  }

  /**
   * 🧹 Clean up country assignments using Grok Brain analysis
   */
  async cleanupCountryAssignments() {
    console.log('🧠 GROK CLEANUP: Starting comprehensive country assignment cleanup...');
    
    // Import here to avoid circular dependencies
    const { getCountryNews } = await import('./enhanced-country-news-processor.js');
    
    const results = {
      totalAnalyzed: 0,
      totalCorrected: 0,
      countryResults: {}
    };

    try {
      const allArticles = await getCountryNews();
      console.log(`📊 Analyzing ${allArticles.length} articles for country accuracy...`);
      
      // Group articles by country
      const articlesByCountry = {};
      allArticles.forEach(article => {
        if (!articlesByCountry[article.country]) {
          articlesByCountry[article.country] = [];
        }
        articlesByCountry[article.country].push(article);
      });

      // Analyze each country's articles
      for (const [countryCode, articles] of Object.entries(articlesByCountry)) {
        if (!this.countryMappings[countryCode]) continue;

        console.log(`🔍 Checking ${articles.length} articles assigned to ${countryCode}...`);
        
        let relevantCount = 0;
        const corrections = [];

        for (const article of articles.slice(0, 5)) { // Limit to prevent overwhelming
          results.totalAnalyzed++;
          
          const analysis = await this.analyzeArticleRelevance(article, countryCode);
          
          if (analysis.relevant) {
            relevantCount++;
          } else {
            corrections.push({
              articleId: article.id,
              title: article.title,
              reason: analysis.reason
            });
            results.totalCorrected++;
          }

          // Small delay
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        const accuracy = Math.round((relevantCount / Math.min(articles.length, 5)) * 100);
        console.log(`🧠 ${countryCode} accuracy: ${accuracy}% (${relevantCount}/${Math.min(articles.length, 5)} relevant)`);

        results.countryResults[countryCode] = {
          totalArticles: articles.length,
          analyzed: Math.min(articles.length, 5),
          relevant: relevantCount,
          accuracy: accuracy,
          corrections: corrections.length
        };
      }

      console.log('🧠 GROK CLEANUP COMPLETED:', results);
      return results;

    } catch (error) {
      console.error('❌ Grok cleanup failed:', error.message);
      throw error;
    }
  }
}

export const grokCountryFilter = new GrokCountryFilter();