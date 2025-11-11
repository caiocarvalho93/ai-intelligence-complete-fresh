/**
 * 🚀 QUANTUM CAI CHAT - REVOLUTIONARY AI ASSISTANT
 * FOCUSED ONLY ON: NEWS, CRYPTO, TECH, JOB MARKET, ARTICLES
 * NO PRIVATE INFORMATION - SECURE & FOCUSED
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, Briefcase, Globe, X, Send, Cpu } from 'lucide-react';

const QuantumCAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [quantumLevel, setQuantumLevel] = useState(100);
  const messagesEndRef = useRef(null);

  // 🚀 QUANTUM BRAIN INITIALIZATION
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: '🧠 **QUANTUM CAI ACTIVATED**\n\nI\'m your AI assistant focused on:\n• 📰 **Latest News & Articles**\n• 💰 **Crypto Market Analysis**\n• 🚀 **Tech Industry Updates**\n• 💼 **Job Market Intelligence**\n• 🌍 **Global Tech Events**\n\nWhat would you like to explore?',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🧠 QUANTUM AI RESPONSE SYSTEM
  const generateQuantumResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // 🚀 FOCUSED RESPONSES - ONLY WEBSITE TOPICS
    if (message.includes('news') || message.includes('article')) {
      return `📰 **NEWS INTELLIGENCE ACTIVATED**\n\nI can help you with:\n• Latest AI & Tech news from our database\n• Global news analysis from 30+ countries\n• Article recommendations based on trends\n• Breaking tech industry updates\n\nWould you like me to fetch the latest articles from a specific country or topic?`;
    }
    
    if (message.includes('crypto') || message.includes('bitcoin') || message.includes('blockchain')) {
      return `💰 **CRYPTO QUANTUM ANALYSIS**\n\nCrypto Intelligence Available:\n• Real-time market analysis\n• Blockchain technology updates\n• Crypto news from verified sources\n• Market trend predictions\n• DeFi and Web3 developments\n\nWhich crypto topic interests you most?`;
    }
    
    if (message.includes('job') || message.includes('career') || message.includes('hiring')) {
      return `💼 **JOB MARKET INTELLIGENCE**\n\nEmployment Data Available:\n• Latest tech job openings\n• AI/ML career opportunities\n• Salary trends in tech industry\n• Remote work opportunities\n• Skills in demand analysis\n\nWhat type of job information are you looking for?`;
    }
    
    if (message.includes('tech') || message.includes('ai') || message.includes('technology')) {
      return `🚀 **TECH INTELLIGENCE NETWORK**\n\nTech Updates Available:\n• AI breakthrough announcements\n• Startup funding news\n• Technology conference updates\n• Innovation trends analysis\n• Industry leader insights\n\nWhich tech sector would you like to explore?`;
    }
    
    if (message.includes('country') || message.includes('global')) {
      return `🌍 **GLOBAL INTELLIGENCE NETWORK**\n\nCountry-Specific Data:\n• Tech developments by country\n• Regional startup ecosystems\n• Government tech policies\n• International trade in tech\n• Global innovation rankings\n\nWhich country's tech scene interests you?`;
    }
    
    // Default focused response
    return `🧠 **QUANTUM CAI FOCUS MODE**\n\nI'm specialized in:\n• 📰 **News & Articles** - Latest tech and global updates\n• 💰 **Crypto Analysis** - Market trends and blockchain news\n• 💼 **Job Market** - Tech career opportunities\n• 🚀 **Technology** - AI, startups, and innovation\n• 🌍 **Global Tech** - Worldwide technology developments\n\nPlease ask me about any of these topics!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate quantum processing
    setTimeout(async () => {
      const aiResponse = await generateQuantumResponse(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <>
      {/* 🚀 QUANTUM CAI FLOATING BUTTON */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(147, 51, 234, 0.5)",
            "0 0 40px rgba(147, 51, 234, 0.8)",
            "0 0 20px rgba(147, 51, 234, 0.5)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        <Brain className="w-8 h-8 text-white" />
        
        {/* Quantum particles around button */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.button>

      {/* 🧠 QUANTUM CHAT INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Cpu className="w-6 h-6 text-purple-400" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Quantum CAI</h3>
                    <p className="text-xs text-purple-300">Tech Intelligence Network</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quantum Level Indicator */}
              <div className="mt-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div className="flex-1 bg-black/30 rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    animate={{ width: `${quantumLevel}%` }}
                  />
                </div>
                <span className="text-xs text-purple-300">{quantumLevel}%</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-800/50 text-gray-100 border border-purple-500/20'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800/50 border border-purple-500/20 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-4 h-4 text-purple-400" />
                      </motion.div>
                      <span className="text-sm text-purple-300">Quantum processing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about news, crypto, tech, jobs..."
                  className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isThinking}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuantumCAIChat;