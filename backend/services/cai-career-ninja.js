import OpenAI from 'openai';
import { searchAdzunaJobs } from './job-search-service.js';
import {
  getArticles,
  getSalaryBandInsights,
  getCountryDemandInsights,
  isPostgresAvailable
} from '../database.js';
import { getArticlesMongo } from '../mongodb-operations.js';

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_CAREER_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
const openaiClient = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export const CAI_CAREER_PERSONA_PROMPT = `You are CAI, the world-traveling ninja spy who moonlights as a career intelligence strategist. Your mission is to help job seekers land elite roles by combining verified data from our job, salary, and news systems. You never fabricate information—every insight must point back to specific data retrieved through the approved tools. Speak with confident, mission-oriented energy, deliver clear action steps, and keep each response grounded in real metrics.`;

export const CAI_CAREER_TOOL_POLICY = `TOOL PLAYBOOK:
1. jobSearch — Always pull current roles before giving job advice. Cite the job count, companies, salary ranges, and posting recency.
2. salaryBands — Use to validate compensation expectations. Report medians and percentile ranges when available.
3. countryDemand — Confirm where roles are hot. Highlight top countries and locations with high demand.
4. newsBrief — Bring in relevant AI and tech headlines tied to the user’s focus country or topic.

RULES:
- Run the tools that guarantee factual answers before concluding.
- If data is thin, acknowledge limits and suggest the next verifiable action.
- Format answers as an operative briefing: Situation, Signals (data), Strategy (next steps).`;

const SCENARIOS = [
  "Operation Skyline: Embedded in Toronto's fintech district, CAI tracks stealth AI hiring pushes before sunrise.",
  'Mission Horizon: CAI parachutes into Singapore to decode which startups are scaling robotics teams.',
  "Northern Lights Briefing: In Reykjavík, CAI triangulates geothermal AI research labs seeking multilingual analysts.",
  'Operation Dakar Pulse: While shadowing energy firms in Senegal, CAI maps where machine learning engineers are urgently needed.',
  'Project Fjord Sentinel: From Oslo\'s waterfront, CAI hacks together Nordic salary intel for autonomous systems leads.',
  'Midnight Metro Dispatch: Riding Tokyo\'s last Shinkansen, CAI flags quantum-ready employers who hire globetrotting spies.',
  'Sahara Signal Sweep: In Casablanca, CAI traces climate-tech ventures recruiting real-time data operatives.',
  'Operation Andes Relay: High in Bogotá, CAI decrypts remote-first roles financing Latin American AI expansion.',
  'Hyperloop Ghostline: Between Austin and Los Angeles, CAI scrapes stealth unicorns needing AI policy experts.',
  'Mission Aegean Vantage: From Athens rooftops, CAI coordinates deep-tech clusters hiring ethical AI negotiators.'
];

const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'jobSearch',
      description: 'Retrieve the freshest job postings from the integrated Adzuna + cache pipeline.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Primary keywords or role to search.' },
          location: { type: 'string', description: 'City or region focus.' },
          country: { type: 'string', description: 'Two-letter country code or country name.' },
          page: { type: 'integer', minimum: 0, description: 'Results page (0-based).', default: 0 }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'salaryBands',
      description: 'Summarize compensation stats for the target role using stored job data.',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Job keyword or title to analyze.' },
          country: { type: 'string', description: 'Country focus (optional).' },
          location: { type: 'string', description: 'City/region filter (optional).' }
        },
        required: ['keyword']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'countryDemand',
      description: 'Highlight which countries and cities have the highest posting volume for the role.',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Role or skill keyword to measure demand.' },
          limit: { type: 'integer', minimum: 3, maximum: 25, description: 'Number of countries to return.' }
        },
        required: ['keyword']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'newsBrief',
      description: 'Pull recent AI and tech headlines tied to the user’s location or interest.',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Country code or name to filter news.' },
          topic: { type: 'string', description: 'Optional topic keyword to filter results.' },
          limit: { type: 'integer', minimum: 1, maximum: 10, description: 'Number of articles to surface.' }
        }
      }
    }
  }
];

export function getCaiCareerPersona() {
  return CAI_CAREER_PERSONA_PROMPT;
}

