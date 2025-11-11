import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import TranslatedText from "./TranslatedText";

const DashboardJobSearch = () => {
  const [showJobSearch, setShowJobSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('software engineering');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchJobs = async (query = searchQuery, loc = location, page = 0) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery, location, 0);
  };

  return (
    <>
      {/* Dashboard Job Search Button - Inline */}
      <button
        onClick={async () => {
          setShowJobSearch(!showJobSearch);
          if (!showJobSearch && jobs.length === 0) {
            await fetchJobs();
          }
        }}
        className="btn"
        style={{
          background: "linear-gradient(135deg, #00bcd4, #0097a7, #006064)",
          border: "2px solid #00bcd4",
          color: "#fff",
          fontWeight: "700",
        }}
      >
        💼 <TranslatedText>JOB SEARCH</TranslatedText>
      </button>

      {/* Futuristic See-Through Popup Overlay - Rendered at Body Level */}
      {showJobSearch && createPortal(
        <AnimatePresence>
          <>
            {/* Subtle Backdrop - Only on Right Side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                left: "450px", // Start after the panel
                width: "calc(100vw - 450px)",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(3px)",
                zIndex: 999999,
              }}
              onClick={() => setShowJobSearch(false)}
            />
            
            {/* Left Side Panel - Outside the Box! */}
            <motion.div
              initial={{ opacity: 0, x: -500 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -500 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "450px",
                height: "100vh",
                background: "linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 151, 167, 0.1), rgba(0, 188, 212, 0.15))",
                backdropFilter: "blur(20px)",
                border: "none",
                borderRight: "3px solid rgba(0, 188, 212, 0.8)",
                borderRadius: "0",
                zIndex: 1000000,
                padding: "2rem",
                overflowY: "auto",
                boxShadow: "10px 0 50px rgba(0, 188, 212, 0.4), inset -1px 0 0 rgba(255, 255, 255, 0.1), 0 0 100px rgba(0, 188, 212, 0.3)",
              }}
        >
          {/* Vertical Animated Background Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, transparent, rgba(0, 188, 212, 0.2), transparent)",
              animation: "verticalJobBeam 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

              {/* Slide-Out Close Button */}
              <motion.button
                onClick={() => setShowJobSearch(false)}
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "-25px", // Positioned outside the panel
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(0, 188, 212, 0.3))",
                  border: "2px solid rgba(0, 188, 212, 0.5)",
                  color: "white",
                  borderRadius: "0 50% 50% 0", // Half circle on the right
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 0 25px rgba(0, 188, 212, 0.3)",
                }}
                whileHover={{
                  scale: 1.1,
                  x: 5,
                  boxShadow: "8px 0 35px rgba(0, 188, 212, 0.5)",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(0, 188, 212, 0.4))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>

              {/* Futuristic Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: "2rem", textAlign: "center" }}
              >
                <motion.h2
                  style={{
                    color: "#00bcd4",
                    fontSize: "2.2rem",
                    fontWeight: "bold",
                    textShadow: "0 0 20px rgba(0, 188, 212, 0.8)",
                    marginBottom: "0.5rem",
                    background: "linear-gradient(45deg, #00bcd4, #00e5ff, #00bcd4)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💼 <TranslatedText>QUANTUM JOB PORTAL</TranslatedText>
                </motion.h2>
                <motion.h3
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1.2rem",
                    textShadow: "0 0 10px rgba(0, 188, 212, 0.5)",
                  }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <TranslatedText>POWERED BY ADZUNA • AI-ENHANCED DISCOVERY</TranslatedText>
                </motion.h3>
              </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(0, 188, 212, 0.3)",
              borderRadius: "15px",
              padding: "15px",
              marginBottom: "15px",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job Title or Keywords"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "14px",
                }}
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (Optional)"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <TranslatedText>Searching...</TranslatedText>
              ) : (
                <>🔍 <TranslatedText>Search Jobs</TranslatedText></>
              )}
            </button>
          </motion.form>

          {/* Job Results */}
          <div style={{ maxHeight: "45vh", overflowY: "auto" }}>
            {/* Cache Status Indicator */}
            {jobs.length > 0 && (
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  marginBottom: "10px",
                  padding: "6px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                📊 {jobs.length} jobs • Intelligent Caching System
              </div>
            )}
            
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1rem",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "3px solid #00bcd4",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 10px",
                  }}
                />
                <TranslatedText>Searching thousands of jobs...</TranslatedText>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="card"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(0, 188, 212, 0.3)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "10px",
                    cursor: "pointer",
                    padding: "12px",
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
                    
                    window.open(job.url, "_blank");
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span
                      className="badge"
                      style={{
                        background: "rgba(0, 188, 212, 0.2)",
                        color: "#00bcd4",
                        border: "1px solid rgba(0, 188, 212, 0.3)",
                        fontSize: "0.7rem",
                        padding: "2px 6px",
                      }}
                    >
                      💼 #{index + 1}
                    </span>
                    <div
                      style={{ 
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.7rem"
                      }}
                    >
                      {job.source}
                    </div>
                  </div>

                  <h4
                    style={{
                      color: "white",
                      marginBottom: "6px",
                      fontSize: "0.9rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {job.title}
                  </h4>

                  <div
                    style={{
                      color: "#00bcd4",
                      fontWeight: "600",
                      marginBottom: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    🏢 {job.company}
                  </div>

                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    📍 {job.location}
                  </div>

                  {job.salary && job.salary !== "Not specified" && (
                    <div
                      style={{
                        color: "#4caf50",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                      }}
                    >
                      💰 {job.salary}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1rem",
                  padding: "20px",
                }}
              >
                <TranslatedText>No jobs found. Try different keywords.</TranslatedText>
              </div>
            )}
          </div>

          {/* Pagination */}
          {jobs.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              {currentPage > 0 && (
                <button
                  onClick={() => fetchJobs(searchQuery, location, currentPage - 1)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 188, 212, 0.3)",
                    background: "rgba(0, 188, 212, 0.1)",
                    color: "#00bcd4",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  <TranslatedText>Previous</TranslatedText>
                </button>
              )}
              <button
                onClick={() => fetchJobs(searchQuery, location, currentPage + 1)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0, 188, 212, 0.3)",
                  background: "rgba(0, 188, 212, 0.1)",
                  color: "#00bcd4",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                <TranslatedText>Next</TranslatedText>
              </button>
            </div>
          )}
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes verticalJobBeam {
          0% {
            background-position: 0 -200%;
          }
          100% {
            background-position: 0 200%;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes aquaGlow {
          0% {
            box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 188, 212, 0.6);
          }
          100% {
            box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
          }
        }
      `}</style>
    </>
  );
};

export default DashboardJobSearch;