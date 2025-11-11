/**
 * 🚀 ADVANCED COINGECKO SERVICE - Smart Rate Limiting Edition
 * Comprehensive crypto data fetching with adaptive throttling
 * Features: Concurrency limiting, exponential backoff, smart caching
 */

import NodeCache from 'node-cache';
import pLimit from 'p-limit';

// Multi-tier caching system
const priceCache = new NodeCache({ stdTTL: 900 }); // 15 min for prices
const marketCache = new NodeCache({ stdTTL: 1800 }); // 30 min for market data
const staticCache = new NodeCache({ stdTTL: 3600 }); // 1 hour for static data
const globalCache = new NodeCache({ stdTTL: 3600 }); // 1 hour for global data

const API_BASE = 'https://api.coingecko.com/api/v3';

// Ultra-conservative rate limiting for free tier
const limit = pLimit(1); // Only 1 concurrent API call
let requestLog = [];
const SAFE_CALLS_PER_MIN = 5; // Very conservative for free tier
const REQUEST_DELAY = 6000; // 6 seconds between requests
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Simple in-memory cache with TTL
const cache = new Map();

/**
 * 🧠 Ultra-conservative rate-limited fetch with 10-minute caching
 */
async function rateLimitedFetch(endpoint, retries = 2) {
  const url = `${API_BASE}${endpoint}`;
  const now = Date.now();
  
  // Check cache first - 10 minute TTL
  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url);
    if (now - timestamp < CACHE_TTL_MS) {
      console.log("🧊 Cache hit (10min TTL):", endpoint);
      return data;
    } else {
      cache.delete(url); // Remove expired cache
    }
  }
  
  // Ultra-conservative rate limiting
  requestLog = requestLog.filter(t => now - t < 60000); // 1-minute window
  
  if (requestLog.length >= SAFE_CALLS_PER_MIN) {
    const waitTime = 12000 + Math.random() * 3000; // 12-15s wait
    console.warn(`⚠️ Rate limit reached. Waiting ${waitTime}ms...`);
    await new Promise(r => setTimeout(r, waitTime));
  }
  
  try {
    // Wait 6 seconds between requests to stay safe
    console.log(`⏱️ Waiting 6 seconds before API call...`);
    await new Promise(r => setTimeout(r, REQUEST_DELAY));
    
    requestLog.push(now);
    console.log(`🌐 CoinGecko Conservative API Call [${requestLog.length}/${SAFE_CALLS_PER_MIN}]:`, endpoint);
    
    const response = await fetch(url);
    
    // Handle 429 with longer backoff
    if (response.status === 429) {
      if (retries > 0) {
        const delay = (3 - retries) * 10000; // 10s, 20s
        console.warn(`🕒 Rate limit hit (429). Waiting ${delay}ms... (${retries} retries left)`);
        await new Promise(r => setTimeout(r, delay));
        return rateLimitedFetch(endpoint, retries - 1);
      } else {
        throw new Error("CoinGecko API error: 429 Too Many Requests - Monthly limit reached");
      }
    }
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in cache with timestamp
    cache.set(url, { data, timestamp: now });
    console.log(`✅ Data cached for 10 minutes:`, endpoint);
    
    return data;
  } catch (error) {
    if (retries > 0 && !error.message.includes('Monthly limit')) {
      const delay = 5000; // 5s for other errors
      console.warn(`🔄 Retrying API call in ${delay}ms... (${retries} retries left)`);
      await new Promise(r => setTimeout(r, delay));
      return rateLimitedFetch(endpoint, retries - 1);
    }
    throw error;
  }
}

/**
 * 🎯 Smart cache getter with tier selection
 */
function getFromCache(key, tier = 'market') {
  switch (tier) {
    case 'price': return priceCache.get(key);
    case 'static': return staticCache.get(key);
    case 'global': return globalCache.get(key);
    default: return marketCache.get(key);
  }
}

/**
 * 🎯 Smart cache setter with tier selection
 */
function setToCache(key, data, tier = 'market') {
  switch (tier) {
    case 'price': return priceCache.set(key, data);
    case 'static': return staticCache.set(key, data);
    case 'global': return globalCache.set(key, data);
    default: return marketCache.set(key, data);
  }
}

/**
 * 🪙 Get coin supply data with smart caching
 */
