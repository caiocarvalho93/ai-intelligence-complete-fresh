/**
 * 🧠 SMART TRANSLATION CACHE SYSTEM
 * Saves money by caching translations and only hitting OpenAI for new words
 * Builds your translation memory for instant responses
 */

import { enhancedAnalyticsDatabase } from './enhanced-analytics-database.js';

class SmartTranslationCache {
  constructor() {
    this.memoryCache = new Map(); // Fast in-memory cache
    this.cacheStats = {
      hits: 0,
      misses: 0,
      openAICalls: 0,
      moneySaved: 0
    };
  }

  /**
   * Generate cache key for translation pair
   */
  generateCacheKey(text, sourceLanguage, targetLanguage) {
    // Normalize text for consistent caching
    const normalizedText = text.toLowerCase().trim();
    return `${normalizedText}|${sourceLanguage}|${targetLanguage}`;
  }

  /**
   * Check if translation exists in cache (database or memory)
   */
  async getCachedTranslation(text, sourceLanguage, targetLanguage) {
    const cacheKey = this.generateCacheKey(text, sourceLanguage, targetLanguage);
    
    try {
      // 1. Check fast in-memory cache first
      if (this.memoryCache.has(cacheKey)) {
        this.cacheStats.hits++;
        console.log('💚 Cache HIT (Memory):', text.substring(0, 50));
        return {
          ...this.memoryCache.get(cacheKey),
          cacheSource: 'memory',
          cached: true
        };
      }

      // 2. Check database cache
      const dbResult = await this.checkDatabaseCache(text, sourceLanguage, targetLanguage);
      if (dbResult) {
        this.cacheStats.hits++;
        // Store in memory for faster future access
        this.memoryCache.set(cacheKey, dbResult);
        console.log('💙 Cache HIT (Database):', text.substring(0, 50));
        return {
          ...dbResult,
          cacheSource: 'database',
          cached: true
        };
      }

      // 3. Not found in cache
      this.cacheStats.misses++;
      console.log('🔍 Cache MISS - Need new translation:', text.substring(0, 50));
      return null;

    } catch (error) {
      console.error('Cache check error:', error);
      return null;
    }
  }

  /**
   * Check database for existing translation
   */
  async checkDatabaseCache(text, sourceLanguage, targetLanguage) {
    try {
      // Query your database for existing translation
      const query = `
        SELECT translated_text, confidence, created_at 
        FROM translations 
        WHERE original_text = ? 
        AND source_language = ? 
        AND target_language = ?
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      // This would connect to your actual database
      // For now, we'll simulate with the analytics database
      const result = await enhancedAnalyticsDatabase.findTranslation(
        text, sourceLanguage, targetLanguage
      );

      if (result) {
        return {
          translatedText: result.translated_text,
          confidence: result.confidence || 0.95,
          sourceLanguage,
          targetLanguage,
          timestamp: result.created_at
        };
      }

      return null;
    } catch (error) {
      console.error('Database cache check error:', error);
      return null;
    }
  }

  /**
   * Store new translation in cache and database
   */
  async storeTranslation(originalText, translatedText, sourceLanguage, targetLanguage, confidence = 0.95) {
    const cacheKey = this.generateCacheKey(originalText, sourceLanguage, targetLanguage);
    
    const translationData = {
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence,
      timestamp: new Date().toISOString(),
      cached: false
    };

    try {
      // 1. Store in memory cache for fast access
      this.memoryCache.set(cacheKey, translationData);

      // 2. Store in database for persistence
      await enhancedAnalyticsDatabase.storeTranslation({
        originalText,
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence,
        timestamp: translationData.timestamp,
        apiSource: 'smart_cache_system'
      });

      // 3. Track that we made an OpenAI call
      this.cacheStats.openAICalls++;
      this.cacheStats.moneySaved += 0.002; // Estimate $0.002 per call saved in future

      console.log('💾 Stored new translation in cache:', originalText.substring(0, 50));
      
      return translationData;

    } catch (error) {
      console.error('Error storing translation:', error);
      return translationData;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const totalRequests = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = totalRequests > 0 ? (this.cacheStats.hits / totalRequests * 100).toFixed(1) : 0;
    
    return {
      ...this.cacheStats,
      totalRequests,
      hitRate: `${hitRate}%`,
      memoryCacheSize: this.memoryCache.size,
      estimatedMoneySaved: `$${this.cacheStats.moneySaved.toFixed(2)}`
    };
  }

  /**
   * Clear memory cache (keep database cache)
   */
  clearMemoryCache() {
    const size = this.memoryCache.size;
    this.memoryCache.clear();
    console.log(`🧹 Cleared memory cache: ${size} entries removed`);
  }

  /**
   * Preload popular translations into memory
   */
  async preloadPopularTranslations(limit = 1000) {
    try {
      console.log('🚀 Preloading popular translations into memory...');
      
      // Get most frequently requested translations from database
      const popularTranslations = await enhancedAnalyticsDatabase.getPopularTranslations(limit);
      
      let loaded = 0;
      for (const translation of popularTranslations) {
        const cacheKey = this.generateCacheKey(
          translation.original_text,
          translation.source_language,
          translation.target_language
        );
        
        this.memoryCache.set(cacheKey, {
          translatedText: translation.translated_text,
          confidence: translation.confidence,
          sourceLanguage: translation.source_language,
          targetLanguage: translation.target_language,
          timestamp: translation.created_at
        });
        
        loaded++;
      }
      
      console.log(`✅ Preloaded ${loaded} popular translations into memory cache`);
      return loaded;
      
    } catch (error) {
      console.error('Error preloading translations:', error);
      return 0;
    }
  }
}

// Create singleton instance
export const smartTranslationCache = new SmartTranslationCache();

// Preload popular translations on startup
smartTranslationCache.preloadPopularTranslations();

export default SmartTranslationCache;