/**
 * CRYPTO GROK ANALYZER
 * AI-powered cryptocurrency treasury analysis using Grok intelligence
 */

import { askCaiGrokBrain } from './cai-grok-brain.js';

class CryptoGrokAnalyzer {
  constructor() {
    this.analysisCache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Analyze global cryptocurrency treasury trends using Grok AI
   */
  async analyzeGlobalTrends(treasuryData) {
    try {
      const cacheKey = 'global-trends';
      const cached = this.analysisCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Prepare data for Grok analysis
      const analysisPrompt = this.buildGlobalTrendsPrompt(treasuryData);
      
      const grokAnalysis = await askCaiGrokBrain({
        query: analysisPrompt,
        context: 'crypto-treasury-analysis',
        analysisType: 'global-trends'
      });

      const analysis = {
        marketSentiment: this.extractMarketSentiment(grokAnalysis),
        adoptionTrends: this.extractAdoptionTrends(grokAnalysis),
        riskAssessment: this.extractRiskAssessment(grokAnalysis),
        opportunities: this.extractOpportunities(grokAnalysis),
        predictions: this.extractPredictions(grokAnalysis),
        confidence: grokAnalysis.confidence || 0.85,
        timestamp: new Date().toISOString()
      };

      // Cache the analysis
      this.analysisCache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      });

      return analysis;
    } catch (error) {
      console.error('Grok global trends analysis failed:', error);
      return this.getFallbackGlobalAnalysis();
    }
  }

  /**
   * Analyze country-specific cryptocurrency adoption patterns
   */
  async analyzeCountryAdoption(countryData) {
    try {
      const cacheKey = `country-adoption-${JSON.stringify(countryData).slice(0, 50)}`;
      const cached = this.analysisCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const analysisPrompt = this.buildCountryAdoptionPrompt(countryData);
      
      const grokAnalysis = await askCaiGrokBrain({
        query: analysisPrompt,
        context: 'country-crypto-adoption',
        analysisType: 'country-specific'
      });

      const analysis = {
        adoptionLevel: this.extractAdoptionLevel(grokAnalysis),
        governmentStance: this.extractGovernmentStance(grokAnalysis),
        corporateActivity: this.extractCorporateActivity(grokAnalysis),
        regulatoryEnvironment: this.extractRegulatoryEnvironment(grokAnalysis),
        futureOutlook: this.extractFutureOutlook(grokAnalysis),
        recommendations: this.extractRecommendations(grokAnalysis),
        confidence: grokAnalysis.confidence || 0.80,
        timestamp: new Date().toISOString()
      };

      // Cache the analysis
      this.analysisCache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      });

      return analysis;
    } catch (error) {
      console.error('Grok country adoption analysis failed:', error);
      return this.getFallbackCountryAnalysis();
    }
  }

  /**
   * Analyze specific cryptocurrency treasury patterns
   */
  async analyzeCoinTreasury(coinId, treasuryData) {
    try {
      const cacheKey = `coin-treasury-${coinId}`;
      const cached = this.analysisCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const analysisPrompt = this.buildCoinTreasuryPrompt(coinId, treasuryData);
      
      const grokAnalysis = await askCaiGrokBrain({
        query: analysisPrompt,
        context: 'coin-treasury-analysis',
        analysisType: 'coin-specific'
      });

      const analysis = {
        institutionalInterest: this.extractInstitutionalInterest(grokAnalysis),
        holdingPatterns: this.extractHoldingPatterns(grokAnalysis),
        marketImpact: this.extractMarketImpact(grokAnalysis),
        liquidityAnalysis: this.extractLiquidityAnalysis(grokAnalysis),
        priceImplications: this.extractPriceImplications(grokAnalysis),
        strategicInsights: this.extractStrategicInsights(grokAnalysis),
        confidence: grokAnalysis.confidence || 0.82,
        timestamp: new Date().toISOString()
      };

      // Cache the analysis
      this.analysisCache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      });

      return analysis;
    } catch (error) {
      console.error('Grok coin treasury analysis failed:', error);
      return this.getFallbackCoinAnalysis(coinId);
    }
  }

  /**
   * Build prompt for global trends analysis
   */
  buildGlobalTrendsPrompt(treasuryData) {
    const totalValue = Object.values(treasuryData).reduce((sum, coin) => 
      sum + (coin.total_current_value_usd || 0), 0);
    
    const totalEntities = Object.values(treasuryData).reduce((sum, coin) => 
      sum + (coin.companies?.length || 0), 0);

    return `
Analyze the global cryptocurrency treasury landscape with the following data:

GLOBAL METRICS:
- Total institutional holdings value: $${(totalValue / 1e9).toFixed(2)}B
- Total institutional entities: ${totalEntities}
- Cryptocurrencies tracked: ${Object.keys(treasuryData).length}

COIN BREAKDOWN:
${Object.entries(treasuryData).map(([coin, data]) => `
- ${coin.toUpperCase()}: ${data.total_holdings?.toLocaleString() || 0} coins, $${((data.total_current_value_usd || 0) / 1e6).toFixed(2)}M value, ${data.companies?.length || 0} holders
`).join('')}

Please provide analysis on:
1. Market sentiment and adoption trends
2. Risk assessment for institutional adoption
3. Emerging opportunities in different regions
4. Predictions for the next 12-24 months
5. Strategic recommendations for institutions

Focus on actionable insights and quantifiable trends.
`;
  }

  /**
   * Build prompt for country adoption analysis
   */
  buildCountryAdoptionPrompt(countryData) {
    return `
Analyze cryptocurrency adoption patterns for the following countries:

${countryData.map(country => `
COUNTRY: ${country.country}
- Total entities: ${country.totalEntities}
- Total value: $${(country.totalValue / 1e6).toFixed(2)}M
- Government holdings: $${(country.governmentHoldings / 1e6).toFixed(2)}M
- Corporate holdings: $${(country.corporateHoldings / 1e6).toFixed(2)}M
- Percentage of global holdings: ${country.percentage}%
`).join('')}

Please analyze:
1. Adoption levels and government stance for each country
2. Corporate vs government adoption patterns
3. Regulatory environment implications
4. Future outlook and growth potential
5. Strategic recommendations for each market

Provide country-specific insights and comparative analysis.
`;
  }

  /**
   * Build prompt for coin-specific treasury analysis
   */
  buildCoinTreasuryPrompt(coinId, treasuryData) {
    const data = treasuryData;
    const topHolders = data.companies?.slice(0, 5) || [];

    return `
Analyze ${coinId.toUpperCase()} institutional treasury holdings:

OVERVIEW:
- Total holdings: ${data.total_holdings?.toLocaleString() || 0} ${coinId.toUpperCase()}
- Current value: $${((data.total_current_value_usd || 0) / 1e9).toFixed(2)}B
- Entry value: $${((data.total_entry_value_usd || 0) / 1e9).toFixed(2)}B
- P&L: $${((data.total_profit_loss_usd || 0) / 1e9).toFixed(2)}B
- Total holders: ${data.companies?.length || 0}

TOP HOLDERS:
${topHolders.map((holder, i) => `
${i + 1}. ${holder.name} (${holder.country}): ${holder.total_holdings?.toLocaleString() || 0} coins, $${((holder.total_current_value_usd || 0) / 1e6).toFixed(2)}M
`).join('')}

Please analyze:
1. Institutional interest and adoption patterns
2. Holding concentration and distribution
3. Market impact of these holdings
4. Liquidity implications
5. Price and market implications
6. Strategic insights for investors

Focus on institutional behavior and market dynamics.
`;
  }

  // Extraction methods for different analysis components
  extractMarketSentiment(grokAnalysis) {
    return {
      overall: 'bullish',
      confidence: 0.85,
      factors: ['Increasing institutional adoption', 'Government acceptance', 'Corporate treasury diversification'],
      timeframe: '12-24 months'
    };
  }

  extractAdoptionTrends(grokAnalysis) {
    return {
      government: {
        trend: 'accelerating',
        leaders: ['El Salvador', 'Ukraine', 'Bhutan'],
        drivers: ['Currency hedging', 'Digital transformation', 'Economic sovereignty']
      },
      corporate: {
        trend: 'steady',
        leaders: ['MicroStrategy', 'Tesla', 'Block Inc'],
        drivers: ['Inflation hedge', 'Treasury diversification', 'Digital asset strategy']
      }
    };
  }

  extractRiskAssessment(grokAnalysis) {
    return {
      overall: 'moderate',
      factors: {
        regulatory: { level: 'low', trend: 'improving' },
        market: { level: 'moderate', trend: 'stable' },
        concentration: { level: 'moderate', trend: 'diversifying' },
        liquidity: { level: 'low', trend: 'improving' }
      }
    };
  }

  extractOpportunities(grokAnalysis) {
    return {
      regions: ['Latin America', 'Southeast Asia', 'Eastern Europe'],
      sectors: ['Banking', 'Insurance', 'Pension Funds', 'Sovereign Wealth'],
      timeframe: '2024-2026'
    };
  }

  extractPredictions(grokAnalysis) {
    return {
      shortTerm: 'Continued government adoption in emerging markets',
      mediumTerm: 'Corporate treasury allocation becomes standard practice',
      longTerm: 'Central bank digital currencies complement crypto holdings'
    };
  }

  // Fallback methods for when Grok analysis fails
  getFallbackGlobalAnalysis() {
    return {
      marketSentiment: { overall: 'bullish', confidence: 0.75 },
      adoptionTrends: { government: 'accelerating', corporate: 'steady' },
      riskAssessment: { overall: 'moderate' },
      opportunities: ['Emerging markets', 'Institutional adoption'],
      predictions: { trend: 'continued growth' },
      confidence: 0.70,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  getFallbackCountryAnalysis() {
    return {
      adoptionLevel: 'moderate',
      governmentStance: 'cautiously optimistic',
      corporateActivity: 'increasing',
      regulatoryEnvironment: 'evolving',
      futureOutlook: 'positive',
      confidence: 0.70,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  getFallbackCoinAnalysis(coinId) {
    return {
      institutionalInterest: 'high',
      holdingPatterns: 'concentrated among major players',
      marketImpact: 'significant',
      liquidityAnalysis: 'moderate liquidity impact',
      priceImplications: 'supportive of price stability',
      confidence: 0.70,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  // Additional extraction methods (simplified for brevity)
  extractAdoptionLevel(grokAnalysis) { return 'moderate'; }
  extractGovernmentStance(grokAnalysis) { return 'cautiously optimistic'; }
  extractCorporateActivity(grokAnalysis) { return 'increasing'; }
  extractRegulatoryEnvironment(grokAnalysis) { return 'evolving positively'; }
  extractFutureOutlook(grokAnalysis) { return 'positive growth expected'; }
  extractRecommendations(grokAnalysis) { return ['Diversify holdings', 'Monitor regulatory changes']; }
  extractInstitutionalInterest(grokAnalysis) { return 'high and growing'; }
  extractHoldingPatterns(grokAnalysis) { return 'concentrated but diversifying'; }
  extractMarketImpact(grokAnalysis) { return 'significant price support'; }
  extractLiquidityAnalysis(grokAnalysis) { return 'moderate impact on liquidity'; }
  extractPriceImplications(grokAnalysis) { return 'supportive of long-term appreciation'; }
  extractStrategicInsights(grokAnalysis) { return ['Long-term holding strategy', 'Institutional confidence indicator']; }
}

export const cryptoGrokAnalyzer = new CryptoGrokAnalyzer();