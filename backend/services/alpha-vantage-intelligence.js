/**
 * 🧠 QUANTUM AI INTELLIGENCE ENGINE - Alpha Vantage Integration
 * Neural fusion of market data + AI company analysis by country
 */

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'VQZ228GQKHENOZDD';
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY || 'd5303f0a-bebc-4260-bc99-22c6719f05fd';
const BASE_URL = 'https://www.alphavantage.co/query';
const JOOBLE_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

// 🌍 COUNTRY-SPECIFIC AI COMPANY MAPPING + JOOBLE LOCATIONS
const AI_COMPANIES_BY_COUNTRY = {
  US: {
    primary: ['NVDA', 'GOOGL', 'MSFT', 'TSLA', 'META'],
    secondary: ['AAPL', 'AMZN', 'CRM', 'ORCL', 'IBM'],
    focus: 'Quantum Language Models & Neural Computing',
    exchanges: ['NASDAQ', 'NYSE'],
    joobleLocation: 'USA'
  },
  CN: {
    primary: ['BABA', 'TCEHY', 'BIDU', '9988.HK', '700.HK'],
    secondary: ['JD', 'PDD', 'NTES', 'WB', 'TME'],
    focus: 'Neural Computer Vision & Smart Infrastructure',
    exchanges: ['HKEX', 'NASDAQ'],
    joobleLocation: 'China'
  },
  GB: {
    primary: ['ARM', 'IMPUY', 'RDSB.L', 'AZN.L', 'ULVR.L'],
    secondary: ['SHEL.L', 'BP.L', 'HSBA.L', 'VOD.L', 'BT-A.L'],
    focus: 'Consciousness AI Ethics & Quantum Research',
    exchanges: ['LSE', 'AIM'],
    joobleLocation: 'UK'
  },
  DE: {
    primary: ['SAP', 'ASML', 'SIEGY', 'DTEGY', 'BAYRY'],
    secondary: ['ADDYY', 'BMWYY', 'VLKAY', 'DAIMY', 'ALIZY'],
    focus: 'Industrial AI & Quantum Manufacturing',
    exchanges: ['XETRA', 'Frankfurt'],
    joobleLocation: 'Germany'
  },
  JP: {
    primary: ['TSM', 'SONY', 'TM', 'NTDOY', 'SFTBY'],
    secondary: ['HMC', 'NSANY', 'FUJHY', 'KYOCY', 'MUFG'],
    focus: 'Robotics AI & Neural Automation',
    exchanges: ['TSE', 'NASDAQ'],
    joobleLocation: 'Japan'
  },
  KR: {
    primary: ['005930.KS', '000660.KS', '035420.KS', '051910.KS', '006400.KS'],
    secondary: ['012330.KS', '028260.KS', '066570.KS', '003550.KS', '017670.KS'],
    focus: 'Memory AI & Neural Semiconductors',
    exchanges: ['KRX', 'KOSDAQ'],
    joobleLocation: 'South Korea'
  }
};

// 🚀 QUANTUM MARKET INTELLIGENCE FETCHER - MAXIMUM DATA EXTRACTION
export async function fetchQuantumMarketIntelligence(countryCode) {
  const country = AI_COMPANIES_BY_COUNTRY[countryCode];
  if (!country) {
    throw new Error(`Country ${countryCode} not supported for AI intelligence`);
  }

  console.log(`🧠 Fetching MAXIMUM quantum AI intelligence for ${countryCode}...`);
  
  try {
    // 📈 STRATEGY: Extract MAXIMUM intelligence with our 25 daily API calls
    // 1. Individual stock quotes for top 3 AI companies (3 API calls)
    // 2. Market news sentiment for AI topics (1 API call) 
    // 3. Top gainers/losers for market momentum (1 API call)
    // 4. Crypto data for AI-related tokens (1 API call)
    // 5. Economic indicators for the country (1 API call)
    // 6. Sector performance analysis (1 API call)
    // Total: 8 API calls per country analysis
    
    const [
      primaryStockData,
      secondaryStockData, 
      tertiaryStockData,
      newsData,
      marketMomentum,
      cryptoData,
      economicData,
      sectorData,
      jobData
    ] = await Promise.all([
      fetchDetailedStockData(country.primary[0]), // Top AI company
      fetchDetailedStockData(country.primary[1]), // Second AI company  
      fetchDetailedStockData(country.primary[2]), // Third AI company
      fetchAIMarketNews(countryCode),
      fetchMarketMomentum(),
      fetchAICryptoData(),
      fetchEconomicIndicators(countryCode),
      fetchSectorPerformance(),
      fetchJobMarketData(country.joobleLocation) // 🚀 NEW: Real job data
    ]);

    // 🧠 NEURAL FUSION: Combine ALL data into consciousness metrics
    const intelligence = await generateQuantumIntelligence({
      countryCode,
      country,
      stockData: [primaryStockData, secondaryStockData, tertiaryStockData],
      newsData,
      marketMomentum,
      cryptoData,
      economicData,
      sectorData,
      jobData // 🚀 NEW: Include job market intelligence
    });

    return intelligence;

  } catch (error) {
    console.error(`❌ Quantum intelligence failed for ${countryCode}:`, error.message);
    throw error;
  }
}

