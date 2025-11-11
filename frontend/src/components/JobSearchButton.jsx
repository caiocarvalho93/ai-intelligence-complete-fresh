import { motion } from "framer-motion";
import { useState } from "react";
import TranslatedText from "./TranslatedText";

// Global state to ensure only one job search panel is open at a time
let globalJobSearchState = {
  isOpen: false,
  activeInstance: null
};

const JobSearchButton = () => {
  const [showJobSearch, setShowJobSearch] = useState(false);
  const instanceId = useState(() => Math.random().toString(36).substr(2, 9))[0];
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
        
        // Show cache status and API usage to user
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
      {/* Job Search Button */}
      <button
        onClick={async () => {
          // Close any other open job search panels
          if (globalJobSearchState.isOpen && globalJobSearchState.activeInstance !== instanceId) {
            // Another instance is open, close it first
            globalJobSearchState.isOpen = false;
            globalJobSearchState.activeInstance = null;
          }
          
          const newState = !showJobSearch;
          setShowJobSearch(newState);
          
          // Update global state
          globalJobSearchState.isOpen = newState;
          globalJobSearchState.activeInstance = newState ? instanceId : null;
          
          if (newState && jobs.length === 0) {
            await fetchJobs();
          }
        }}
        className="btn"
        style={{
          background: 'rgba(0, 188, 212, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 188, 212, 0.3)',
          color: '#00bcd4',
          fontWeight: '700',
          textShadow: '0 0 10px rgba(0, 188, 212, 0.5)',
          boxShadow: '0 0 20px rgba(0, 188, 212, 0.2)',
          transition: 'all 0.3s ease',
          minWidth: '200px',
          height: '45px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 188, 212, 0.2)';
          e.target.style.boxShadow = '0 0 30px rgba(0, 188, 212, 0.4)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 188, 212, 0.1)';
          e.target.style.boxShadow = '0 0 20px rgba(0, 188, 212, 0.2)';
          e.target.style.transform = 'translateY(0px)';
        }}
      >
        💼 <TranslatedText>JOB SEARCH</TranslatedText>
      </button>

      {/* JOB SEARCH - BLUE BEAM ANIMATION (EXACT COPY OF AI NEWS BUT LEFT SIDE) */}
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
            onClick={() => {
              setShowJobSearch(false);
              globalJobSearchState.isOpen = false;
              globalJobSearchState.activeInstance = null;
            }}
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
              {loading ? (
                <TranslatedText>Loading jobs...</TranslatedText>
              ) : (
                <TranslatedText>No jobs found. Try different keywords.</TranslatedText>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blueBeam {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
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
      `}</style>
    </>
  );
};

export default JobSearchButton;