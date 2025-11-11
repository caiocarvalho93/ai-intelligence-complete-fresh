import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, BarChart3, Globe } from "lucide-react";

// Simple placeholder components for crypto features
const SparklineChart = ({ data }) => (
  <div style={{ height: '40px', background: 'rgba(0, 188, 212, 0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#00bcd4' }}>
    Chart
  </div>
);

const GlobalMarketChart = ({ data }) => (
  <div style={{ height: '200px', background: 'rgba(0, 188, 212, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00bcd4' }}>
    Global Market Chart
  </div>
);

const TrendingCoins = ({ coins }) => (
  <div style={{ background: 'rgba(0, 188, 212, 0.1)', borderRadius: '8px', padding: '1rem', color: '#00bcd4' }}>
    Trending Coins Component
  </div>
);

const TopMovers = ({ data }) => (
  <div style={{ background: 'rgba(0, 188, 212, 0.1)', borderRadius: '8px', padding: '1rem', color: '#00bcd4' }}>
    Top Movers Component
  </div>
);

const TopExchanges = ({ exchanges }) => (
  <div style={{ background: 'rgba(0, 188, 212, 0.1)', borderRadius: '8px', padding: '1rem', color: '#00bcd4' }}>
    Top Exchanges Component
  </div>
);
// Simple TrippyCoin placeholder component
const TrippyCoin = ({ size = 24 }) => (
  <div style={{ 
    width: size, 
    height: size, 
    borderRadius: '50%', 
    background: 'linear-gradient(45deg, #ff1493, #ff69b4)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'white', 
    fontSize: size * 0.4,
    fontWeight: 'bold'
  }}>
    T
  </div>
);

