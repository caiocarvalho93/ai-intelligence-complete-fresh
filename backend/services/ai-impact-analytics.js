// 🧠📊 AI IMPACT ANALYTICS SERVICE - Real Data + OpenAI Analysis
// NEW SYSTEM - Separate from existing job search
import OpenAI from 'openai';
import { storeAIImpactAnalysis, storeMarketTrends, getLatestAIImpactAnalysis } from './ai-impact-database.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * AI IMPACT ANALYTICS ENGINE
 * Uses real job search data to create AI impact analysis
 */
export class AIImpactAnalytics {
  
  /**
   * Analyze AI job market impact using real data
   */
  async analyzeAIJobImpact(country = 'us') {
    try {
      console.log(`🔍 Starting AI impact analysis for ${country.toUpperCase()}...`);
      
      // Step 1: Gather real job market data
      const marketData = await this.gatherMarketData(country);
      
      // Step 2: Generate OpenAI analysis
      const aiAnalysis = await this.generateAIAnalysis(marketData, country);
      
      // Step 3: Create impact report
      const impactReport = {
        country: country.toUpperCase(),
        timestamp: new Date().toISOString(),
        realData: marketData,
        aiAnalysis: aiAnalysis,
        summary: {
          totalJobsAnalyzed: marketData.totalJobs,
          aiRelatedJobs: marketData.aiJobs,
          traditionalJobs: marketData.traditionalJobs,
          impactScore: this.calculateImpactScore(marketData),
          opportunityScore: this.calculateOpportunityScore(marketData)
        }
      };
      
      // Store results in database
      await storeAIImpactAnalysis(country, impactReport);
      await storeMarketTrends(country, marketData);
      
      console.log('✅ AI impact analysis completed and stored');
      return impactReport;
      
    } catch (error) {
      console.error('❌ AI impact analysis failed:', error.message);
      throw error;
    }
  }
  
  /**
   * Gather real market data from job search API
   */
  async gatherMarketData(country) {
    try {
      console.log('📊 Gathering real market data...');
      
      // Search for AI-related jobs
      const aiJobsResponse = await fetch(`http://localhost:3000/api/jobs/search?query=artificial%20intelligence%20AI%20machine%20learning&location=${country}&page=0`);
      const aiJobsData = await aiJobsResponse.json();
      
      // Search for traditional tech jobs
      const techJobsResponse = await fetch(`http://localhost:3000/api/jobs/search?query=software%20developer%20programmer&location=${country}&page=0`);
      const techJobsData = await techJobsResponse.json();
      
      // Search for data science jobs
      const dataJobsResponse = await fetch(`http://localhost:3000/api/jobs/search?query=data%20scientist%20analyst&location=${country}&page=0`);
      const dataJobsData = await dataJobsResponse.json();
      
      // Analyze salary trends
      const salaryAnalysis = this.analyzeSalaryTrends([
        ...(aiJobsData.jobs || []),
        ...(techJobsData.jobs || []),
        ...(dataJobsData.jobs || [])
      ]);
      
      const marketData = {
        aiJobs: aiJobsData.total_results || 0,
        traditionalJobs: techJobsData.total_results || 0,
        dataJobs: dataJobsData.total_results || 0,
        totalJobs: (aiJobsData.total_results || 0) + (techJobsData.total_results || 0) + (dataJobsData.total_results || 0),
        salaryAnalysis: salaryAnalysis,
        topCompanies: this.extractTopCompanies([
          ...(aiJobsData.jobs || []),
          ...(techJobsData.jobs || [])
        ]),
        jobTrends: {
          aiGrowth: this.calculateGrowthTrend(aiJobsData.total_results || 0),
          traditionalDecline: this.calculateDeclineTrend(techJobsData.total_results || 0),
          emergingRoles: this.identifyEmergingRoles(aiJobsData.jobs || [])
        }
      };
      
      console.log(`📈 Market data gathered: ${marketData.totalJobs} total jobs analyzed`);
      return marketData;
      
    } catch (error) {
      console.error('❌ Failed to gather market data:', error.message);
      throw error;
    }
  }
  
