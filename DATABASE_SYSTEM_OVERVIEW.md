# 🗄️ **DATABASE SYSTEM OVERVIEW & CONNECTIONS**

## **📊 CURRENT SYSTEM STATUS**
- **Total Articles**: 255
- **Backend**: http://localhost:3000 ✅
- **Frontend**: http://localhost:5173 ✅
- **Database**: PostgreSQL (Railway) ✅

## **🔗 KEY DATABASE TABLES & CONNECTIONS**

### **1. CORE NEWS SYSTEM**
```
articles (MAIN TABLE)
├── id (PRIMARY KEY)
├── title, description, url
├── country (FK to country tables)
├── publishedAt, source
├── relScore, anaScore
└── provenance (tracking source)

CONNECTIONS:
→ country_news_* tables (255 articles distributed)
→ news_cache (caching layer)
→ user_ratings (user feedback)
```

### **2. TRANSLATION SYSTEM**
```
translations (CACHING)
├── original_text
├── translated_text  
├── source_language
├── target_language
├── confidence_score
└── timestamp

CONNECTIONS:
→ LanguageContext (frontend)
→ TranslatedText components
→ UniversalLanguageButton
→ /api/translate endpoints
```

### **3. COUNTRY-SPECIFIC TABLES**
```
korea_news, japan_news, china_news, etc.
├── Materialized views from main articles
├── Country-specific filtering
├── Real-time updates
└── Performance indexes

CONNECTIONS:
→ /api/country-news/:country
→ Country pages
→ AI Leaderboard rankings
```

### **4. JOB SEARCH SYSTEM**
```
job_searches (ADZUNA INTEGRATION)
├── search_terms, location
├── cached_results
├── user_interactions
└── api_usage_tracking

CONNECTIONS:
→ /api/jobs/search
→ Adzuna API (external)
→ Job analytics dashboard
```

### **5. AI ANALYTICS & LEARNING**
```
user_interactions
├── user_id, session_id
├── interaction_type
├── target_content
├── feedback_data
└── learning_metrics

grok_learning_sessions
├── session_data
├── ai_insights
├── performance_metrics
└── optimization_results

CONNECTIONS:
→ AI Optimization Dashboard
→ Grok Learning System
→ User behavior analytics
```

## **🌐 API ENDPOINT CONNECTIONS**

### **TRANSLATION ENDPOINTS**
- `/api/languages` → Returns 35+ supported languages
- `/api/translate` → Single text translation
- `/api/translate/batch` → Multiple text translation
- `/api/public-translation/*` → Public API for developers

### **NEWS ENDPOINTS**  
- `/api/global-news` → All 255 articles
- `/api/country-news/:country` → Country-specific articles
- `/api/startup-news` → AI startup news
- `/api/china-news` → China-specific filtering

### **JOB ENDPOINTS**
- `/api/jobs/search` → Adzuna job search
- `/api/jobs/analytics` → Job search analytics
- `/api/jobs/track-click` → User interaction tracking

### **AI SYSTEM ENDPOINTS**
- `/api/ai-optimization/*` → AI enhancement features
- `/api/ai-advanced/*` → Advanced AI capabilities  
- `/api/grok-learning/*` → Grok AI learning system
- `/api/crypto-treasury/*` → Crypto analysis system

## **🔑 CRITICAL KEYS & RELATIONSHIPS**

### **PRIMARY KEYS**
- `articles.id` → Main content identifier
- `user_interactions.id` → User behavior tracking
- `translations.id` → Translation cache entries
- `job_searches.id` → Job search sessions

### **FOREIGN KEY RELATIONSHIPS**
```
articles.country → country_news_tables
user_interactions.target_id → articles.id
translations.user_id → user_sessions
job_searches.user_id → user_interactions
```

### **INDEXES FOR PERFORMANCE**
- `articles(country, publishedAt)` → Country news queries
- `articles(relScore, anaScore)` → Ranking algorithms
- `translations(original_text, target_language)` → Translation cache
- `user_interactions(user_id, timestamp)` → Analytics queries

## **📈 DATA FLOW DIAGRAM**
```
USER REQUEST
    ↓
FRONTEND (5173)
    ↓ (proxy /api)
BACKEND (3000)
    ↓
DATABASE LAYER
    ├── PostgreSQL (Railway)
    ├── Translation Cache
    ├── Country Tables
    └── Analytics Storage
    ↓
EXTERNAL APIS
    ├── Adzuna (Jobs)
    ├── OpenAI (Translation)
    └── NewsAPI (Articles)
```