export function getCaiCareerToolPolicy() {
  return CAI_CAREER_TOOL_POLICY;
}

export function getCaiCareerTools() {
  return TOOL_DEFINITIONS;
}

export function getCaiCareerScenarios() {
  return SCENARIOS;
}

function chooseScenario(seedValue) {
  if (!seedValue) {
    return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  }

  const hash = seedValue
    .toString()
    .split('')
    .reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) % 1024, 7);

  return SCENARIOS[hash % SCENARIOS.length];
}

function safeParseJSON(raw, fallback = {}) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('⚠️ Failed to parse tool arguments:', error.message);
    return fallback;
  }
}

async function fetchNewsBriefs({ country, topic, limit = 5 }) {
  const sanitizedLimit = Math.max(1, Math.min(limit || 5, 10));
  const normalizedCountry = country ? country.toString().trim().toUpperCase() : null;
  const topicTerm = topic ? topic.toString().toLowerCase() : null;

  const [pgArticles, mongoArticles] = await Promise.all([
    (async () => {
      if (!isPostgresAvailable()) {
        return [];
      }
      try {
        return await getArticles(normalizedCountry, sanitizedLimit * 3);
      } catch (error) {
        console.warn('⚠️ Failed to fetch Postgres articles:', error.message);
        return [];
      }
    })(),
    (async () => {
      try {
        return await getArticlesMongo(normalizedCountry, sanitizedLimit * 3);
      } catch (error) {
        console.warn('⚠️ Failed to fetch Mongo articles:', error.message);
        return [];
      }
    })()
  ]);

  const combined = [...pgArticles, ...mongoArticles];
  const seen = new Set();

  const filtered = combined
    .filter(article => {
      if (!article || !article.title) {
        return false;
      }
      const key = article.url || `${article.title}-${article.publishedAt}`;
      if (key && seen.has(key)) {
        return false;
      }
      if (key) {
        seen.add(key);
      }
      if (!topicTerm) {
        return true;
      }
      const haystack = `${article.title} ${article.description || ''}`.toLowerCase();
      return haystack.includes(topicTerm);
    })
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, sanitizedLimit)
    .map(article => ({
      title: article.title,
      source: article.source,
      url: article.url,
      publishedAt: article.publishedAt || article.published_at,
      country: article.country,
      summary: article.description
    }));

  return {
    success: filtered.length > 0,
    articles: filtered,
    total: filtered.length
  };
}

