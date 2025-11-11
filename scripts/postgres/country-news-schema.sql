-- CAI 🥷 Country News + Job Analytics Schema
-- Run once to prepare per-country news storage and daily job analytics tables.

-- Enable pgvector for embeddings (safe to re-run).
CREATE EXTENSION IF NOT EXISTS vector;

-- Track configured countries and their friendly names.
CREATE TABLE IF NOT EXISTS cai_countries (
  code TEXT PRIMARY KEY,
  name TEXT
);

-- Function to ensure an individual country's news table exists.
CREATE OR REPLACE FUNCTION ensure_country_news_table(cc TEXT) RETURNS VOID AS $$
BEGIN
  EXECUTE format($f$
    CREATE TABLE IF NOT EXISTS news_country_%I (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT,
      url TEXT,
      published_at TIMESTAMPTZ NOT NULL,
      summary TEXT,
      category TEXT,
      embedding VECTOR(1536)
    );$f$, cc);

  EXECUTE format($f$
    CREATE INDEX IF NOT EXISTS news_%I_published
      ON news_country_%I (published_at DESC);$f$, cc, cc);

  EXECUTE format($f$
    CREATE INDEX IF NOT EXISTS news_%I_category
      ON news_country_%I (category);$f$, cc, cc);

  EXECUTE format($f$
    CREATE INDEX IF NOT EXISTS news_%I_embedding
      ON news_country_%I USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);$f$, cc, cc);
END;
$$ LANGUAGE plpgsql;

-- Daily analytics roll-up (one row per country per day).
CREATE TABLE IF NOT EXISTS job_analytics_daily (
  day DATE NOT NULL,
  country TEXT NOT NULL,
  top_companies JSONB,
  top_titles JSONB,
  salary_stats JSONB,
  brief TEXT,
  PRIMARY KEY (day, country)
);

-- Fast view to get the latest analytics per country.
CREATE OR REPLACE VIEW job_analytics_latest AS
SELECT DISTINCT ON (country)
  country,
  day,
  top_companies,
  top_titles,
  salary_stats,
  brief
FROM job_analytics_daily
ORDER BY country, day DESC;