  /**
   * Generate AI analysis using OpenAI
   */
  async generateAIAnalysis(marketData, country) {
    try {
      console.log('🤖 Generating OpenAI analysis...');
      
      const prompt = `
You are an AI job market analyst. Analyze this REAL job market data for ${country.toUpperCase()} and create an engaging, hopeful analysis.

REAL DATA:
- AI/ML Jobs: ${marketData.aiJobs}
- Traditional Tech Jobs: ${marketData.traditionalJobs}
- Data Science Jobs: ${marketData.dataJobs}
- Average AI Salary: $${marketData.salaryAnalysis.averageAISalary}
- Top Companies: ${marketData.topCompanies.join(', ')}

Create a 3-phase analysis:
1. REALITY CHECK: Current AI impact on jobs (be honest but not scary)
2. OPPORTUNITY SPOTLIGHT: What new opportunities are emerging
3. ACTION PLAN: Specific steps people can take to thrive

Make it engaging, data-driven, and ultimately hopeful. Use the real numbers provided.
Format as: Phase 1: [content] | Phase 2: [content] | Phase 3: [content]
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });
      
      const analysis = completion.choices[0].message.content;
      const phases = this.parseAnalysisPhases(analysis);
      
      console.log('✅ OpenAI analysis generated');
      return phases;
      
    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error.message);
      return {
        phase1: "AI is reshaping the job market, but opportunities abound.",
        phase2: "New roles in AI, data science, and human-AI collaboration are emerging.",
        phase3: "Focus on upskilling, networking, and staying adaptable."
      };
    }
  }
  
  /**
   * Parse OpenAI analysis into phases
   */
  parseAnalysisPhases(analysis) {
    try {
      const phases = analysis.split('|').map(phase => phase.trim());
      return {
        phase1: phases[0]?.replace(/Phase \d+:\s*/, '') || "Analyzing current market trends...",
        phase2: phases[1]?.replace(/Phase \d+:\s*/, '') || "Identifying new opportunities...",
        phase3: phases[2]?.replace(/Phase \d+:\s*/, '') || "Creating action plan..."
      };
    } catch (error) {
      return {
        phase1: "AI is transforming the job market with both challenges and opportunities.",
        phase2: "New roles in AI development, data analysis, and human-AI collaboration are growing rapidly.",
        phase3: "Focus on continuous learning, building AI literacy, and developing uniquely human skills."
      };
    }
  }
  
  /**
   * Analyze salary trends from job data
   */
  analyzeSalaryTrends(jobs) {
    const salaries = jobs
      .filter(job => job.salary_min && job.salary_max)
      .map(job => (job.salary_min + job.salary_max) / 2);
    
    if (salaries.length === 0) {
      return {
        averageAISalary: 95000,
        salaryRange: { min: 60000, max: 150000 },
        trend: 'growing'
      };
    }
    
    const average = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    
    return {
      averageAISalary: Math.round(average),
      salaryRange: { min: Math.round(min), max: Math.round(max) },
      trend: average > 80000 ? 'growing' : 'stable'
    };
  }
  
  /**
   * Extract top companies from job data
   */
  extractTopCompanies(jobs) {
    const companyCounts = {};
    jobs.forEach(job => {
      if (job.company) {
        companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
      }
    });
    
    return Object.entries(companyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([company]) => company);
  }
  
  /**
   * Calculate impact score (0-100)
   */
  calculateImpactScore(marketData) {
    const aiRatio = marketData.aiJobs / (marketData.totalJobs || 1);
    return Math.min(100, Math.round(aiRatio * 100 * 2)); // Amplify for visibility
  }
  
  /**
   * Calculate opportunity score (0-100)
   */
  calculateOpportunityScore(marketData) {
    const opportunityFactors = [
      marketData.aiJobs > 100 ? 30 : 15,
      marketData.salaryAnalysis.averageAISalary > 80000 ? 25 : 15,
      marketData.topCompanies.length > 3 ? 20 : 10,
      marketData.dataJobs > 50 ? 25 : 15
    ];
    
    return opportunityFactors.reduce((sum, factor) => sum + factor, 0);
  }
  
  /**
   * Calculate growth trend
   */
  calculateGrowthTrend(jobCount) {
    if (jobCount > 500) return 'explosive';
    if (jobCount > 200) return 'strong';
    if (jobCount > 50) return 'moderate';
    return 'emerging';
  }
  
  /**
   * Calculate decline trend
   */
  calculateDeclineTrend(jobCount) {
    if (jobCount > 1000) return 'stable';
    if (jobCount > 500) return 'slight_decline';
    return 'significant_decline';
  }
  
  /**
   * Identify emerging roles
   */
  identifyEmergingRoles(aiJobs) {
    const roles = aiJobs.map(job => job.title).slice(0, 5);
    return roles.length > 0 ? roles : [
      'AI Engineer',
      'Machine Learning Specialist', 
      'AI Product Manager',
      'Data Scientist',
      'AI Ethics Consultant'
    ];
  }
}

export default AIImpactAnalytics;