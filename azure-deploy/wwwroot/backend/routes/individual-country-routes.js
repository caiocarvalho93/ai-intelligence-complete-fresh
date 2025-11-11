// Individual Country Tables API Routes
// Dedicated API endpoints for country-specific news with individual tables

import express from 'express';
import { individualCountryTables } from '../services/individual-country-tables.js';

const router = express.Router();

/**
 * GET /api/country-tables/stats - Get statistics for all country tables
 */
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Getting country tables statistics...');
    
    const stats = await individualCountryTables.getAllCountryStats();
    
    res.json({
      success: true,
      stats,
      message: 'Country tables statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Failed to get country stats:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve country statistics'
    });
  }
});

/**
 * GET /api/country-tables/:country - Get news from specific country table
 */
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { limit = 20, minRelevance = 60 } = req.query;

    console.log(`📰 Getting news from ${country.toUpperCase()} table...`);
    
    const articles = await individualCountryTables.getFromCountryTable(
      country.toUpperCase(), 
      parseInt(limit), 
      parseInt(minRelevance)
    );
    
    res.json({
      success: true,
      country: country.toUpperCase(),
      articles,
      count: articles.length,
      message: `Retrieved ${articles.length} articles from ${country.toUpperCase()} table`
    });

  } catch (error) {
    console.error(`❌ Failed to get ${req.params.country} news:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: `Failed to retrieve news for ${req.params.country}`
    });
  }
});

/**
 * POST /api/country-tables/create - Create all individual country tables
 */
router.post('/create', async (req, res) => {
  try {
    console.log('🏗️ Creating individual country tables...');
    
    const success = await individualCountryTables.createCountryTables();
    
    if (success) {
      res.json({
        success: true,
        message: 'All individual country tables created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create some country tables'
      });
    }

  } catch (error) {
    console.error('❌ Failed to create country tables:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to create country tables'
    });
  }
});

/**
 * POST /api/country-tables/fetch/:country - Run dedicated searcher for specific country
 */
router.post('/fetch/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { articles = 10 } = req.body;

    console.log(`🚀 Running dedicated searcher for ${country.toUpperCase()}...`);
    
    const result = await individualCountryTables.fetchAndStoreCountryNews(
      country.toUpperCase(), 
      parseInt(articles)
    );
    
    res.json({
      success: result.success,
      country: country.toUpperCase(),
      result,
      message: result.message || `Dedicated searcher completed for ${country.toUpperCase()}`
    });

  } catch (error) {
    console.error(`❌ Dedicated searcher failed for ${req.params.country}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: `Dedicated searcher failed for ${req.params.country}`
    });
  }
});

/**
 * POST /api/country-tables/populate - Populate individual country tables from existing database
 */
router.post('/populate', async (req, res) => {
  try {
    console.log('🔄 Populating individual country tables from existing database...');
    
    const result = await individualCountryTables.populateFromExistingDatabase();
    
    res.json({
      success: result.success,
      message: result.success ? 'Individual country tables populated successfully' : 'Population failed',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Failed to populate country tables:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to populate individual country tables'
    });
  }
});

/**
 * POST /api/country-tables/fetch-all - Run all dedicated searchers (MASSIVE FETCH)
 */
router.post('/fetch-all', async (req, res) => {
  try {
    const { articles = 8 } = req.body;

    console.log('🌍 MASSIVE COUNTRY NEWS FETCH - Running all dedicated searchers...');
    
    // Start the massive fetch process
    const fetchPromise = individualCountryTables.runAllDedicatedSearchers(parseInt(articles));
    
    // Return immediate response since this takes time
    res.json({
      success: true,
      message: 'Massive country news fetch started for all countries',
      status: 'processing',
      note: 'This process runs in background. Check /stats endpoint for results.'
    });

    // Let the fetch continue in background
    fetchPromise.then(result => {
      console.log('🎯 MASSIVE FETCH COMPLETED:', result.summary);
    }).catch(error => {
      console.error('❌ MASSIVE FETCH FAILED:', error.message);
    });

  } catch (error) {
    console.error('❌ Failed to start massive fetch:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to start massive country news fetch'
    });
  }
});

/**
 * POST /api/country-tables/fetch-focused - Fetch country-focused news to fill main database
 */
router.post('/fetch-focused', async (req, res) => {
  try {
    console.log('🎯 Starting country-focused news fetch to fill main database...');
    
    const { countryFocusedNewsFetcher } = await import('../services/country-focused-news-fetcher.js');
    
    // Start the fetch process
    const fetchPromise = countryFocusedNewsFetcher.fetchAllCountriesFocusedNews();
    
    // Return immediate response since this takes time
    res.json({
      success: true,
      message: 'Country-focused news fetch started for all countries',
      status: 'processing',
      note: 'This process fetches country-specific articles and adds them to main database. Check /stats after completion.'
    });

    // Let the fetch continue in background
    fetchPromise.then(result => {
      console.log('🎯 COUNTRY-FOCUSED FETCH COMPLETED:', result);
    }).catch(error => {
      console.error('❌ COUNTRY-FOCUSED FETCH FAILED:', error.message);
    });

  } catch (error) {
    console.error('❌ Failed to start country-focused fetch:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to start country-focused news fetch'
    });
  }
});

/**
 * POST /api/country-tables/grok-cleanup - Use Grok Brain to clean up country assignments
 */
router.post('/grok-cleanup', async (req, res) => {
  try {
    console.log('🧠 Starting Grok Brain country cleanup with unlimited web search...');
    
    const { grokCountryFilter } = await import('../services/grok-country-filter.js');
    
    // Start the Grok cleanup process
    const cleanupPromise = grokCountryFilter.cleanupCountryAssignments();
    
    // Return immediate response since this takes time
    res.json({
      success: true,
      message: 'Grok Brain country cleanup started with unlimited web search',
      status: 'processing',
      note: 'Grok is analyzing all articles with web search to ensure 100% country accuracy. Check logs for progress.'
    });

    // Let the cleanup continue in background
    cleanupPromise.then(result => {
      console.log('🧠 GROK CLEANUP COMPLETED:', result);
    }).catch(error => {
      console.error('❌ GROK CLEANUP FAILED:', error.message);
    });

  } catch (error) {
    console.error('❌ Failed to start Grok cleanup:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to start Grok Brain country cleanup'
    });
  }
});

/**
 * GET /api/country-tables/test/:country - Test country table functionality
 */
router.get('/test/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const countryCode = country.toUpperCase();

    console.log(`🧪 Testing country table functionality for ${countryCode}...`);

    // Test 1: Check if table exists and get sample data
    const articles = await individualCountryTables.getFromCountryTable(countryCode, 5, 0);
    
    // Test 2: Get table name mapping
    const tableName = individualCountryTables.getCountryTableName(countryCode);
    
    // Test 3: Try a small fetch and store
    const fetchResult = await individualCountryTables.fetchAndStoreCountryNews(countryCode, 2);

    res.json({
      success: true,
      country: countryCode,
      tests: {
        tableExists: tableName !== undefined,
        tableName: tableName,
        existingArticles: articles.length,
        sampleArticles: articles.slice(0, 2),
        fetchTest: fetchResult
      },
      message: `Country table test completed for ${countryCode}`
    });

  } catch (error) {
    console.error(`❌ Country table test failed for ${req.params.country}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: `Country table test failed for ${req.params.country}`
    });
  }
});

export default router;