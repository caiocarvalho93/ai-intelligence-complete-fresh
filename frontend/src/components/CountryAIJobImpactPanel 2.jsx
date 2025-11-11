// 🌍🧠 COUNTRY-SPECIFIC AI JOB IMPACT PANEL
// Triggered when clicking on countries in the leaderboard
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TranslatedText from "./TranslatedText";

const CountryAIJobImpactPanel = ({ country, countryName, isOpen, onClose }) => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [autoProgress, setAutoProgress] = useState(true);

  useEffect(() => {
    if (isOpen && country) {
      fetchCountryImpactData();
    }
  }, [isOpen, country]);

  // Auto-progress through phases
  useEffect(() => {
    if (!impactData || !autoProgress || !isOpen) return;
    
    const intervals = [4000, 6000, 8000];
    const timer = setTimeout(() => {
      setCurrentPhase(prev => {
        if (prev < 2) return prev + 1;
        return prev;
      });
    }, intervals[currentPhase]);

    return () => clearTimeout(timer);
  }, [currentPhase, impactData, autoProgress, isOpen]);

  const fetchCountryImpactData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching impact data for country: ${country}`);
      
      if (!country) {
        setError('No country specified');
        return;
      }
      
      const response = await fetch(`/api/ai-impact/impact-card?country=${country}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Country impact data received:', data);

      if (data.success && data.card) {
        setImpactData(data.card);
        setCurrentPhase(0);
        setAutoProgress(true);
        console.log('✅ Country impact data loaded successfully');
      } else {
        setError(data.error || 'Failed to load country impact data');
        console.error('❌ Country impact data error:', data);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
      console.error('❌ Failed to fetch country AI job impact data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Parse AI message into phases
  const parseAIMessage = (message) => {
    if (!message) return { alert: '', pivot: '', hope: '' };
    
    if (message.includes('1. Alert:') || message.includes('2. Flip')) {
      const parts = message.split(/(?:\d+\.\s*(?:Alert:|Flip Side:|Joke:))/);
      return {
        alert: parts[1]?.trim() || '',
        pivot: parts[2]?.trim() || '',
        hope: parts[3]?.trim() || ''
      };
    }
    
    const parts = message.split(/(?:Now, let's flip the script\.|Remember,)/);
    return {
      alert: parts[0]?.trim() || '',
      pivot: parts[1]?.trim() || '',
      hope: parts[2]?.trim() || message
    };
  };

  const messageParts = impactData ? parseAIMessage(impactData.message_for_users) : { alert: '', pivot: '', hope: '' };

  // Get country flag emoji
  const getCountryFlag = (countryCode) => {
    const flags = {
      'us': '🇺🇸', 'uk': '🇬🇧', 'ca': '🇨🇦', 'au': '🇦🇺', 'de': '🇩🇪',
      'fr': '🇫🇷', 'nl': '🇳🇱', 'it': '🇮🇹', 'es': '🇪🇸', 'br': '🇧🇷',
      'in': '🇮🇳', 'sg': '🇸🇬', 'za': '🇿🇦'
    };
    return flags[countryCode?.toLowerCase()] || '🌍';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '2rem 2rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem' }}>
                {getCountryFlag(country)}
              </div>
              <div>
                <h2 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {countryName} <TranslatedText>AI Job Impact</TranslatedText>
                </h2>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  <TranslatedText>Localized market analysis</TranslatedText>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ 
            padding: '2rem',
            maxHeight: 'calc(90vh - 120px)',
            overflowY: 'auto'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid #00bcd4',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <TranslatedText>Loading {countryName} job impact data...</TranslatedText>
                </div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <div style={{ color: '#ff5722', fontWeight: '600', marginBottom: '1rem' }}>
                  <TranslatedText>Unable to load {countryName} data</TranslatedText>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
                  {error}
                </div>
                <button 
                  onClick={fetchCountryImpactData}
                  className="btn"
                  style={{
                    background: '#00bcd4',
                    border: 'none',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px'
                  }}
                >
                  <TranslatedText>Retry</TranslatedText>
                </button>
              </div>
            ) : impactData ? (
              <div style={{ position: 'relative' }}>
                {/* Dynamic Background */}
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
                    borderRadius: '15px',
                    animation: 'countryPulse 4s ease-in-out infinite',
                    pointerEvents: 'none'
                  }}
                />

                {/* Phase Indicators */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {[0, 1, 2].map(phase => (
                    <div
                      key={phase}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: currentPhase >= phase 
                          ? (phase === 0 ? '#ff5722' : phase === 1 ? '#ffc107' : '#4caf50')
                          : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: currentPhase === phase ? '0 0 10px currentColor' : 'none'
                      }}
                      onClick={() => {
                        setCurrentPhase(phase);
                        setAutoProgress(false);
                      }}
                    />
                  ))}
                </div>

                {/* Phase Content */}
                <div style={{ 
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <AnimatePresence mode="wait">
                    {/* PHASE 0: COUNTRY ALERT */}
                    {currentPhase === 0 && (
                      <motion.div
                        key="country-alert"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                      >
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
                            marginBottom: '1.5rem'
                          }}
                        >
                          {getCountryFlag(country)}💔
                        </motion.div>

                        <h3 style={{
                          color: '#ff5722',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          marginBottom: '1rem',
                          textShadow: '0 0 20px rgba(255, 87, 34, 0.5)'
                        }}>
                          {impactData.headline.title}
                        </h3>

                        <div style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                          marginBottom: '2rem',
                          maxWidth: '500px',
                          margin: '0 auto 2rem'
                        }}>
                          {messageParts.alert || 'Loading market analysis...'}
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '1.5rem',
                          maxWidth: '400px',
                          margin: '0 auto'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '2rem',
                              fontWeight: '700',
                              color: '#ff5722',
                              textShadow: '0 0 10px rgba(255, 87, 34, 0.5)'
                            }}>
                              {impactData?.headline?.stats?.companies || 0}
                            </div>
                            <div style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                              textTransform: 'uppercase'
                            }}>
                              <TranslatedText>Companies</TranslatedText>
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '2rem',
                              fontWeight: '700',
                              color: '#ff5722',
                              textShadow: '0 0 10px rgba(255, 87, 34, 0.5)'
                            }}>
                              {impactData?.headline?.stats?.jobs_analyzed?.toLocaleString() || '0'}
                            </div>
                            <div style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                              textTransform: 'uppercase'
                            }}>
                              <TranslatedText>Affected</TranslatedText>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* PHASE 1: COUNTRY OPPORTUNITIES */}
                    {currentPhase === 1 && (
                      <motion.div
                        key="country-pivot"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                      >
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
                            marginBottom: '1.5rem'
                          }}
                        >
                          {getCountryFlag(country)}🔄
                        </motion.div>

                        <h3 style={{
                          color: '#ffc107',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          marginBottom: '1rem',
                          textShadow: '0 0 20px rgba(255, 193, 7, 0.5)'
                        }}>
                          {impactData?.opportunity?.trend_label || 'Market Analysis'}
                        </h3>

                        <div style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                          marginBottom: '2rem',
                          maxWidth: '600px',
                          margin: '0 auto 2rem'
                        }}>
                          {messageParts.pivot || 'Analyzing opportunities...'}
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '1rem',
                          maxWidth: '600px',
                          margin: '0 auto'
                        }}>
                          {(impactData?.opportunity?.hot_titles || []).slice(0, 3).map((title, index) => (
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
                                textAlign: 'center'
                              }}
                            >
                              <div style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginBottom: '0.5rem'
                              }}>
                                {title.title}
                              </div>
                              <div style={{
                                color: '#ffc107',
                                fontSize: '1.1rem',
                                fontWeight: '700'
                              }}>
                                ${Math.round((title?.avg_salary_usd || 95000) / 1000)}K
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* PHASE 2: COUNTRY HOPE */}
                    {currentPhase === 2 && (
                      <motion.div
                        key="country-hope"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                      >
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
                            marginBottom: '1.5rem'
                          }}
                        >
                          {getCountryFlag(country)}🚀
                        </motion.div>

                        <h3 style={{
                          color: '#4caf50',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          marginBottom: '1rem',
                          textShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
                        }}>
                          <TranslatedText>Your {countryName} Opportunity</TranslatedText>
                        </h3>

                        <div style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                          marginBottom: '2rem',
                          maxWidth: '500px',
                          margin: '0 auto 2rem'
                        }}>
                          {messageParts.hope || 'Generating encouragement...'}
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '1rem',
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
                              fontWeight: '600'
                            }}
                            onClick={() => {
                              // Could trigger country-specific job search
                              console.log(`Explore ${countryName} opportunities`);
                            }}
                          >
                            🔍 <TranslatedText>Explore {countryName} Jobs</TranslatedText>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes countryPulse {
              0%, 100% { 
                opacity: 0.3; 
                transform: scale(1);
              }
              50% { 
                opacity: 0.6; 
                transform: scale(1.01);
              }
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CountryAIJobImpactPanel;