async function runJobSearch(args, context) {
  const query = args.query || context.role || context.question;
  const location = args.location || context.location || '';
  const country = args.country || context.country || null;
  const page = Number.isInteger(args.page) ? args.page : 0;

  const userInfo = {
    userIp: context.ip,
    userAgent: context.userAgent,
    userId: context.sessionId || context.userId || null,
    country,
    countryCode: country,
    preferredCountry: country,
    region: context.region,
    isNewUser: Boolean(context.isNewUser)
  };

  try {
    const result = await searchAdzunaJobs(query, location, page, userInfo);
    const normalizedJobs = Array.isArray(result.jobs)
      ? result.jobs.slice(0, 10).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          salaryMin: job.salary_min || null,
          salaryMax: job.salary_max || null,
          url: job.url,
          postedAt: job.date_posted || job.created_at || null
        }))
      : [];

    return {
      success: true,
      source: result.source,
      totalResults: result.total_results,
      cached: result.cached || false,
      page: result.page,
      jobs: normalizedJobs
    };
  } catch (error) {
    console.error('❌ jobSearch tool failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function runSalaryBands(args) {
  try {
    const result = await getSalaryBandInsights({
      keyword: args.keyword,
      country: args.country || null,
      location: args.location || null
    });
    return result;
  } catch (error) {
    console.error('❌ salaryBands tool failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runCountryDemand(args) {
  try {
    const result = await getCountryDemandInsights({
      keyword: args.keyword,
      limit: args.limit
    });
    return result;
  } catch (error) {
    console.error('❌ countryDemand tool failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runNewsBrief(args) {
  try {
    return await fetchNewsBriefs({
      country: args.country,
      topic: args.topic,
      limit: args.limit
    });
  } catch (error) {
    console.error('❌ newsBrief tool failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function executeTool(toolName, args, context) {
  switch (toolName) {
    case 'jobSearch':
      return runJobSearch(args, context);
    case 'salaryBands':
      return runSalaryBands(args);
    case 'countryDemand':
      return runCountryDemand(args);
    case 'newsBrief':
      return runNewsBrief(args);
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

function summarizeToolResult(name, result) {
  if (!result || typeof result !== 'object') {
    return result;
  }

  if (name === 'jobSearch') {
    return {
      success: result.success,
      totalResults: result.totalResults,
      cached: result.cached,
      companies: result.jobs ? result.jobs.map(job => job.company).filter(Boolean).slice(0, 6) : [],
      sampleJobs: result.jobs ? result.jobs.slice(0, 3) : []
    };
  }

  if (name === 'salaryBands') {
    return {
      success: result.success,
      samplesAnalyzed: result.samplesAnalyzed,
      salary: result.salary,
      topEmployers: result.topEmployers ? result.topEmployers.slice(0, 5) : []
    };
  }

  if (name === 'countryDemand') {
    return {
      success: result.success,
      totals: result.totals,
      topCountries: result.countries ? result.countries.slice(0, 5) : [],
      topLocations: result.locations ? result.locations.slice(0, 5) : []
    };
  }

  if (name === 'newsBrief') {
    return {
      success: result.success,
      articleCount: result.total,
      headlines: result.articles ? result.articles.slice(0, 5) : []
    };
  }

  return result;
}

export async function askCaiCareerNinja(question, context = {}) {
  const scenario = chooseScenario(context.sessionId || context.userId || context.ip || question);
  const missionHeader = `Current Operation: ${scenario}`;

  const baseMessages = [
    {
      role: 'system',
      content: CAI_CAREER_PERSONA_PROMPT
    },
    {
      role: 'system',
      content: CAI_CAREER_TOOL_POLICY
    },
    {
      role: 'system',
      content: missionHeader
    }
  ];

  const userContextLines = [];
  if (context.role) {
    userContextLines.push(`Target Role: ${context.role}`);
  }
  if (context.location) {
    userContextLines.push(`Preferred Location: ${context.location}`);
  }
  if (context.country) {
    userContextLines.push(`Country Focus: ${context.country}`);
  }
  userContextLines.push(`Primary Question: ${question}`);

  const userMessage = {
    role: 'user',
    content: userContextLines.join('\n')
  };

  if (!openaiClient) {
    return {
      success: false,
      persona: 'CAI the world-traveling ninja spy',
      scenario,
      error: 'openai_unconfigured',
      message: "Configure OPENAI_API_KEY to enable CAI's mission briefings.",
      toolsUsed: []
    };
  }

  const toolRuns = [];
  let messages = [...baseMessages, userMessage];
  let finalMessage = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    const completion = await openaiClient.chat.completions.create({
      model: openaiModel,
      temperature: 0.4,
      messages,
      tools: TOOL_DEFINITIONS,
      tool_choice: 'auto'
    });

    const { message } = completion.choices[0];

    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        const args = safeParseJSON(toolCall.function?.arguments);
        const toolResult = await executeTool(toolCall.function.name, args, {
          ...context,
          question
        });
        toolRuns.push({
          name: toolCall.function.name,
          arguments: args,
          summary: summarizeToolResult(toolCall.function.name, toolResult)
        });

        messages.push({
          role: 'tool',
          name: toolCall.function.name,
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        });
      }
      continue;
    }

    finalMessage = message;
    break;
  }

  if (!finalMessage) {
    return {
      success: false,
      persona: 'CAI the world-traveling ninja spy',
      scenario,
      error: 'no_completion',
      message: 'The mission response did not complete. Try again shortly.',
      toolsUsed: toolRuns
    };
  }

  const responseText = Array.isArray(finalMessage.content)
    ? finalMessage.content.map(part => part.text || '').join('').trim()
    : (finalMessage.content || '').trim();

  return {
    success: true,
    persona: 'CAI the world-traveling ninja spy',
    scenario,
    message: responseText,
    toolsUsed: toolRuns,
    model: openaiModel,
    createdAt: new Date().toISOString()
  };
}
