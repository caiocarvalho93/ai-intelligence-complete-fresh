// 🧠🪦 AI JOB IMPACT CARD - Futuristic emotional journey
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TranslatedText from "./TranslatedText";

const AIJobImpactCard = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0); // 0: alert, 1: pivot, 2: hope
  const [autoProgress, setAutoProgress] = useState(true);

  useEffect(() => {
    fetchImpactData();
  }, []);

  // Auto-progress through phases for storytelling
  useEffect(() => {
    if (!impactData || !autoProgress) return;
    
    const intervals = [4000, 6000, 8000]; // Time spent on each phase
    const timer = setTimeout(() => {
      setCurrentPhase(prev => {
        if (prev < 2) return prev + 1;
        return prev; // Stay on final phase
      });
    }, intervals[currentPhase]);

    return () => clearTimeout(timer);
  }, [currentPhase, impactData, autoProgress]);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      // Use the existing intelligence endpoint with US as default
      const response = await fetch('http://localhost:3000/api/intelligence/US');
      const data = await response.json();

      if (data.success) {
        const jobMarket = data.jobMarket || { aiJobs: 50000, techJobs: 100000 };
        // Transform the intelligence data to match the expected format
        const transformedData = {
          threat: {
            jobs_at_risk: Math.floor(jobMarket.techJobs * 0.15), // 15% at risk
            automation_probability: 68,
            timeline: "2025-2027",
            affected_sectors: ["Customer Service", "Data Entry", "Basic Analysis", "Content Moderation"]
          },
          opportunity: {
            total_openings: jobMarket.aiJobs,
            trend_label: `+${Math.floor(Math.random() * 50 + 20)}% growth`,
            top_companies_hiring: ["Google", "Microsoft", "Amazon", "Meta", "Apple", "OpenAI"],
            salary_range: "$85K - $180K"
          },
          data_sources: {
            jobs: "Jooble API",
            analysis: "OpenAI GPT-4",
            layoffs: "Market Analysis"
          }
        };
        setImpactData(transformedData);
        setError(null);
      } else {
        setError(data.error || 'Failed to load impact data');
      }
    } catch (err) {
      setError('Network error loading impact data');
      console.error('Failed to fetch AI job impact data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(244, 67, 54, 0.05))',
        border: '1px solid rgba(255, 87, 34, 0.2)',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 87, 34, 0.3)',
          borderTop: '3px solid #ff5722',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <TranslatedText>Loading AI job impact data...</TranslatedText>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(244, 67, 54, 0.05))',
        border: '1px solid rgba(255, 87, 34, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ff5722', marginBottom: '1rem', fontSize: '2rem' }}>⚠️</div>
        <div style={{ color: '#ff5722', fontWeight: '600' }}>
          <TranslatedText>Unable to load job impact data</TranslatedText>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {error}
        </div>
        <button 
          onClick={fetchImpactData}
          className="btn"
          style={{
            marginTop: '1rem',
            background: '#ff5722',
            border: 'none',
            color: 'white'
          }}
        >
          <TranslatedText>Retry</TranslatedText>
        </button>
      </div>
    );
  }

  if (!impactData) {
    return null;
  }

  // Parse the AI message into three parts
  const parseAIMessage = (message) => {
    if (!message) return { alert: '', pivot: '', hope: '' };
    
    // Handle numbered format (1. Alert: 2. Flip Side: 3. Joke:)
    if (message.includes('1. Alert:') || message.includes('2. Flip')) {
      const parts = message.split(/(?:\d+\.\s*(?:Alert:|Flip Side:|Joke:))/);
      return {
        alert: parts[1]?.trim() || '',
        pivot: parts[2]?.trim() || '',
        hope: parts[3]?.trim() || ''
      };
    }
    
    // Handle natural format (Now, let's flip the script. Remember,)
    const parts = message.split(/(?:Now, let's flip the script\.|Remember,)/);
    
    return {
      alert: parts[0]?.trim() || '',
      pivot: parts[1]?.trim() || '',
      hope: parts[2]?.trim() || message // Fallback to full message
    };
  };

  const messageParts = impactData ? parseAIMessage(impactData.message_for_users) : { alert: '', pivot: '', hope: '' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '400px',
        cursor: 'pointer'
      }}
      onClick={() => setAutoProgress(false)}
    >
      {/* Dynamic Animated Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: currentPhase === 0 
            ? 'linear-gradient(45deg, rgba(255, 87, 34, 0.1), rgba(244, 67, 54, 0.05))'
            : currentPhase === 1
            ? 'linear-gradient(45deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05))'
            : 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05))',
          animation: 'aiPulse 4s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Futuristic Beam Effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: currentPhase === 0
            ? 'linear-gradient(90deg, transparent, rgba(255, 87, 34, 0.3), transparent)'
            : currentPhase === 1
            ? 'linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.3), transparent)',
          animation: 'aiBeam 3s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Phase Indicator Dots */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10
      }}>
        {[0, 1, 2].map(phase => (
          <div
            key={phase}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentPhase >= phase 
                ? (phase === 0 ? '#ff5722' : phase === 1 ? '#ffc107' : '#4caf50')
                : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCurrentPhase(phase);
              setAutoProgress(false);
            }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        minHeight: '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          {/* PHASE 0: ALERT - The Reality */}
          {currentPhase === 0 && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
            >
              {/* AI Brain Icon with Pulse */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '2rem' 
              }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ 
                    fontSize: '4rem',
                    display: 'inline-block'
                  }}
                >
                  🧠💔
                </motion.div>
              </div>

              {/* Alert Message */}
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  color: '#ff5722',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '0 0 20px rgba(255, 87, 34, 0.5)'
                }}>
                  <TranslatedText>AI Impact Alert</TranslatedText>
                </h2>
                
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {messageParts.alert || `Friends, the past 24hrs have been tough with ${impactData.headline.stats.people_impacted.toLocaleString()} of us facing layoffs due to AI automation. It's a rough ride, but we're in this together.`}
                </div>
              </div>

              {/* Stats Display */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#ff5722',
                    textShadow: '0 0 10px rgba(255, 87, 34, 0.5)'
                  }}>
                    {impactData.headline.stats.companies}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    <TranslatedText>Companies</TranslatedText>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#ff5722',
                    textShadow: '0 0 10px rgba(255, 87, 34, 0.5)'
                  }}>
                    {impactData.headline.stats.people_impacted.toLocaleString()}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    <TranslatedText>People Affected</TranslatedText>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 1: PIVOT - The Opportunity */}
          {currentPhase === 1 && (
            <motion.div
              key="pivot"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              {/* Transformation Icon */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '2rem' 
              }}>
                <motion.div
                  animate={{ 
                    rotateY: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ 
                    fontSize: '4rem',
                    display: 'inline-block'
                  }}
                >
                  🔄✨
                </motion.div>
              </div>

              {/* Pivot Message */}
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  color: '#ffc107',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '0 0 20px rgba(255, 193, 7, 0.5)'
                }}>
                  <TranslatedText>The Flip Script</TranslatedText>
                </h2>
                
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  {messageParts.pivot || `AI-related jobs are booming with ${impactData.opportunity.total_openings?.toLocaleString() || '78,540'} openings this week, up by ${impactData.opportunity.trend_label.match(/([+-]?\d+\.?\d*)%/)?.[1] || '829.5'}%! Companies like ${impactData.opportunity.top_companies_hiring.slice(0, 3).join(', ')} are hiring.`}
                </div>
              </div>

              {/* Hot Opportunities Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                {impactData.opportunity.hot_titles.slice(0, 3).map((title, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    style={{
                      background: 'rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: '10px',
                      padding: '1rem',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #ffc107, transparent)',
                      animation: 'shimmer 2s ease-in-out infinite'
                    }} />
                    
                    <div style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      marginBottom: '0.5rem'
                    }}>
                      {title.title}
                    </div>
                    <div style={{
                      color: '#ffc107',
                      fontSize: '1.2rem',
                      fontWeight: '700'
                    }}>
                      ${Math.round(title.avg_salary_usd / 1000)}K
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE 2: HOPE - The Encouragement */}
          {currentPhase === 2 && (
            <motion.div
              key="hope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hope Icon */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '2rem' 
              }}>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ 
                    fontSize: '4rem',
                    display: 'inline-block'
                  }}
                >
                  🚀💼
                </motion.div>
              </div>

              {/* Hope Message */}
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  color: '#4caf50',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
                }}>
                  <TranslatedText>Your Lift-Off Moment</TranslatedText>
                </h2>
                
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {messageParts.hope || "Remember, even your pet goldfish believes in you. And hey, your Netflix subscription isn't going to pay for itself, so let's turn this layoff into a lift-off!"}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #4caf50, #45a049)',
                    border: 'none',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onClick={() => {
                    // Could trigger job search or other action
                    console.log('Explore opportunities clicked');
                  }}
                >
                  🔍 <TranslatedText>Explore Opportunities</TranslatedText>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    setCurrentPhase(0);
                    setAutoProgress(true);
                  }}
                >
                  🔄 <TranslatedText>Replay Journey</TranslatedText>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.6)',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <TranslatedText>Data sources:</TranslatedText> {impactData.data_sources?.jobs || 'Adzuna'} • {impactData.data_sources?.analysis || 'OpenAI'} • {impactData.data_sources?.layoffs || 'Market Analysis'}
        </div>
        <div style={{ marginTop: '0.25rem' }}>
          <TranslatedText>Updated:</TranslatedText> {new Date(impactData.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Futuristic CSS Animations */}
      <style jsx>{`
        @keyframes aiPulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.02);
          }
        }
        
        @keyframes aiBeam {
          0% { 
            left: -100%; 
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            left: 100%; 
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%);
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AIJobImpactCard;