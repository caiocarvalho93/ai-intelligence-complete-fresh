import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GAME_COUNTRIES,
  getRegions,
  getCountryByRegion,
} from "../config/gameCountries";

// ---- API CLIENT HELPERS ----
const API_BASE =
  import.meta.env.VITE_API_URL?.trim() ||
  (typeof window !== "undefined" &&
  window.location.hostname.includes("vercel.app")
    ? "https://website-project-ai-production.up.railway.app"
    : "http://localhost:3000"); // LOCAL BACKEND

// Robust retry so Railway wake-ups don't blank the UI
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 1500) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: options.method || "GET",
        headers: { Accept: "application/json", ...(options.headers || {}) },
        mode: "cors",
        cache: "no-cache",
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        console.warn(`🔄 Retry ${attempt}/${retries}: ${err.message}`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr || new Error("Network error");
}

// Use the comprehensive game countries configuration

export default function AIFansRace() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitUrl, setSubmitUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [urlValidation, setUrlValidation] = useState({ isValid: false, message: "" });

  // 🛡️ AI Content Filter - Only allow AI/Tech/Startup articles
  const validateAIContent = async (url) => {
    try {
      // Extract domain and path for basic validation
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname.toLowerCase();
      
      // Check for Official Tech Company domains (Premium Sources)
      const techCompanyDomains = [
        // AI Leaders
        'openai.com', 'deepmind.com', 'anthropic.com', 'cohere.ai',
        // Big Tech
        'apple.com', 'microsoft.com', 'google.com', 'meta.com', 'amazon.com',
        'nvidia.com', 'intel.com', 'amd.com', 'qualcomm.com',
        // Chinese Tech Giants
        'alibaba.com', 'tencent.com', 'baidu.com', 'bytedance.com', 'huawei.com',
        // Other Major Tech
        'tesla.com', 'spacex.com', 'ibm.com', 'oracle.com', 'salesforce.com',
        'adobe.com', 'netflix.com', 'uber.com', 'airbnb.com', 'spotify.com',
        // Research Institutions
        'mit.edu', 'stanford.edu', 'berkeley.edu', 'cmu.edu', 'ieee.org',
        // Startups & Unicorns
        'stripe.com', 'figma.com', 'notion.so', 'discord.com', 'zoom.us',
        'slack.com', 'dropbox.com', 'github.com', 'gitlab.com'
      ];
      
      const isTechCompanyDomain = techCompanyDomains.some(domain => urlObj.hostname.includes(domain));
      
      // Check for AI/Tech keywords in URL
      const aiKeywords = [
        'ai', 'artificial-intelligence', 'machine-learning', 'deep-learning',
        'neural-network', 'chatgpt', 'openai', 'tech', 'technology',
        'startup', 'innovation', 'robotics', 'automation', 'blockchain',
        'quantum', 'computing', 'software', 'algorithm', 'data-science'
      ];
      
      const hasAIKeywords = aiKeywords.some(keyword => 
        path.includes(keyword) || urlObj.search.includes(keyword)
      );
      
      if (isTechCompanyDomain) {
        return { isValid: true, message: "🏆 PREMIUM SOURCE! Official tech company content!" };
      } else if (hasAIKeywords) {
        return { isValid: true, message: "✅ Valid AI/Tech article!" };
      } else {
        return { 
          isValid: false, 
          message: "❌ Only official tech companies allowed! Try Apple, Google, Tesla, NVIDIA, Meta, etc." 
        };
      }
    } catch (error) {
      return { isValid: false, message: "❌ Invalid URL format" };
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log(
        "🔍 FETCHING LEADERBOARD FROM:",
        `${API_BASE}/api/fans-race/leaderboard`
      );
      const response = await fetchWithRetry(
        `${API_BASE}/api/fans-race/leaderboard`
      );

      // Create full leaderboard with all countries
      const dbLeaderboard = response.leaderboard || [];
      const topCountries = [
        "US",
        "DE",
        "ES",
        "GB",
        "FR",
        "JP",
        "KR",
        "IN",
        "CA",
        "BR",
        "CN",
      ];

      // REAL DATA ONLY - Include all countries with their actual scores
      const fullLeaderboard = topCountries.map((countryCode) => {
        const existing = dbLeaderboard.find(
          (item) => item.country === countryCode
        );
        return existing || { country: countryCode, score: 0 };
      });

      // Sort by score (China will show ??? rank regardless of actual position)
      fullLeaderboard.sort((a, b) => b.score - a.score);

      console.log("🔍 FORCED LEADERBOARD WITH CHINA:", fullLeaderboard);
      console.log("🇨🇳 CHINA FORCED IN:", fullLeaderboard.find((c) => c.country === "CN"));

      setLeaderboard(fullLeaderboard);
      setTotalSubmissions(response.totalSubmissions);
      setLoading(false);
    } catch (error) {
      console.warn("Fans race leaderboard pending:", error.message);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getScoreColor = (score) => {
    if (score >= 50) return "#ffc107";
    if (score >= 20) return "#28a745";
    if (score >= 10) return "#17a2b8";
    return "#6c757d";
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading AI Fans Race...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex-between"
          style={{ marginBottom: "2rem" }}
        >
          <div>
            <div className="heading">🏁 AI FANS RACE 🏁</div>
            <div className="text-muted">
              Community-driven country competition • Real-time scoring
            </div>
          </div>
          <div className="flex">
            <button onClick={() => navigate("/ai-leaderboard")} className="btn">
              📊 Official Rankings
            </button>
            <button onClick={() => navigate("/")} className="btn">
              ← Command Center
            </button>
          </div>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-3"
          style={{ marginBottom: "2rem" }}
        >
          <div className="card">
            <div className="subheading">Total Submissions</div>
            <div className="badge badge-primary">{totalSubmissions}</div>
          </div>
          <div className="card">
            <div className="subheading">Active Countries</div>
            <div className="badge badge-success">
              {leaderboard.filter((c) => c.score > 0).length}
            </div>
          </div>
          <div className="card">
            <div className="subheading">Leading Country</div>
            <div className="badge badge-ai">
              {leaderboard.length > 0
                ? `${GAME_COUNTRIES[leaderboard[0].country]?.flag} ${
                    GAME_COUNTRIES[leaderboard[0].country]?.name
                  }`
                : "None"}
            </div>
          </div>
        </motion.div>

        {/* Submission Box */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{
            marginBottom: "2rem",
            background:
              "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 235, 59, 0.1))",
            border: "2px solid rgba(255, 193, 7, 0.4)",
            boxShadow: "0 8px 25px rgba(255, 193, 7, 0.2)",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1rem" }}>
            <div>
              <div
                className="subheading"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                🚀 SUBMIT AI ARTICLE & WIN POINTS! 🚀
              </div>
              <div className="text-muted" style={{ marginBottom: '1rem' }}>
                🔥 HACK THE LEADERBOARD! Help your country dominate the AI race! 🔥
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1))',
                border: '1px solid rgba(255, 0, 255, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  🛡️ SECURITY PROTOCOL: AI/TECH CONTENT ONLY
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  🏆 PREMIUM: Apple, Google, Tesla, NVIDIA, Meta, Microsoft, OpenAI<br/>
                  ✅ ACCEPTED: Official tech company announcements, AI research, startups<br/>
                  ❌ BLOCKED: Tech blogs, news sites, non-official sources<br/>
                  🎯 Pro Tip: Use official company domains for maximum points!
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid grid-2"
            style={{ gap: "1rem", marginBottom: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                📰 AI Article URL
              </label>
              <input
                type="url"
                placeholder="https://techcrunch.com/ai-breakthrough..."
                value={submitUrl}
                onChange={async (e) => {
                  const url = e.target.value;
                  setSubmitUrl(url);
                  
                  if (url.length > 10) {
                    const validation = await validateAIContent(url);
                    setUrlValidation(validation);
                  } else {
                    setUrlValidation({ isValid: false, message: "" });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: `2px solid ${urlValidation.isValid ? '#00ff00' : urlValidation.message ? '#ff0000' : 'var(--border)'}`,
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                }}
              />
              {urlValidation.message && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.8rem',
                  color: urlValidation.isValid ? '#00ff00' : '#ff0000',
                  fontWeight: 'bold'
                }}>
                  {urlValidation.message}
                </div>
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                🏆 Choose Your Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                }}
              >
                {getRegions().map((region) => (
                  <optgroup key={region} label={`🌍 ${region}`}>
                    {Object.entries(getCountryByRegion(region)).map(
                      ([code, country]) => (
                        <option key={code} value={code}>
                          {country.flag} {country.name}
                        </option>
                      )
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-between">
            <button
              className="btn btn-primary"
              style={{
                fontSize: "1rem",
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #ffc107, #ff9800)",
                border: "none",
                fontWeight: "700",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                boxShadow: "0 6px 20px rgba(255, 193, 7, 0.4)",
              }}
              onClick={async () => {
                try {
                  const response = await fetchWithRetry(
                    `${API_BASE}/api/fans-race/submit`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: {
                        url: submitUrl,
                        country: selectedCountry,
                        userId: "user-" + Date.now(),
                      },
                    }
                  );

                  // Epic success message
                  const epicMessages = [
                    `🎆 LEGENDARY! +${response.pointsAwarded} points for ${GAME_COUNTRIES[selectedCountry]?.name}! 🎆`,
                    `⚡ POWER SURGE! ${GAME_COUNTRIES[selectedCountry]?.name} gains +${response.pointsAwarded} points! ⚡`,
                    `🚀 ROCKET BOOST! +${response.pointsAwarded} points to ${GAME_COUNTRIES[selectedCountry]?.name}! 🚀`,
                    `🔥 UNSTOPPABLE! ${GAME_COUNTRIES[selectedCountry]?.name} scores +${response.pointsAwarded} points! 🔥`,
                  ];

                  const randomMessage =
                    epicMessages[
                      Math.floor(Math.random() * epicMessages.length)
                    ];
                  alert(
                    randomMessage +
                      `\n\n🏆 ${GAME_COUNTRIES[selectedCountry]?.name} Total: ${response.newScore} points`
                  );
                  setSubmitUrl("");
                  fetchLeaderboard(); // Refresh leaderboard
                } catch (error) {
                  alert(
                    "🚫 " +
                      (error.response?.data?.error ||
                        "Submission failed. Try again!")
                  );
                }
              }}
              disabled={!submitUrl || !urlValidation.isValid}
            >
              🏆 SUBMIT & DOMINATE! 🏆
            </button>

            {/* Scoring Guide */}
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(0,0,0,0.1)",
                borderRadius: "8px",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                🎮 POINT SYSTEM:
              </div>
              <div>🥉 AI/Tech keywords: +1 pt</div>
              <div>🥈 Startup domains: +2 pts</div>
              <div>🥇 Official tech companies: +5 pts</div>
              <div>🏆 FAANG/Big Tech: +10 pts</div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={itemVariants}>
          <div className="subheading" style={{ marginBottom: "1.5rem" }}>
            🏆 LIVE LEADERBOARD 🏆
          </div>

          {leaderboard.length === 0 ? (
            <div className="card">
              <div className="text-center text-muted">
                No submissions yet! Be the first to get your country on the
                board! 🚀
              </div>
            </div>
          ) : (
            <div className="grid" style={{ gap: "1rem" }}>
              {leaderboard.map((country, index) => (
                <motion.div
                  key={country.country}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                  style={{
                    background:
                      country.country === "CN"
                        ? "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 223, 0, 0.1), rgba(255, 215, 0, 0.05))"
                        : index < 3
                        ? `linear-gradient(135deg, ${getScoreColor(
                            country.score
                          )}15, ${getScoreColor(country.score)}05)`
                        : undefined,
                    border:
                      country.country === "CN"
                        ? "2px solid rgba(255, 215, 0, 0.6)"
                        : index < 3
                        ? `2px solid ${getScoreColor(country.score)}40`
                        : undefined,
                    boxShadow:
                      country.country === "CN"
                        ? "0 8px 25px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)"
                        : undefined,
                  }}
                >
                  <div className="flex-between">
                    <div className="flex">
                      <div style={{ fontSize: "2rem", marginRight: "1rem" }}>
                        {getRankEmoji(index + 1)}
                      </div>
                      <div>
                        <div
                          className="flex"
                          style={{
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span style={{ fontSize: "1.5rem" }}>
                            {GAME_COUNTRIES[country.country]?.flag}
                          </span>
                          <div
                            className="subheading"
                            style={
                              country.country === "CN"
                                ? {
                                    color: "#FFD700",
                                    fontWeight: "700",
                                    textShadow:
                                      "0 0 10px rgba(255, 215, 0, 0.8)",
                                  }
                                : {}
                            }
                          >
                            {GAME_COUNTRIES[country.country]?.name}
                          </div>
                        </div>
                        <div
                          className="text-muted"
                          style={
                            country.country === "CN"
                              ? {
                                  color: "#FFD700",
                                  fontWeight: "700",
                                  textShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
                                }
                              : {}
                          }
                        >
                          {country.country === "CN"
                            ? "Rank #???"
                            : `Rank #${index + 1}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className="badge badge-ai"
                        style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}
                      >
                        {country.score} pts
                      </div>
                      {index < 3 && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            marginTop: "0.25rem",
                            color: getScoreColor(country.score),
                          }}
                        >
                          {index === 0
                            ? "🔥 LEADING!"
                            : index === 1
                            ? "💪 STRONG!"
                            : "⚡ RISING!"}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* FANS AI ARTICLES Section */}
        <motion.div variants={itemVariants} style={{ marginTop: "3rem" }}>
          <div 
            className="subheading" 
            style={{ 
              marginBottom: "1.5rem",
              background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            🔥 FANS AI ARTICLES 🔥
          </div>
          
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(255, 105, 180, 0.05))',
            border: '2px solid rgba(255, 20, 147, 0.3)',
            padding: '2rem'
          }}>
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                COMMUNITY AI ARTICLES COMING SOON!
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                This section will showcase the latest AI articles submitted by our community,<br/>
                filtered to show only the highest quality AI, Tech, and Startup content.<br/>
                <br/>
                🛡️ <strong>100% AI/Tech Content Guaranteed</strong><br/>
                🎯 <strong>Community Curated</strong><br/>
                🏆 <strong>Country Competition Ready</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap"
          style={{ marginTop: "2rem" }}
        >
          {/* 🔒 DEVELOPER ONLY: Refresh Leaderboard (hidden from users)
          <button onClick={fetchLeaderboard} className="btn btn-primary">
            🔄 Refresh Leaderboard
          </button>
          */}
          <button onClick={() => navigate("/ai-leaderboard")} className="btn">
            📊 Official AI Rankings
          </button>
          <button onClick={() => navigate("/news")} className="btn">
            📰 Global News Feed
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
