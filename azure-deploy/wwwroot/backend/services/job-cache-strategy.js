// 🎯 INTELLIGENT JOB SEARCH CACHING STRATEGY
// Implements smart caching to maximize API efficiency and user experience

/**
 * CACHE DURATION STRATEGY
 */
export const CACHE_DURATIONS = {
  // Job searches: 24 hours (balance freshness vs API usage)
  JOB_SEARCH: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  
  // Location data: 7 days (rarely changes)
  LOCATION_DATA: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Popular job titles: 48 hours (stable but competitive)
  POPULAR_TITLES: 48 * 60 * 60 * 1000, // 48 hours
  
  // Emergency extended cache (when near API limits)
  EMERGENCY_EXTENDED: 72 * 60 * 60 * 1000, // 72 hours
  
  // Quick cache for immediate re-requests
  QUICK_CACHE: 5 * 60 * 1000 // 5 minutes
};

/**
 * POPULAR JOB TITLES - Cache longer for common searches
 */
export const POPULAR_JOB_TITLES = [
  'software engineer', 'software developer', 'data scientist', 'product manager',
  'marketing manager', 'sales representative', 'business analyst', 'project manager',
  'full stack developer', 'frontend developer', 'backend developer', 'devops engineer',
  'machine learning engineer', 'data analyst', 'ux designer', 'ui designer',
  'accountant', 'financial analyst', 'hr manager', 'customer success manager'
];

/**
 * LOCATION ALIASES - Group similar location searches
 */
export const LOCATION_ALIASES = {
  'new york': ['ny', 'new york city', 'nyc', 'manhattan', 'brooklyn'],
  'san francisco': ['sf', 'san francisco bay area', 'bay area'],
  'los angeles': ['la', 'los angeles county', 'hollywood'],
  'chicago': ['chi', 'chicago il', 'windy city'],
  'boston': ['bos', 'boston ma', 'cambridge'],
  'seattle': ['sea', 'seattle wa', 'bellevue'],
  'austin': ['atx', 'austin tx', 'austin texas'],
  'denver': ['den', 'denver co', 'denver colorado'],
  'remote': ['work from home', 'wfh', 'telecommute', 'distributed']
};

/**
 * PEAK USAGE PATTERNS - When users search most
 */
export const PEAK_USAGE_HOURS = {
  // Morning job search rush (9-11 AM)
  MORNING_PEAK: { start: 9, end: 11 },
  
  // Lunch break searches (12-2 PM)  
  LUNCH_PEAK: { start: 12, end: 14 },
  
  // Evening searches (6-8 PM)
  EVENING_PEAK: { start: 18, end: 20 }
};

/**
 * API BUDGET MANAGEMENT
 */
export const API_BUDGET = {
  // Monthly API call limit (adjust based on your plan)
  MONTHLY_LIMIT: 10000,
  
  // Daily budget (70% of monthly / 30 days, reserve 30% for spikes)
  DAILY_BUDGET: Math.floor((10000 * 0.7) / 30),
  
  // Emergency reserve (20% of monthly)
  EMERGENCY_RESERVE: Math.floor(10000 * 0.2),
  
  // Warning threshold (80% of daily budget)
  WARNING_THRESHOLD: 0.8
};

/**
 * SMART SEARCH GROUPING - Normalize search terms
 */
export function normalizeSearchTerm(searchTerm) {
  if (!searchTerm) return '';
  
  const normalized = searchTerm.toLowerCase().trim();
  
  // Group similar job titles
  const jobTitleMappings = {
    'software developer': ['software engineer', 'programmer', 'coder', 'dev'],
    'data scientist': ['data analyst', 'ml engineer', 'machine learning engineer'],
    'frontend developer': ['front end developer', 'ui developer', 'react developer', 'vue developer'],
    'backend developer': ['back end developer', 'api developer', 'server developer'],
    'full stack developer': ['fullstack developer', 'full-stack developer'],
    'product manager': ['pm', 'product owner', 'product lead'],
    'ux designer': ['user experience designer', 'ux/ui designer'],
    'devops engineer': ['devops', 'site reliability engineer', 'sre']
  };
  
  // Find matching group
  for (const [canonical, aliases] of Object.entries(jobTitleMappings)) {
    if (aliases.some(alias => normalized.includes(alias)) || normalized.includes(canonical)) {
      return canonical;
    }
  }
  
  return normalized;
}

/**
 * SMART LOCATION GROUPING - Normalize location terms
 */
export function normalizeLocation(location) {
  if (!location) return '';
  
  const normalized = location.toLowerCase().trim();
  
  // Find matching location group
  for (const [canonical, aliases] of Object.entries(LOCATION_ALIASES)) {
    if (aliases.some(alias => normalized.includes(alias)) || normalized.includes(canonical)) {
      return canonical;
    }
  }
  
  return normalized;
}

/**
 * DETERMINE CACHE DURATION based on search characteristics
 */
export function getCacheDuration(searchTerm, location, userType = 'returning') {
  const normalizedTerm = normalizeSearchTerm(searchTerm);
  
  // Popular job titles get longer cache
  if (POPULAR_JOB_TITLES.includes(normalizedTerm)) {
    return CACHE_DURATIONS.POPULAR_TITLES;
  }
  
  // Location-based searches (stable) get longer cache
  if (location && Object.keys(LOCATION_ALIASES).includes(normalizeLocation(location))) {
    return CACHE_DURATIONS.LOCATION_DATA;
  }
  
  // New users get shorter cache (fresher data for first impression)
  if (userType === 'new') {
    return CACHE_DURATIONS.JOB_SEARCH * 0.5; // 12 hours
  }
  
  // Default cache duration
  return CACHE_DURATIONS.JOB_SEARCH;
}

/**
 * CHECK IF PEAK USAGE TIME
 */
export function isPeakUsageTime() {
  const now = new Date();
  const hour = now.getHours();
  
  return Object.values(PEAK_USAGE_HOURS).some(peak => 
    hour >= peak.start && hour <= peak.end
  );
}

/**
 * SHOULD EXTEND CACHE - Emergency cache extension when near API limits
 */
export function shouldExtendCache(dailyApiUsage, dailyBudget) {
  const usageRatio = dailyApiUsage / dailyBudget;
  
  // If we've used 80% of daily budget, extend cache durations
  return usageRatio >= API_BUDGET.WARNING_THRESHOLD;
}

/**
 * GET CACHE KEY with smart grouping
 */
export function getSmartCacheKey(searchTerm, location, page = 0) {
  const normalizedTerm = normalizeSearchTerm(searchTerm);
  const normalizedLocation = normalizeLocation(location);
  
  return `jobs_${normalizedTerm}_${normalizedLocation}_${page}`;
}

/**
 * PRIORITY SCORING - Determine which searches get fresh data
 */
export function getSearchPriority(searchTerm, location, userType, userHistory = {}) {
  let priority = 50; // Base priority
  
  // New users get higher priority (first impression matters)
  if (userType === 'new') {
    priority += 30;
  }
  
  // Specific location searches get higher priority
  if (location && location.trim()) {
    priority += 20;
  }
  
  // Less common job titles get higher priority (more valuable)
  if (!POPULAR_JOB_TITLES.includes(normalizeSearchTerm(searchTerm))) {
    priority += 15;
  }
  
  // Users who haven't searched recently get higher priority
  const lastSearchTime = userHistory.lastSearch;
  if (lastSearchTime && Date.now() - lastSearchTime > 24 * 60 * 60 * 1000) {
    priority += 10;
  }
  
  return Math.min(100, priority);
}

/**
 * PRE-CACHE POPULAR SEARCHES during low usage
 */
export const PRE_CACHE_SEARCHES = [
  { term: 'software engineer', location: '' },
  { term: 'data scientist', location: '' },
  { term: 'product manager', location: '' },
  { term: 'software engineer', location: 'new york' },
  { term: 'software engineer', location: 'san francisco' },
  { term: 'data scientist', location: 'new york' },
  { term: 'frontend developer', location: '' },
  { term: 'backend developer', location: '' },
  { term: 'full stack developer', location: '' },
  { term: 'marketing manager', location: '' }
];

/**
 * CACHE STATUS MESSAGES for user communication
 */
export function getCacheStatusMessage(cacheAge, isExtended = false) {
  if (cacheAge < 60) {
    return { 
      badge: '⚡ INSTANT RESULTS', 
      message: 'Fresh data from our cache',
      color: '#00bcd4'
    };
  } else if (cacheAge < 60 * 24) {
    const hours = Math.floor(cacheAge / 60);
    return { 
      badge: '📦 CACHED RESULTS', 
      message: `Data from ${hours} hour${hours > 1 ? 's' : ''} ago`,
      color: '#4caf50'
    };
  } else {
    const days = Math.floor(cacheAge / (60 * 24));
    return { 
      badge: isExtended ? '🔄 EXTENDED CACHE' : '📊 STORED RESULTS', 
      message: `Data from ${days} day${days > 1 ? 's' : ''} ago`,
      color: isExtended ? '#ff9800' : '#2196f3'
    };
  }
}

/**
 * INDUSTRY-SPECIFIC CACHE DURATIONS
 */
export const INDUSTRY_CACHE_DURATIONS = {
  // Fast-changing industries (shorter cache)
  'crypto': CACHE_DURATIONS.JOB_SEARCH * 0.5, // 12 hours
  'startup': CACHE_DURATIONS.JOB_SEARCH * 0.5,
  'fintech': CACHE_DURATIONS.JOB_SEARCH * 0.75, // 18 hours
  
  // Stable industries (longer cache)
  'government': CACHE_DURATIONS.POPULAR_TITLES, // 48 hours
  'education': CACHE_DURATIONS.POPULAR_TITLES,
  'healthcare': CACHE_DURATIONS.JOB_SEARCH * 1.5, // 36 hours
  'manufacturing': CACHE_DURATIONS.JOB_SEARCH * 1.5
};

/**
 * GET INDUSTRY-SPECIFIC CACHE DURATION
 */
export function getIndustryCacheDuration(searchTerm) {
  const term = searchTerm.toLowerCase();
  
  for (const [industry, duration] of Object.entries(INDUSTRY_CACHE_DURATIONS)) {
    if (term.includes(industry)) {
      return duration;
    }
  }
  
  return CACHE_DURATIONS.JOB_SEARCH;
}