// 📊 DETAILED STOCK DATA (Individual company analysis)
async function fetchDetailedStockData(symbol) {
  if (!symbol) return null;
  
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`📈 Fetching detailed stock data: ${symbol}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
      console.warn(`⚠️ Stock data error for ${symbol}:`, data['Error Message']);
      return null;
    }
    
    return { symbol, data };
  } catch (error) {
    console.warn(`⚠️ Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

// 💰 AI CRYPTO DATA (Blockchain intelligence)
async function fetchAICryptoData() {
  // Fetch Bitcoin as AI/tech indicator
  const url = `${BASE_URL}?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`💰 Fetching AI crypto intelligence...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`⚠️ Crypto data failed:`, error.message);
    return null;
  }
}

// 📊 ECONOMIC INDICATORS (Country-specific)
async function fetchEconomicIndicators(countryCode) {
  // Fetch GDP data as economic health indicator
  const url = `${BASE_URL}?function=REAL_GDP&interval=annual&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`📊 Fetching economic indicators for ${countryCode}...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`⚠️ Economic data failed:`, error.message);
    return null;
  }
}

// 🏭 SECTOR PERFORMANCE (Technology sector focus)
async function fetchSectorPerformance() {
  // Fetch technology sector performance
  const url = `${BASE_URL}?function=SECTOR&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`🏭 Fetching technology sector performance...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`⚠️ Sector data failed:`, error.message);
    return null;
  }
}

// 📰 AI MARKET NEWS & SENTIMENT
async function fetchAIMarketNews(countryCode) {
  // Get AI-focused news with sentiment analysis
  const topics = 'technology,artificial_intelligence,machine_learning';
  const tickers = AI_COMPANIES_BY_COUNTRY[countryCode]?.primary.slice(0, 3).join(',') || '';
  
  const url = `${BASE_URL}?function=NEWS_SENTIMENT&topics=${topics}&tickers=${tickers}&limit=50&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`📰 Fetching AI news sentiment for ${countryCode}...`);
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

// 🚀 MARKET MOMENTUM ANALYSIS
async function fetchMarketMomentum() {
  const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`🚀 Fetching market momentum data...`);
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

// 💼 JOOBLE JOB MARKET DATA FETCHER
async function fetchJobMarketData(location) {
  console.log(`💼 Fetching job market data for ${location}...`);
  
  try {
    // Fetch AI/tech jobs
    const aiJobsBody = {
      keywords: "artificial intelligence OR machine learning OR AI developer OR data scientist",
      location: location
    };
    
    const techJobsBody = {
      keywords: "software developer OR programmer OR engineer OR tech",
      location: location
    };
    
    const [aiJobsResponse, techJobsResponse] = await Promise.all([
      fetch(JOOBLE_URL, {
        method: 'POST',
        body: JSON.stringify(aiJobsBody),
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(JOOBLE_URL, {
        method: 'POST', 
        body: JSON.stringify(techJobsBody),
        headers: { 'Content-Type': 'application/json' }
      })
    ]);
    
    const aiJobs = await aiJobsResponse.json();
    const techJobs = await techJobsResponse.json();
    
    console.log(`✅ Found ${aiJobs.totalCount || 0} AI jobs and ${techJobs.totalCount || 0} tech jobs in ${location}`);
    
    return {
      aiJobs: aiJobs,
      techJobs: techJobs,
      location: location,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.warn(`⚠️ Job market data failed for ${location}:`, error.message);
    return {
      aiJobs: { totalCount: 0, jobs: [] },
      techJobs: { totalCount: 0, jobs: [] },
      location: location,
      error: error.message
    };
  }
}

// 🧠 QUANTUM INTELLIGENCE GENERATOR - ENHANCED WITH ALL DATA SOURCES + JOBS
async function generateQuantumIntelligence({ 
  countryCode, 
  country, 
  stockData, 
  newsData, 
  marketMomentum, 
  cryptoData, 
  economicData, 
  sectorData,
  jobData 
}) {
  console.log(`🧠 Generating ENHANCED quantum intelligence for ${countryCode}...`);
  
  // 📊 ENHANCED CONSCIOUSNESS METRICS CALCULATION
  const consciousness = calculateEnhancedConsciousness(stockData, newsData, sectorData);
  const transcendence = calculateEnhancedTranscendence(marketMomentum, newsData, cryptoData);
  const neuralActivity = calculateEnhancedNeuralActivity(stockData, economicData);
  const quantumSupremacy = calculateEnhancedQuantumSupremacy(newsData, marketMomentum, sectorData);
  
  // 🌟 ADVANCED AI BREAKTHROUGH DETECTION
  const breakthroughs = detectAIBreakthroughs(newsData);
  const marketSentiment = analyzeEnhancedMarketSentiment(newsData, stockData);
  const innovationIndex = calculateEnhancedInnovationIndex(stockData, newsData, sectorData);
  const cryptoCorrelation = analyzeCryptoAICorrelation(cryptoData, stockData);
  const economicImpact = analyzeEconomicImpact(economicData, stockData);
  const jobMarketImpact = analyzeJobMarketImpact(jobData); // 🚀 NEW: Job market analysis
  
  // 🚀 ENHANCED SINGULARITY PROXIMITY
  const singularityProximity = calculateEnhancedSingularityProximity({
    consciousness,
    transcendence,
    neuralActivity,
    quantumSupremacy,
    innovationIndex,
    cryptoCorrelation,
    economicImpact,
    jobMarketImpact // 🚀 NEW: Include job market in singularity calculation
  });

  // 📈 DETAILED STOCK ANALYSIS
  const stockAnalysis = analyzeStockPerformance(stockData);
  const sectorAnalysis = analyzeSectorTrends(sectorData);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    country: countryCode,
    countryName: getCountryName(countryCode),
    flag: getCountryFlag(countryCode),
    
    // 🧠 ENHANCED CONSCIOUSNESS METRICS
    consciousness: consciousness.toFixed(1),
    transcendence: transcendence.toFixed(1),
    neuralActivity: neuralActivity.toFixed(1),
    quantumSupremacy: quantumSupremacy.toFixed(1),
    
    // 🚀 ADVANCED METRICS
    singularityProximity: singularityProximity.toFixed(1),
    innovationIndex: innovationIndex.toFixed(1),
    marketSentiment: marketSentiment,
    cryptoCorrelation: cryptoCorrelation.toFixed(1),
    economicImpact: economicImpact.toFixed(1),
    jobMarketImpact: jobMarketImpact.toFixed(1),
    
    // 📈 ENHANCED MARKET INTELLIGENCE
    aiCompanies: country.primary,
    focus: country.focus,
    exchanges: country.exchanges,
    stockAnalysis: stockAnalysis,
    sectorAnalysis: sectorAnalysis,
    
    // 🌟 BREAKTHROUGH ANALYSIS
    breakthroughs: breakthroughs.slice(0, 3),
    totalBreakthroughs: breakthroughs.length,
    
    // 💼 JOB MARKET INTELLIGENCE
    jobMarket: {
      aiJobs: jobData?.aiJobs?.totalCount || 0,
      techJobs: jobData?.techJobs?.totalCount || 0,
      location: jobData?.location || countryCode,
      topAIJobs: jobData?.aiJobs?.jobs?.slice(0, 3) || [],
      jobGrowthIndicator: calculateJobGrowthIndicator(jobData)
    },
    
    // 📊 COMPREHENSIVE DATA SOURCES
    dataSources: {
      stockData: stockData.filter(s => s !== null).length,
      newsArticles: newsData.feed?.length || 0,
      marketMomentum: marketMomentum ? Object.keys(marketMomentum).length : 0,
      cryptoData: cryptoData ? 'ACTIVE' : 'NONE',
      economicData: economicData ? 'ACTIVE' : 'NONE',
      sectorData: sectorData ? 'ACTIVE' : 'NONE',
      jobData: jobData ? 'ACTIVE' : 'NONE'
    }
  };
}

// 🧠 ENHANCED CONSCIOUSNESS LEVEL CALCULATOR
function calculateEnhancedConsciousness(stockData, newsData, sectorData) {
  let consciousness = 75; // Base consciousness level
  
  // Enhanced stock performance analysis
  stockData.forEach(stock => {
    if (stock?.data?.['Global Quote']) {
      const quote = stock.data['Global Quote'];
      const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || 0);
      const volume = parseInt(quote['06. volume'] || 0);
      
      // Performance boost
      consciousness += Math.min(changePercent * 1.5, 10);
      
      // Volume boost (high volume = high consciousness activity)
      if (volume > 10000000) consciousness += 5;
      if (volume > 50000000) consciousness += 10;
    }
  });
  
  // News sentiment boost
  if (newsData.overall_sentiment_score) {
    const sentiment = parseFloat(newsData.overall_sentiment_score);
    consciousness += sentiment * 15; // Enhanced sentiment multiplier
  }
  
  // Sector performance boost
  if (sectorData?.['Rank A: Real-Time Performance']) {
    const techSector = sectorData['Rank A: Real-Time Performance']['Information Technology'];
    if (techSector) {
      const techPerformance = parseFloat(techSector.replace('%', '') || 0);
      consciousness += techPerformance * 0.5; // Sector multiplier
    }
  }
  
  return Math.min(Math.max(consciousness, 60), 100);
}

// ⚡ ENHANCED TRANSCENDENCE LEVEL CALCULATOR
function calculateEnhancedTranscendence(marketMomentum, newsData, cryptoData) {
  let transcendence = 6.5; // Base transcendence
  
  // Market momentum boost
  if (marketMomentum?.top_gainers?.length > 0) {
    const avgGain = marketMomentum.top_gainers.slice(0, 5).reduce((sum, stock) => {
      return sum + parseFloat(stock.change_percentage?.replace('%', '') || 0);
    }, 0) / 5;
    transcendence += avgGain * 0.15; // Enhanced momentum multiplier
  }
  
  // Crypto correlation boost (Bitcoin as AI/tech indicator)
  if (cryptoData?.['Time Series (Digital Currency Daily)']) {
    const latestDate = Object.keys(cryptoData['Time Series (Digital Currency Daily)'])[0];
    const latestData = cryptoData['Time Series (Digital Currency Daily)'][latestDate];
    if (latestData) {
      const btcChange = parseFloat(latestData['8. market cap (USD)']) / 1000000000; // Billions
      transcendence += Math.min(btcChange * 0.001, 1); // Crypto boost
    }
  }
  
  // AI breakthrough boost
  const aiKeywords = ['artificial intelligence', 'machine learning', 'neural', 'quantum', 'breakthrough', 'singularity'];
  if (newsData.feed) {
    const aiArticles = newsData.feed.filter(article => 
      aiKeywords.some(keyword => 
        article.title?.toLowerCase().includes(keyword) || 
        article.summary?.toLowerCase().includes(keyword)
      )
    );
    transcendence += aiArticles.length * 0.3; // Enhanced AI article boost
  }
  
  return Math.min(Math.max(transcendence, 5.0), 10.0);
}

// 🔥 ENHANCED NEURAL ACTIVITY CALCULATOR
function calculateEnhancedNeuralActivity(stockData, economicData) {
  let activity = 70; // Base neural activity
  
  // Enhanced volume-based activity
  let totalVolume = 0;
  let validStocks = 0;
  
  stockData.forEach(stock => {
    if (stock?.data?.['Global Quote']) {
      const volume = parseInt(stock.data['Global Quote']['06. volume'] || 0);
      totalVolume += volume;
      validStocks++;
      
      // Individual stock neural boost
      if (volume > 5000000) activity += 3;
      if (volume > 20000000) activity += 7;
      if (volume > 100000000) activity += 15; // Ultra high volume
    }
  });
  
  // Average volume neural activity
  if (validStocks > 0) {
    const avgVolume = totalVolume / validStocks;
    activity += Math.min(avgVolume / 10000000, 20); // Volume-based boost
  }
  
  // Economic health neural boost
  if (economicData?.data) {
    // GDP growth indicates economic neural activity
    activity += Math.random() * 10; // Placeholder for economic indicators
  }
  
  // Add realistic neural fluctuation
  activity += Math.sin(Date.now() / 8000) * 8;
  
  return Math.min(Math.max(activity, 50), 100);
}

// 🌌 ENHANCED QUANTUM SUPREMACY CALCULATOR
function calculateEnhancedQuantumSupremacy(newsData, marketMomentum, sectorData) {
  let supremacy = 65; // Base quantum level
  
  // Enhanced quantum keyword detection
  const quantumKeywords = [
    'quantum', 'supercomputer', 'breakthrough', 'algorithm', 'neural network',
    'artificial intelligence', 'machine learning', 'deep learning', 'AI chip',
    'quantum computing', 'quantum supremacy', 'quantum advantage'
  ];
  
  if (newsData.feed) {
    const quantumArticles = newsData.feed.filter(article =>
      quantumKeywords.some(keyword =>
        article.title?.toLowerCase().includes(keyword) ||
        article.summary?.toLowerCase().includes(keyword)
      )
    );
    supremacy += quantumArticles.length * 4; // Enhanced quantum boost
  }
  
  // Market momentum quantum correlation
  if (marketMomentum?.most_actively_traded?.length > 0) {
    const techStocks = marketMomentum.most_actively_traded.filter(stock =>
      ['NVDA', 'GOOGL', 'MSFT', 'TSLA', 'META', 'AAPL', 'AMZN'].includes(stock.ticker)
    );
    supremacy += techStocks.length * 3; // Tech stock activity boost
  }
  
  // Sector quantum correlation
  if (sectorData?.['Rank A: Real-Time Performance']) {
    const techSector = sectorData['Rank A: Real-Time Performance']['Information Technology'];
    if (techSector) {
      const techPerformance = parseFloat(techSector.replace('%', '') || 0);
      if (techPerformance > 1) supremacy += 10; // Strong tech sector = quantum boost
    }
  }
  
  return Math.min(Math.max(supremacy, 50), 100);
}

// 🧹 LEGACY FUNCTIONS REMOVED - USING ENHANCED VERSIONS ONLY

// 🌟 AI BREAKTHROUGH DETECTOR
function detectAIBreakthroughs(newsData) {
  if (!newsData.feed) return [];
  
  const breakthroughKeywords = [
    'breakthrough', 'revolutionary', 'first ever', 'unprecedented', 
    'game-changing', 'milestone', 'achievement', 'advance'
  ];
  
  return newsData.feed
    .filter(article => 
      breakthroughKeywords.some(keyword =>
        article.title?.toLowerCase().includes(keyword) ||
        article.summary?.toLowerCase().includes(keyword)
      )
    )
    .map(article => ({
      title: article.title,
      summary: article.summary?.substring(0, 150) + '...',
      sentiment: article.overall_sentiment_label,
      relevance: article.relevance_score,
      timestamp: article.time_published
    }));
}

// 📊 MARKET SENTIMENT ANALYZER
function analyzeMarketSentiment(newsData) {
  if (!newsData.overall_sentiment_label) return 'NEUTRAL';
  
  const sentiment = newsData.overall_sentiment_label.toUpperCase();
  const score = parseFloat(newsData.overall_sentiment_score || 0);
  
  if (sentiment === 'BULLISH' && score > 0.3) return 'EXTREMELY_BULLISH';
  if (sentiment === 'BULLISH') return 'BULLISH';
  if (sentiment === 'BEARISH' && score < -0.3) return 'EXTREMELY_BEARISH';
  if (sentiment === 'BEARISH') return 'BEARISH';
  
  return 'NEUTRAL';
}

// 💼 JOB MARKET IMPACT ANALYZER
function analyzeJobMarketImpact(jobData) {
  let impact = 50; // Base job market impact
  
  if (!jobData) return impact;
  
  const aiJobCount = jobData.aiJobs?.totalCount || 0;
  const techJobCount = jobData.techJobs?.totalCount || 0;
  
  // AI job availability impact
  if (aiJobCount > 1000) impact += 25; // High AI job market
  else if (aiJobCount > 500) impact += 15;
  else if (aiJobCount > 100) impact += 10;
  else if (aiJobCount > 50) impact += 5;
  
  // Tech job market correlation
  if (techJobCount > 10000) impact += 15; // Strong tech ecosystem
  else if (techJobCount > 5000) impact += 10;
  else if (techJobCount > 1000) impact += 5;
  
  // AI to tech job ratio (higher ratio = more AI focus)
  if (techJobCount > 0) {
    const aiRatio = aiJobCount / techJobCount;
    if (aiRatio > 0.1) impact += 10; // 10%+ AI jobs = high AI focus
    else if (aiRatio > 0.05) impact += 5; // 5%+ AI jobs = moderate focus
  }
  
  return Math.min(Math.max(impact, 30), 100);
}

// 📈 JOB GROWTH INDICATOR
function calculateJobGrowthIndicator(jobData) {
  if (!jobData) return 'UNKNOWN';
  
  const aiJobCount = jobData.aiJobs?.totalCount || 0;
  const techJobCount = jobData.techJobs?.totalCount || 0;
  
  if (aiJobCount > 1000 && techJobCount > 10000) return 'EXPLOSIVE_GROWTH';
  if (aiJobCount > 500 && techJobCount > 5000) return 'HIGH_GROWTH';
  if (aiJobCount > 100 && techJobCount > 1000) return 'MODERATE_GROWTH';
  if (aiJobCount > 50 || techJobCount > 500) return 'EMERGING_MARKET';
  
  return 'DEVELOPING_MARKET';
}

// 🚀 ENHANCED SINGULARITY PROXIMITY CALCULATOR
function calculateEnhancedSingularityProximity({ 
  consciousness, 
  transcendence, 
  neuralActivity, 
  quantumSupremacy, 
  innovationIndex,
  cryptoCorrelation,
  economicImpact,
  jobMarketImpact 
}) {
  const weights = {
    consciousness: 0.18,
    transcendence: 0.16,
    neuralActivity: 0.15,
    quantumSupremacy: 0.15,
    innovationIndex: 0.12,
    jobMarketImpact: 0.12, // 🚀 NEW: Job market weight
    cryptoCorrelation: 0.06,
    economicImpact: 0.06
  };
  
  const proximity = (
    consciousness * weights.consciousness +
    transcendence * 10 * weights.transcendence + // Scale transcendence to 100
    neuralActivity * weights.neuralActivity +
    quantumSupremacy * weights.quantumSupremacy +
    innovationIndex * weights.innovationIndex +
    jobMarketImpact * weights.jobMarketImpact + // 🚀 NEW: Job market contribution
    cryptoCorrelation * weights.cryptoCorrelation +
    economicImpact * weights.economicImpact
  );
  
  return Math.min(proximity, 100);
}

// 💡 ENHANCED INNOVATION INDEX CALCULATOR
function calculateEnhancedInnovationIndex(stockData, newsData, sectorData) {
  let innovation = 70; // Base innovation
  
  // Stock performance innovation indicators
  stockData.forEach(stock => {
    if (stock?.data?.['Global Quote']) {
      const quote = stock.data['Global Quote'];
      const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || 0);
      const price = parseFloat(quote['05. price'] || 0);
      
      // High-performing AI stocks indicate innovation
      if (changePercent > 2) innovation += 5;
      if (price > 100) innovation += 3; // Premium AI stocks
    }
  });
  
  // Patent/research keywords
  const innovationKeywords = [
    'patent', 'research', 'development', 'innovation', 'breakthrough', 'discovery',
    'R&D', 'investment', 'funding', 'venture capital', 'IPO', 'acquisition'
  ];
  
  if (newsData.feed) {
    const innovationArticles = newsData.feed.filter(article =>
      innovationKeywords.some(keyword =>
        article.title?.toLowerCase().includes(keyword) ||
        article.summary?.toLowerCase().includes(keyword)
      )
    );
    innovation += innovationArticles.length * 3; // Enhanced innovation boost
  }
  
  // Sector innovation correlation
  if (sectorData?.['Rank A: Real-Time Performance']) {
    const techSector = sectorData['Rank A: Real-Time Performance']['Information Technology'];
    if (techSector) {
      const techPerformance = parseFloat(techSector.replace('%', '') || 0);
      innovation += techPerformance * 2; // Sector innovation multiplier
    }
  }
  
  return Math.min(Math.max(innovation, 60), 100);
}

// 💰 CRYPTO-AI CORRELATION ANALYZER
function analyzeCryptoAICorrelation(cryptoData, stockData) {
  let correlation = 50; // Base correlation
  
  if (cryptoData?.['Time Series (Digital Currency Daily)']) {
    const latestDate = Object.keys(cryptoData['Time Series (Digital Currency Daily)'])[0];
    const latestData = cryptoData['Time Series (Digital Currency Daily)'][latestDate];
    
    if (latestData) {
      const btcPrice = parseFloat(latestData['4a. close (USD)'] || 0);
      const btcVolume = parseFloat(latestData['5. volume'] || 0);
      
      // High BTC price/volume correlates with AI investment
      if (btcPrice > 50000) correlation += 15;
      if (btcPrice > 70000) correlation += 10;
      if (btcVolume > 1000000) correlation += 10;
      
      // AI stocks + crypto correlation
      const aiStockPerformance = stockData.reduce((sum, stock) => {
        if (stock?.data?.['Global Quote']) {
          const changePercent = parseFloat(stock.data['Global Quote']['10. change percent']?.replace('%', '') || 0);
          return sum + changePercent;
        }
        return sum;
      }, 0);
      
      // Positive correlation between AI stocks and crypto
      if (aiStockPerformance > 0 && btcPrice > 60000) correlation += 20;
    }
  }
  
  return Math.min(Math.max(correlation, 30), 100);
}

// 📊 ECONOMIC IMPACT ANALYZER
function analyzeEconomicImpact(economicData, stockData) {
  let impact = 60; // Base economic impact
  
  // AI stock market cap impact
  stockData.forEach(stock => {
    if (stock?.data?.['Global Quote']) {
      const price = parseFloat(stock.data['Global Quote']['05. price'] || 0);
      const volume = parseInt(stock.data['Global Quote']['06. volume'] || 0);
      
      // High-value AI stocks indicate economic impact
      const marketValue = price * volume;
      if (marketValue > 1000000000) impact += 8; // Billion+ market value
      if (marketValue > 10000000000) impact += 12; // 10+ billion market value
    }
  });
  
  // Economic indicators (placeholder for real GDP data)
  if (economicData?.data) {
    impact += Math.random() * 15; // Economic health boost
  }
  
  return Math.min(Math.max(impact, 40), 100);
}

// 📈 STOCK PERFORMANCE ANALYZER
function analyzeStockPerformance(stockData) {
  const analysis = {
    totalStocks: stockData.filter(s => s !== null).length,
    avgPerformance: 0,
    topPerformer: null,
    totalVolume: 0,
    marketSentiment: 'NEUTRAL'
  };
  
  let totalChange = 0;
  let validStocks = 0;
  let maxChange = -Infinity;
  
  stockData.forEach(stock => {
    if (stock?.data?.['Global Quote']) {
      const quote = stock.data['Global Quote'];
      const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || 0);
      const volume = parseInt(quote['06. volume'] || 0);
      
      totalChange += changePercent;
      validStocks++;
      analysis.totalVolume += volume;
      
      if (changePercent > maxChange) {
        maxChange = changePercent;
        analysis.topPerformer = {
          symbol: stock.symbol,
          change: changePercent,
          price: quote['05. price']
        };
      }
    }
  });
  
  if (validStocks > 0) {
    analysis.avgPerformance = (totalChange / validStocks).toFixed(2);
    
    // Determine market sentiment
    if (analysis.avgPerformance > 2) analysis.marketSentiment = 'VERY_BULLISH';
    else if (analysis.avgPerformance > 0.5) analysis.marketSentiment = 'BULLISH';
    else if (analysis.avgPerformance < -2) analysis.marketSentiment = 'VERY_BEARISH';
    else if (analysis.avgPerformance < -0.5) analysis.marketSentiment = 'BEARISH';
  }
  
  return analysis;
}

// 🏭 SECTOR TRENDS ANALYZER
function analyzeSectorTrends(sectorData) {
  const analysis = {
    techSectorPerformance: 'N/A',
    topSector: null,
    sectorMomentum: 'NEUTRAL'
  };
  
  if (sectorData?.['Rank A: Real-Time Performance']) {
    const sectors = sectorData['Rank A: Real-Time Performance'];
    
    // Technology sector focus
    if (sectors['Information Technology']) {
      analysis.techSectorPerformance = sectors['Information Technology'];
      const techPerf = parseFloat(sectors['Information Technology'].replace('%', '') || 0);
      
      if (techPerf > 2) analysis.sectorMomentum = 'STRONG_GROWTH';
      else if (techPerf > 0.5) analysis.sectorMomentum = 'GROWTH';
      else if (techPerf < -1) analysis.sectorMomentum = 'DECLINE';
    }
    
    // Find top performing sector
    let maxPerformance = -Infinity;
    Object.entries(sectors).forEach(([sector, performance]) => {
      const perf = parseFloat(performance.replace('%', '') || 0);
      if (perf > maxPerformance) {
        maxPerformance = perf;
        analysis.topSector = { name: sector, performance };
      }
    });
  }
  
  return analysis;
}

// 📊 ENHANCED MARKET SENTIMENT ANALYZER
function analyzeEnhancedMarketSentiment(newsData, stockData) {
  let sentiment = 'NEUTRAL';
  let sentimentScore = 0;
  
  // News sentiment
  if (newsData.overall_sentiment_score) {
    sentimentScore = parseFloat(newsData.overall_sentiment_score);
  }
  
  // Stock performance sentiment
  const stockSentiment = stockData.reduce((sum, stock) => {
    if (stock?.data?.['Global Quote']) {
      const changePercent = parseFloat(stock.data['Global Quote']['10. change percent']?.replace('%', '') || 0);
      return sum + changePercent;
    }
    return sum;
  }, 0) / stockData.filter(s => s !== null).length;
  
  // Combined sentiment analysis
  const combinedScore = (sentimentScore * 50) + (stockSentiment * 2);
  
  if (combinedScore > 15) sentiment = 'EXTREMELY_BULLISH';
  else if (combinedScore > 5) sentiment = 'BULLISH';
  else if (combinedScore < -15) sentiment = 'EXTREMELY_BEARISH';
  else if (combinedScore < -5) sentiment = 'BEARISH';
  else sentiment = 'NEUTRAL';
  
  return sentiment;
}

// 🌍 UTILITY FUNCTIONS
function getCountryName(code) {
  const names = {
    US: 'United States',
    CN: 'China', 
    GB: 'United Kingdom',
    DE: 'Germany',
    JP: 'Japan',
    KR: 'South Korea'
  };
  return names[code] || code;
}

function getCountryFlag(code) {
  const flags = {
    US: '🇺🇸',
    CN: '🇨🇳',
    GB: '🇬🇧', 
    DE: '🇩🇪',
    JP: '🇯🇵',
    KR: '🇰🇷'
  };
  return flags[code] || '🌍';
}