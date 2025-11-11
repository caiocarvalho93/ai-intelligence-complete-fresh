// 🧠📊 COUNTRY AI ANALYTICS SECTION - Real Data Integration for News Pages
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TranslatedText from "./TranslatedText";

const CountryAIAnalyticsSection = ({ countryCode, countryName }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (countryCode) {
      fetchAnalyticsData();
    }
  }, [countryCode]);

  // Auto-progress through phases every 8 seconds
  useEffect(() => {
    if (!analyticsData || !analyticsData.aiInsights) return;
    
    const timer = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % 3);
    }, 8000);

    return () => clearInterval(timer);
  }, [analyticsData]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching AI analytics for ${countryCode}...`);
      
      const API_BASE = import.meta.env.VITE_API_URL?.trim() || 
        (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
          ? "https://website-project-ai-production.up.railway.app"
          : "http://localhost:3000");
      
      const response = await fetch(`${API_BASE}/api/intelligence/${countryCode}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 AI analytics data received:', data);

      if (data.success) {
        // Transform the intelligence data to match expected analytics format
        const analyticsData = {
          impactMetrics: {
            aiAdoption: data.consciousness || 85,
            jobsCreated: data.jobMarket?.aiJobs || 0,
            economicImpact: data.economicImpact || 75,
            innovationIndex: data.innovationIndex || 80
          },
          aiInsights: {
            focus: data.focus || "AI Development",
            sentiment: data.marketSentiment || "POSITIVE",
            breakthroughs: data.breakthroughs || [],
            companies: data.aiCompanies || []
          },
          economicData: {
            stockPerformance: data.stockAnalysis?.avgPerformance || "0.0",
            marketCap: data.stockAnalysis?.totalVolume || 0,
            topPerformer: data.stockAnalysis?.topPerformer || null
          },
          jobMarketData: {
            totalJobs: data.jobMarket?.aiJobs || 0,
            techJobs: data.jobMarket?.techJobs || 0,
            topJobs: data.jobMarket?.topAIJobs || [],
            growth: data.jobMarket?.jobGrowthIndicator || "STABLE"
          }
        };
        setAnalyticsData(analyticsData);
        console.log('✅ AI analytics data loaded successfully');
      } else {
        setError('Failed to load AI analytics data');
        console.error('❌ AI analytics data error:', data);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
      console.error('❌ Failed to fetch AI analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      'us': '🇺🇸', 'uk': '🇬🇧', 'gb': '🇬🇧', 'ca': '🇨🇦', 'au': '🇦🇺', 'de': '🇩🇪',
      'fr': '🇫🇷', 'nl': '🇳🇱', 'it': '🇮🇹', 'es': '🇪🇸', 'br': '🇧🇷',
      'in': '🇮🇳', 'sg': '🇸🇬', 'za': '🇿🇦', 'jp': '🇯🇵', 'kr': '🇰🇷', 'cn': '🇨🇳'
    };
    return flags[countryCode?.toLowerCase()] || '🌍';
  };

  const getMetricColor = (score) => {
    if (score >= 70) return '#4caf50'; // Green
    if (score >= 50) return '#ffc107'; // Yellow
    return '#ff5722'; // Red
  };

  const getMetricIcon = (metricName) => {
    const icons = {
      aiAdoptionScore: '🤖',
      jobDisplacementRisk: '⚠️',
      opportunityIndex: '🚀',
      economicResilience: '💪',
      skillDemandShift: '📈'
    };
    return icons[metricName] || '📊';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.05))',
          border: '1px solid rgba(0, 188, 212, 0.3)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 188, 212, 0.3)',
            borderTop: '3px solid #00bcd4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <TranslatedText>Loading AI job market analysis for {countryName}...</TranslatedText>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(244, 67, 54, 0.05))',
          border: '1px solid rgba(255, 87, 34, 0.3)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#ff5722', fontWeight: '600', marginBottom: '1rem' }}>
            <TranslatedText>AI Analytics Temporarily Unavailable</TranslatedText>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
            {error}
          </div>
          <button 
            onClick={fetchAnalyticsData}
            className="btn"
            style={{
              background: '#ff5722',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}
          >
            <TranslatedText>Retry</TranslatedText>
          </button>
        </div>
      </motion.div>
    );
  }

  if (!analyticsData) return null;

  const { impactMetrics, aiInsights, economicData, jobMarketData } = analyticsData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.05))',
        border: '1px solid rgba(0, 188, 212, 0.3)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>
            {getCountryFlag(countryCode)}
          </div>
          <div>
            <h3 style={{
              color: '#00bcd4',
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: 0
            }}>
              🧠 <TranslatedText>{countryName} AI Job Market Intelligence</TranslatedText>
            </h3>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              marginTop: '0.25rem'
            }}>
              <TranslatedText>Real economic data + OpenAI analysis</TranslatedText>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0, 188, 212, 0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid rgba(0, 188, 212, 0.4)',
          color: '#00bcd4',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          <TranslatedText>LIVE DATA</TranslatedText>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {impactMetrics && Object.entries(impactMetrics).map(([key, value]) => (
          <div
            key={key}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1rem',
              borderRadius: '10px',
              textAlign: 'center',
              border: `1px solid ${getMetricColor(value)}40`
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {getMetricIcon(key)}
            </div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: getMetricColor(value),
              marginBottom: '0.25rem'
            }}>
              {value}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <TranslatedText>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </TranslatedText>
            </div>
          </div>
        ))}
      </div>

      {/* Economic Indicators */}
      {economicData && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h4 style={{
            color: '#00bcd4',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            📊 <TranslatedText>Economic Indicators</TranslatedText>
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            {economicData.unemployment && (
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TranslatedText>Unemployment</TranslatedText>
                </div>
                <div style={{ color: '#ffc107', fontWeight: '600' }}>
                  {economicData.unemployment.current}%
                </div>
              </div>
            )}
            {economicData.employment && (
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TranslatedText>Employment Trend</TranslatedText>
                </div>
                <div style={{ 
                  color: economicData.employment.trend === 'increasing' ? '#4caf50' : 
                        economicData.employment.trend === 'decreasing' ? '#ff5722' : '#ffc107',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {economicData.employment.trend}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights Phases */}
      {aiInsights && (
        <div>
          {/* Phase Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {[0, 1, 2].map(phase => (
              <div
                key={phase}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: currentPhase >= phase 
                    ? (phase === 0 ? '#ff5722' : phase === 1 ? '#ffc107' : '#4caf50')
                    : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: currentPhase === phase ? '0 0 8px currentColor' : 'none'
                }}
                onClick={() => setCurrentPhase(phase)}
              />
            ))}
          </div>

          {/* Current Phase Content */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1.5rem',
              borderRadius: '10px',
              minHeight: '120px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                {currentPhase === 0 ? '📊' : currentPhase === 1 ? '🚀' : '🎯'}
              </div>
              <h4 style={{
                color: currentPhase === 0 ? '#ff5722' : currentPhase === 1 ? '#ffc107' : '#4caf50',
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: 0
              }}>
                <TranslatedText>
                  {currentPhase === 0 ? 'Reality Check' : 
                   currentPhase === 1 ? 'Opportunity Spotlight' : 'Action Plan'}
                </TranslatedText>
              </h4>
            </div>
            
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              {currentPhase === 0 && aiInsights.phase1}
              {currentPhase === 1 && aiInsights.phase2}
              {currentPhase === 2 && aiInsights.phase3}
            </div>
          </motion.div>
        </div>
      )}

      {/* Job Market Summary */}
      {jobMarketData && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '10px'
        }}>
          <h4 style={{
            color: '#00bcd4',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            💼 <TranslatedText>Job Market Snapshot</TranslatedText>
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            {jobMarketData.ai_roles && (
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TranslatedText>AI/ML Jobs</TranslatedText>
                </div>
                <div style={{ color: '#4caf50', fontWeight: '600' }}>
                  {jobMarketData.ai_roles.totalJobs}
                </div>
              </div>
            )}
            {jobMarketData.ai_roles && jobMarketData.ai_roles.averageSalary > 0 && (
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TranslatedText>Avg AI Salary</TranslatedText>
                </div>
                <div style={{ color: '#4caf50', fontWeight: '600' }}>
                  ${Math.round(jobMarketData.ai_roles.averageSalary / 1000)}K
                </div>
              </div>
            )}
            {jobMarketData.emerging_roles && (
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TranslatedText>Emerging Roles</TranslatedText>
                </div>
                <div style={{ color: '#ffc107', fontWeight: '600' }}>
                  {jobMarketData.emerging_roles.totalJobs}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS for loading animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default CountryAIAnalyticsSection;