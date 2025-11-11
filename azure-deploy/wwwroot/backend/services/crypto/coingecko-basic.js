/**
 * 🪙 BASIC COINGECKO SERVICE
 * Simple price and logo fetching (existing functionality)
 */

import cryptoCache from './crypto-cache.js';

const API_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Get basic coin data (prices, logos, market data)
 */
export async function getBasicCoinData(coinIds) {
  const cacheKey = `basic:${coinIds.join(',')}`;
  
  // Check cache first
  const cached = cryptoCache.getPrice(cacheKey);
  if (cached) {
    console.log('🧊 Cache hit for basic coin data');
    return cached;
  }
  
  try {
    // Use the global rate-controlled fetcher if available
    const fetchFunction = global.fetchCoinGecko || fetch;
    
    const [priceData, coinsData] = await Promise.all([
      fetchFunction(`${API_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`),
      fetchFunction(`${API_BASE}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`)
    ]);
    
    const prices = await priceData.json();
    const coins = await coinsData.json();
    
    const logoMap = {};
    const marketMap = {};
    
    // Process coins data
    coins.forEach(coin => {
      logoMap[coin.id] = {
        logo: coin.image,
        thumb: coin.image.replace('/large/', '/thumb/'),
        name: coin.name,
        symbol: coin.symbol.toUpperCase()
      };
    });
    
    // Process price data
    Object.keys(prices).forEach(coinId => {
      const coinPrice = prices[coinId];
      const coinInfo = coins.find(c => c.id === coinId);
      
      marketMap[coinId] = {
        price: coinPrice.usd,
        change24h: coinPrice.usd_24h_change || 0,
        marketCap: coinPrice.usd_market_cap || (coinInfo ? coinInfo.market_cap : 0),
        volume: coinPrice.usd_24h_vol || (coinInfo ? coinInfo.total_volume : 0),
        rank: coinInfo ? coinInfo.market_cap_rank : 0,
        high24h: coinInfo ? coinInfo.high_24h : coinPrice.usd * 1.05,
        low24h: coinInfo ? coinInfo.low_24h : coinPrice.usd * 0.95,
        ath: coinInfo ? coinInfo.ath : coinPrice.usd,
        athDate: coinInfo ? coinInfo.ath_date : new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
    });
    
    const result = {
      logos: logoMap,
      marketData: marketMap,
      lastUpdated: new Date().toISOString(),
      source: 'CoinGecko API - Basic'
    };
    
    // Cache the result
    cryptoCache.setPrice(cacheKey, result);
    console.log('✅ Basic coin data cached');
    
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch basic coin data:', error);
    throw error;
  }
}

export default {
  getBasicCoinData
};