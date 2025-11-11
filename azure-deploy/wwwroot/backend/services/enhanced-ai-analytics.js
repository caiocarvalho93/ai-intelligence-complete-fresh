// 🧠📊 ENHANCED AI ANALYTICS - Real Economic Data + Job Market Intelligence
// BRAND NEW SYSTEM - Completely separate from existing functionality
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// FRED API Configuration
const FRED_API_KEY = '83bffce4ed0dcc881233542560502fb2';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// Country-specific economic indicators mapping
const COUNTRY_ECONOMIC_INDICATORS = {
  'us': {
    unemployment: 'UNRATE',
    employment: 'PAYEMS',
    initialClaims: 'ICSA',
    continuedClaims: 'CCSA',
    gdp: 'GDP',
    inflation: 'CPIAUCSL'
  },
  'uk': {
    unemployment: 'GBRURHARMMDSMEI',
    employment: 'GBREMPALLPERSONSQRTLY',
    gdp: 'NAEXKP01GBQ652S'
  },
  'de': {
    unemployment: 'DEURHARMMDSMEI',
    employment: 'DEUEMP15T64TTQRTL',
    gdp: 'NAEXKP01DEQ652S'
  },
  'ca': {
    unemployment: 'CANRHARMMDSMEI',
    employment: 'CANEMP15T64TTQRTL',
    gdp: 'NAEXKP01CAQ652S'
  },
  'fr': {
    unemployment: 'FRARHARMMDSMEI',
    employment: 'FRAEMP15T64TTQRTL',
    gdp: 'NAEXKP01FRQ652S'
  },
  'es': {
    unemployment: 'ESPRHARMMDSMEI',
    employment: 'ESPEMPALLPERSONSQRTLY',
    gdp: 'NAEXKP01ESQ652S'
  },
  'it': {
    unemployment: 'ITARHARMMDSMEI',
    employment: 'ITAEMPALLPERSONSQRTLY',
    gdp: 'NAEXKP01ITQ652S'
  },
  'au': {
    unemployment: 'AUSRHARMMDSMEI',
    employment: 'AUSEMPALLPERSONSQRTLY',
    gdp: 'NAEXKP01AUQ652S'
  }
};

// Job categories for AI impact analysis
const JOB_CATEGORIES = {
  ai_roles: ['artificial intelligence', 'machine learning', 'AI engineer', 'ML engineer', 'data scientist'],
  tech_traditional: ['software developer', 'programmer', 'web developer', 'system administrator'],
  automation_risk: ['data entry', 'customer service', 'accounting clerk', 'administrative assistant'],
  emerging_roles: ['AI trainer', 'prompt engineer', 'AI ethics specialist', 'automation specialist']
};

/**
 * ENHANCED AI IMPACT ANALYTICS ENGINE
 * Combines real economic data with job market intelligence
 */
export class EnhancedAIAnalytics {
  
  /**
   * Generate comprehensive country AI impact analysis
   */
  async generateCountryAnalysis(countryCode) {
    try {
      console.log(`🔍 Starting enhanced analysis for ${countryCode.toUpperCase()}...`);
      
      // Step 1: Gather real economic data from FRED
      const economicData = await this.fetchEconomicData(countryCode);
      
      // Step 2: Analyze job market across multiple categories
      const jobMarketData = await this.analyzeJobMarket(countryCode);
      
      // Step 3: Calculate AI impact metrics
      const impactMetrics = this.calculateImpactMetrics(economicData, jobMarketData);
      
      // Step 4: Generate OpenAI insights with real data
      const aiInsights = await this.generateAIInsights(countryCode, economicData, jobMarketData, impactMetrics);
      
      // Step 5: Create comprehensive report
      const analysisReport = {
        country: countryCode.toUpperCase(),
        timestamp: new Date().toISOString(),
        economicData: economicData,
        jobMarketData: jobMarketData,
        impactMetrics: impactMetrics,
        aiInsights: aiInsights,
        dataQuality: this.assessDataQuality(economicData, jobMarketData),
        recommendations: this.generateRecommendations(impactMetrics)
      };
      
      console.log(`✅ Enhanced analysis completed for ${countryCode.toUpperCase()}`);
      return analysisReport;
      
    } catch (error) {
      console.error(`❌ Enhanced analysis failed for ${countryCode}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Fetch real economic data from FRED API
   */
  async fetchEconomicData(countryCode) {
    try {
      console.log(`📊 Fetching FRED economic data for ${countryCode}...`);
      
      const indicators = COUNTRY_ECONOMIC_INDICATORS[countryCode.toLowerCase()];
      if (!indicators) {
        console.warn(`⚠️ No FRED indicators available for ${countryCode}, using fallback data`);
        return this.getFallbackEconomicData(countryCode);
      }
      
      const economicData = {};
      
      // Fetch each economic indicator
      for (const [key, seriesId] of Object.entries(indicators)) {
        try {
          const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=12&sort_order=desc`;
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`FRED API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.observations && data.observations.length > 0) {
            const latestData = data.observations.filter(obs => obs.value !== '.').slice(0, 3);
            economicData[key] = {
              current: parseFloat(latestData[0]?.value) || 0,
              previous: parseFloat(latestData[1]?.value) || 0,
              trend: this.calculateTrend(latestData),
              lastUpdated: latestData[0]?.date,
              seriesId: seriesId
            };
          }
          
          // Rate limiting - be respectful to FRED API
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${key} for ${countryCode}:`, error.message);
          economicData[key] = { current: 0, previous: 0, trend: 'stable', error: error.message };
        }
      }
      
