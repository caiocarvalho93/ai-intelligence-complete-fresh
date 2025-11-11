/**
 * AI OPTIMIZATION DASHBOARD
 * Ultimate interface for AI-powered news intelligence and translation capabilities
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Zap,
  TrendingUp,
  Globe,
  Target,
  Cpu,
  BarChart3,
  Languages,
  Sparkles,
  Rocket,
  Shield,
  Eye,
  Bitcoin,
} from "lucide-react";

const AIOptimizationDashboard = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [newsResults, setNewsResults] = useState(null);
  const [translationResults, setTranslationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchAIMetrics();
  }, []);

  const fetchAIMetrics = async () => {
    try {
      const response = await fetch("/api/ai-optimization/metrics");
      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch AI metrics:", error);
    }
  };

  const testNewsIntelligence = async () => {
    setIsProcessing(true);
    try {
      const testArticles = [
        {
          title: "Revolutionary AI Breakthrough in Machine Learning",
          description:
            "Scientists develop new neural network architecture that achieves unprecedented accuracy in natural language processing tasks",
          publishedAt: new Date().toISOString(),
          source: { name: "AI Research Today" },
          url: "https://example.com/ai-breakthrough",
        },
        {
          title: "Quantum Computing Meets Artificial Intelligence",
          description:
            "Major tech companies announce collaboration on quantum-AI hybrid systems for solving complex optimization problems",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "TechCrunch" },
          url: "https://example.com/quantum-ai",
        },
        {
          title: "Cybersecurity AI Prevents Major Data Breach",
          description:
            "Advanced AI security system successfully identifies and neutralizes sophisticated cyber attack targeting financial institutions",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "CyberSec Weekly" },
          url: "https://example.com/ai-security",
        },
      ];

      const response = await fetch("/api/ai-optimization/news/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articles: testArticles,
          countryCode: "US",
          options: { priority: "high", aiEnhancement: true },
        }),
      });

      const data = await response.json();
      setNewsResults(data);
    } catch (error) {
      console.error("News intelligence test failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const testContextualTranslation = async () => {
    setIsProcessing(true);
    try {
      const testTexts = [
        "The artificial intelligence revolution is transforming how we work and live.",
        "Machine learning algorithms are becoming increasingly sophisticated.",
        "Quantum computing will unlock new possibilities for AI development.",
      ];

      const results = [];
      for (const text of testTexts) {
        const response = await fetch(
          "/api/ai-optimization/translation/contextual",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              targetLanguage: "es",
              options: { domain: "technology", formality: "formal" },
            }),
          }
        );
        const data = await response.json();
        results.push(data);
      }

      setTranslationResults(results);
    } catch (error) {
      console.error("Translation test failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Optimization Dashboard
                </h1>
                <p className="text-gray-400">
                  Ultimate AI-powered intelligence platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/crypto-treasury"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Bitcoin className="w-4 h-4" />
                <span>Crypto Treasury</span>
              </Link>
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 font-semibold">
                  System Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-black/20 p-1 rounded-xl border border-purple-500/20">
          {[
            { id: "news", label: "News Intelligence", icon: Eye },
            {
              id: "translation",
              label: "Contextual Translation",
              icon: Languages,
            },
            { id: "metrics", label: "AI Metrics", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
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
          {activeTab === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* News Intelligence Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        AI-Enhanced News Intelligence
                      </h2>
                      <p className="text-gray-400">
                        ML-powered accuracy scoring and predictive analysis
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={testNewsIntelligence}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Rocket className="w-4 h-4" />
                        <span>Test AI Enhancement</span>
                      </div>
                    )}
                  </button>
                </div>

                {newsResults && (
                  <div className="space-y-6">
                    {/* AI Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-green-400 font-semibold">
                              ML Confidence
                            </p>
                            <p className="text-2xl font-bold">
                              {Math.round((newsResults?.mlConfidence || 0) * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Cpu className="w-6 h-6 text-blue-400" />
                          <div>
                            <p className="text-blue-400 font-semibold">
                              Processing Time
                            </p>
                            <p className="text-2xl font-bold">
                              {newsResults?.processingTime || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-6 h-6 text-purple-400" />
                          <div>
                            <p className="text-purple-400 font-semibold">
                              Enhanced Articles
                            </p>
                            <p className="text-2xl font-bold">
                              {newsResults?.enhancedCount || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Predictive Insights */}
                    <div className="bg-black/30 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span>AI Predictive Insights</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-400 mb-3">
                            Emerging Trends
                          </h4>
                          <div className="space-y-2">
                            {(newsResults?.aiMetrics?.predictiveInsights?.emergingTrends || []).map(
                              (trend, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg"
                                >
                                  <span className="text-sm">{trend.trend}</span>
                                  <span className="text-green-400 font-semibold">
                                    {Math.round(trend.confidence * 100)}%
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-400 mb-3">
                            Risk Factors
                          </h4>
                          <div className="space-y-2">
                            {(newsResults?.aiMetrics?.predictiveInsights?.riskFactors || []).map(
                              (risk, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg"
                                >
                                  <span className="text-sm">{risk.risk}</span>
                                  <span className="text-red-400 font-semibold">
                                    {risk.severity}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitive Intelligence */}
                    <div className="bg-black/30 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span>Competitive Intelligence</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">
                            Market Position
                          </p>
                          <p className="text-xl font-bold text-blue-400">
                            {
                              newsResults?.aiMetrics?.competitiveIntelligence
                                ?.marketPosition || 'N/A'
                            }
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">Threat Level</p>
                          <p className="text-xl font-bold text-yellow-400">
                            {
                              newsResults?.aiMetrics?.competitiveIntelligence
                                ?.threatLevel || 'N/A'
                            }
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">
                            Activity Level
                          </p>
                          <p className="text-xl font-bold text-green-400">
                            {
                              newsResults?.aiMetrics?.competitiveIntelligence
                                ?.competitorActivity || 'N/A'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "translation" && (
            <motion.div
              key="translation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Translation Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Globe className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        AI Contextual Translation
                      </h2>
                      <p className="text-gray-400">
                        NLP-powered translation with cultural adaptation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={testContextualTranslation}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Translating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Languages className="w-4 h-4" />
                        <span>Test AI Translation</span>
                      </div>
                    )}
                  </button>
                </div>

                {translationResults && (
                  <div className="space-y-6">
                    {/* Translation Results */}
                    <div className="space-y-4">
                      {(translationResults || []).map((result, index) => (
                        <div key={index} className="bg-black/30 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-blue-400 mb-2">
                                Original (English)
                              </h4>
                              <p className="text-gray-300 bg-blue-500/10 p-4 rounded-lg">
                                {result.originalText}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-400 mb-2">
                                Translation (Spanish)
                              </h4>
                              <p className="text-gray-300 bg-green-500/10 p-4 rounded-lg">
                                {result.translation}
                              </p>
                            </div>
                          </div>

                          {/* Quality Metrics */}
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-gray-400 text-sm">Accuracy</p>
                              <p className="text-lg font-bold text-green-400">
                                {Math.round(
                                  (result?.qualityMetrics?.accuracy || 0) * 100
                                )}
                                %
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-sm">Fluency</p>
                              <p className="text-lg font-bold text-blue-400">
                                {Math.round(
                                  (result?.qualityMetrics?.fluency || 0) * 100
                                )}
                                %
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-sm">Cultural</p>
                              <p className="text-lg font-bold text-purple-400">
                                {Math.round(
                                  result.qualityMetrics
                                    .culturalAppropriateness * 100
                                )}
                                %
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-sm">Overall</p>
                              <p className="text-lg font-bold text-yellow-400">
                                {Math.round(
                                  (result?.qualityMetrics?.overallQuality || 0) * 100
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "metrics" && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* AI Metrics Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI System Metrics</h2>
                    <p className="text-gray-400">
                      Real-time performance and optimization statistics
                    </p>
                  </div>
                </div>

                {metrics && (
                  <div className="space-y-8">
                    {/* News Intelligence Metrics */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-blue-400">
                        News Intelligence Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <p className="text-blue-400 font-semibold">
                            Accuracy Improvement
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              metrics?.newsIntelligence
                                ?.averageAccuracyImprovement || 'N/A'
                            }
                          </p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <p className="text-green-400 font-semibold">
                            Processing Speed
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.newsIntelligence?.realTimeProcessingSpeed || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                          <p className="text-purple-400 font-semibold">
                            ML Confidence
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.newsIntelligence?.mlModelConfidence || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                          <p className="text-yellow-400 font-semibold">
                            Intelligence Extraction
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              metrics?.newsIntelligence
                                ?.competitiveIntelligenceExtraction || 'N/A'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Translation Metrics */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-green-400">
                        Translation Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <p className="text-green-400 font-semibold">
                            Quality Score
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.translation?.averageQualityScore || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <p className="text-blue-400 font-semibold">
                            Contextual Accuracy
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.translation?.contextualAccuracy || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                          <p className="text-purple-400 font-semibold">
                            Cultural Adaptation
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.translation?.culturalAdaptation || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                          <p className="text-yellow-400 font-semibold">
                            Languages Supported
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.translation?.supportedLanguages || 0}+
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overall System Metrics */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-purple-400">
                        Overall System Health
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <p className="text-green-400 font-semibold">
                            System Uptime
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.overall?.systemUptime || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <p className="text-blue-400 font-semibold">
                            API Response Time
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.overall?.apiResponseTime || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                          <p className="text-red-400 font-semibold">
                            Error Rate
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.overall?.errorRate || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                          <p className="text-yellow-400 font-semibold">
                            User Satisfaction
                          </p>
                          <p className="text-2xl font-bold">
                            {metrics?.overall?.userSatisfaction || 'N/A'}
                          </p>
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

export default AIOptimizationDashboard;
