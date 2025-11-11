// 🔍 JOB SEARCH ROUTES - Adzuna Integration with Intelligent Caching
import express from 'express';
import { searchAdzunaJobs, clearJobCache, trackJobClick, cleanupOldJobs, getApiUsageStats } from '../services/job-search-service.js';
import { getJobSearchAnalytics } from '../database.js';

const router = express.Router();

// Job search endpoint with user tracking
router.get('/search', async (req, res) => {
  try {
    const {
      q = 'software engineering',
      l = '', // location
      page = 0
    } = req.query;

    console.log(`🔍 Job search request: "${q}" in "${l}" (page ${page})`);

    // Collect user info for analytics and smart caching
    const userInfo = {
      userIp: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.headers['x-user-id'] || null,
      isNewUser: req.headers['x-new-user'] === 'true',
      history: {
        lastSearch: req.headers['x-last-search'] ? parseInt(req.headers['x-last-search']) : null
      }
    };

    const result = await searchAdzunaJobs(q, l, parseInt(page), userInfo);
    
    res.json(result);

  } catch (error) {
    console.error('❌ Job search API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search jobs',
      message: error.message,
      retry_suggestion: 'Try again with different keywords'
    });
  }
});

// Track job clicks
router.post('/track-click', async (req, res) => {
  try {
    const { jobId } = req.body;
    
    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    const userInfo = {
      userIp: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.headers['x-user-id'] || null
    };

    await trackJobClick(jobId, userInfo);
    
    res.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('❌ Job click tracking error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to track click'
    });
  }
});

// Clear cache endpoint (for development)
router.post('/clear-cache', async (req, res) => {
  try {
    clearJobCache();
    const cleaned = await cleanupOldJobs();
    
    res.json({
      success: true,
      message: 'Job search cache cleared',
      expired_jobs_cleaned: cleaned
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

// Get job search analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await getJobSearchAnalytics();
    const apiUsage = getApiUsageStats();
    
    res.json({
      success: true,
      analytics: analytics,
      apiUsage: apiUsage
    });
  } catch (error) {
    console.error('❌ Job analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
});

// Get API usage stats
router.get('/usage', (req, res) => {
  try {
    const usage = getApiUsageStats();
    res.json({
      success: true,
      usage: usage
    });
  } catch (error) {
    console.error('❌ API usage error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get usage stats'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  const usage = getApiUsageStats();
  
  res.json({
    status: 'active',
    service: 'Adzuna Job Search with Intelligent Caching',
    credits: 'API Key Active',
    features: [
      'Smart Cache Duration',
      'Search Term Normalization', 
      'Peak Usage Management',
      'API Budget Tracking',
      'User Priority Scoring',
      'Industry-Specific Caching'
    ],
    apiUsage: usage
  });
});

export default router;
