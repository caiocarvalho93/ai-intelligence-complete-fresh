# CAI 🥷 Country News + Job Analytics Pipeline

## Goals
- Per-country tech news (10/day) with embeddings for RAG.
- Daily job analytics per country (top companies, titles, salary stats).
- Cheap, deterministic, production-safe (no hallucinations).

## Stack
- PostgreSQL (Railway) + pgvector
- Azure OpenAI (embeddings; optional short brief)
- NewsAPI.org (top-headlines)
- Your Job API (country-scoped)
- Vercel (frontend), Azure Container Apps (backend)

## Tables
- `news_country_<cc>`: id, title, source, url, published_at, summary, category, embedding
- `job_analytics_daily`: (day, country) PK, top_companies, top_titles, salary_stats, brief
- `cai_countries`: list of enabled countries
- View: `job_analytics_latest`

## Daily Flow (cron @ 03:00 UTC)
1) For each country in `cai_countries`:
   - Ensure `news_country_<cc>` exists.
   - Fetch NewsAPI top headlines (technology). Random 10. Embed+upsert.
   - Fetch Job API (up to 100). Compute stats locally. (Optional) OAI 1-line brief.
   - Upsert `job_analytics_daily`.
2) Done. Frontend reads:
   - `/country/{cc}/news?category=...`
   - `/country/{cc}/analytics`

## Cost Control
- 1 NewsAPI call per country/day (50 → 50 req/day).
- Embeddings: 10 articles/country/day → 500 embeddings/day, truncated text.
- Optional OAI brief: 1 short chat per country/day (set `DO_OAI_BRIEF=false` to disable).

## KPIs
- `retrieval_precision@5` (offline eval)
- `apply_click_rate` (from UI → Job clicks)
- Improve only features that move these metrics.

## Security
- Read-only DB creds for frontend routes.
- No PII stored in analytics (counts only).
- Strict model use: embeddings + optional tiny brief. No free-form “make up data”.