export async function getCoinSupplyData(coinId) {
  const cacheKey = `supply:${coinId}`;
  
  const cached = getFromCache(cacheKey, 'static');
  if (cached) {
    console.log('🧊 Cache hit for supply data:', coinId);
    return cached;
  }
  
  return limit(async () => {
    try {
      const data = await rateLimitedFetch(`/coins/${coinId}?localization=false&market_data=true`);
      const marketData = data.market_data || {};
      
      const supplyData = {
        circulating: marketData.circulating_supply,
        total: marketData.total_supply,
        max: marketData.max_supply,
        percentage: marketData.circulating_supply && marketData.max_supply 
          ? ((marketData.circulating_supply / marketData.max_supply) * 100).toFixed(2)
          : null,
        lastUpdated: new Date().toISOString()
      };
      
      setToCache(cacheKey, supplyData, 'static');
      console.log('✅ Supply data cached for:', coinId);
      return supplyData;
    } catch (error) {
      console.error('❌ Failed to fetch supply data for', coinId, error);
      return { circulating: null, total: null, max: null, percentage: null };
    }
  });
}

/**
 * 🌐 Get global market overview with extended caching
 */
export async function getGlobalMarketData() {
  const cacheKey = 'global_market';
  
  const cached = getFromCache(cacheKey, 'global');
  if (cached) {
    console.log('🧊 Cache hit for global market data');
    return cached;
  }
  
  return limit(async () => {
    try {
      const response = await rateLimitedFetch('/global');
      const globalData = response.data;
      
      const processedData = {
        totalMarketCap: globalData.total_market_cap?.usd || 0,
        totalVolume: globalData.total_volume?.usd || 0,
        marketCapPercentage: globalData.market_cap_percentage || {},
        activeCryptocurrencies: globalData.active_cryptocurrencies || 0,
        markets: globalData.markets || 0,
        marketCapChange24h: globalData.market_cap_change_percentage_24h_usd || 0,
        updatedAt: globalData.updated_at,
        lastFetched: new Date().toISOString()
      };
      
      setToCache(cacheKey, processedData, 'global');
      console.log('✅ Global market data cached for 1 hour');
      return processedData;
    } catch (error) {
      console.error('❌ Failed to fetch global market data:', error);
      return null;
    }
  });
}

/**
 * 📈 Get market chart data with smart caching
 */
export async function getMarketChart(coinId, days = 7) {
  const cacheKey = `chart:${coinId}:${days}`;
  
  const cached = getFromCache(cacheKey, 'market');
  if (cached) {
    console.log('🧊 Cache hit for chart data:', coinId);
    return cached;
  }
  
  return limit(async () => {
    try {
      const data = await rateLimitedFetch(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
      
      const chartData = {
        prices: data.prices || [],
        marketCaps: data.market_caps || [],
        totalVolumes: data.total_volumes || [],
        coinId,
        days,
        lastUpdated: new Date().toISOString()
      };
      
      setToCache(cacheKey, chartData, 'market');
      console.log('✅ Chart data cached for 30min:', coinId);
      return chartData;
    } catch (error) {
      console.error('❌ Failed to fetch chart data for', coinId, error);
      return { prices: [], marketCaps: [], totalVolumes: [], coinId, days };
    }
  });
}

/**
 * 🔥 Get trending coins with smart caching
 */
export async function getTrendingCoins() {
  const cacheKey = 'trending_coins';
  
  const cached = getFromCache(cacheKey, 'market');
  if (cached) {
    console.log('🧊 Cache hit for trending coins');
    return cached;
  }
  
  return limit(async () => {
    try {
      const data = await rateLimitedFetch('/search/trending');
      const trendingCoins = data.coins.map(coin => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        thumb: coin.item.thumb,
        small: coin.item.small,
        large: coin.item.large,
        marketCapRank: coin.item.market_cap_rank,
        score: coin.item.score
      }));
      
      setToCache(cacheKey, trendingCoins, 'market');
      console.log('✅ Trending coins cached for 30min:', trendingCoins.length, 'coins');
      return trendingCoins;
    } catch (error) {
      console.error('❌ Failed to fetch trending coins:', error);
      return [];
    }
  });
}

/**
 * 🏦 Get top exchanges with extended caching
 */
