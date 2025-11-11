import express from 'express';
const router = express.Router();

// Grok country filter routes
router.get('/status', (req, res) => {
  res.json({ status: 'Grok country filter routes active' });
});

export default router;ce.js';
import fetch from 'node-fetch';

const router = express.Router();
const grokIntelligence = new GrokCountryIntelligence();

// Test Grok filtering for a specific country
router.post('/test/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        const { articles } = req.body;

        if (!articles || !Array.isArray(articles)) {
            return res.status(400).json({
                success: false,
                error: 'Articles array is required'
            });
        }

        console.log(`🧠 Testing Grok filtering for ${countryCode} with ${articles.length} articles`);

        const filteredArticles = await grokIntelligence.filterArticlesForCountry(articles, countryCode);

        res.json({
            success: true,
            countryCode,
            originalCount: articles.length,
            filteredCount: filteredArticles.length,
            filteredArticles,
            filteringStats: {
                relevantArticles: filteredArticles.length,
                filteredOutArticles: articles.length - filteredArticles.length,
                averageRelevanceScore: filteredArticles.reduce((sum, article) => sum + (article.relevanceScore || 0), 0) / filteredArticles.length || 0
            }
        });

    } catch (error) {
        console.error('Grok filtering test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Fix Brazil filtering specifically
router.post('/fix-brazil', async (req, res) => {
    try {
        console.log('🇧🇷 ROUTE CALLED: Fixing Brazil filtering with Grok intelligence...');

        // Get current Brazil articles
        const response = await fetch('http://localhost:3000/api/country-news/BR');
        const currentData = await response.json();

        if (!currentData.articles) {
            return res.status(400).json({
                success: false,
                error: 'No Brazil articles found to filter'
            });
        }

        console.log(`📊 Current Brazil articles: ${currentData.articles.length}`);
        console.log('🔍 Sample problematic articles:');
        currentData.articles.slice(0, 3).forEach(article => {
            console.log(`   - "${article.title}" (Source: ${article.source})`);
        });

        // Apply Grok filtering
        const filteredArticles = await grokIntelligence.filterArticlesForCountry(currentData.articles, 'BR');

        console.log(`✅ Grok filtered Brazil articles: ${filteredArticles.length}/${currentData.articles.length}`);

        res.json({
            success: true,
            message: 'Brazil filtering fixed with Grok intelligence',
            before: {
                count: currentData.articles.length,
                sampleTitles: currentData.articles.slice(0, 5).map(a => a.title)
            },
            after: {
                count: filteredArticles.length,
                sampleTitles: filteredArticles.slice(0, 5).map(a => a.title)
            },
            filteredOut: {
                count: currentData.articles.length - filteredArticles.length,
                examples: currentData.articles
                    .filter(article => !filteredArticles.find(filtered => filtered.id === article.id))
                    .slice(0, 3)
                    .map(article => ({
                        title: article.title,
                        reason: 'Not relevant to Brazil'
                    }))
            },
            grokStats: {
                averageRelevanceScore: filteredArticles.reduce((sum, article) => sum + (article.relevanceScore || 0), 0) / filteredArticles.length || 0,
                grokPoweredFiltering: filteredArticles.filter(a => a.grokFiltered).length,
                localFiltering: filteredArticles.filter(a => !a.grokFiltered).length
            }
        });

    } catch (error) {
        console.error('Brazil filtering fix error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Grok analysis for a single article
router.post('/analyze-article', async (req, res) => {
    try {
        const { article, countryCode } = req.body;

        if (!article || !countryCode) {
            return res.status(400).json({
                success: false,
                error: 'Article and countryCode are required'
            });
        }

        const analysis = await grokIntelligence.analyzeArticleRelevance(article, countryCode);

        res.json({
            success: true,
            article: {
                title: article.title,
                source: article.source
            },
            countryCode,
            analysis
        });

    } catch (error) {
        console.error('Article analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;