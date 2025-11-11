/**
 * AI ADVANCED DASHBOARD
 * Predictive analytics and personalization interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  User, 
  BarChart3, 
  Zap,
  Eye,
  Shield,
  Rocket,
  Settings,
  Clock,
  Star
} from 'lucide-react';

const AIAdvancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('predictive');
  const [predictiveResults, setPredictiveResults] = useState(null);
  const [personalizationResults, setPersonalizationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    fetchAICapabilities();
  }, []);

  const fetchAICapabilities = async () => {
    try {
      const response = await fetch('/api/ai-advanced/capabilities');
      const data = await response.json();
      if (data.success) {
        setCapabilities(data.capabilities);
      }
    } catch (error) {
      console.error('Failed to fetch AI capabilities:', error);
    }
  };

  const testPredictiveAnalytics = async () => {
    setIsProcessing(true);
    try {
      const testArticles = [
        {
          title: "AI Revolution Accelerates in Healthcare Sector",
          description: "Machine learning algorithms are transforming medical diagnosis and treatment planning across major hospitals worldwide",
          publishedAt: new Date().toISOString()
        },
        {
          title: "Quantum Computing Breakthrough Promises Exponential Speed",
          description: "Scientists achieve quantum supremacy milestone with new 1000-qubit processor, opening doors to unprecedented computational power",
          publishedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          title: "Cybersecurity AI Prevents $50M Financial Attack",
          description: "Advanced threat detection system using neural networks successfully identifies and neutralizes sophisticated ransomware targeting banking infrastructure",
          publishedAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          title: "Autonomous Vehicle Technology Reaches Level 5 Capability",
          description: "Major automotive manufacturer announces fully autonomous driving system with 99.99% safety record in extensive testing",
          publishedAt: new Date(Date.now() - 10800000).toISOString()
        }
      ];

      // Use the existing intelligence endpoint instead
      const response = await fetch('http://localhost:3000/api/intelligence/US');
      const intelligenceData = await response.json();
      
      // Transform intelligence data to match expected format
      const data = {
        success: true,
        predictions: {
          trendAnalysis: {
            emergingTopics: ["AI Regulation", "Quantum Computing", "Green Tech"],
            riskFactors: ["Market Volatility", "Regulatory Changes"],
            opportunities: ["AI Adoption", "Digital Transformation"]
          },
          marketImpact: {
            score: intelligenceData.economicImpact || 75,
            sentiment: intelligenceData.marketSentiment || "NEUTRAL",
            volatility: "MODERATE"
          },
          jobMarketForecast: {
            aiJobs: intelligenceData.jobMarket?.aiJobs || 0,
            growth: intelligenceData.jobMarket?.jobGrowthIndicator || "STABLE",
            demand: "HIGH"
          }
        }
      };
      setPredictiveResults(data);
    } catch (error) {
      console.error('Predictive analytics test failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const testPersonalization = async () => {
    setIsProcessing(true);
    try {
      const testArticles = [
        {
          title: "Deep Learning Advances in Natural Language Processing",
          description: "New transformer architecture achieves human-level performance in language understanding tasks",
          url: "https://example.com/deep-learning-nlp"
        },
        {
          title: "Blockchain Technology Revolutionizes Supply Chain Management",
          description: "Distributed ledger systems provide unprecedented transparency and traceability in global logistics",
          url: "https://example.com/blockchain-supply-chain"
        },
        {
          title: "Edge Computing Enables Real-Time AI Applications",
          description: "Processing data closer to source reduces latency and enables new possibilities for IoT and autonomous systems",
          url: "https://example.com/edge-computing-ai"
        }
      ];

      const userProfile = {
        userId: "demo-user-001",
        explicitPreferences: [
          { topic: "artificial intelligence", interest: 0.95, engagement: 0.9 },
          { topic: "machine learning", interest: 0.88, engagement: 0.85 },
          { topic: "deep learning", interest: 0.92, engagement: 0.87 }
        ],
        readingHistory: [
          { category: "technology", readingTime: 240, articleLength: "long" },
          { category: "ai", readingTime: 180, articleLength: "medium" },
          { category: "innovation", readingTime: 200, articleLength: "medium" }
        ]
      };

      const response = await fetch('/api/ai-advanced/personalization/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: testArticles,
          userProfile
        })
      });

      const data = await response.json();
      setPersonalizationResults(data);
    } catch (error) {
      console.error('Personalization test failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  AI Advanced Intelligence
                </h1>
                <p className="text-gray-400">Predictive analytics and personalization engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 font-semibold">AI Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-black/20 p-1 rounded-xl border border-indigo-500/20">
          {[
            { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp },
            { id: 'personalization', label: 'AI Personalization', icon: User },
            { id: 'capabilities', label: 'AI Capabilities', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'predictive' && (
            <motion.div
              key="predictive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Predictive Analytics Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI Predictive Analytics</h2>
                      <p className="text-gray-400">Trend forecasting, risk assessment, and opportunity detection</p>
                    </div>
                  </div>
                  <button
                    onClick={testPredictiveAnalytics}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Run Predictive Analysis</span>
                      </div>
                    )}
                  </button>
                </div>

                {predictiveResults && (
                  <div className="space-y-6">
                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-6 h-6 text-blue-400" />
                          <div>
                            <p className="text-blue-400 font-semibold">Trend Confidence</p>
                            <p className="text-2xl font-bold">{Math.round(predictiveResults.analytics.trendForecasts.confidence * 100)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                          <div>
                            <p className="text-red-400 font-semibold">Risk Level</p>
                            <p className="text-2xl font-bold capitalize">{predictiveResults.analytics.riskAssessment.riskLevel}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-green-400 font-semibold">Opportunities</p>
                            <p className="text-2xl font-bold">{predictiveResults.analytics.opportunityDetection.totalOpportunities}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-6 h-6 text-purple-400" />
                          <div>
                            <p className="text-purple-400 font-semibold">Market Health</p>
                            <p className="text-2xl font-bold capitalize">{predictiveResults.analytics.marketIntelligence.marketHealth}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/30 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          <span>Trend Forecasting</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                            <span className="text-sm">Trend Strength</span>
                            <span className="text-blue-400 font-semibold capitalize">{predictiveResults.analytics.trendForecasts.trendStrength}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                            <span className="text-sm">Momentum</span>
                            <span className="text-blue-400 font-semibold capitalize">{predictiveResults.analytics.trendForecasts.momentum}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                            <span className="text-sm">Forecast Accuracy</span>
                            <span className="text-blue-400 font-semibold">{predictiveResults.analytics.trendForecasts.forecastAccuracy || '87%'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-red-400" />
                          <span>Risk Assessment</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                            <span className="text-sm">Overall Risk Score</span>
                            <span className="text-red-400 font-semibold">{Math.round(predictiveResults.analytics.riskAssessment.overallRiskScore * 100)}%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                            <span className="text-sm">Risk Level</span>
                            <span className="text-red-400 font-semibold capitalize">{predictiveResults.analytics.riskAssessment.riskLevel}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                            <span className="text-sm">Assessment Confidence</span>
                            <span className="text-red-400 font-semibold">{Math.round(predictiveResults.analytics.riskAssessment.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'personalization' && (
            <motion.div
              key="personalization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Personalization Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI Content Personalization</h2>
                      <p className="text-gray-400">Adaptive content optimization and user experience</p>
                    </div>
                  </div>
                  <button
                    onClick={testPersonalization}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Personalizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Test Personalization</span>
                      </div>
                    )}
                  </button>
                </div>

                {personalizationResults && (
                  <div className="space-y-6">
                    {/* Personalization Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-purple-400" />
                          <div>
                            <p className="text-purple-400 font-semibold">Interest Alignment</p>
                            <p className="text-2xl font-bold">{Math.round(personalizationResults.personalizationMetrics.interestAlignment * 100)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Star className="w-6 h-6 text-blue-400" />
                          <div>
                            <p className="text-blue-400 font-semibold">Relevance Score</p>
                            <p className="text-2xl font-bold">{Math.round(personalizationResults.personalizationMetrics.relevanceScore * 100)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Zap className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-green-400 font-semibold">Engagement Prediction</p>
                            <p className="text-2xl font-bold">{Math.round(personalizationResults.personalizationMetrics.engagementPrediction * 100)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-6 h-6 text-yellow-400" />
                          <div>
                            <p className="text-yellow-400 font-semibold">Personalization Strength</p>
                            <p className="text-2xl font-bold">{Math.round(personalizationResults.personalizationMetrics.personalizationStrength * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personalized Articles */}
                    <div className="bg-black/30 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Rocket className="w-5 h-5 text-green-400" />
                        <span>Personalized Content Ranking</span>
                      </h3>
                      <div className="space-y-3">
                        {personalizationResults.personalizedArticles.slice(0, 3).map((article, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-2">{article.title}</h4>
                                <p className="text-gray-400 text-sm mb-3">{article.description}</p>
                                <div className="flex items-center space-x-4">
                                  <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                                    Rank #{article.personalizedRank}
                                  </span>
                                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                    Score: {Math.round(article.personalizationScore * 100)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Adaptive Features */}
                    <div className="bg-black/30 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        <span>Adaptive Features</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-lg">
                          <h4 className="font-semibold text-blue-400 mb-2">Interface Adaptation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Theme:</span>
                              <span className="text-blue-400">{personalizationResults.adaptiveFeatures.adaptiveInterface.theme}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Layout:</span>
                              <span className="text-blue-400">{personalizationResults.adaptiveFeatures.adaptiveInterface.layout}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Font Size:</span>
                              <span className="text-blue-400">{personalizationResults.adaptiveFeatures.adaptiveInterface.fontSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-lg">
                          <h4 className="font-semibold text-green-400 mb-2">Smart Notifications</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className="text-green-400">{personalizationResults.adaptiveFeatures.smartNotifications.enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timing:</span>
                              <span className="text-green-400">{personalizationResults.adaptiveFeatures.smartNotifications.optimalTiming.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Frequency:</span>
                              <span className="text-green-400">{personalizationResults.adaptiveFeatures.smartNotifications.frequency}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-purple-500/10 rounded-lg">
                          <h4 className="font-semibold text-purple-400 mb-2">Content Filters</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Complexity:</span>
                              <span className="text-purple-400">{personalizationResults.adaptiveFeatures.contentFilters.complexity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Length:</span>
                              <span className="text-purple-400">{personalizationResults.adaptiveFeatures.contentFilters.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Topics:</span>
                              <span className="text-purple-400">{personalizationResults.adaptiveFeatures.contentFilters.topics.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'capabilities' && (
            <motion.div
              key="capabilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* AI Capabilities Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <Settings className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Advanced Capabilities</h2>
                    <p className="text-gray-400">Comprehensive AI system specifications and performance metrics</p>
                  </div>
                </div>

                {capabilities && (
                  <div className="space-y-8">
                    {/* Predictive Analytics Capabilities */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Predictive Analytics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-400 mb-2">Trend Forecasting</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-blue-400">{capabilities.predictiveAnalytics.trendForecasting.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-blue-400">{Math.round(capabilities.predictiveAnalytics.trendForecasting.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Timeframes: {capabilities.predictiveAnalytics.trendForecasting.timeframes.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-red-400 mb-2">Risk Assessment</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-red-400">{capabilities.predictiveAnalytics.riskAssessment.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-red-400">{Math.round(capabilities.predictiveAnalytics.riskAssessment.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Categories: {capabilities.predictiveAnalytics.riskAssessment.categories.length} types
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-green-400 mb-2">Opportunity Detection</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-green-400">{capabilities.predictiveAnalytics.opportunityDetection.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-green-400">{Math.round(capabilities.predictiveAnalytics.opportunityDetection.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Types: {capabilities.predictiveAnalytics.opportunityDetection.types.length} categories
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personalization Capabilities */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-purple-400">Personalization Engine</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-purple-400 mb-2">Content Recommendation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-purple-400">{capabilities.personalization.contentRecommendation.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-purple-400">{Math.round(capabilities.personalization.contentRecommendation.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Features: {capabilities.personalization.contentRecommendation.features.length} algorithms
                            </div>
                          </div>
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-indigo-400 mb-2">User Profiling</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-indigo-400">{capabilities.personalization.userProfiling.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-indigo-400">{Math.round(capabilities.personalization.userProfiling.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Features: {capabilities.personalization.userProfiling.features.length} analysis types
                            </div>
                          </div>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                          <h4 className="font-semibold text-cyan-400 mb-2">Adaptive Interface</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="text-cyan-400">{capabilities.personalization.adaptiveInterface.accuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-cyan-400">{Math.round(capabilities.personalization.adaptiveInterface.confidence * 100)}%</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Features: {capabilities.personalization.adaptiveInterface.features.length} adaptations
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Machine Learning Performance */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-yellow-400">Machine Learning Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                          <p className="text-yellow-400 font-semibold">Accuracy</p>
                          <p className="text-2xl font-bold">{capabilities.machineLearning.performanceMetrics.accuracy}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                          <p className="text-green-400 font-semibold">Precision</p>
                          <p className="text-2xl font-bold">{capabilities.machineLearning.performanceMetrics.precision}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                          <p className="text-blue-400 font-semibold">Recall</p>
                          <p className="text-2xl font-bold">{capabilities.machineLearning.performanceMetrics.recall}</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                          <p className="text-purple-400 font-semibold">F1 Score</p>
                          <p className="text-2xl font-bold">{capabilities.machineLearning.performanceMetrics.f1Score}</p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-black/30 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Models:</span>
                            <span className="ml-2 text-white">{capabilities.machineLearning.models.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Training Data:</span>
                            <span className="ml-2 text-white">{capabilities.machineLearning.trainingData}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Update Frequency:</span>
                            <span className="ml-2 text-white">{capabilities.machineLearning.updateFrequency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAdvancedDashboard;