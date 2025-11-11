// AI Leaderboard Routes - Country AI Dominance Rankings
import express from 'express';

const router = express.Router();

/**
 * GET /api/ai-leaderboard - Global AI dominance leaderboard
 */
router.get('/', async (req, res) => {
  try {
    // Generate AI leaderboard data
    const leaderboard = [
      {
        rank: 1,
        country: "US",
        countryName: "United States",
        aiScore: 95,
        aiJobs: 2500000,
        aiCompanies: 15000,
        aiInvestment: 50000000000,
        trend: "up",
        change: "+5.2%"
      },
      {
        rank: 2,
        country: "CN",
        countryName: "China",
        aiScore: 88,
        aiJobs: 1800000,
        aiCompanies: 12000,
        aiInvestment: 35000000000,
        trend: "up",
        change: "+8.1%"
      },
      {
        rank: 3,
        country: "GB",
        countryName: "United Kingdom",
        aiScore: 78,
        aiJobs: 450000,
        aiCompanies: 3500,
        aiInvestment: 8000000000,
        trend: "up",
        change: "+3.7%"
      },
      {
        rank: 4,
        country: "DE",
        countryName: "Germany",
        aiScore: 75,
        aiJobs: 380000,
        aiCompanies: 2800,
        aiInvestment: 6500000000,
        trend: "up",
        change: "+2.9%"
      },
      {
        rank: 5,
        country: "CA",
        countryName: "Canada",
        aiScore: 72,
        aiJobs: 320000,
        aiCompanies: 2200,
        aiInvestment: 4500000000,
        trend: "up",
        change: "+4.1%"
      },
      {
        rank: 6,
        country: "FR",
        countryName: "France",
        aiScore: 70,
        aiJobs: 290000,
        aiCompanies: 2000,
        aiInvestment: 4000000000,
        trend: "stable",
        change: "+1.8%"
      },
      {
        rank: 7,
        country: "JP",
        countryName: "Japan",
        aiScore: 68,
        aiJobs: 275000,
        aiCompanies: 1800,
        aiInvestment: 3800000000,
        trend: "up",
        change: "+2.3%"
      },
      {
        rank: 8,
        country: "KR",
        countryName: "South Korea",
        aiScore: 65,
        aiJobs: 220000,
        aiCompanies: 1500,
        aiInvestment: 3200000000,
        trend: "up",
        change: "+3.5%"
      },
      {
        rank: 9,
        country: "IN",
        countryName: "India",
        aiScore: 62,
        aiJobs: 850000,
        aiCompanies: 4500,
        aiInvestment: 2800000000,
        trend: "up",
        change: "+6.2%"
      },
      {
        rank: 10,
        country: "AU",
        countryName: "Australia",
        aiScore: 58,
        aiJobs: 180000,
        aiCompanies: 1200,
        aiInvestment: 2200000000,
        trend: "up",
        change: "+2.7%"
      }
    ];

    res.json({
      success: true,
      leaderboard,
      totalCountries: leaderboard.length,
      lastUpdated: new Date().toISOString(),
      methodology: {
        factors: [
          "AI job market size",
          "Number of AI companies",
          "AI investment levels",
          "Research output",
          "Government AI initiatives"
        ],
        scoring: "Weighted composite score (0-100)"
      }
    });
  } catch (error) {
    console.error('❌ AI Leaderboard error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI leaderboard',
      details: error.message
    });
  }
});

/**
 * GET /api/ai-leaderboard/country/:code - Specific country ranking
 */
router.get('/country/:code', async (req, res) => {
  try {
    const countryCode = req.params.code.toUpperCase();
    
    // Mock country-specific data
    const countryData = {
      country: countryCode,
      rank: Math.floor(Math.random() * 20) + 1,
      aiScore: Math.floor(Math.random() * 40) + 60,
      details: {
        aiJobs: Math.floor(Math.random() * 1000000) + 100000,
        aiCompanies: Math.floor(Math.random() * 5000) + 500,
        aiInvestment: Math.floor(Math.random() * 10000000000) + 1000000000,
        trend: Math.random() > 0.3 ? "up" : "stable",
        change: `+${(Math.random() * 8 + 1).toFixed(1)}%`
      }
    };

    res.json({
      success: true,
      country: countryData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Country AI ranking error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get country AI ranking',
      details: error.message
    });
  }
});

export default router;