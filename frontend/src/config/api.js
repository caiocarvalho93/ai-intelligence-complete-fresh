/**
 * 🚨 API Configuration - Railway Best Practices
 * Centralized API base URL configuration
 */

// EINSTEIN-LEVEL: Bulletproof environment detection
const API_BASE = (() => {
  // 1. Check for explicit environment variable
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  // 2. Detect production environment (Azure backend)
  if (import.meta.env.PROD || window.location.hostname.includes("vercel.app")) {
    return "https://ai-intelligence-complete.azurewebsites.net";
  }

  // 3. Local development (pointing to Azure for testing)
  return "https://ai-intelligence-complete.azurewebsites.net";
})();

console.log("🔗 API Base URL:", API_BASE);

/**
 * Create full API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/global-news')
 * @returns {string} Full API URL
 */
export function createApiUrl(endpoint) {
  return `${API_BASE}${endpoint}`;
}

/**
 * Fetch wrapper with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function apiCall(endpoint, options = {}) {
  try {
    const url = createApiUrl(endpoint);
    console.log(`📡 API Call: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Success: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
}

// Tourism and Jobs API Integration
const GEOAPIFY_KEY = "87fff072fd194da2ababf80ff62bc5e3"; // Updated location key
const ALPHA_VANTAGE_KEY = "VQZ228GQKHENOZDD"; // For enhanced financial/market data

/**
 * Get tourism attractions for a country using Geoapify
 * @param {string} countryBounds - Bounding box coordinates
 * @returns {Promise} Tourism data
 */
export async function getTourismData(countryBounds) {
  try {
    // Enhanced categories for more comprehensive results
    const categories = [
      'tourism.attraction',
      'tourism.sights',
      'heritage.unesco',
      'entertainment.museum',
      'natural.beach',
      'building.historic'
    ].join(',');
    
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=rect:${countryBounds}&limit=15&apiKey=${GEOAPIFY_KEY}`;
    console.log('🏛️ Fetching enhanced tourism data:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Tourism API error: ${response.status}`);
    
    const data = await response.json();
    
    // Enhance the data with better categorization
    if (data.features) {
      data.features = data.features.map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          attractionType: getAttractionType(feature.properties.categories || []),
          priority: getAttractionPriority(feature.properties)
        }
      })).sort((a, b) => b.properties.priority - a.properties.priority);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Tourism data fetch failed:', error);
    throw error;
  }
}

/**
 * Determine attraction type from categories
 * @param {Array} categories - Array of category strings
 * @returns {string} Attraction type
 */
function getAttractionType(categories) {
  if (categories.some(cat => cat.includes('unesco'))) return 'UNESCO Site';
  if (categories.some(cat => cat.includes('museum'))) return 'Museum';
  if (categories.some(cat => cat.includes('beach'))) return 'Beach';
  if (categories.some(cat => cat.includes('historic'))) return 'Historic';
  if (categories.some(cat => cat.includes('natural'))) return 'Natural';
  if (categories.some(cat => cat.includes('entertainment'))) return 'Entertainment';
  return 'Attraction';
}

/**
 * Calculate attraction priority for sorting
 * @param {Object} properties - Feature properties
 * @returns {number} Priority score
 */
function getAttractionPriority(properties) {
  let priority = 0;
  const categories = properties.categories || [];
  
  // UNESCO sites get highest priority
  if (categories.some(cat => cat.includes('unesco'))) priority += 100;
  
  // Major attractions
  if (categories.some(cat => cat.includes('tourism.attraction'))) priority += 50;
  
  // Museums and cultural sites
  if (categories.some(cat => cat.includes('museum'))) priority += 40;
  
  // Historic buildings
  if (categories.some(cat => cat.includes('historic'))) priority += 30;
  
  // Natural attractions
  if (categories.some(cat => cat.includes('natural'))) priority += 25;
  
  // Beaches
  if (categories.some(cat => cat.includes('beach'))) priority += 20;
  
  // Boost priority if it has a name
  if (properties.name && properties.name.length > 0) priority += 10;
  
  return priority;
}

/**
 * Get job market data for a country with database caching (Cost-Efficient)
 * @param {string} countryCode - Country code
 * @returns {Promise} Job market data
 */
export async function getJobData(countryCode) {
  try {
    // First, try to get cached data from database (saves API calls)
    try {
      const cachedResponse = await apiCall(`/api/job-cache/${countryCode}`);
      if (cachedResponse.success && cachedResponse.data) {
        console.log(`💼 Using cached job data for ${countryCode} (saves API costs)`);
        return {
          success: true,
          data: cachedResponse.data,
          cached: true,
          lastUpdated: cachedResponse.data.lastUpdated
        };
      }
    } catch (cacheError) {
      console.log(`💼 Cache miss for ${countryCode}, generating fresh data`);
    }
    // Mock job data based on country - replace with real Jooble API integration
    const jobData = {
      'US': {
        totalJobs: 4500,
        aiJobs: 850,
        averageSalary: 120000,
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
        growthRate: 25,
        demandLevel: 'Very High'
      },
      'CN': {
        totalJobs: 3200,
        aiJobs: 680,
        averageSalary: 45000,
        topCompanies: ['Alibaba', 'Tencent', 'Baidu', 'ByteDance', 'Huawei'],
        growthRate: 35,
        demandLevel: 'Very High'
      },
      'GB': {
        totalJobs: 2100,
        aiJobs: 420,
        averageSalary: 75000,
        topCompanies: ['DeepMind', 'ARM', 'Rolls-Royce', 'BAE Systems', 'BT'],
        growthRate: 18,
        demandLevel: 'High'
      },
      'DE': {
        totalJobs: 1800,
        aiJobs: 380,
        averageSalary: 70000,
        topCompanies: ['SAP', 'Siemens', 'BMW', 'Mercedes-Benz', 'Bosch'],
        growthRate: 22,
        demandLevel: 'High'
      },
      'JP': {
        totalJobs: 1600,
        aiJobs: 320,
        averageSalary: 65000,
        topCompanies: ['Sony', 'Toyota', 'SoftBank', 'Nintendo', 'Panasonic'],
        growthRate: 15,
        demandLevel: 'Moderate'
      },
      'KR': {
        totalJobs: 1400,
        aiJobs: 290,
        averageSalary: 55000,
        topCompanies: ['Samsung', 'LG', 'Hyundai', 'SK Hynix', 'Naver'],
        growthRate: 28,
        demandLevel: 'High'
      },
      'CA': {
        totalJobs: 1200,
        aiJobs: 250,
        averageSalary: 85000,
        topCompanies: ['Shopify', 'BlackBerry', 'Cohere', 'Element AI', 'Mila'],
        growthRate: 20,
        demandLevel: 'High'
      },
      'FR': {
        totalJobs: 1100,
        aiJobs: 220,
        averageSalary: 60000,
        topCompanies: ['Thales', 'Atos', 'Dassault', 'Orange', 'Criteo'],
        growthRate: 16,
        demandLevel: 'Moderate'
      },
      'IN': {
        totalJobs: 2800,
        aiJobs: 560,
        averageSalary: 25000,
        topCompanies: ['Infosys', 'TCS', 'Wipro', 'HCL', 'Tech Mahindra'],
        growthRate: 40,
        demandLevel: 'Very High'
      },
      'BR': {
        totalJobs: 900,
        aiJobs: 180,
        averageSalary: 35000,
        topCompanies: ['Petrobras', 'Vale', 'Itaú', 'Banco do Brasil', 'Embraer'],
        growthRate: 30,
        demandLevel: 'Growing'
      }
    };

    const countryData = jobData[countryCode?.toUpperCase()] || {
      totalJobs: Math.floor(Math.random() * 1000) + 500,
      aiJobs: Math.floor(Math.random() * 200) + 100,
      averageSalary: Math.floor(Math.random() * 50000) + 40000,
      topCompanies: ['TechCorp', 'InnovateLab', 'AI Solutions', 'DataTech', 'FutureSoft'],
      growthRate: Math.floor(Math.random() * 20) + 10,
      demandLevel: 'Moderate'
    };

    // Add some fun randomization to make it more dynamic
    const funMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier
    countryData.totalJobs = Math.floor(countryData.totalJobs * funMultiplier);
    countryData.aiJobs = Math.floor(countryData.aiJobs * funMultiplier);
    countryData.averageSalary = Math.floor(countryData.averageSalary * funMultiplier);
    
    // Add fun job titles
    const funJobTitles = [
      'AI Wizard 🧙‍♂️', 'Data Sorcerer 🔮', 'Machine Learning Ninja 🥷',
      'Quantum Developer 🌌', 'Neural Network Architect 🧠', 'AI Ethics Guardian 🛡️',
      'Robotics Engineer 🤖', 'Computer Vision Specialist 👁️', 'NLP Engineer 💬',
      'Deep Learning Researcher 🔬', 'AI Product Manager 📊', 'MLOps Engineer ⚙️'
    ];
    
    countryData.funJobTitles = funJobTitles.slice(0, 5);
    countryData.marketVibes = [
      '🔥 Hot Market!', '🚀 Booming!', '💎 Premium Opportunities', 
      '⚡ High Energy', '🌟 Stellar Growth', '🎯 Target Rich'
    ][Math.floor(Math.random() * 6)];
    
    // Simulate API delay with some randomness for realism
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    
    // Store in cache for future use (saves API costs)
    try {
      await apiCall(`/api/job-cache/${countryCode}`, {
        method: 'POST',
        body: JSON.stringify(countryData)
      });
      console.log(`💼 Fresh job data cached for ${countryCode}`);
    } catch (cacheError) {
      console.warn(`⚠️ Failed to cache job data for ${countryCode}:`, cacheError.message);
    }
    
    return {
      success: true,
      data: countryData,
      cached: false,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Job data fetch failed:', error);
    throw error;
  }
}

/**
 * Get Wikipedia summary for cultural context
 * @param {string} countryName - Country name
 * @returns {Promise} Wikipedia summary
 */
export async function getWikipediaSummary(countryName) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
    console.log('📚 Fetching Wikipedia data:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Wikipedia API error: ${response.status}`);
    
    const data = await response.json();
    return {
      extract: data.extract || 'No cultural information available.',
      title: data.title,
      thumbnail: data.thumbnail?.source
    };
  } catch (error) {
    console.error('❌ Wikipedia data fetch failed:', error);
    return {
      extract: 'Cultural information temporarily unavailable.',
      title: countryName,
      thumbnail: null
    };
  }
}