      console.log(`✅ FRED data fetched for ${countryCode}:`, Object.keys(economicData));
      return economicData;
      
    } catch (error) {
      console.error(`❌ FRED data fetch failed for ${countryCode}:`, error.message);
      return this.getFallbackEconomicData(countryCode);
    }
  }
  
  /**
   * Analyze job market using existing job search API
   */
  async analyzeJobMarket(countryCode) {
    try {
      console.log(`💼 Analyzing job market for ${countryCode}...`);
      
      const jobAnalysis = {};
      
      // Analyze each job category
      for (const [category, keywords] of Object.entries(JOB_CATEGORIES)) {
        const categoryData = {
          totalJobs: 0,
          averageSalary: 0,
          topCompanies: [],
          locations: [],
          trends: 'stable'
        };
        
        // Search for jobs in each keyword
        for (const keyword of keywords.slice(0, 2)) { // Limit to prevent API overload
          try {
            const response = await fetch(`http://localhost:3000/api/jobs/search?query=${encodeURIComponent(keyword)}&location=${countryCode}&page=0`);
            
            if (response.ok) {
              const jobData = await response.json();
              
              if (jobData.success && jobData.jobs) {
                categoryData.totalJobs += jobData.total_results || 0;
                
                // Extract salary data
                const salaries = jobData.jobs
                  .filter(job => job.salary_min && job.salary_max)
                  .map(job => (job.salary_min + job.salary_max) / 2);
                
                if (salaries.length > 0) {
                  categoryData.averageSalary = salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length;
                }
                
                // Extract companies and locations
                jobData.jobs.forEach(job => {
                  if (job.company && !categoryData.topCompanies.includes(job.company)) {
                    categoryData.topCompanies.push(job.company);
                  }
                  if (job.location && !categoryData.locations.includes(job.location)) {
                    categoryData.locations.push(job.location);
                  }
                });
              }
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            console.warn(`⚠️ Job search failed for ${keyword} in ${countryCode}:`, error.message);
          }
        }
        
        // Limit arrays to prevent data bloat
        categoryData.topCompanies = categoryData.topCompanies.slice(0, 5);
        categoryData.locations = categoryData.locations.slice(0, 10);
        categoryData.averageSalary = Math.round(categoryData.averageSalary);
        
        jobAnalysis[category] = categoryData;
      }
      
      console.log(`✅ Job market analysis completed for ${countryCode}`);
      return jobAnalysis;
      
    } catch (error) {
      console.error(`❌ Job market analysis failed for ${countryCode}:`, error.message);
      return this.getFallbackJobData(countryCode);
    }
  }
  
  /**
   * Calculate AI impact metrics
   */
  calculateImpactMetrics(economicData, jobMarketData) {
    try {
      const metrics = {
        aiAdoptionScore: 0,
        jobDisplacementRisk: 0,
        opportunityIndex: 0,
        economicResilience: 0,
        skillDemandShift: 0
      };
      
      // AI Adoption Score (0-100)
      const aiJobs = jobMarketData.ai_roles?.totalJobs || 0;
      const totalTechJobs = (jobMarketData.ai_roles?.totalJobs || 0) + (jobMarketData.tech_traditional?.totalJobs || 0);
      metrics.aiAdoptionScore = totalTechJobs > 0 ? Math.min(100, (aiJobs / totalTechJobs) * 100) : 0;
      
      // Job Displacement Risk (0-100)
      const automationRiskJobs = jobMarketData.automation_risk?.totalJobs || 0;
      const emergingJobs = jobMarketData.emerging_roles?.totalJobs || 0;
      metrics.jobDisplacementRisk = automationRiskJobs > 0 ? Math.max(0, 100 - (emergingJobs / automationRiskJobs) * 100) : 0;
      
      // Opportunity Index (0-100)
      const aiSalary = jobMarketData.ai_roles?.averageSalary || 0;
      const traditionalSalary = jobMarketData.tech_traditional?.averageSalary || 0;
      const salaryPremium = traditionalSalary > 0 ? (aiSalary / traditionalSalary) : 1;
      metrics.opportunityIndex = Math.min(100, (aiJobs * salaryPremium) / 10);
      
      // Economic Resilience (0-100)
      const unemploymentRate = economicData.unemployment?.current || 5;
      const employmentGrowth = economicData.employment?.trend === 'increasing' ? 20 : 0;
      metrics.economicResilience = Math.max(0, 100 - (unemploymentRate * 10) + employmentGrowth);
      
      // Skill Demand Shift (0-100)
      metrics.skillDemandShift = Math.min(100, (emergingJobs + aiJobs) / 5);
      
      // Round all metrics
      Object.keys(metrics).forEach(key => {
        metrics[key] = Math.round(metrics[key]);
      });
      
      return metrics;
      
    } catch (error) {
      console.error('❌ Failed to calculate impact metrics:', error.message);
      return {
        aiAdoptionScore: 50,
        jobDisplacementRisk: 30,
        opportunityIndex: 70,
        economicResilience: 60,
        skillDemandShift: 40
      };
    }
  }
  
  /**
   * Generate AI insights using OpenAI with real data
   */
  async generateAIInsights(countryCode, economicData, jobMarketData, impactMetrics) {
    try {
      console.log(`🤖 Generating AI insights for ${countryCode}...`);
      
      const prompt = `
You are an expert AI economist analyzing the impact of artificial intelligence on ${countryCode.toUpperCase()}'s job market.

REAL ECONOMIC DATA:
- Unemployment Rate: ${economicData.unemployment?.current || 'N/A'}%
- Employment Trend: ${economicData.employment?.trend || 'stable'}
- Economic Resilience Score: ${impactMetrics.economicResilience}/100

REAL JOB MARKET DATA:
- AI/ML Jobs Available: ${jobMarketData.ai_roles?.totalJobs || 0}
- Traditional Tech Jobs: ${jobMarketData.tech_traditional?.totalJobs || 0}
- Average AI Salary: $${jobMarketData.ai_roles?.averageSalary || 0}
- Automation Risk Jobs: ${jobMarketData.automation_risk?.totalJobs || 0}
- Emerging AI Roles: ${jobMarketData.emerging_roles?.totalJobs || 0}

CALCULATED METRICS:
- AI Adoption Score: ${impactMetrics.aiAdoptionScore}/100
- Job Displacement Risk: ${impactMetrics.jobDisplacementRisk}/100
- Opportunity Index: ${impactMetrics.opportunityIndex}/100

Create a 3-phase analysis:
1. REALITY CHECK: Current state with specific numbers
2. OPPORTUNITY SPOTLIGHT: What's emerging and growing
3. ACTION PLAN: Concrete steps for individuals

Be data-driven, honest but optimistic. Use the real numbers provided.
Format as: PHASE1: [content] | PHASE2: [content] | PHASE3: [content]
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      });
      
      const analysis = completion.choices[0].message.content;
      const phases = this.parseAnalysisPhases(analysis);
      
      console.log(`✅ AI insights generated for ${countryCode}`);
      return phases;
      
    } catch (error) {
      console.error(`❌ AI insights generation failed for ${countryCode}:`, error.message);
      return this.getFallbackInsights(countryCode, impactMetrics);
    }
  }
  
  /**
   * Parse OpenAI analysis into structured phases
   */
  parseAnalysisPhases(analysis) {
    try {
      const phases = analysis.split('|').map(phase => phase.trim());
      return {
        phase1: phases[0]?.replace(/PHASE\d+:\s*/, '') || "Analyzing current market conditions...",
        phase2: phases[1]?.replace(/PHASE\d+:\s*/, '') || "Identifying emerging opportunities...",
        phase3: phases[2]?.replace(/PHASE\d+:\s*/, '') || "Creating actionable recommendations..."
      };
    } catch (error) {
      return {
        phase1: "AI is reshaping the job market with measurable impact on employment patterns.",
        phase2: "New opportunities are emerging in AI development, data analysis, and human-AI collaboration.",
        phase3: "Focus on continuous learning, building AI literacy, and developing complementary human skills."
      };
    }
  }
  
  /**
   * Calculate trend from time series data
   */
  calculateTrend(dataPoints) {
    if (!dataPoints || dataPoints.length < 2) return 'stable';
    
    const current = parseFloat(dataPoints[0]?.value) || 0;
    const previous = parseFloat(dataPoints[1]?.value) || 0;
    
    const change = ((current - previous) / previous) * 100;
    
    if (change > 2) return 'increasing';
    if (change < -2) return 'decreasing';
    return 'stable';
  }
  
  /**
   * Assess data quality
   */
  assessDataQuality(economicData, jobMarketData) {
    const economicDataPoints = Object.keys(economicData).length;
    const jobDataPoints = Object.keys(jobMarketData).length;
    
    return {
      economicDataAvailable: economicDataPoints,
      jobDataAvailable: jobDataPoints,
      overallQuality: economicDataPoints > 2 && jobDataPoints > 2 ? 'high' : 'medium',
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Generate recommendations based on metrics
   */
  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.aiAdoptionScore > 70) {
      recommendations.push("High AI adoption - focus on advanced AI skills and specialization");
    } else if (metrics.aiAdoptionScore < 30) {
      recommendations.push("Low AI adoption - opportunity for early movers and AI education");
    }
    
    if (metrics.jobDisplacementRisk > 60) {
      recommendations.push("High displacement risk - prioritize reskilling and emerging technologies");
    }
    
    if (metrics.opportunityIndex > 70) {
      recommendations.push("Strong opportunities - leverage high demand for AI professionals");
    }
    
    return recommendations;
  }
  
  /**
   * Fallback economic data when FRED API is unavailable
   */
  getFallbackEconomicData(countryCode) {
    const fallbackData = {
      us: { unemployment: { current: 3.7, trend: 'stable' }, employment: { current: 157000, trend: 'increasing' } },
      uk: { unemployment: { current: 4.2, trend: 'stable' }, employment: { current: 32500, trend: 'stable' } },
      de: { unemployment: { current: 3.1, trend: 'decreasing' }, employment: { current: 45200, trend: 'increasing' } },
      ca: { unemployment: { current: 5.8, trend: 'stable' }, employment: { current: 19800, trend: 'stable' } },
      fr: { unemployment: { current: 7.3, trend: 'decreasing' }, employment: { current: 28100, trend: 'stable' } }
    };
    
    return fallbackData[countryCode.toLowerCase()] || fallbackData.us;
  }
  
  /**
   * Fallback job data when job search API is unavailable
   */
  getFallbackJobData(countryCode) {
    return {
      ai_roles: { totalJobs: 150, averageSalary: 95000, topCompanies: ['Tech Corp', 'AI Innovations'], locations: ['Major City'] },
      tech_traditional: { totalJobs: 800, averageSalary: 75000, topCompanies: ['Software Inc', 'Dev Solutions'], locations: ['Tech Hub'] },
      automation_risk: { totalJobs: 200, averageSalary: 45000, topCompanies: ['Service Co'], locations: ['Business District'] },
      emerging_roles: { totalJobs: 75, averageSalary: 85000, topCompanies: ['Future Tech'], locations: ['Innovation Center'] }
    };
  }
  
  /**
   * Fallback AI insights when OpenAI is unavailable
   */
  getFallbackInsights(countryCode, metrics) {
    return {
      phase1: `The AI job market in ${countryCode.toUpperCase()} shows ${metrics.aiAdoptionScore > 50 ? 'strong' : 'emerging'} adoption with ${metrics.economicResilience > 60 ? 'stable' : 'challenging'} economic conditions.`,
      phase2: `Opportunities are ${metrics.opportunityIndex > 60 ? 'abundant' : 'developing'} in AI development, data science, and automation technologies.`,
      phase3: `Focus on building AI literacy, networking with tech professionals, and staying updated with emerging technologies in your region.`
    };
  }
}

export default EnhancedAIAnalytics;