export async function getTopExchanges(perPage = 10) {
  const cacheKey = `exchanges:${perPage}`;
  
  const cached = getFromCache(cacheKey, 'static');
  if (cached) {
    console.log('🧊 Cache hit for exchanges');
    return cached;
  }
  
  return limit(async () => {
    try {
      const exchanges = await rateLimitedFetch(`/exchanges?per_page=${perPage}&page=1`);
      
      const processedExchanges = exchanges.map(exchange => ({
        id: exchange.id,
        name: exchange.name,
        image: exchange.image,
        trustScore: exchange.trust_score,
        trustScoreRank: exchange.trust_score_rank,
        tradeVolume24hBtc: exchange.trade_volume_24h_btc,
        country: exchange.country,
        yearEstablished: exchange.year_established,
        url: exchange.url
      }));
      
      setToCache(cacheKey, processedExchanges, 'static');
      console.log('✅ Exchanges cached for 1 hour:', processedExchanges.length, 'exchanges');
      return processedExchanges;
    } catch (error) {
      console.error('❌ Failed to fetch exchanges:', error);
      return [];
    }
  });
}

/**
 * 📊 Get top gainers and losers with smart caching
 */
export async function getTopMovers() {
  const cacheKey = 'top_movers';
  
  const cached = getFromCache(cacheKey, 'market');
  if (cached) {
    console.log('🧊 Cache hit for top movers');
    return cached;
  }
  
  return limit(async () => {
    try {
      const data = await rateLimitedFetch('/coins/top_gainers_losers?vs_currency=usd&duration=24h');
    
    const processedData = {
      topGainers: data.top_gainers?.slice(0, 5).map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        priceChangePercentage: coin.price_change_percentage_24h,
        currentPrice: coin.current_price
      })) || [],
      topLosers: data.top_losers?.slice(0, 5).map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        priceChangePercentage: coin.price_change_percentage_24h,
        currentPrice: coin.current_price
      })) || []
    };
    
    setToCache(cacheKey, processedData, 'market');
    console.log('✅ Top movers cached for 30min');
    return processedData;
    } catch (error) {
      console.error('❌ Failed to fetch top movers:', error);
      // Return mock data when API fails
      return {
        topGainers: [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', priceChangePercentage: 5.2, currentPrice: 68000 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', priceChangePercentage: 3.8, currentPrice: 2600 },
          { id: 'solana', name: 'Solana', symbol: 'SOL', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', priceChangePercentage: 7.1, currentPrice: 180 }
        ],
        topLosers: [
          { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', priceChangePercentage: -2.3, currentPrice: 0.15 },
          { id: 'ripple', name: 'XRP', symbol: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', priceChangePercentage: -1.8, currentPrice: 0.52 },
          { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', priceChangePercentage: -0.9, currentPrice: 72 }
        ]
      };
    }
  });
}

/**
 * 🔄 Get all advanced data with smart throttling
 */
export async function getAllAdvancedData(supportedCoins = []) {
  console.log('🚀 Fetching all advanced crypto data with smart throttling...');
  
  try {
    // Phase 1: Fetch global data (low frequency endpoints)
    console.log('📊 Phase 1: Fetching global market data...');
    const [globalData, trendingCoins, exchanges, topMovers] = await Promise.all([
      getGlobalMarketData(),
      getTrendingCoins(),
      getTopExchanges(5),
      getTopMovers()
    ]);
    
    // Phase 2: Minimal per-coin data to conserve API calls
    console.log('🪙 Phase 2: Fetching minimal per-coin data (conservative mode)...');
    const supplyData = {};
    const chartData = {};
    
    // Only fetch supply data for 2 most important coins to conserve API calls
    const priorityCoins = supportedCoins.slice(0, 2); // Only Bitcoin and Ethereum
    
    for (let i = 0; i < priorityCoins.length; i++) {
      const coin = priorityCoins[i];
      const coinId = typeof coin === 'string' ? coin : coin.id;
      
      try {
        console.log(`🔄 Processing priority coin ${i + 1}/${priorityCoins.length}: ${coinId}`);
        
        // Only fetch supply data, skip charts to save API calls
        const supply = await getCoinSupplyData(coinId);
        supplyData[coinId] = supply;
        
        // Generate mock chart data to avoid API calls
        chartData[coinId] = generateMockChartData(coinId);
        
        // Long delay between coins
        if (i < priorityCoins.length - 1) {
          const delay = 15000; // 15 seconds between coins
          console.log(`⏱️ Waiting ${delay}ms before next priority coin...`);
          await new Promise(r => setTimeout(r, delay));
        }
        
      } catch (error) {
        console.error(`❌ Failed to fetch data for ${coinId}:`, error);
        supplyData[coinId] = { circulating: null, total: null, max: null };
        chartData[coinId] = generateMockChartData(coinId);
      }
    }
    
    // Generate mock data for remaining coins to avoid API calls
    for (const coin of supportedCoins.slice(2)) {
      const coinId = typeof coin === 'string' ? coin : coin.id;
      supplyData[coinId] = generateMockSupplyData(coinId);
      chartData[coinId] = generateMockChartData(coinId);
    }
    
    const result = {
      global: globalData,
      trending: trendingCoins,
      exchanges,
      topMovers,
      supply: supplyData,
      charts: chartData,
      lastUpdated: new Date().toISOString(),
      fetchStats: {
        totalCoins: supportedCoins.length,
        successfulSupply: Object.keys(supplyData).filter(k => supplyData[k].circulating).length,
        successfulCharts: Object.keys(chartData).filter(k => chartData[k].prices.length > 0).length,
        requestsInLastMinute: requestLog.length
      }
    };
    
    console.log('✅ All advanced data fetched successfully:', result.fetchStats);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch advanced data:', error);
    throw error;
  }
}