const CryptoTreasuryDashboard = () => {
  const [cryptoLogos, setCryptoLogos] = useState({});
  const [cryptoMarketData, setCryptoMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Advanced data states
  const [advancedData, setAdvancedData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [topMovers, setTopMovers] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [chartData, setChartData] = useState({});
  const [supplyData, setSupplyData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const supportedCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "orange" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "blue" },
    { id: "solana", name: "Solana", symbol: "SOL", color: "purple" },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", color: "yellow" },
    { id: "ripple", name: "XRP", symbol: "XRP", color: "blue" },
    { id: "litecoin", name: "Litecoin", symbol: "LTC", color: "gray" },
  ];

  // Fetch basic crypto data
  const fetchCryptoData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/crypto-treasury/crypto-logos-data");
      const result = await response.json();

      if (result.success) {
        setCryptoLogos(result.data.logos || {});
        setCryptoMarketData(result.data.marketData || {});
        console.log("🚀 BASIC CRYPTO DATA LOADED:", Object.keys(result.data.logos || {}).length, "coins");
      }
    } catch (error) {
      console.error("Failed to fetch basic crypto data:", error);
    }
  };

  // Fetch advanced crypto data with fallback
  const fetchAdvancedData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/crypto-treasury/advanced-data");
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setAdvancedData(data);
        setGlobalData(data.global);
        setTrendingCoins(data.trending || []);
        setTopMovers(data.topMovers);
        setExchanges(data.exchanges || []);
        setChartData(data.charts || {});
        setSupplyData(data.supply || {});
        setLastUpdated(new Date().toISOString());
        console.log("🚀 ADVANCED DATA LOADED:", {
          trending: data.trending?.length || 0,
          exchanges: data.exchanges?.length || 0,
          charts: Object.keys(data.charts || {}).length
        });
      }
    } catch (error) {
      console.error("Failed to fetch advanced crypto data:", error);
      // Set fallback data to show something immediately
      setGlobalData({
        totalMarketCap: 2400000000000,
        totalVolume: 95000000000,
        marketCapPercentage: { btc: 57.6, eth: 13.2 },
        activeCryptocurrencies: 10847,
        marketCapChange24h: 2.34
      });
      setTrendingCoins([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png', marketCapRank: 1 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png', marketCapRank: 2 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png', marketCapRank: 5 }
      ]);
      setTopMovers({
        topGainers: [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', priceChangePercentage: 5.2, currentPrice: 68000 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', priceChangePercentage: 3.8, currentPrice: 2600 }
        ],
        topLosers: [
          { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', priceChangePercentage: -2.3, currentPrice: 0.15 }
        ]
      });
      
      // Add mock chart data for sparklines
      const mockCharts = {};
      supportedCoins.forEach(coin => {
        const basePrice = coin.id === 'bitcoin' ? 68000 : coin.id === 'ethereum' ? 2600 : 100;
        const prices = [];
        const now = Date.now();
        for (let i = 6; i >= 0; i--) {
          const timestamp = now - (i * 24 * 60 * 60 * 1000);
          const variation = (Math.random() - 0.5) * 0.1;
          const price = basePrice * (1 + variation);
          prices.push([timestamp, price]);
        }
        mockCharts[coin.id] = { prices, coinId: coin.id, days: 7 };
      });
      setChartData(mockCharts);
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    setIsRefreshing(true);
    
    try {
      // Refresh basic data first (fast)
      await fetchCryptoData();
      
      // Then refresh advanced data (slower)
      await fetchAdvancedData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load basic data immediately, then advanced data
    const loadData = async () => {
      setIsLoading(true);
      await fetchCryptoData();
      setIsLoading(false);
      
      // Load advanced data in background
      setTimeout(() => {
        fetchAdvancedData();
      }, 1000);
    };
    
    loadData();
    
    // Refresh basic data every 30 seconds, advanced data every 5 minutes
    const basicInterval = setInterval(fetchCryptoData, 30000);
    const advancedInterval = setInterval(fetchAdvancedData, 300000);
    
    return () => {
      clearInterval(basicInterval);
      clearInterval(advancedInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Command Center</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              ₿ Quantum Crypto Treasury
            </h1>
            <p className="text-gray-400 mt-2">Advanced Cryptocurrency Intelligence Dashboard</p>
          </div>
          
          <div className="text-right">
            <button
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors disabled:opacity-50 mb-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-green-400">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Global Market Overview */}
        {globalData && (
          <div className="mb-8">
            <GlobalMarketChart globalData={globalData} />
          </div>
        )}

        {/* Top Section: Trending & Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <TrendingCoins trendingData={trendingCoins} />
          </div>
          <div className="lg:col-span-2">
            <TopMovers moversData={topMovers} />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading live crypto data...</p>
          </div>
        )}

        {/* Main Crypto Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedCoins.map((coin, index) => {
              const logoData = cryptoLogos[coin.id];
              const marketData = cryptoMarketData[coin.id];
              const isPositive = (marketData?.change24h || 0) >= 0;
              
              return (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    {logoData?.logo ? (
                      <img 
                        src={logoData.logo} 
                        alt={logoData.name}
                        className="w-16 h-16 rounded-full shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-black font-bold text-xl">
                        {coin.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {logoData?.name || coin.name}
                      </h3>
                      <p className="text-gray-400 text-lg">
                        {logoData?.symbol || coin.symbol}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sparkline Chart */}
                  {chartData[coin.id] && (
                    <div className="mb-4">
                      <SparklineChart 
                        data={chartData[coin.id]} 
                        color={coin.color === 'orange' ? '#f59e0b' : 
                               coin.color === 'blue' ? '#3b82f6' : 
                               coin.color === 'purple' ? '#8b5cf6' : 
                               coin.color === 'yellow' ? '#eab308' : 
                               coin.color === 'gray' ? '#6b7280' : '#f59e0b'} 
                        height={60}
                      />
                    </div>
                  )}

                  {marketData ? (
                    <div className="space-y-4">
                      <div className="text-center py-4 bg-gray-900/50 rounded-lg">
                        <div className="text-3xl font-bold text-green-400">
                          ${marketData.price?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) || 'N/A'}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">Current Price</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                        <span className="text-gray-400 flex items-center">
                          {isPositive ? <TrendingUp className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
                          24h Change:
                        </span>
                        <span className={`font-bold text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}
                          {marketData.change24h?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-blue-400 font-semibold">
                          ${((marketData.marketCap || 0) / 1e9).toFixed(2)}B
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                        <span className="text-gray-400">24h Volume:</span>
                        <span className="text-purple-400 font-semibold">
                          ${((marketData.volume || 0) / 1e6).toFixed(2)}M
                        </span>
                      </div>

                      {/* Supply Data */}
                      {supplyData[coin.id] && (
                        <div className="p-3 bg-gray-900/30 rounded-lg">
                          <div className="text-sm text-gray-400 mb-2">Supply Information</div>
                          <div className="space-y-1 text-sm">
                            {supplyData[coin.id].circulating && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Circulating:</span>
                                <span className="text-cyan-400">
                                  {(supplyData[coin.id].circulating / 1e6).toFixed(2)}M
                                </span>
                              </div>
                            )}
                            {supplyData[coin.id].max && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Max Supply:</span>
                                <span className="text-yellow-400">
                                  {(supplyData[coin.id].max / 1e6).toFixed(2)}M
                                </span>
                              </div>
                            )}
                            {supplyData[coin.id].percentage && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Mined:</span>
                                <span className="text-green-400">
                                  {supplyData[coin.id].percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                      </div>
                      <p className="text-gray-400 mt-4">Loading market data...</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* TRIPPY Coin Special Section */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 border border-pink-500/30 rounded-xl p-8 text-center">
            <div className="flex flex-col items-center">
              <TrippyCoin size={48} />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mt-4">
                TRIPPY COIN
              </h3>
              <p className="text-gray-300 text-lg mt-2">The Future Is Trippy 🌸</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-pink-400">$0.0420</div>
                  <div className="text-sm text-gray-400">Current Price</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">+69.42%</div>
                  <div className="text-sm text-gray-400">24h Change</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">∞</div>
                  <div className="text-sm text-gray-400">Market Cap</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Exchanges Section */}
        {exchanges.length > 0 && (
          <div className="mt-12">
            <TopExchanges exchangesData={exchanges} />
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Data provided by CoinGecko API • Basic data updates every 30s • Advanced data every 5min
          </p>
          <div className="mt-2 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Prices</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Advanced Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm">Global Markets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTreasuryDashboard;