// 🔍 JOB SEARCH SERVICE - Adzuna Integration with Intelligent Caching
import axios from "axios";
import {
  getCachedJobPostings,
  storeJobPostings,
  logJobSearchQuery,
  trackJobInteraction,
  cleanupExpiredJobs,
  isPostgresAvailable,
} from "../database.js";
import {
  storeJobPostingsMongo,
  getCachedJobPostingsMongo,
  logJobSearchQueryMongo,
  trackJobInteractionMongo,
  cleanupExpiredJobsMongo,
} from "../mongodb-operations.js";
import {
  normalizeSearchTerm,
  normalizeLocation,
  getCacheDuration,
  getSmartCacheKey,
  getSearchPriority,
  isPeakUsageTime,
  shouldExtendCache,
  getCacheStatusMessage,
  getIndustryCacheDuration,
  API_BUDGET,
} from "./job-cache-strategy.js";

const ADZUNA_APP_ID = "2498c2a6";
const ADZUNA_APP_KEY = "74dd1fc5c1720b42cfb6f1d64da12732";
const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";
const PAGE_SIZE = 10;

const COUNTRY_CODE_ALIASES = {
  us: "US",
  usa: "US",
  "united states": "US",
  "united states of america": "US",
  ca: "CA",
  canada: "CA",
  gb: "GB",
  uk: "GB",
  "united kingdom": "GB",
  britain: "GB",
  au: "AU",
  australia: "AU",
  in: "IN",
  india: "IN",
  de: "DE",
  germany: "DE",
  fr: "FR",
  france: "FR",
  es: "ES",
  spain: "ES",
  br: "BR",
  brazil: "BR",
  mx: "MX",
  mexico: "MX",
  jp: "JP",
  japan: "JP",
  sg: "SG",
  singapore: "SG"
};

function resolveCountryCode(rawCountry) {
  if (!rawCountry) {
    return "US";
  }

  const normalized = rawCountry.toString().trim().toLowerCase();
  if (!normalized) {
    return "US";
  }

  if (COUNTRY_CODE_ALIASES[normalized]) {
    return COUNTRY_CODE_ALIASES[normalized];
  }

  if (normalized.length === 2) {
    return normalized.toUpperCase();
  }

  return "US";
}

function postgresActive() {
  try {
    return Boolean(isPostgresAvailable());
  } catch (error) {
    console.warn("⚠️ Postgres availability check failed:", error.message);
    return false;
  }
}

async function getCachedJobsDual(searchParams, cacheDurationMs) {
  const postgresAvailable = postgresActive();

  if (postgresAvailable) {
    try {
      const pgResult = await getCachedJobPostings(searchParams, cacheDurationMs);
      if (pgResult && Array.isArray(pgResult.jobs) && pgResult.jobs.length > 0) {
        return { ...pgResult, dataSource: "postgresql" };
      }
    } catch (error) {
      console.warn("⚠️ PostgreSQL job cache lookup failed:", error.message);
    }
  }

  try {
    const mongoResult = await getCachedJobPostingsMongo(
      { ...searchParams, pageSize: PAGE_SIZE },
      cacheDurationMs
    );

    if (mongoResult && Array.isArray(mongoResult.jobs) && mongoResult.jobs.length > 0) {
      return {
        ...mongoResult,
        dataSource: postgresAvailable ? "mongodb+postgresql" : "mongodb"
      };
    }
  } catch (error) {
    console.warn("⚠️ MongoDB job cache lookup failed:", error.message);
  }

  return null;
}

async function persistJobPostingsDual(jobs, searchParams) {
  const postgresAvailable = postgresActive();
  const result = { postgres: null, mongo: null };

  if (postgresAvailable) {
    try {
      result.postgres = await storeJobPostings(jobs, searchParams);
    } catch (error) {
      console.warn("⚠️ PostgreSQL job storage failed:", error.message);
    }
  }

  try {
    result.mongo = await storeJobPostingsMongo(jobs, searchParams);
  } catch (error) {
    console.warn("⚠️ MongoDB job storage failed:", error.message);
  }

  return result;
}

async function logSearchQueryDual(searchParams, result, userInfo) {
  if (!result) return;

  if (postgresActive()) {
    try {
      await logJobSearchQuery(searchParams, result, userInfo);
    } catch (error) {
      console.warn("⚠️ PostgreSQL job search logging failed:", error.message);
    }
  }

  try {
    await logJobSearchQueryMongo(searchParams, result, userInfo);
  } catch (error) {
    console.warn("⚠️ MongoDB job search logging failed:", error.message);
  }
}

async function recordJobInteractionDual(jobId, interactionType, userInfo = {}, metadata = {}) {
  if (postgresActive()) {
    try {
      await trackJobInteraction(jobId, interactionType, userInfo, metadata);
    } catch (error) {
      console.warn("⚠️ PostgreSQL job interaction tracking failed:", error.message);
    }
  }

  try {
    await trackJobInteractionMongo(jobId, interactionType, userInfo, metadata);
  } catch (error) {
    console.warn("⚠️ MongoDB job interaction tracking failed:", error.message);
  }
}

async function cleanupExpiredJobsDual() {
  let total = 0;

  if (postgresActive()) {
    try {
      const pgCleaned = await cleanupExpiredJobs();
      total += pgCleaned || 0;
    } catch (error) {
      console.warn("⚠️ PostgreSQL job cleanup failed:", error.message);
    }
  }

  try {
    const mongoCleaned = await cleanupExpiredJobsMongo();
    total += mongoCleaned || 0;
  } catch (error) {
    console.warn("⚠️ MongoDB job cleanup failed:", error.message);
  }

  return total;
}

// In-memory cache for very recent searches (5 minutes)
const quickCache = new Map();

// API usage tracking
let dailyApiUsage = 0;
let lastResetDate = new Date().toDateString();

export async function searchAdzunaJobs(
  keywords = "software engineering",
  location = "",
  page = 0,
  userInfo = {}
) {
  const startTime = Date.now();

  // Reset daily API usage counter if new day
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyApiUsage = 0;
    lastResetDate = today;
    console.log("📅 Daily API usage counter reset");
  }

  // Smart search normalization
  const normalizedKeywords = normalizeSearchTerm(keywords);
  const normalizedLocation = normalizeLocation(location);
  const smartCacheKey = getSmartCacheKey(
    normalizedKeywords,
    normalizedLocation,
    page
  );

  const preferredCountry =
    userInfo.country ||
    userInfo.countryCode ||
    userInfo.preferredCountry ||
    userInfo.region ||
    null;

  const countryCode = resolveCountryCode(preferredCountry);

  const searchParams = {
    keywords: normalizedKeywords,
    location: normalizedLocation,
    page,
    country: countryCode,
    originalKeywords: keywords,
    originalLocation: location,
  };

  // Determine user type and search priority
  const userType = userInfo.isNewUser ? "new" : "returning";
  const searchPriority = getSearchPriority(
    normalizedKeywords,
    normalizedLocation,
    userType,
    userInfo.history
  );
  const isHighPriority = searchPriority > 70;

  console.log(`🎯 Search priority: ${searchPriority}/100 (${userType} user)`);

  try {
    // Check quick cache first (5 minutes for very recent searches)
    if (quickCache.has(smartCacheKey)) {
      const cached = quickCache.get(smartCacheKey);
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        console.log("⚡ Serving quick-cached job results");
        const result = {
          ...cached.data,
          responseTime: Date.now() - startTime,
          cacheStatus: getCacheStatusMessage(0),
        };
        await logSearchQueryDual(searchParams, result, userInfo);
        return result;
      }
    }

    // Determine appropriate cache duration
    const baseCacheDuration = getCacheDuration(
      normalizedKeywords,
      normalizedLocation,
      userType
    );
    const industryCacheDuration = getIndustryCacheDuration(normalizedKeywords);
    const cacheDuration = Math.min(baseCacheDuration, industryCacheDuration);

    // Check if we should extend cache due to API budget constraints
    const shouldExtend = shouldExtendCache(
      dailyApiUsage,
      API_BUDGET.DAILY_BUDGET
    );
    const effectiveCacheDuration = shouldExtend
      ? cacheDuration * 2
      : cacheDuration;

    if (shouldExtend) {
      console.log("⚠️ Extending cache duration due to API budget constraints");
    }

    // Check database cache with smart duration
    console.log(
      `🔍 Checking database cache (${Math.round(
        effectiveCacheDuration / (60 * 60 * 1000)
      )}h duration)...`
    );
    const cachedJobs = await getCachedJobsDual(
      searchParams,
      effectiveCacheDuration
    );

    if (cachedJobs && cachedJobs.jobs.length > 0) {
      const cacheAgeMinutes = cachedJobs.cache_age;
      console.log(
        `📦 Found ${cachedJobs.jobs.length} cached jobs (${cacheAgeMinutes} minutes old)`
      );

      // For high-priority searches during peak times, consider bypassing cache
      if (
        isHighPriority &&
        isPeakUsageTime() &&
        cacheAgeMinutes > 60 &&
        dailyApiUsage < API_BUDGET.DAILY_BUDGET * 0.5
      ) {
        console.log(
          "🚀 High-priority search during peak time - considering fresh data..."
        );
        // Continue to API fetch
      } else {
        const result = {
          ...cachedJobs,
          responseTime: Date.now() - startTime,
          cached: true,
          cacheStatus: getCacheStatusMessage(cacheAgeMinutes, shouldExtend),
        };
        await logSearchQueryDual(searchParams, result, userInfo);
        return result;
      }
    }

    // Check API budget before making calls
    if (dailyApiUsage >= API_BUDGET.DAILY_BUDGET) {
      console.log(
        "⚠️ Daily API budget exceeded - serving extended cache or error"
      );

      // Try to serve older cached data
      const extendedCachedJobs = await getCachedJobsDual(
        searchParams,
        effectiveCacheDuration * 3
      );
      if (extendedCachedJobs && extendedCachedJobs.jobs.length > 0) {
        const result = {
          ...extendedCachedJobs,
          responseTime: Date.now() - startTime,
          cached: true,
          budgetExceeded: true,
          cacheStatus: {
            badge: "⚠️ BUDGET LIMIT",
            message: "Serving extended cache due to API limits",
            color: "#ff5722",
          },
        };
        await logSearchQueryDual(searchParams, result, userInfo);
        return result;
      }

      throw new Error("Daily API budget exceeded and no cached data available");
    }

    // If no cache and this is a new search (page 0), fetch multiple pages
    if (page === 0) {
      console.log(
        "🚀 New search detected - fetching multiple pages to build comprehensive database..."
      );
      return await fetchAndStoreMultiplePages(
        normalizedKeywords,
        normalizedLocation,
        userInfo,
        startTime,
        searchParams
      );
    }

    // If we reach here, we need to fetch from API (either no cache or requesting page > 0 without full cache)
    console.log(
      `🔍 No sufficient cache found, fetching from Adzuna API (page ${page})...`
    );
    return await fetchSinglePage(
      normalizedKeywords,
      normalizedLocation,
      page,
      userInfo,
      startTime,
      searchParams
    );
  } catch (error) {
    console.error("❌ Adzuna job search failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw new Error(`Job search failed: ${error.message}`);
  }
}

function parseAdzunaJobs(adzunaResults) {
  const jobs = [];

  console.log(
    "🔍 Parsing Adzuna API response, jobs count:",
    adzunaResults.length
  );

  adzunaResults.forEach((job, index) => {
    try {
      // Format salary
      let salary = "Salary not specified";
      let salary_min = null;
      let salary_max = null;

      if (job.salary_min && job.salary_max) {
        const minSalary = Math.round(parseFloat(job.salary_min));
        const maxSalary = Math.round(parseFloat(job.salary_max));
        salary = `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;
        salary_min = minSalary;
        salary_max = maxSalary;
      } else if (job.salary_min) {
        const minSalary = Math.round(parseFloat(job.salary_min));
        salary = `$${minSalary.toLocaleString()}+`;
        salary_min = minSalary;
      } else if (job.salary_max) {
        const maxSalary = Math.round(parseFloat(job.salary_max));
        salary = `Up to $${maxSalary.toLocaleString()}`;
        salary_max = maxSalary;
      }

      // Format location
      let location = "Location not specified";
      if (job.location) {
        const locationParts = [];
        if (job.location.area && job.location.area.length > 0) {
          locationParts.push(...job.location.area);
        }
        if (locationParts.length > 0) {
          location = locationParts.join(", ");
        }
      }

      // Format date
      let datePosted = "Recent";
      let date_posted = new Date();

      if (job.created) {
        const createdDate = new Date(job.created);
        date_posted = createdDate;
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          datePosted = "1 day ago";
        } else if (diffDays < 7) {
          datePosted = `${diffDays} days ago`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          datePosted = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        } else {
          datePosted = "Over a month ago";
        }
      }

      const parsedJob = {
        id: job.id || `adzuna_${Date.now()}_${index}`,
        title: job.title || "Job Title Not Available",
        company: job.company?.display_name || "Company Not Specified",
        location: location,
        salary: salary,
        salary_min: salary_min,
        salary_max: salary_max,
        metadata: job.description
          ? job.description.substring(0, 200) + "..."
          : "No description available",
        url: job.redirect_url || "https://www.adzuna.com",
        date: datePosted,
        date_posted: date_posted,
        source: "Adzuna",
        contract_type: job.contract_type || "Not specified",
        category: job.category?.label || "General",
      };

      jobs.push(parsedJob);
      console.log(
        `✅ Parsed job ${jobs.length}: ${parsedJob.title} at ${parsedJob.company}`
      );
    } catch (error) {
      console.log("Error parsing Adzuna job:", error.message);
    }
  });

  console.log(`🔍 Final result: ${jobs.length} jobs parsed from Adzuna`);
  return jobs;
}

export function clearJobCache() {
  quickCache.clear();
  console.log("🔍 Job search quick cache cleared");
}

export async function trackJobClick(jobId, userInfo = {}) {
  try {
    await recordJobInteractionDual(jobId, "click", userInfo);
    console.log(`👆 Job click tracked: ${jobId}`);
  } catch (error) {
    console.warn("⚠️ Failed to track job click:", error.message);
  }
}

export async function cleanupOldJobs() {
  try {
    const cleaned = await cleanupExpiredJobsDual();
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired job postings`);
    }
    return cleaned;
  } catch (error) {
    console.warn("⚠️ Failed to cleanup old jobs:", error.message);
    return 0;
  }
}

export function getApiUsageStats() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyApiUsage = 0;
    lastResetDate = today;
  }

  return {
    daily: dailyApiUsage,
    budget: API_BUDGET.DAILY_BUDGET,
    remaining: Math.max(0, API_BUDGET.DAILY_BUDGET - dailyApiUsage),
    percentage: Math.round((dailyApiUsage / API_BUDGET.DAILY_BUDGET) * 100),
    isPeakTime: isPeakUsageTime(),
    shouldExtendCache: shouldExtendCache(
      dailyApiUsage,
      API_BUDGET.DAILY_BUDGET
    ),
  };
}

/**
 * Fetch multiple pages from Adzuna to build comprehensive job database
 */
async function fetchAndStoreMultiplePages(
  keywords,
  location,
  userInfo,
  startTime,
  searchParams
) {
  const allJobs = [];
  let totalResults = 0;
  let pagesProcessed = 0;

  // Smart page fetching based on peak usage and API budget
  let maxPages = 5; // Default: 5 pages (50 jobs)

  if (isPeakUsageTime() && dailyApiUsage > API_BUDGET.DAILY_BUDGET * 0.6) {
    maxPages = 3; // Reduce during peak times when budget is tight
    console.log(
      "⚠️ Reducing page fetch due to peak usage and budget constraints"
    );
  } else if (dailyApiUsage < API_BUDGET.DAILY_BUDGET * 0.3) {
    maxPages = 7; // Increase when budget allows
    console.log(
      "💰 Increasing page fetch - budget allows for more comprehensive data"
    );
  }

  try {
    console.log(
      `📚 Fetching multiple pages for "${keywords}" in "${location}"...`
    );

    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      try {
        console.log(`📄 Fetching page ${currentPage}/${maxPages}...`);

        // Build Adzuna API URL for current page
        const country = (searchParams.country || "US").toLowerCase();
        const adzunaUrl = `${ADZUNA_BASE_URL}/${country}/search/${currentPage}`;

        const params = {
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_APP_KEY,
          results_per_page: 10,
          what: keywords,
        };

        if (location && location.trim()) {
          params.where = location.trim();
        }

        const response = await axios.get(adzunaUrl, {
          params: params,
          timeout: 15000,
          headers: {
            "User-Agent": "JobSearchApp/1.0",
          },
        });

        if (currentPage === 1) {
          totalResults = response.data.count || 0;
          console.log(
            `📊 Total jobs available: ${totalResults.toLocaleString()}`
          );
        }

        const pageJobs = parseAdzunaJobs(response.data.results || []);
        allJobs.push(...pageJobs);
        pagesProcessed++;

        console.log(
          `✅ Page ${currentPage}: ${pageJobs.length} jobs added (${allJobs.length} total)`
        );

        // Track API usage
        dailyApiUsage++;

        // Small delay to be respectful to API (longer during peak times)
        if (currentPage < maxPages) {
          const delay = isPeakUsageTime() ? 500 : 200;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (pageError) {
        console.warn(
          `⚠️ Failed to fetch page ${currentPage}:`,
          pageError.message
        );
        // Continue with other pages even if one fails
      }
    }

    console.log(
      `🎯 Multi-page fetch complete: ${allJobs.length} jobs from ${pagesProcessed} pages`
    );

    // Store all jobs in database
    if (allJobs.length > 0) {
      console.log("💾 Storing comprehensive job dataset in database...");
      await persistJobPostingsDual(allJobs, searchParams);
    }

    // Return first page of results to user
    const firstPageJobs = allJobs.slice(0, 10);

    const result = {
      success: true,
      source: "adzuna_multi_page",
      query: searchParams.originalKeywords || keywords,
      location: searchParams.originalLocation || location,
      jobs: firstPageJobs,
      count: firstPageJobs.length,
      total_results: totalResults,
      total_fetched: allJobs.length,
      pages_processed: pagesProcessed,
      has_more: allJobs.length > 10,
      page: 0,
      credits_used: pagesProcessed,
      responseTime: Date.now() - startTime,
      cached: false,
      cacheStatus: getCacheStatusMessage(0),
      apiUsage: {
        daily: dailyApiUsage,
        budget: API_BUDGET.DAILY_BUDGET,
        remaining: API_BUDGET.DAILY_BUDGET - dailyApiUsage,
      },
    };

    // Store in quick cache with smart key
    const smartCacheKey = getSmartCacheKey(keywords, location, 0);
    quickCache.set(smartCacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    // Log the search query
    await logSearchQueryDual(searchParams, result, userInfo);

    return result;
  } catch (error) {
    console.error("❌ Multi-page fetch failed:", error.message);

    // Fallback to single page if multi-page fails
    console.log("🔄 Falling back to single page fetch...");
    return await fetchSinglePage(
      keywords,
      location,
      0,
      userInfo,
      startTime,
      searchParams
    );
  }
}

/**
 * Fallback single page fetch (original logic)
 */
async function fetchSinglePage(
  keywords,
  location,
  page,
  userInfo,
  startTime,
  searchParams
) {
  const searchContext = searchParams || {
    originalKeywords: keywords,
    originalLocation: location,
  };
  // Determine country code (default to US)
  const country = (searchParams?.country || "US").toLowerCase();

  // Build Adzuna API URL
  const adzunaUrl = `${ADZUNA_BASE_URL}/${country}/search/${page + 1}`;

  // Build query parameters
  const params = {
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: 10,
    what: keywords,
  };

  // Add location if provided
  if (location && location.trim()) {
    params.where = location.trim();
  }

  console.log(
    "🔍 Calling Adzuna API (single page):",
    adzunaUrl,
    "with params:",
    params
  );

  const response = await axios.get(adzunaUrl, {
    params: params,
    timeout: 15000,
    headers: {
      "User-Agent": "JobSearchApp/1.0",
    },
  });

  console.log("📄 Adzuna response:", response.data.count, "jobs found");

  const jobs = parseAdzunaJobs(response.data.results || []);

  // Track API usage
  dailyApiUsage++;

  const result = {
    success: true,
    source: "adzuna_single_page",
    query: searchContext.originalKeywords || keywords,
    location: searchContext.originalLocation || location,
    jobs: jobs,
    count: jobs.length,
    total_results: response.data.count || 0,
    has_more: (page + 1) * PAGE_SIZE < (response.data.count || 0),
    page: parseInt(page),
    credits_used: 1,
    responseTime: Date.now() - startTime,
    cached: false,
    cacheStatus: getCacheStatusMessage(0),
    apiUsage: {
      daily: dailyApiUsage,
      budget: API_BUDGET.DAILY_BUDGET,
      remaining: API_BUDGET.DAILY_BUDGET - dailyApiUsage,
    },
  };

  // Store in database for caching
  if (jobs.length > 0) {
    console.log("💾 Storing jobs in database cache...");
    await persistJobPostingsDual(jobs, searchParams || searchContext);
  }

  // Store in quick cache with smart key
  const smartCacheKey = getSmartCacheKey(keywords, location, page);
  quickCache.set(smartCacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  // Log the search query
  await logSearchQueryDual(searchParams || searchContext, result, userInfo);

  return result;
}