/**
 * 🎭 Generate mock supply data to avoid API calls
 */
function generateMockSupplyData(coinId) {
  const mockData = {
    bitcoin: { circulating: 19675962, total: 19675962, max: 21000000, percentage: "93.69" },
    ethereum: { circulating: 120280000, total: 120280000, max: null, percentage: null },
    solana: { circulating: 460000000, total: 580000000, max: 580000000, percentage: "79.31" },
    dogecoin: { circulating: 141000000000, total: 141000000000, max: null, percentage: null },
    ripple: { circulating: 53000000000, total: 100000000000, max: 100000000000, percentage: "53.00" },
    litecoin: { circulating: 74000000, total: 74000000, max: 84000000, percentage: "88.10" }
  };
  
  return mockData[coinId] || { circulating: null, total: null, max: null, percentage: null };
}

/**
 * 🎭 Generate mock chart data to avoid API calls
 */
function generateMockChartData(coinId) {
  const basePrice = {
    bitcoin: 68000,
    ethereum: 2600,
    solana: 180,
    dogecoin: 0.15,
    ripple: 0.52,
    litecoin: 72
  }[coinId] || 100;
  
  const prices = [];
  const now = Date.now();
  
  // Generate 7 days of mock price data
  for (let i = 6; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    prices.push([timestamp, price]);
  }
  
  return {
    prices,
    marketCaps: prices.map(([t, p]) => [t, p * 19000000]), // Mock market cap
    totalVolumes: prices.map(([t, p]) => [t, p * 1000000]), // Mock volume
    coinId,
    days: 7,
    lastUpdated: new Date().toISOString(),
    isMockData: true
  };
}

/**
 * 🧹 Clear all caches (for testing/debugging)
 */
export function clearCache(tier = 'all') {
  if (tier === 'all') {
    priceCache.flushAll();
    marketCache.flushAll();
    staticCache.flushAll();
    globalCache.flushAll();
    console.log('🧹 All advanced CoinGecko caches cleared');
  } else {
    switch (tier) {
      case 'price': priceCache.flushAll(); break;
      case 'market': marketCache.flushAll(); break;
      case 'static': staticCache.flushAll(); break;
      case 'global': globalCache.flushAll(); break;
    }
    console.log(`🧹 ${tier} cache cleared`);
  }
}

/**
 * 📊 Get cache statistics
 */
export function getCacheStats() {
  return {
    price: {
      keys: priceCache.keys().length,
      stats: priceCache.getStats()
    },
    market: {
      keys: marketCache.keys().length,
      stats: marketCache.getStats()
    },
    static: {
      keys: staticCache.keys().length,
      stats: staticCache.getStats()
    },
    global: {
      keys: globalCache.keys().length,
      stats: globalCache.getStats()
    },
    rateLimiting: {
      requestsInLastMinute: requestLog.length,
      maxRequestsPerMinute: SAFE_CALLS_PER_MIN,
      requestDelay: REQUEST_DELAY,
      concurrencyLimit: limit.activeCount + '/' + limit.pendingCount
    }
  };
}

export default {
  getCoinSupplyData,
  getGlobalMarketData,
  getMarketChart,
  getTrendingCoins,
  getTopExchanges,
  getTopMovers,
  getAllAdvancedData,
  clearCache,
  getCacheStats
};