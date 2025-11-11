import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TranslatedText from "./TranslatedText";
import TranslatedArticleTitle from "./TranslatedArticleTitle";
import MillionDollarArticleButton from "./MillionDollarArticleButton";

import "./NewsFeed.css";

// ---- API CLIENT HELPERS ----
const API_BASE =
  import.meta.env.VITE_API_URL?.trim() ||
  (typeof window !== "undefined" &&
  window.location.hostname.includes("vercel.app")
    ? "https://website-project-ai-production.up.railway.app"
    : "http://localhost:3000"); // LOCAL BACKEND

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showStartupNews, setShowStartupNews] = useState(false);
  const [startupArticles, setStartupArticles] = useState([]);
  const [showFansAIArticles, setShowFansAIArticles] = useState(false);
  const [fansAIArticles, setFansAIArticles] = useState([]);
  const [showJobSearch, setShowJobSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('software engineering');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Job search functionality
  const fetchJobs = async (query = searchQuery, loc = location, page = 0) => {
    setJobLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        l: loc,
        page: page.toString()
      });

      const response = await fetch(`http://localhost:3000/api/jobs/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setCurrentPage(page);
        
        if (data.cached) {
          console.log(`📦 Loaded ${data.jobs.length} cached jobs (${data.cache_age || 'recent'} cache)`);
        } else {
          console.log(`🔍 Loaded ${data.jobs.length} fresh jobs from Adzuna`);
        }
        
        if (data.apiUsage) {
          console.log(`📊 API Usage: ${data.apiUsage.daily}/${data.apiUsage.budget} (${data.apiUsage.percentage}%)`);
        }
      } else {
        console.error('Job search failed:', data.error);
        setJobs([]);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setJobLoading(false);
    }
  };

  const handleJobSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery, location, 0);
  };

  // FIXED: Safe API base URL
  const getApiBase = () => {
    // Always use Railway backend in production
    if (
      import.meta.env.PROD ||
      window.location.hostname.includes("vercel.app")
    ) {
      return "https://website-project-ai-production.up.railway.app";
    }
    return window.location.origin;
  };

  const filterArticles = (filterType) => {
    setFilter(filterType);
    if (filterType === "ai") {
      const aiArticles = allArticles.filter(
        (a) =>
          a?.category === "ai" ||
          a?.title?.toLowerCase().includes("ai") ||
          a?.title?.toLowerCase().includes("artificial intelligence")
      );
      setArticles(aiArticles);
    } else {
      setArticles(allArticles);
    }
  };

  useEffect(() => {
    // EINSTEIN-LEVEL: Health check on mount
    const initializeConnection = async () => {
      try {
        const healthCheck = await fetchWithRetry(`${API_BASE}/health`, 1, 500);
        console.log("✅ Initial backend health:", healthCheck);

        // Log when backend resumes after idle sleep
        if (healthCheck.uptime < 60) {
          console.log(
            "🔄 Backend recently restarted (Railway wake-up detected)"
          );
        }
      } catch (healthErr) {
        console.warn("⚠️ Initial health check failed:", healthErr.message);
      }

      // Fetch news after health check
      fetchNews();
    };

    initializeConnection();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // EINSTEIN-LEVEL: Resilient fetch with exponential backoff
  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: HTTP ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);

      if (
        retries > 0 &&
        (err.name === "AbortError" ||
          err.message.includes("HTTP 5") ||
          err.message.includes("fetch"))
      ) {
        const attempt = 4 - retries;
        console.warn(`🔄 Retry ${attempt}/3: ${err.message}`);
        console.log(`⏳ Exponential backoff: ${delay}ms (Railway wake-up)`);

        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(url, retries - 1, delay * 2); // Exponential backoff
      }
      throw err;
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 FETCHING FROM:", `${API_BASE}/api/global-news`);
      const data = await fetchWithRetry(`${API_BASE}/api/global-news`);
      console.log("📊 RECEIVED DATA:", data);

      // DEBUG: Check article categories
      if (data.countries) {
        Object.values(data.countries).forEach((countryArticles) => {
          if (Array.isArray(countryArticles)) {
            countryArticles.slice(0, 3).forEach((article) => {
              console.log("🔍 ARTICLE DEBUG:", {
                title: article.title?.substring(0, 50),
                category: article.category,
                hasAIInTitle: article.title?.toLowerCase().includes("ai"),
                hasAIInDesc: article.description?.toLowerCase().includes("ai"),
              });
            });
          }
        });
      }

      // Extract articles safely from both buckets
      let extracted = [];
      if (data?.countries && typeof data.countries === "object") {
        for (const list of Object.values(data.countries)) {
          if (Array.isArray(list)) extracted.push(...list);
        }
      }
      if (Array.isArray(data?.global)) extracted.push(...data.global);

      // DEDUPLICATE: Remove duplicate articles by title
      const uniqueArticles = [];
      const seenTitles = new Set();

      extracted.forEach((article) => {
        if (article && article.title && !seenTitles.has(article.title)) {
          seenTitles.add(article.title);
          uniqueArticles.push(article);
        }
      });

      console.log(
        `🔄 DEDUPLICATION: ${extracted.length} → ${uniqueArticles.length} articles`
      );

      // Sort & render
      const sorted = uniqueArticles
        .filter((a) => a && a.title)
        .sort((a, b) => {
          const A = new Date(a.publishedAt || a.published_at || 0).getTime();
          const B = new Date(b.publishedAt || b.published_at || 0).getTime();
          return B - A;
        });

      setAllArticles(sorted);
      setArticles(sorted);
      setLastUpdate(data?.lastUpdate || new Date().toISOString());
    } catch (err) {
      setError(err.message || "Failed to load news");
      // do NOT clear lists – keep last good render
      // setAllArticles([]); setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Simplified process function without axios
  const processNewArticles = async () => {
    try {
      setLoading(true);
      console.log("🚀 Processing new articles...");

      const forceRefreshUrl = `${API_BASE}/api/cache/force-refresh`;
      const response = await fetch(forceRefreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        console.log("✅ Cache refresh successful");
        // Wait for cache to update
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await fetchNews();
      } else {
        throw new Error(result.error || "Refresh failed");
      }
    } catch (error) {
      console.error("❌ Cache refresh failed:", error);
      setError(`Refresh failed: ${error.message}`);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getRelevanceBadge = (score) => {
    if (!score) return "badge-info";
    if (score >= 85) return "badge-success";
    if (score >= 75) return "badge-warning";
    return "badge-info";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      ai: "🤖",
      technology: "💻",
      business: "💼",
      economy: "📈",
    };
    return icons[category] || "📰";
  };

  // FIXED: Title-focused AI filtering
  const aiArticlesCount = allArticles.filter(
    (a) =>
      a?.category === "ai" ||
      a?.title?.toLowerCase().includes("ai") ||
      a?.title?.toLowerCase().includes("artificial intelligence")
  ).length;

  const avgRelevance =
    articles.length > 0
      ? Math.round(
          articles.reduce(
            (sum, a) => sum + (a.relScore || a.rel_score || 0),
            0
          ) / articles.length
        )
      : 0;

  if (loading && articles.length === 0) {
    return (
      <div className="container">
        <div className="loading">
          <TranslatedText>Loading live intelligence feed...</TranslatedText>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: "3rem" }}
        >
          {/* Title Section */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div 
              className="heading"
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #00bcd4, #ff1493, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 20px rgba(0, 188, 212, 0.5)",
                marginBottom: "1rem"
              }}
            >
              📰 <TranslatedText>Live AI • Tech • Finance News</TranslatedText>
            </div>
            <div 
              className="text-muted"
              style={{
                fontSize: "1.4rem",
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
              }}
            >
              <TranslatedText>
                Real-time global intelligence feed
              </TranslatedText>{" "}
              • <TranslatedText>Last update</TranslatedText>:{" "}
              {lastUpdate ? (
                new Date(lastUpdate).toLocaleTimeString()
              ) : (
                <TranslatedText>Unknown</TranslatedText>
              )}
            </div>
            {error && (
              <div style={{ color: "#ff6b6b", marginTop: "0.5rem" }}>
                ⚠️ <TranslatedText>{error}</TranslatedText>
              </div>
            )}
          </div>

          {/* AI-Inspired Futuristic Carousel */}
          <div 
            style={{
              position: "relative",
              width: "100%",
              height: "120px",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(255, 20, 147, 0.1), rgba(255, 215, 0, 0.1))",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0 0 40px rgba(0, 188, 212, 0.3)",
            }}
          >
            {/* Animated Background Pattern */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "200%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.2), transparent, rgba(255, 20, 147, 0.2), transparent)",
                animation: "carouselFlow 8s linear infinite",
                pointerEvents: "none",
              }}
            />

            {/* Button Rows */}
            <div style={{ 
              position: "relative", 
              zIndex: 2, 
              height: "100%", 
              display: "flex", 
              justifyContent: "center",
              padding: "1rem 2rem"
            }}>
              {/* Professional Horizontal Button Layout */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                gap: "1.5rem",
                flexWrap: "wrap"
              }}>
                {/* SUBMIT AI ARTICLE Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/ai-fans-race'}
                  className="btn"
                  style={{
                    background: 'rgba(255, 215, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    color: '#FFD700',
                    fontWeight: '800',
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px',
                    height: '50px',
                    borderRadius: '25px',
                    fontSize: '0.9rem'
                  }}
                >
                  🚀 <TranslatedText>SUBMIT AI ARTICLE</TranslatedText> 🏁
                </motion.button>

                {/* AI NEWS Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setShowStartupNews(!showStartupNews);
                    
                    if (!showStartupNews && startupArticles.length === 0) {
                      try {
                        const response = await fetchWithRetry(
                          `${getApiBase()}/api/startup-news`
                        );
                        setStartupArticles(response.articles || []);
                      } catch (error) {
                        console.error("Failed to fetch startup news:", error);
                      }
                    }
                  }}
                  className="btn"
                  disabled={loading}
                  style={{
                    background: 'rgba(255, 20, 147, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 20, 147, 0.4)',
                    color: '#ff1493',
                    fontWeight: '800',
                    textShadow: '0 0 15px rgba(255, 20, 147, 0.8)',
                    boxShadow: '0 0 25px rgba(255, 20, 147, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                    height: '50px',
                    borderRadius: '25px',
                    fontSize: '0.9rem'
                  }}
                >
                  🚀 <TranslatedText>AI NEWS</TranslatedText>
                </motion.button>

                {/* FANS AI Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setShowFansAIArticles(!showFansAIArticles);
                    
                    if (!showFansAIArticles && fansAIArticles.length === 0) {
                      try {
                        const response = await fetchWithRetry(
                          `${getApiBase()}/api/fans-ai-articles`
                        );
                        setFansAIArticles(response.articles || []);
                      } catch (error) {
                        console.error("Failed to fetch fans AI articles:", error);
                      }
                    }
                  }}
                  className="btn"
                  disabled={loading}
                  style={{
                    background: 'rgba(0, 255, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(0, 255, 0, 0.4)',
                    color: '#00ff00',
                    fontWeight: '800',
                    textShadow: '0 0 15px rgba(0, 255, 0, 0.8)',
                    boxShadow: '0 0 25px rgba(0, 255, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '130px',
                    height: '50px',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}
                >
                  🔥 <TranslatedText>FANS AI</TranslatedText>
                </motion.button>

                {/* JOB SEARCH Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setShowJobSearch(!showJobSearch);
                    
                    if (!showJobSearch && jobs.length === 0) {
                      await fetchJobs();
                    }
                  }}
                  className="btn"
                  disabled={loading}
                  style={{
                    background: 'rgba(0, 188, 212, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(0, 188, 212, 0.4)',
                    color: '#00bcd4',
                    fontWeight: '800',
                    textShadow: '0 0 15px rgba(0, 188, 212, 0.8)',
                    boxShadow: '0 0 25px rgba(0, 188, 212, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                    height: '50px',
                    borderRadius: '25px',
                    fontSize: '0.9rem'
                  }}
                >
                  💼 <TranslatedText>JOB SEARCH</TranslatedText>
                </motion.button>

                {/* Command Center Button */}
                <motion.button 
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")} 
                  className="btn" 
                  style={{ 
                    background: 'rgba(220, 53, 69, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(220, 53, 69, 0.4)',
                    color: '#dc3545',
                    fontWeight: '800',
                    textShadow: '0 0 15px rgba(220, 53, 69, 0.8)',
                    boxShadow: '0 0 25px rgba(220, 53, 69, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '160px',
                    height: '50px',
                    borderRadius: '25px',
                    fontSize: '0.9rem'
                  }}
                >
                  ← <TranslatedText>Command Center</TranslatedText>
                </motion.button>
              </div>
            </div>

            {/* Floating Particles Effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `
                  radial-gradient(circle at 20% 30%, rgba(0, 188, 212, 0.3) 2px, transparent 2px),
                  radial-gradient(circle at 80% 70%, rgba(255, 20, 147, 0.3) 2px, transparent 2px),
                  radial-gradient(circle at 60% 20%, rgba(255, 215, 0, 0.3) 2px, transparent 2px)
                `,
                backgroundSize: "100px 100px, 150px 150px, 120px 120px",
                animation: "particleFloat 12s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={itemVariants}
          className="grid grid-3"
          style={{ marginBottom: "2rem" }}
        >
          <div
            className={`card ${filter === "all" ? "card-active" : ""}`}
            onClick={() => filterArticles("all")}
            style={{ cursor: "pointer" }}
          >
            <div className="subheading">
              <TranslatedText>Total Articles</TranslatedText>
            </div>
            <div className="badge badge-primary">{allArticles.length}</div>
          </div>
          <div
            className={`card ai-coverage-card ${
              filter === "ai" ? "card-active" : ""
            }`}
            onClick={() => filterArticles("ai")}
            style={{ cursor: "pointer" }}
          >
            <div className="subheading">
              <TranslatedText>AI Articles</TranslatedText>
            </div>
            <div className="badge badge-ai">{aiArticlesCount}</div>
          </div>
          <div className="card">
            <div className="subheading">
              <TranslatedText>Avg Relevance</TranslatedText>
            </div>
            <div className="badge badge-info">{avgRelevance}/100</div>
          </div>
        </motion.div>

        {/* Debug Info */}
        {false && (
          <motion.div
            variants={itemVariants}
            className="card"
            style={{
              background: "#1a1a2e",
              border: "1px solid #ff6b6b",
              marginBottom: "1rem",
            }}
          >
            <div style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
              🔍 DEBUG: articles={articles.length} | allArticles=
              {allArticles.length} | loading={loading.toString()}
              <br />
              🌍 API: {API_BASE}
              <br />
              <button
                onClick={() => {
                  console.log("🧪 Manual API Test");
                  fetch(API_BASE + "/api/global-news")
                    .then((res) => res.json())
                    .then((data) => console.log("✅ Manual test result:", data))
                    .catch((err) =>
                      console.error("❌ Manual test failed:", err)
                    );
                }}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.8rem",
                }}
              >
                🧪 <TranslatedText>Test API in Console</TranslatedText>
              </button>
            </div>
          </motion.div>
        )}

        {/* Articles Feed */}
        {articles.length === 0 ? (
          <motion.div variants={itemVariants} className="card">
            <div className="text-center text-muted">
              {loading ? (
                <TranslatedText>Loading articles...</TranslatedText>
              ) : (
                <TranslatedText>No articles available</TranslatedText>
              )}
              {error && (
                <div style={{ marginTop: "1rem", color: "#ff6b6b" }}>
                  <TranslatedText>Error</TranslatedText>: {error}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid"
            style={{ gap: "1.5rem" }}
          >
            {articles.map((article, index) => (
              <motion.div
                key={article.id || `article-${index}`}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="card article-card"
              >
                <div className="flex-between" style={{ marginBottom: "1rem" }}>
                  <div className="flex">
                    <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
                      {getCategoryIcon(article.category)}
                    </span>
                    <div>
                      <div
                        className="subheading"
                        style={{ marginBottom: "0.25rem" }}
                      >
                        <TranslatedArticleTitle
                          title={article.title || "Untitled Article"}
                        />
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {article.source}{" "}
                        {article.author && `• ${article.author}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {(article.relScore || article.rel_score) && (
                      <span
                        className={`badge ${getRelevanceBadge(
                          article.relScore || article.rel_score
                        )}`}
                      >
                        REL {article.relScore || article.rel_score}
                      </span>
                    )}
                    <span className="badge badge-info">
                      <TranslatedText>{(article.category || "news").toUpperCase()}</TranslatedText>
                    </span>
                  </div>
                </div>

                {article.description && (
                  <p
                    className="text-secondary"
                    style={{ marginBottom: "1rem", lineHeight: "1.5" }}
                  >
                    <TranslatedText>
                      {article.description.length > 200
                        ? `${article.description.substring(0, 200)}...`
                        : article.description}
                    </TranslatedText>
                  </p>
                )}

                <div className="article-meta">
                  <span>🌍 <TranslatedText>{article.country || "Global"}</TranslatedText></span>
                  <span>
                    ⏰{" "}
                    {article.publishedAt || article.published_at
                      ? new Date(
                          article.publishedAt || article.published_at
                        ).toLocaleTimeString()
                      : <TranslatedText>Recent</TranslatedText>}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-1"
                  style={{ marginTop: "1rem" }}
                >
                  {article.url && (
                    <MillionDollarArticleButton article={article} />
                  )}
                  <button
                    onClick={() =>
                      navigate(`/country/${article.country || "global"}`)
                    }
                    className="btn"
                  >
                    📊 <TranslatedText>Analysis</TranslatedText>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Refresh Button */}
        {articles.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center"
            style={{ marginTop: "2rem" }}
          >
            <button onClick={fetchNews} className="btn btn-primary">
              🔄 <TranslatedText>Refresh Feed</TranslatedText>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* STARTUP NEWS - PINK BEAM ANIMATION */}
      {showStartupNews && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            background:
              "linear-gradient(135deg, rgba(255, 20, 147, 0.15), rgba(255, 105, 180, 0.1))",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            padding: "2rem",
            overflowY: "auto",
            boxShadow: "-10px 0 30px rgba(255, 20, 147, 0.3)",
          }}
        >
          {/* Pink Beam Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 20, 147, 0.3), transparent)",
              animation: "pinkBeam 2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowStartupNews(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ×
          </button>

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                marginBottom: "0.5rem",
              }}
            >
              <TranslatedText>BOOM! 💥</TranslatedText>
            </h2>
            <h3
              style={{
                color: "white",
                fontSize: "1rem",
                textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
              }}
            >
              <TranslatedText>WEEKLY STARTUP NEWS</TranslatedText>
            </h3>
          </motion.div>

          {/* Startup Articles */}
          {startupArticles.length > 0 ? (
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {startupArticles.map((article, index) => (
                <motion.div
                  key={article.id || index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card article-card"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 20, 147, 0.3)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="flex-between"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(255, 20, 147, 0.2)",
                          color: "#ff1493",
                          border: "1px solid rgba(255, 20, 147, 0.3)",
                        }}
                      >
                        🚀 STARTUP #{index + 1}
                      </span>
                    </div>
                    <div
                      className="text-muted"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {article.source}
                      {article.publishedAt && (
                        <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>
                          • {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <TranslatedArticleTitle
                    title={article.title}
                    className="article-title"
                    style={{
                      color: "white",
                      marginBottom: "1rem",
                      fontSize: "1rem",
                      lineHeight: "1.4",
                    }}
                  />

                  {article.description && (
                    <p
                      className="article-description"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: "1rem",
                        lineHeight: "1.5",
                        fontSize: "0.9rem",
                      }}
                    >
                      <TranslatedText>
                        {article.description.length > 150
                          ? article.description.substring(0, 150) + "..."
                          : article.description}
                      </TranslatedText>
                    </p>
                  )}

                  <div className="flex" style={{ gap: "0.5rem" }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        background: "rgba(255, 20, 147, 0.2)",
                        border: "1px solid rgba(255, 20, 147, 0.3)",
                        color: "#ff1493",
                        fontSize: "0.8rem",
                      }}
                    >
                      🔗 <TranslatedText>Read Article</TranslatedText>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "1rem",
              }}
            >
              <TranslatedText>Loading startup news...</TranslatedText>
            </div>
          )}
        </motion.div>
      )}

      {/* JOB SEARCH - BLUE BEAM ANIMATION (LEFT SIDE - EXACT COPY OF AI NEWS PATTERN) */}
      {showJobSearch && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "400px",
            height: "100vh",
            background:
              "linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 151, 167, 0.1))",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            padding: "2rem",
            overflowY: "auto",
            boxShadow: "10px 0 30px rgba(0, 188, 212, 0.3)",
          }}
        >
          {/* Blue Beam Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.3), transparent)",
              animation: "blueBeam 2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowJobSearch(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ×
          </button>

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                marginBottom: "0.5rem",
              }}
            >
              💼 <TranslatedText>JOB SEARCH</TranslatedText>
            </h2>
            <h3
              style={{
                color: "white",
                fontSize: "1rem",
                textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
              }}
            >
              <TranslatedText>POWERED BY ADZUNA</TranslatedText>
            </h3>
          </motion.div>

          {/* Job Search Form - Compact */}
          <motion.form
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleJobSearch}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(0, 188, 212, 0.3)",
              borderRadius: "15px",
              padding: "15px",
              marginBottom: "15px",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job Title"
                className="job-search-input"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="job-search-input"
              />
            </div>

            <button
              type="submit"
              disabled={jobLoading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: jobLoading ? "not-allowed" : "pointer",
                opacity: jobLoading ? 0.7 : 1,
              }}
            >
              {jobLoading ? (
                <TranslatedText>Searching...</TranslatedText>
              ) : (
                <>🔍 <TranslatedText>Search Jobs</TranslatedText></>
              )}
            </button>
          </motion.form>

          {/* Job Results */}
          {jobs.length > 0 ? (
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card article-card"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(0, 188, 212, 0.3)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="flex-between"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(0, 188, 212, 0.2)",
                          color: "#00bcd4",
                          border: "1px solid rgba(0, 188, 212, 0.3)",
                        }}
                      >
                        💼 JOB #{index + 1}
                      </span>
                    </div>
                    <div
                      className="text-muted"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {job.source}
                    </div>
                  </div>

                  <h4
                    style={{
                      color: "white",
                      marginBottom: "1rem",
                      fontSize: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {job.title}
                  </h4>

                  <div
                    style={{
                      color: "#00bcd4",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    🏢 {job.company}
                  </div>

                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    📍 {job.location}
                  </div>

                  {job.salary && job.salary !== "Not specified" && (
                    <p
                      style={{
                        color: "#4caf50",
                        fontWeight: "600",
                        marginBottom: "1rem",
                        lineHeight: "1.5",
                        fontSize: "0.9rem",
                      }}
                    >
                      💰 {job.salary}
                    </p>
                  )}

                  <div className="flex" style={{ gap: "0.5rem" }}>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        background: "rgba(0, 188, 212, 0.2)",
                        border: "1px solid rgba(0, 188, 212, 0.3)",
                        color: "#00bcd4",
                        fontSize: "0.8rem",
                      }}
                      onClick={async () => {
                        try {
                          await fetch('http://localhost:3000/api/jobs/track-click', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ jobId: job.id })
                          });
                        } catch (error) {
                          console.warn('Failed to track job click:', error);
                        }
                      }}
                    >
                      🔗 <TranslatedText>Apply Now</TranslatedText>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "1rem",
              }}
            >
              {jobLoading ? (
                <TranslatedText>Loading jobs...</TranslatedText>
              ) : (
                <TranslatedText>No jobs found. Try different keywords.</TranslatedText>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* FANS AI ARTICLES - GREEN PANEL (INDEPENDENT) */}
      {showFansAIArticles && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "400px",
            height: "50vh",
            background:
              "linear-gradient(135deg, rgba(0, 255, 0, 0.15), rgba(50, 205, 50, 0.1))",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            padding: "2rem",
            overflowY: "auto",
            boxShadow: "0 -10px 30px rgba(0, 255, 0, 0.3)",
            borderTop: "2px solid rgba(0, 255, 0, 0.3)",
            borderLeft: "2px solid rgba(0, 255, 0, 0.3)",
          }}
        >
          {/* Green Hacker Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(180deg, transparent, rgba(0, 255, 0, 0.2), transparent)",
              animation: "greenHacker 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowFansAIArticles(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(0, 255, 0, 0.2)",
              border: "1px solid rgba(0, 255, 0, 0.3)",
              color: "#00ff00",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            ×
          </button>

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h2
              style={{
                color: "#00ff00",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(0, 255, 0, 0.8)",
                marginBottom: "0.5rem",
                fontFamily: "monospace",
              }}
            >
              <TranslatedText>🔥 FANS AI ARTICLES</TranslatedText>
            </h2>
            <h3
              style={{
                color: "rgba(0, 255, 0, 0.8)",
                fontSize: "1rem",
                textShadow: "0 0 5px rgba(0, 255, 0, 0.5)",
                fontFamily: "monospace",
              }}
            >
              <TranslatedText>COMMUNITY SUBMISSIONS</TranslatedText>
            </h3>
          </motion.div>

          {/* Fans AI Articles */}
          {fansAIArticles.length > 0 ? (
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {fansAIArticles.map((article, index) => (
                <motion.div
                  key={article.id || index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card article-card"
                  style={{
                    background: "rgba(0, 255, 0, 0.05)",
                    border: "1px solid rgba(0, 255, 0, 0.3)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="flex-between"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(0, 255, 0, 0.2)",
                          color: "#00ff00",
                          border: "1px solid rgba(0, 255, 0, 0.3)",
                          fontFamily: "monospace",
                        }}
                      >
                        🚀 ARTICLE #{index + 1}
                      </span>
                    </div>
                    <div
                      className="text-muted"
                      style={{ 
                        color: "rgba(0, 255, 0, 0.7)",
                        fontFamily: "monospace" 
                      }}
                    >
                      {article.author || "Anonymous"}
                      {article.createdAt && (
                        <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>
                          • {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <TranslatedArticleTitle
                    title={article.title}
                    className="article-title"
                    style={{
                      color: "#00ff00",
                      marginBottom: "1rem",
                      fontSize: "1rem",
                      lineHeight: "1.4",
                      fontFamily: "monospace",
                      textShadow: "0 0 5px rgba(0, 255, 0, 0.5)",
                    }}
                  />

                  {article.content && (
                    <p
                      className="article-description"
                      style={{
                        color: "rgba(0, 255, 0, 0.8)",
                        marginBottom: "1rem",
                        lineHeight: "1.5",
                        fontSize: "0.9rem",
                        fontFamily: "monospace",
                      }}
                    >
                      <TranslatedText>
                        {article.content.length > 150
                          ? article.content.substring(0, 150) + "..."
                          : article.content}
                      </TranslatedText>
                    </p>
                  )}

                  <div className="flex" style={{ gap: "0.5rem" }}>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          background: "rgba(0, 255, 0, 0.2)",
                          border: "1px solid rgba(0, 255, 0, 0.3)",
                          color: "#00ff00",
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                        }}
                      >
                        🔗 <TranslatedText>Read More</TranslatedText>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "rgba(0, 255, 0, 0.7)",
                fontSize: "1rem",
                fontFamily: "monospace",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              <TranslatedText>No community articles yet!</TranslatedText>
              <br />
              <TranslatedText>Be the first to submit an AI article in the Fans Race!</TranslatedText>
            </div>
          )}
        </motion.div>
      )}

    </div>


    </>
  );
}
