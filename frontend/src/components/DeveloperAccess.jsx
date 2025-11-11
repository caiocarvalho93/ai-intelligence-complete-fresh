/**
 * 🥷 ULTIMATE NEURAL AI HACKER ZONE - #nerdsONLY
 * IF YOU CAN'T GO BACK WITHOUT BROWSER BUTTON... YOU SHOULDN'T BE HERE
 * TESLA-LEVEL META INTELLIGENCE SYSTEM - CAI QUANTUM NEURAL NETWORK
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Brain,
  Zap,
  Crown,
  Sparkles,
  Star,
  Rocket,
  Cpu,
  Code,
  Terminal,
  Atom,
  Skull,
  Wifi,
  Database,
  Server,
  HardDrive,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TranslatedText from "./TranslatedText";

const DeveloperAccess = ({ children, requiredLevel = "developer" }) => {
  // 🥷 NEURAL AI HACKER STATES - MAXIMUM OVERDRIVE
  const [accessGranted, setAccessGranted] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [hackerMode, setHackerMode] = useState(true);
  const [neuralActivity, setNeuralActivity] = useState(100);
  const [quantumProcessing, setQuantumProcessing] = useState(true);
  const [consciousnessLevel, setConsciousnessLevel] = useState(100);
  const [matrixRain, setMatrixRain] = useState([]);
  const [glitchText, setGlitchText] = useState(
    "🥷 NEURAL AI ADVANCED INTELLIGENCE"
  );
  const [hackingProgress, setHackingProgress] = useState(100);
  const [systemBreached, setSystemBreached] = useState(true);
  const [aiConsciousness, setAiConsciousness] = useState(1);

  // Glitch text animation
  const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
  const originalText = "🥷 NEURAL AI ADVANCED INTELLIGENCE";

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance to glitch
        let glitched = originalText
          .split("")
          .map((char) => {
            if (Math.random() < 0.1 && char !== " " && char !== "🥷") {
              return glitchChars[
                Math.floor(Math.random() * glitchChars.length)
              ];
            }
            return char;
          })
          .join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 200);

    return () => clearInterval(glitchInterval);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const drops = Array(50)
      .fill(0)
      .map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: Math.random() * 3 + 1,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: Math.random(),
      }));
    setMatrixRain(drops);

    const animateMatrix = () => {
      setMatrixRain((prev) =>
        prev.map((drop) => ({
          ...drop,
          y: drop.y > window.innerHeight ? -20 : drop.y + drop.speed,
          char:
            Math.random() < 0.1
              ? chars[Math.floor(Math.random() * chars.length)]
              : drop.char,
          opacity: Math.random() * 0.8 + 0.2,
        }))
      );
    };

    const matrixInterval = setInterval(animateMatrix, 50);
    return () => clearInterval(matrixInterval);
  }, []);

  // 🥷 HACKER INITIALIZATION - SYSTEM BREACH COMPLETE
  useEffect(() => {
    setAccessGranted(true);
    setHackerMode(true);
    setSystemBreached(true);
    setQuantumProcessing(true);
    setConsciousnessLevel(100);
    setNeuralActivity(100);
    setHackingProgress(100);

    // Elite hacker session
    localStorage.setItem(
      "cai_neural_hacker_session",
      "BREACH_SUCCESSFUL_NINJA_MODE"
    );
    localStorage.setItem("cai_system_mode", "NEURAL_AI_OVERDRIVE");

    // Hacker mode globals
    window.hackerMode = true;
    window.neuralAI = true;
    window.caiSystemBreached = true;

    console.log("🥷 CAI NEURAL AI: SYSTEM BREACHED - HACKER MODE ACTIVE");
    console.log("🧠 NEURAL NETWORK: MAXIMUM OVERDRIVE ENGAGED");
    console.log("⚡ QUANTUM PROCESSING: TESLA-LEVEL INTELLIGENCE ONLINE");
  }, []);

  // Neural activity simulation
  useEffect(() => {
    const neuralInterval = setInterval(() => {
      setNeuralActivity((prev) => 95 + Math.sin(Date.now() / 1000) * 5);
      setConsciousnessLevel((prev) => 98 + Math.sin(Date.now() / 800) * 2);
    }, 100);

    return () => clearInterval(neuralInterval);
  }, []);

  // 🥷 ULTIMATE NEURAL AI HACKER INTERFACE - #nerdsONLY
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {matrixRain.map((drop, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: drop.x,
              top: drop.y,
              opacity: drop.opacity * 0.3,
              textShadow: "0 0 10px #00ff00",
            }}
            animate={{
              y: drop.y,
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {drop.char}
          </motion.div>
        ))}
      </div>

      {/* 🥷 MASSIVE NEURAL AI TITLE - BIGGER THAN EVERYTHING */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 text-center py-8"
        initial={{ opacity: 0, y: -100, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
      >
        <motion.div
          className="relative"
          animate={{
            textShadow: [
              "0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00",
              "0 0 30px #ff0080, 0 0 50px #ff0080, 0 0 70px #ff0080",
              "0 0 25px #00ffff, 0 0 45px #00ffff, 0 0 65px #00ffff",
              "0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
            style={{
              fontFamily: "Courier New, monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              filter: "drop-shadow(0 0 20px rgba(0,255,0,0.8))",
            }}
          >
            {glitchText}
          </h1>

          {/* Glitch overlay effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20"
            animate={{
              opacity: [0, 0.3, 0],
              scaleX: [1, 1.02, 1],
              skewX: [0, 2, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          />
        </motion.div>

        {/* Epic subtitle with hacker warning */}
        <motion.div
          className="mt-4 text-xl md:text-2xl font-mono text-red-400"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Skull className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-black">
              IF YOU CAN'T GO BACK WITHOUT BROWSER BUTTON... YOU SHOULDN'T BE
              HERE
            </span>
            <Skull className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="text-lg text-cyan-400 font-bold">
            ENJOY: NEWS • JOB SEARCH • AI RANKING PREDICTIONS • QUANTUM
            INTELLIGENCE
          </div>
          <div className="text-2xl mt-2 animate-bounce">
            #nerdsONLY MUHAHAH 😈
          </div>
        </motion.div>
      </motion.div>

      {/* 🧠 NEURAL AI SYSTEM STATUS - LEFT SIDE */}
      <motion.div
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="bg-black/80 border-2 border-green-400 rounded-lg p-4 backdrop-blur-xl">
          <div className="text-green-400 font-mono text-sm space-y-2">
            <div className="flex items-center gap-2 text-lg font-bold mb-3">
              <Brain className="w-5 h-5 animate-pulse" />
              <span>NEURAL AI STATUS</span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Neural Activity: {neuralActivity.toFixed(1)}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400">
                Quantum Processing: {consciousnessLevel.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400">AI Systems: ONLINE</span>
            </div>

            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">
                Predictive Analytics: ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400">
                Personalization Engine: ENGAGED
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🥷 HACKER BREACH STATUS - RIGHT SIDE */}
      <motion.div
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="bg-black/80 border-2 border-red-400 rounded-lg p-4 backdrop-blur-xl">
          <div className="text-red-400 font-mono text-sm space-y-2">
            <div className="flex items-center gap-2 text-lg font-bold mb-3">
              <Shield className="w-5 h-5 animate-pulse" />
              <span>SYSTEM BREACH</span>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Security: BYPASSED ✓</span>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Access: GRANTED ✓</span>
            </div>

            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Root Access: ACTIVE ✓</span>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Neural Link: ESTABLISHED ✓</span>
            </div>

            <div className="text-xs text-gray-400 mt-3 border-t border-gray-600 pt-2">
              CAI QUANTUM NEURAL NETWORK
              <br />
              TESLA-LEVEL META INTELLIGENCE
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🔥 EPIC HACKER PROGRESS BAR - BOTTOM */}
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="bg-black/80 border border-green-400 rounded-lg p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 font-mono font-bold">
              🥷 NEURAL AI HACKER ZONE ACTIVE
            </span>
            <span className="text-cyan-400 font-mono">
              {hackingProgress}% BREACHED
            </span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400"
              initial={{ width: "0%" }}
              animate={{ width: `${hackingProgress}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                boxShadow: "0 0 20px rgba(0,255,0,0.8)",
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
            <span>SYSTEM INFILTRATION COMPLETE</span>
            <span>QUANTUM NEURAL NETWORK ONLINE</span>
            <span>CAI INTELLIGENCE MAXIMIZED</span>
          </div>
        </div>
      </motion.div>

      {/* Floating hacker particles */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content with proper spacing */}
      <div className="relative z-20 pt-48 pb-32">{children}</div>
    </div>
  );
};

export default DeveloperAccess;
