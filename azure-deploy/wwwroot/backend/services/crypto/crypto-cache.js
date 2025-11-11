/**
 * 🧊 CRYPTO CACHE MANAGER
 * Advanced caching strategies for crypto data
 */

import NodeCache from 'node-cache';

class CryptoCacheManager {
  constructor() {
    // Different TTL for different data types
    this.priceCache = new NodeCache({ stdTTL: 300 }); // 5 minutes for prices
    this.marketCache = new NodeCache({ stdTTL: 1800 }); // 30 minutes for market data
    this.staticCache = new NodeCache({ stdTTL: 86400 }); // 24 hours for static data
    this.chartCache = new NodeCache({ stdTTL: 3600 }); // 1 hour for charts
    
    console.log('🧊 Crypto Cache Manager initialized');
  }

  /**
   * Get from price cache (short TTL)
   */
  getPrice(key) {
    return this.priceCache.get(key);
  }

  /**
   * Set price cache
   */
  setPrice(key, data) {
    return this.priceCache.set(key, data);
  }

  /**
   * Get from market cache (medium TTL)
   */
  getMarket(key) {
    return this.marketCache.get(key);
  }

  /**
   * Set market cache
   */
  setMarket(key, data) {
    return this.marketCache.set(key, data);
  }

  /**
   * Get from static cache (long TTL)
   */
  getStatic(key) {
    return this.staticCache.get(key);
  }

  /**
   * Set static cache
   */
  setStatic(key, data) {
    return this.staticCache.set(key, data);
  }

  /**
   * Get from chart cache
   */
  getChart(key) {
    return this.chartCache.get(key);
  }

  /**
   * Set chart cache
   */
  setChart(key, data) {
    return this.chartCache.set(key, data);
  }

  /**
   * Check if any cache has the key
   */
  has(key) {
    return this.priceCache.has(key) || 
           this.marketCache.has(key) || 
           this.staticCache.has(key) ||
           this.chartCache.has(key);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      price: {
        keys: this.priceCache.keys().length,
        hits: this.priceCache.getStats().hits,
        misses: this.priceCache.getStats().misses
      },
      market: {
        keys: this.marketCache.keys().length,
        hits: this.marketCache.getStats().hits,
        misses: this.marketCache.getStats().misses
      },
      static: {
        keys: this.staticCache.keys().length,
        hits: this.staticCache.getStats().hits,
        misses: this.staticCache.getStats().misses
      },
      chart: {
        keys: this.chartCache.keys().length,
        hits: this.chartCache.getStats().hits,
        misses: this.chartCache.getStats().misses
      }
    };
  }

  /**
   * Clear all caches
   */
  clearAll() {
    this.priceCache.flushAll();
    this.marketCache.flushAll();
    this.staticCache.flushAll();
    this.chartCache.flushAll();
    console.log('🧹 All crypto caches cleared');
  }

  /**
   * Clear specific cache type
   */
  clearCache(type) {
    switch (type) {
      case 'price':
        this.priceCache.flushAll();
        break;
      case 'market':
        this.marketCache.flushAll();
        break;
      case 'static':
        this.staticCache.flushAll();
        break;
      case 'chart':
        this.chartCache.flushAll();
        break;
      default:
        console.warn('Unknown cache type:', type);
    }
  }
}

// Export singleton instance
const cryptoCache = new CryptoCacheManager();
export default cryptoCache;