/**
 * Get detailed place information using Geoapify
 * @param {string} placeId - Geoapify place ID
 * @returns {Promise} Detailed place data
 */
export async function getPlaceDetails(placeId) {
  try {
    const url = `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${GEOAPIFY_KEY}`;
    console.log('🔍 Fetching place details:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Place details API error: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Place details fetch failed:', error);
    throw error;
  }
}

/**
 * Real Jooble API integration (requires API key)
 * @param {string} countryCode - Country code
 * @param {string} keywords - Job search keywords
 * @returns {Promise} Real job data from Jooble
 */
export async function getJoobleJobs(countryCode, keywords = 'artificial intelligence') {
  try {
    // Note: Jooble API requires server-side integration due to CORS
    // This is a placeholder for the real implementation
    const joobleApiKey = 'YOUR_JOOBLE_API_KEY'; // You'll need to get this from Jooble
    
    // Map country codes to Jooble country parameters
    const joobleCountries = {
      'US': 'us', 'CN': 'cn', 'GB': 'uk', 'DE': 'de', 'JP': 'jp',
      'KR': 'kr', 'CA': 'ca', 'FR': 'fr', 'IN': 'in', 'BR': 'br'
    };
    
    const joobleCountry = joobleCountries[countryCode] || 'us';
    
    // For now, return enhanced mock data that simulates Jooble response
    console.log(`💼 Simulating Jooble API for ${countryCode} with keywords: ${keywords}`);
    
    const mockJoobleResponse = {
      totalCount: Math.floor(Math.random() * 5000) + 1000,
      jobs: Array.from({ length: 10 }, (_, i) => ({
        title: [
          'Senior AI Engineer', 'Machine Learning Scientist', 'Data Scientist',
          'AI Research Engineer', 'Deep Learning Engineer', 'Computer Vision Engineer',
          'NLP Engineer', 'AI Product Manager', 'Robotics Engineer', 'MLOps Engineer'
        ][i],
        company: `TechCorp ${i + 1}`,
        location: `${countryName} City`,
        salary: `$${Math.floor(Math.random() * 100000) + 80000}`,
        link: `https://example.com/job/${i + 1}`,
        snippet: `Exciting ${keywords} opportunity in ${countryName}...`
      }))
    };
    
    return {
      success: true,
      data: mockJoobleResponse,
      source: 'jooble_simulation'
    };
    
  } catch (error) {
    console.error('❌ Jooble API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Enhanced country data with multiple sources
 * @param {string} countryCode - Country code
 * @param {string} countryName - Country name
 * @returns {Promise} Combined country intelligence
 */
export async function getCountryIntelligence(countryCode, countryName) {
  try {
    console.log(`🧠 Fetching comprehensive intelligence for ${countryName} (${countryCode})`);
    
    // Get country coordinates for tourism data
    const coordinates = getCountryCoordinates(countryCode);
    
    // Fetch all data in parallel for better performance
    const [tourismData, jobData, wikiData] = await Promise.all([
      getTourismData(coordinates.bounds).catch(err => ({ features: [], error: err.message })),
      getJobData(countryCode).catch(err => ({ success: false, error: err.message })),
      getWikipediaSummary(countryName).catch(err => ({ extract: 'Cultural data unavailable', error: err.message }))
    ]);
    
    return {
      country: countryName,
      countryCode,
      coordinates,
      tourism: tourismData,
      jobs: jobData,
      culture: wikiData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Country intelligence fetch failed:', error);
    throw error;
  }
}

/**
 * Get country coordinates and bounds
 * @param {string} countryCode - Country code
 * @returns {Object} Coordinates and bounds
 */
function getCountryCoordinates(countryCode) {
  const coordinates = {
    'US': { lat: 39.8283, lng: -98.5795, bounds: '-125.0,24.0,-66.0,49.0' },
    'CN': { lat: 35.8617, lng: 104.1954, bounds: '73.0,18.0,135.0,54.0' },
    'GB': { lat: 55.3781, lng: -3.4360, bounds: '-8.0,49.0,2.0,61.0' },
    'DE': { lat: 51.1657, lng: 10.4515, bounds: '5.0,47.0,16.0,55.0' },
    'JP': { lat: 36.2048, lng: 138.2529, bounds: '129.0,31.0,146.0,46.0' },
    'KR': { lat: 35.9078, lng: 127.7669, bounds: '124.0,33.0,132.0,39.0' },
    'CA': { lat: 56.1304, lng: -106.3468, bounds: '-141.0,41.0,-52.0,84.0' },
    'FR': { lat: 46.2276, lng: 2.2137, bounds: '-5.0,41.0,10.0,51.0' },
    'IN': { lat: 20.5937, lng: 78.9629, bounds: '68.0,6.0,97.0,37.0' },
    'BR': { lat: -14.2350, lng: -51.9253, bounds: '-74.0,-34.0,-28.0,6.0' },
    'AU': { lat: -25.2744, lng: 133.7751, bounds: '112.0,-44.0,154.0,-9.0' },
    'IT': { lat: 41.8719, lng: 12.5674, bounds: '6.0,35.0,19.0,47.0' },
    'ES': { lat: 40.4637, lng: -3.7492, bounds: '-10.0,35.0,5.0,44.0' },
    'NL': { lat: 52.1326, lng: 5.2913, bounds: '3.0,50.0,8.0,54.0' },
    'SE': { lat: 60.1282, lng: 18.6435, bounds: '10.0,55.0,25.0,70.0' },
    'NO': { lat: 60.4720, lng: 8.4689, bounds: '4.0,57.0,32.0,72.0' },
    'DK': { lat: 56.2639, lng: 9.5018, bounds: '7.0,54.0,16.0,58.0' },
    'FI': { lat: 61.9241, lng: 25.7482, bounds: '19.0,59.0,32.0,71.0' },
    'SG': { lat: 1.3521, lng: 103.8198, bounds: '103.6,1.2,104.0,1.5' },
    'CH': { lat: 46.8182, lng: 8.2275, bounds: '5.0,45.0,11.0,48.0' },
    'AT': { lat: 47.5162, lng: 14.5501, bounds: '9.0,46.0,17.0,49.0' },
    'BE': { lat: 50.5039, lng: 4.4699, bounds: '2.0,49.0,7.0,52.0' },
    'PT': { lat: 39.3999, lng: -8.2245, bounds: '-10.0,36.0,-6.0,43.0' },
    'IE': { lat: 53.4129, lng: -8.2439, bounds: '-11.0,51.0,-5.0,56.0' },
    'IL': { lat: 31.0461, lng: 34.8516, bounds: '34.0,29.0,36.0,34.0' },
    'AE': { lat: 23.4241, lng: 53.8478, bounds: '51.0,22.0,57.0,27.0' },
    'SA': { lat: 23.8859, lng: 45.0792, bounds: '34.0,16.0,56.0,33.0' },
    'TR': { lat: 38.9637, lng: 35.2433, bounds: '25.0,35.0,45.0,43.0' },
    'RU': { lat: 61.5240, lng: 105.3188, bounds: '19.0,41.0,170.0,82.0' },
    'MX': { lat: 23.6345, lng: -102.5528, bounds: '-118.0,14.0,-86.0,33.0' },
    'AR': { lat: -38.4161, lng: -63.6167, bounds: '-74.0,-56.0,-53.0,-21.0' },
    'ZA': { lat: -30.5595, lng: 22.9375, bounds: '16.0,-35.0,33.0,-22.0' }
  };
  return coordinates[countryCode?.toUpperCase()] || coordinates['US'];
}

export default API_BASE;
