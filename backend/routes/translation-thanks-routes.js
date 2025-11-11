import express from 'express';
const router = express.Router();

// In-memory storage for thanks (in production, use a database)
let thanksData = {
  totalThanks: 0,
  dailyThanks: 0,
  lastResetDate: new Date().toDateString(),
  thanksHistory: []
};

// Reset daily counter if it's a new day
const resetDailyIfNeeded = () => {
  const today = new Date().toDateString();
  if (thanksData.lastResetDate !== today) {
    thanksData.dailyThanks = 0;
    thanksData.lastResetDate = today;
  }
};

// POST /api/translation-thanks - Record a thanks from a developer
router.post('/translation-thanks', async (req, res) => {
  try {
    resetDailyIfNeeded();
    
    const { timestamp, userAgent, language } = req.body;
    
    // Record the thanks
    const thanksEntry = {
      id: Date.now(),
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || 'Unknown',
      language: language || 'en',
      ip: req.ip || req.connection.remoteAddress,
      date: new Date().toDateString()
    };
    
    thanksData.totalThanks++;
    thanksData.dailyThanks++;
    thanksData.thanksHistory.push(thanksEntry);
    
    // Keep only last 1000 entries to prevent memory issues
    if (thanksData.thanksHistory.length > 1000) {
      thanksData.thanksHistory = thanksData.thanksHistory.slice(-1000);
    }
    
    console.log(`🙏 New thanks received! Total: ${thanksData.totalThanks}, Today: ${thanksData.dailyThanks}`);
    
    res.json({
      success: true,
      message: 'Thanks recorded! You\'re awesome! 🎉',
      stats: {
        totalThanks: thanksData.totalThanks,
        dailyThanks: thanksData.dailyThanks,
        yourThanksId: thanksEntry.id
      }
    });
    
  } catch (error) {
    console.error('Error recording thanks:', error);
    res.status(500).json({
      success: false,
      message: 'Thanks received but couldn\'t record it properly',
      error: error.message
    });
  }
});

// GET /api/translation-thanks/stats - Get thanks statistics
router.get('/translation-thanks/stats', (req, res) => {
  try {
    resetDailyIfNeeded();
    
    // Calculate some fun stats
    const languageStats = {};
    thanksData.thanksHistory.forEach(entry => {
      languageStats[entry.language] = (languageStats[entry.language] || 0) + 1;
    });
    
    const recentThanks = thanksData.thanksHistory
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return entryDate > dayAgo;
      }).length;
    
    res.json({
      success: true,
      stats: {
        totalThanks: thanksData.totalThanks,
        dailyThanks: thanksData.dailyThanks,
        recentThanks: recentThanks,
        languageBreakdown: languageStats,
        lastThanks: thanksData.thanksHistory.slice(-5).reverse(), // Last 5 thanks
        message: `${thanksData.totalThanks} developers have said thanks! 🎉`
      }
    });
    
  } catch (error) {
    console.error('Error getting thanks stats:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve thanks stats',
      error: error.message
    });
  }
});

// GET /api/translation-thanks/leaderboard - Fun leaderboard of thanks
router.get('/translation-thanks/leaderboard', (req, res) => {
  try {
    resetDailyIfNeeded();
    
    // Group by date for daily leaderboard
    const dailyStats = {};
    thanksData.thanksHistory.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });
    
    const sortedDays = Object.entries(dailyStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    res.json({
      success: true,
      leaderboard: {
        totalThanks: thanksData.totalThanks,
        topDays: sortedDays.map(([date, count]) => ({
          date,
          thanksCount: count,
          message: `${count} thanks on ${date} 🎉`
        })),
        funFacts: [
          `${thanksData.totalThanks} developers have used our translation system!`,
          `That's ${thanksData.dailyThanks} thanks just today!`,
          `Our system is making the web more multilingual! 🌍`,
          `Thanks for being part of the translation revolution! 🚀`
        ]
      }
    });
    
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve leaderboard',
      error: error.message
    });
  }
});

export default router;