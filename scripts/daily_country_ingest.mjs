import 'dotenv/config';
import pg from 'pg';
import fetch from 'node-fetch';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const OAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const JOB_API_URL = process.env.JOB_API_URL;
const DO_OAI_BRIEF = (process.env.DO_OAI_BRIEF || 'true').toLowerCase() === 'true';

const TAGS = [
  { key: 'ai', rx: /\b(ai|artificial intelligence|gpt|openai|llm|model|ml|machine learning)\b/i },
  { key: 'startups', rx: /\b(startup|seed|series [ab]|funding|venture|angel|accelerator|incubator)\b/i },
  { key: 'companies', rx: /\b(google|microsoft|meta|amazon|tesla|nvidia|openai|apple|bytedance|oracle|ibm)\b/i },
  { key: 'technology', rx: /\b(tech|cloud|kubernetes|devops|saas|api|cyber|data|analytics|robot|quantum)\b/i }
];

function classifyCategory(title, summary) {
  const text = `${title} ${summary || ''}`;
  for (const t of ['ai', 'startups', 'companies']) {
    const rule = TAGS.find((x) => x.key === t);
    if (rule?.rx?.test(text)) return t;
  }
  return 'technology';
}

function randomTen(items) {
  if (!Array.isArray(items) || items.length <= 10) {
    return Array.isArray(items) ? items : [];
  }
  const picks = new Set();
  while (picks.size < 10) {
    picks.add(Math.floor(Math.random() * items.length));
  }
  return [...picks].map((index) => items[index]);
}

async function embedText(text) {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
    throw new Error('Azure OpenAI credentials missing for embeddings');
  }

  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-08-01-preview`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_OPENAI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text.slice(0, 6000) })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const embedding = payload?.data?.[0]?.embedding;
  if (!embedding) {
    throw new Error('Embedding payload missing data');
  }
  return embedding;
}

async function chatBrief(country, stats) {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
    return null;
  }

  const systemPrompt = 'You write one-sentence market brief. Be factual, concise, and avoid fluff.';
  const content = `Country: ${country}\nStats: ${JSON.stringify(stats).slice(0, 1200)}`;
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${OAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_OPENAI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      temperature: 0.2,
      max_tokens: 250
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brief generation failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  return payload?.choices?.[0]?.message?.content || null;
}

function idFrom(source) {
  return (source || '').replace(/[^\w]/g, '').slice(-64);
}

async function ensureTable(client, cc) {
  await client.query('SELECT ensure_country_news_table($1);', [cc]);
}

async function upsertNews(client, cc, article) {
  const id = idFrom(article.url || article.title);
  const title = article.title || '';
  const summary = (article.description || article.content || '').slice(0, 1200);
  const category = classifyCategory(title, summary);
  const source = article.source?.name || '';
  const url = article.url || '';
  const publishedAt = article.publishedAt || new Date().toISOString();
  const embedding = await embedText(`${title}\n${summary}`);

  const sql = `
    INSERT INTO news_country_${cc} (id, title, source, url, published_at, summary, category, embedding)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (id) DO UPDATE SET
      title=EXCLUDED.title,
      source=EXCLUDED.source,
      url=EXCLUDED.url,
      published_at=EXCLUDED.published_at,
      summary=EXCLUDED.summary,
      category=EXCLUDED.category,
      embedding=EXCLUDED.embedding;
  `;

  await client.query(sql, [
    id,
    title,
    source,
    url,
    publishedAt,
    summary,
    category,
    embedding
  ]);
}

async function fetchTopHeadlines(cc) {
  if (!NEWS_API_KEY) {
    return [];
  }
  const url = `https://newsapi.org/v2/top-headlines?country=${cc}&category=technology&pageSize=20&apiKey=${NEWS_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  const payload = await response.json();
  return Array.isArray(payload.articles) ? payload.articles : [];
}

function statsFromJobs(jobs) {
  const byCompany = {};
  const byTitle = {};
  const salaries = [];

  for (const job of jobs || []) {
    const company = (job.company || '').trim();
    const title = (job.title || '').trim();
    if (company) byCompany[company] = (byCompany[company] || 0) + 1;
    if (title) byTitle[title] = (byTitle[title] || 0) + 1;

    if (job.salary_min && job.salary_max) {
      const min = Number(job.salary_min);
      const max = Number(job.salary_max);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        salaries.push((min + max) / 2);
      }
    } else if (job.salary) {
      const numeric = Number(String(job.salary).replace(/[^\d.]/g, ''));
      if (!Number.isNaN(numeric)) {
        salaries.push(numeric);
      }
    }
  }

  const companies = Object.entries(byCompany)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const titles = Object.entries(byTitle)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  salaries.sort((a, b) => a - b);
  const mid = Math.floor(salaries.length / 2);
  const median = salaries.length
    ? salaries.length % 2
      ? salaries[mid]
      : (salaries[mid - 1] + salaries[mid]) / 2
    : null;

  const stats = {
    n: salaries.length,
    min: salaries.length ? salaries[0] : null,
    median,
    max: salaries.length ? salaries[salaries.length - 1] : null,
    currency: 'LOCAL'
  };

  return { top_companies: companies, top_titles: titles, salary_stats: stats };
}

async function fetchJobs(cc) {
  if (!JOB_API_URL) {
    return [];
  }
  const response = await fetch(`${JOB_API_URL}?country=${cc}&limit=100`);
  if (!response.ok) {
    return [];
  }
  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

async function main() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const countriesResult = await client.query('SELECT code FROM cai_countries ORDER BY code');
  const countries = countriesResult.rows.map((row) => row.code);
  const today = new Date().toISOString().slice(0, 10);

  for (const country of countries) {
    const cc = country.toLowerCase();
    console.log(`=== ${cc} ===`);
    await ensureTable(client, cc);

    const headlines = await fetchTopHeadlines(cc);
    const chosen = randomTen(headlines);
    for (const article of chosen) {
      try {
        await upsertNews(client, cc, article);
      } catch (error) {
        console.error(cc, 'news err', error.message);
      }
    }

    const jobs = await fetchJobs(cc);
    const stats = statsFromJobs(jobs);

    let brief = null;
    if (DO_OAI_BRIEF) {
      try {
        brief = await chatBrief(cc, stats);
      } catch (error) {
        console.error(cc, 'brief err', error.message);
      }
    }

    await client.query(
      `INSERT INTO job_analytics_daily (day, country, top_companies, top_titles, salary_stats, brief)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (day, country) DO UPDATE SET
         top_companies=EXCLUDED.top_companies,
         top_titles=EXCLUDED.top_titles,
         salary_stats=EXCLUDED.salary_stats,
         brief=EXCLUDED.brief`,
      [
        today,
        cc,
        JSON.stringify(stats.top_companies),
        JSON.stringify(stats.top_titles),
        JSON.stringify(stats.salary_stats),
        brief
      ]
    );

    console.log('OK', cc);
  }

  await client.end();
  console.log('✅ daily ingest complete');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
