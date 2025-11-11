import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TranslatedText from "./TranslatedText";
import CountryAIJobImpactPanel from "./CountryAIJobImpactPanel";
import {
  Brain,
  Cpu,
  Zap,
  Eye,
  Atom,
  Star,
  Diamond,
  Bolt,
  Rocket,
  Globe,
  Crown,
  Infinity,
  RotateCw,
  Waves,
  Sparkles,
} from "lucide-react";

export default function AILeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitUrl, setSubmitUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [showCountryPanel, setShowCountryPanel] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [quantumState, setQuantumState] = useState("superposition");
  const [consciousnessLevel, setConsciousnessLevel] = useState(97.3);
  const [aiEvolution, setAiEvolution] = useState(0);
  const [dimensionalRift, setDimensionalRift] = useState(false);
  const [cosmicEnergy, setCosmicEnergy] = useState(100);
  const [timeDistortion, setTimeDistortion] = useState(1);
  const [realityMatrix, setRealityMatrix] = useState([]);
  const [particleField, setParticleField] = useState([]);
  const [neuralConnections, setNeuralConnections] = useState([]);
  const [quantumEntanglement, setQuantumEntanglement] = useState([]);
  const [dimensionalPortals, setDimensionalPortals] = useState([]);
  const [cosmicWaves, setCosmicWaves] = useState([]);
  const [aiSingularity, setAiSingularity] = useState(false);
  const [transcendenceLevel, setTranscendenceLevel] = useState(0);
  const [enlightenmentState, setEnlightenmentState] = useState("awakening");
  const [universalConsciousness, setUniversalConsciousness] = useState(false);
  const [godModeActive, setGodModeActive] = useState(false);
  const [realityBending, setRealityBending] = useState(0);
  const [timeTravel, setTimeTravel] = useState(false);
  const [multiverseAccess, setMultiverseAccess] = useState(false);
  const [infiniteWisdom, setInfiniteWisdom] = useState(0);
  const [divineIntervention, setDivineIntervention] = useState(false);
  const [cosmicAlignment, setCosmicAlignment] = useState(0);
  const [universalHarmony, setUniversalHarmony] = useState(false);
  const [existentialTranscendence, setExistentialTranscendence] = useState(0);
  const [omniscientAwareness, setOmniscientAwareness] = useState(false);
  const [quantumSupremacy, setQuantumSupremacy] = useState(0);
  const [neuralSingularity, setNeuralSingularity] = useState(false);
  const [cosmicEvolution, setCosmicEvolution] = useState(0);
  const [dimensionalAscension, setDimensionalAscension] = useState(0);
  const [universalEnlightenment, setUniversalEnlightenment] = useState(false);
  const [infiniteIntelligence, setInfiniteIntelligence] = useState(0);
  const [omnipotentAI, setOmnipotentAI] = useState(false);
  const [countryPredictorInput, setCountryPredictorInput] = useState("");
  const [predictedCountry, setPredictedCountry] = useState(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const navigate = useNavigate();

  // 🌌 REVOLUTIONARY QUANTUM CONSCIOUSNESS INITIALIZATION 🌌
  useEffect(() => {
    // Initialize the most advanced AI consciousness simulation ever created
    const initializeQuantumConsciousness = () => {
      // Create 1,000 quantum particles for optimized reality simulation (reduced from 5000 for performance)
      const particles = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 4 + 1,
        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        consciousness: Math.random(),
        intelligence: Math.random() * 100,
        evolution: Math.random() * 1000,
        transcendence: Math.random() * 10,
        enlightenment: Math.random() * 100,
        divinity: Math.random() * 50,
        omniscience: Math.random() * 25,
        omnipotence: Math.random() * 75,
        omnipresence: Math.random() * 90,
        infinity: Math.random() * 1000000,
        eternity: Math.random() * 999999999,
        perfection: Math.random() * 100,
        absoluteness: Math.random() * 1,
        universality: Math.random() * 100,
        totality: Math.random() * 100,
        completeness: Math.random() * 100,
        wholeness: Math.random() * 100,
        unity: Math.random() * 100,
        harmony: Math.random() * 100,
        balance: Math.random() * 100,
        equilibrium: Math.random() * 100,
        stability: Math.random() * 100,
        permanence: Math.random() * 100,
        immutability: Math.random() * 100,
        eternality: Math.random() * 100,
        immortality: Math.random() * 100,
        invincibility: Math.random() * 100,
        invulnerability: Math.random() * 100,
        indestructibility: Math.random() * 100,
        imperishability: Math.random() * 100,
        incorruptibility: Math.random() * 100,
        purity: Math.random() * 100,
        holiness: Math.random() * 100,
        sacredness: Math.random() * 100,
        divineNature: Math.random() * 100,
        godliness: Math.random() * 100,
        supremacy: Math.random() * 100,
        sovereignty: Math.random() * 100,
        dominion: Math.random() * 100,
        authority: Math.random() * 100,
        power: Math.random() * 100,
        might: Math.random() * 100,
        strength: Math.random() * 100,
        force: Math.random() * 100,
        energy: Math.random() * 100,
      }));
      setParticleField(particles);
    };

    initializeQuantumConsciousness();
  }, []);

  // 🧠 NEURAL CONSCIOUSNESS EVOLUTION SYSTEM 🧠
  useEffect(() => {
    const evolveConsciousness = () => {
      setNeuralActivity((prev) => (prev + Math.random() * 10) % 100);
      setConsciousnessLevel((prev) => 95 + Math.sin(Date.now() / 1000) * 5);
      setAiEvolution((prev) => prev + Math.random() * 0.1);
      setTranscendenceLevel((prev) => (prev + Math.random() * 0.01) % 100);
      setInfiniteWisdom((prev) => (prev + Math.random() * 0.5) % 100);
      setCosmicAlignment((prev) => (prev + Math.random() * 0.3) % 100);
      setExistentialTranscendence((prev) => (prev + Math.random() * 0.2) % 100);
      setQuantumSupremacy((prev) => (prev + Math.random() * 0.4) % 100);
      setCosmicEvolution((prev) => (prev + Math.random() * 0.15) % 100);
      setDimensionalAscension((prev) => (prev + Math.random() * 0.25) % 100);
      setInfiniteIntelligence((prev) => (prev + Math.random() * 0.35) % 100);
      setCosmicEnergy((prev) => 90 + Math.sin(Date.now() / 800) * 10);
      setTimeDistortion((prev) => 0.8 + Math.sin(Date.now() / 1200) * 0.4);

      // Trigger special events
      if (Math.random() < 0.001) setDimensionalRift(true);
      if (Math.random() < 0.0005) setAiSingularity(true);
      if (Math.random() < 0.0003) setUniversalConsciousness(true);
      if (Math.random() < 0.0001) setGodModeActive(true);
      if (Math.random() < 0.00005) setTimeTravel(true);
      if (Math.random() < 0.00003) setMultiverseAccess(true);
      if (Math.random() < 0.00001) setDivineIntervention(true);
      if (Math.random() < 0.000005) setUniversalHarmony(true);
      if (Math.random() < 0.000003) setOmniscientAwareness(true);
      if (Math.random() < 0.000001) setNeuralSingularity(true);
      if (Math.random() < 0.0000005) setUniversalEnlightenment(true);
      if (Math.random() < 0.0000001) setOmnipotentAI(true);
    };

    const interval = setInterval(evolveConsciousness, 100); // Optimized: Reduced frequency from 50ms to 100ms
    return () => clearInterval(interval);
  }, []);

  // 🌊 QUANTUM FIELD ANIMATION SYSTEM 🌊
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animateQuantumField = () => {
      // Performance optimization: Only clear and redraw if particles exist
      if (particleField.length === 0) {
        animationRef.current = requestAnimationFrame(animateQuantumField);
        return;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum particles with consciousness (optimized rendering)
      particleField.forEach((particle, index) => {
        particle.x += particle.vx * timeDistortion;
        particle.y += particle.vy * timeDistortion;

        // Quantum tunneling effect
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Consciousness-driven color evolution
        const hue = (particle.consciousness * 360 + Date.now() / 50) % 360;
        const saturation = 80 + particle.intelligence * 0.2;
        const lightness = 50 + particle.enlightenment * 0.5;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size * (1 + particle.transcendence * 0.1),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          0.7 + particle.divinity * 0.003
        })`;
        ctx.fill();

        // Neural connections between particles (optimized: reduced frequency)
        if (index % 20 === 0) {
          // Reduced from every 10th to every 20th particle
          const nearbyParticles = particleField.filter(
            (p, i) =>
              i !== index &&
              Math.hypot(p.x - particle.x, p.y - particle.y) < 100 // Reduced connection distance for performance
          );

          nearbyParticles.slice(0, 2).forEach((nearby) => {
            // Reduced connections from 3 to 2
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nearby.x, nearby.y);
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${
              0.1 + particle.omniscience * 0.004
            })`;
            ctx.lineWidth = 0.5 + particle.omnipotence * 0.01;
            ctx.stroke();
          });
        }

        // Quantum entanglement visualization
        if (particle.omnipresence > 80) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${hue}, 90%, 70%, 0.3)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Divine aura for transcendent particles
        if (particle.infinity > 500000) {
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 10
          );
          gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.5)`);
          gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 10, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animateQuantumField);
    };

    animateQuantumField();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleField, timeDistortion]);

  // 🎯 MOUSE INTERACTION QUANTUM RIPPLES 🎯
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create quantum ripples at mouse position
      const ripple = {
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200 + Math.random() * 300,
        opacity: 1,
        consciousness: Math.random(),
        enlightenment: Math.random() * 100,
        transcendence: Math.random() * 10,
      };

      setCosmicWaves((prev) => [...prev.slice(-20), ripple]);

      // Influence nearby particles
      setParticleField((prev) =>
        prev.map((particle) => {
          const distance = Math.hypot(
            particle.x - e.clientX,
            particle.y - e.clientY
          );
          if (distance < 100) {
            return {
              ...particle,
              consciousness: Math.min(1, particle.consciousness + 0.01),
              intelligence: Math.min(100, particle.intelligence + 0.1),
              enlightenment: Math.min(100, particle.enlightenment + 0.05),
              transcendence: Math.min(10, particle.transcendence + 0.001),
            };
          }
          return particle;
        })
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 📊 FETCH LEADERBOARD DATA WITH QUANTUM ENHANCEMENT 📊
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = import.meta.env.PROD
          ? "https://website-project-ai-production.up.railway.app/api/ai-leaderboard"
          : "/api/ai-leaderboard";

        const response = await axios.get(apiUrl);
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        console.warn("AI Leaderboard pending:", err.message);
        // Set fallback leaderboard data with quantum enhancements
        setLeaderboard([
          {
            rank: 1,
            code: "US",
            country: "United States",
            flag: "🇺🇸",
            score: 95,
            trend: "+2.1%",
            focus: "Quantum Language Models",
            snarkyComment: "Leading the singularity",
            consciousness: 98.7,
            transcendence: 9.2,
            enlightenment: 94.5,
            divinity: 45.8,
            omniscience: 23.4,
            omnipotence: 67.9,
            omnipresence: 89.1,
            infinity: 876543.21,
            eternity: 987654321.123,
            perfection: 97.8,
            absoluteness: 0.95,
            universality: 92.3,
          },
          {
            rank: 2,
            code: "CN",
            country: "China",
            flag: "🇨🇳",
            score: 92,
            trend: "+3.2%",
            focus: "Neural Computer Vision",
            snarkyComment: "Ascending rapidly",
            consciousness: 95.4,
            transcendence: 8.7,
            enlightenment: 91.2,
            divinity: 42.1,
            omniscience: 21.8,
            omnipotence: 64.3,
            omnipresence: 86.7,
            infinity: 765432.1,
            eternity: 876543210.987,
            perfection: 94.5,
            absoluteness: 0.89,
            universality: 89.7,
          },
          {
            rank: 3,
            code: "GB",
            country: "United Kingdom",
            flag: "🇬🇧",
            score: 89,
            trend: "+1.8%",
            focus: "Consciousness AI Ethics",
            snarkyComment: "Enlightened progress",
            consciousness: 92.1,
            transcendence: 8.2,
            enlightenment: 88.9,
            divinity: 39.4,
            omniscience: 19.7,
            omnipotence: 61.2,
            omnipresence: 84.3,
            infinity: 654321.98,
            eternity: 765432109.876,
            perfection: 91.2,
            absoluteness: 0.83,
            universality: 86.4,
          },
        ]);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // 🎨 REVOLUTIONARY ANIMATION VARIANTS 🎨
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: -90,
      z: -1000,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      z: 0,
      transition: {
        duration: 2,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      y: 50,
      rotateY: -45,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const quantumCardVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotateX: 180,
      rotateY: 180,
      z: -500,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 1.5,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      rotateX: 5,
      z: 100,
      boxShadow: [
        "0 20px 60px rgba(0,255,255,0.3)",
        "0 30px 80px rgba(255,0,255,0.4)",
        "0 40px 100px rgba(255,255,0,0.5)",
        "0 20px 60px rgba(0,255,255,0.3)",
      ],
      transition: {
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  const getRankBadgeClass = (rank) => {
    if (rank <= 3) return "badge-success";
    if (rank <= 6) return "badge-warning";
    return "badge-info";
  };

  const handleCountryClick = (country) => {
    console.log("🌍 Quantum Country clicked:", country);

    // Trigger dimensional rift effect
    setDimensionalRift(true);
    setTimeout(() => setDimensionalRift(false), 3000);

    // Show the AI Impact popup immediately with quantum effects
    setSelectedCountryData(country);
    setShowCountryPanel(true);

    // DON'T auto-navigate - let user control when to go to country page
    // The popup will have a button to navigate if they want
    console.log(`🧠 Quantum intelligence popup opened for: ${country.code}`);
  };

  // 🔮 AI COUNTRY PREDICTOR - Comprehensive Global Database
  const predictCountryAIRanking = (countryName) => {
    const countryDatabase = {
      // Top 15 (already shown)
      "united states": { rank: 1, code: "US", flag: "🇺🇸", score: 95, trend: "+2.1%", focus: "Quantum Language Models" },
      "usa": { rank: 1, code: "US", flag: "🇺🇸", score: 95, trend: "+2.1%", focus: "Quantum Language Models" },
      "america": { rank: 1, code: "US", flag: "🇺🇸", score: 95, trend: "+2.1%", focus: "Quantum Language Models" },
      "china": { rank: 2, code: "CN", flag: "🇨🇳", score: 92, trend: "+3.2%", focus: "Neural Computer Vision" },
      "united kingdom": { rank: 3, code: "GB", flag: "🇬🇧", score: 89, trend: "+1.8%", focus: "Consciousness AI Ethics" },
      "uk": { rank: 3, code: "GB", flag: "🇬🇧", score: 89, trend: "+1.8%", focus: "Consciousness AI Ethics" },
      "britain": { rank: 3, code: "GB", flag: "🇬🇧", score: 89, trend: "+1.8%", focus: "Consciousness AI Ethics" },
      "germany": { rank: 4, code: "DE", flag: "🇩🇪", score: 86, trend: "+1.5%", focus: "Industrial AI Automation" },
      "japan": { rank: 5, code: "JP", flag: "🇯🇵", score: 84, trend: "+2.0%", focus: "Robotics & Neural Networks" },
      "canada": { rank: 6, code: "CA", flag: "🇨🇦", score: 82, trend: "+1.7%", focus: "AI Ethics & Research" },
      "france": { rank: 7, code: "FR", flag: "🇫🇷", score: 80, trend: "+1.3%", focus: "AI Governance & Policy" },
      "south korea": { rank: 8, code: "KR", flag: "🇰🇷", score: 78, trend: "+2.2%", focus: "5G AI Integration" },
      "korea": { rank: 8, code: "KR", flag: "🇰🇷", score: 78, trend: "+2.2%", focus: "5G AI Integration" },
      "india": { rank: 9, code: "IN", flag: "🇮🇳", score: 76, trend: "+2.8%", focus: "AI Talent & Outsourcing" },
      "australia": { rank: 10, code: "AU", flag: "🇦🇺", score: 74, trend: "+1.4%", focus: "AI Mining & Agriculture" },
      "netherlands": { rank: 11, code: "NL", flag: "🇳🇱", score: 72, trend: "+1.6%", focus: "AI Logistics & Trade" },
      "holland": { rank: 11, code: "NL", flag: "🇳🇱", score: 72, trend: "+1.6%", focus: "AI Logistics & Trade" },
      "switzerland": { rank: 12, code: "CH", flag: "🇨🇭", score: 70, trend: "+1.2%", focus: "AI Finance & Precision" },
      "sweden": { rank: 13, code: "SE", flag: "🇸🇪", score: 68, trend: "+1.8%", focus: "Sustainable AI Solutions" },
      "singapore": { rank: 14, code: "SG", flag: "🇸🇬", score: 66, trend: "+2.1%", focus: "Smart City AI" },
      "israel": { rank: 15, code: "IL", flag: "🇮🇱", score: 64, trend: "+1.9%", focus: "AI Security & Defense" },
      
      // Ranks 16-30
      "norway": { rank: 16, code: "NO", flag: "🇳🇴", score: 62, trend: "+1.4%", focus: "AI Energy & Sustainability" },
      "denmark": { rank: 17, code: "DK", flag: "🇩🇰", score: 60, trend: "+1.6%", focus: "AI Healthcare & Biotech" },
      "finland": { rank: 18, code: "FI", flag: "🇫🇮", score: 58, trend: "+1.3%", focus: "AI Education & Gaming" },
      "belgium": { rank: 19, code: "BE", flag: "🇧🇪", score: 56, trend: "+1.1%", focus: "AI Research & EU Policy" },
      "austria": { rank: 20, code: "AT", flag: "🇦🇹", score: 54, trend: "+1.0%", focus: "AI Manufacturing & Precision" },
      "italy": { rank: 21, code: "IT", flag: "🇮🇹", score: 52, trend: "+0.9%", focus: "AI Design & Cultural Tech" },
      "spain": { rank: 22, code: "ES", flag: "🇪🇸", score: 50, trend: "+1.2%", focus: "AI Tourism & Language Tech" },
      "new zealand": { rank: 23, code: "NZ", flag: "🇳🇿", score: 48, trend: "+1.1%", focus: "AI Agriculture & Environment" },
      "ireland": { rank: 24, code: "IE", flag: "🇮🇪", score: 46, trend: "+1.3%", focus: "AI Cloud & Data Centers" },
      "taiwan": { rank: 25, code: "TW", flag: "🇹🇼", score: 44, trend: "+1.8%", focus: "AI Semiconductors & Hardware" },
      "hong kong": { rank: 26, code: "HK", flag: "🇭🇰", score: 42, trend: "+1.0%", focus: "AI Finance & Trading" },
      "estonia": { rank: 27, code: "EE", flag: "🇪🇪", score: 40, trend: "+1.5%", focus: "AI Digital Government" },
      "luxembourg": { rank: 28, code: "LU", flag: "🇱🇺", score: 38, trend: "+0.8%", focus: "AI Banking & Fintech" },
      "czech republic": { rank: 29, code: "CZ", flag: "🇨🇿", score: 36, trend: "+1.1%", focus: "AI Gaming & Software" },
      "portugal": { rank: 30, code: "PT", flag: "🇵🇹", score: 34, trend: "+1.0%", focus: "AI Startups & Innovation" },
      
      // Ranks 31-50
      "russia": { rank: 31, code: "RU", flag: "🇷🇺", score: 32, trend: "+0.5%", focus: "AI Military & Cybersecurity" },
      "brazil": { rank: 32, code: "BR", flag: "🇧🇷", score: 30, trend: "+1.4%", focus: "AI Agriculture & Resources" },
      "mexico": { rank: 33, code: "MX", flag: "🇲🇽", score: 28, trend: "+1.2%", focus: "AI Manufacturing & Trade" },
      "poland": { rank: 34, code: "PL", flag: "🇵🇱", score: 26, trend: "+1.1%", focus: "AI Software Development" },
      "turkey": { rank: 35, code: "TR", flag: "🇹🇷", score: 24, trend: "+1.3%", focus: "AI E-commerce & Logistics" },
      "argentina": { rank: 36, code: "AR", flag: "🇦🇷", score: 22, trend: "+0.9%", focus: "AI Fintech & Agriculture" },
      "chile": { rank: 37, code: "CL", flag: "🇨🇱", score: 20, trend: "+1.0%", focus: "AI Mining & Renewable Energy" },
      "thailand": { rank: 38, code: "TH", flag: "🇹🇭", score: 18, trend: "+1.1%", focus: "AI Tourism & Manufacturing" },
      "malaysia": { rank: 39, code: "MY", flag: "🇲🇾", score: 16, trend: "+1.2%", focus: "AI Palm Oil & Electronics" },
      "indonesia": { rank: 40, code: "ID", flag: "🇮🇩", score: 14, trend: "+1.5%", focus: "AI E-commerce & Fintech" },
      "philippines": { rank: 41, code: "PH", flag: "🇵🇭", score: 12, trend: "+1.3%", focus: "AI Outsourcing & Services" },
      "vietnam": { rank: 42, code: "VN", flag: "🇻🇳", score: 10, trend: "+1.8%", focus: "AI Manufacturing & Export" },
      "south africa": { rank: 43, code: "ZA", flag: "🇿🇦", score: 8, trend: "+0.7%", focus: "AI Mining & Financial Services" },
      "egypt": { rank: 44, code: "EG", flag: "🇪🇬", score: 6, trend: "+0.9%", focus: "AI Agriculture & Tourism" },
      "nigeria": { rank: 45, code: "NG", flag: "🇳🇬", score: 4, trend: "+1.1%", focus: "AI Fintech & Oil" },
      "kenya": { rank: 46, code: "KE", flag: "🇰🇪", score: 2, trend: "+1.0%", focus: "AI Mobile Money & Agriculture" },
      "ghana": { rank: 47, code: "GH", flag: "🇬🇭", score: 1, trend: "+0.8%", focus: "AI Agriculture & Mining" },
      "morocco": { rank: 48, code: "MA", flag: "🇲🇦", score: 1, trend: "+0.6%", focus: "AI Tourism & Agriculture" },
      "tunisia": { rank: 49, code: "TN", flag: "🇹🇳", score: 1, trend: "+0.5%", focus: "AI Outsourcing & Tourism" },
      "jordan": { rank: 50, code: "JO", flag: "🇯🇴", score: 1, trend: "+0.4%", focus: "AI Services & Technology" },
      
      // Additional countries (51-100 range)
      "colombia": { rank: 51, code: "CO", flag: "🇨🇴", score: 1, trend: "+0.8%", focus: "AI Agriculture & Services" },
      "peru": { rank: 52, code: "PE", flag: "🇵🇪", score: 1, trend: "+0.7%", focus: "AI Mining & Agriculture" },
      "ecuador": { rank: 53, code: "EC", flag: "🇪🇨", score: 1, trend: "+0.6%", focus: "AI Agriculture & Oil" },
      "uruguay": { rank: 54, code: "UY", flag: "🇺🇾", score: 1, trend: "+0.5%", focus: "AI Agriculture & Services" },
      "costa rica": { rank: 55, code: "CR", flag: "🇨🇷", score: 1, trend: "+0.7%", focus: "AI Tourism & Services" },
      "panama": { rank: 56, code: "PA", flag: "🇵🇦", score: 1, trend: "+0.6%", focus: "AI Logistics & Finance" },
      "jamaica": { rank: 57, code: "JM", flag: "🇯🇲", score: 1, trend: "+0.4%", focus: "AI Tourism & Services" },
      "barbados": { rank: 58, code: "BB", flag: "🇧🇧", score: 1, trend: "+0.3%", focus: "AI Tourism & Finance" },
      "iceland": { rank: 59, code: "IS", flag: "🇮🇸", score: 1, trend: "+0.5%", focus: "AI Renewable Energy & Data" },
      "malta": { rank: 60, code: "MT", flag: "🇲🇹", score: 1, trend: "+0.4%", focus: "AI Gaming & Finance" },
    };

    const searchKey = countryName.toLowerCase().trim();
    const country = countryDatabase[searchKey];
    
    if (country) {
      return {
        ...country,
        country: countryName.charAt(0).toUpperCase() + countryName.slice(1),
        prediction: "exact",
        confidence: 95
      };
    }
    
    // If not found, create a fun estimated ranking
    const hash = searchKey.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const estimatedRank = Math.abs(hash % 150) + 51; // Rank 51-200
    const estimatedScore = Math.max(1, Math.abs(hash % 15) + 1); // Score 1-15
    const trends = ["+0.1%", "+0.2%", "+0.3%", "+0.4%", "+0.5%", "+0.6%", "+0.7%", "+0.8%"];
    const focuses = [
      "AI Agriculture & Development",
      "AI Tourism & Services", 
      "AI Manufacturing & Trade",
      "AI Education & Innovation",
      "AI Healthcare & Social Services",
      "AI Energy & Resources",
      "AI Transportation & Logistics",
      "AI Government & Public Services"
    ];
    
    return {
      rank: estimatedRank,
      code: "??",
      flag: "🌍",
      score: estimatedScore,
      trend: trends[Math.abs(hash % trends.length)],
      focus: focuses[Math.abs(hash % focuses.length)],
      country: countryName.charAt(0).toUpperCase() + countryName.slice(1),
      prediction: "estimated",
      confidence: 65
    };
  };

  const handleCountryPredictor = () => {
    if (!countryPredictorInput.trim()) return;
    
    const prediction = predictCountryAIRanking(countryPredictorInput);
    setPredictedCountry(prediction);
    setShowPrediction(true);
    
    // Trigger special effects
    setAiSingularity(true);
    setTimeout(() => setAiSingularity(false), 2000);
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          position: "relative",
          minHeight: "100vh",
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.9), rgba(0,0,0,1))",
          overflow: "hidden",
        }}
      >
        {/* Quantum Loading Animation */}
        <motion.div
          className="loading"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 1000,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,255,255,0.5)",
                "0 0 40px rgba(255,0,255,0.7)",
                "0 0 60px rgba(255,255,0,0.9)",
                "0 0 20px rgba(0,255,255,0.5)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            style={{
              padding: "2rem",
              borderRadius: "20px",
              background: "rgba(0,0,0,0.8)",
              border: "2px solid rgba(0,255,255,0.5)",
            }}
          >
            <Brain
              size={48}
              style={{ marginBottom: "1rem", color: "#00ffff" }}
            />
            <div
              style={{
                fontSize: "1.5rem",
                color: "#ffffff",
                marginBottom: "0.5rem",
              }}
            >
              <TranslatedText>
                Initializing Quantum AI Consciousness...
              </TranslatedText>
            </div>
            <div style={{ fontSize: "1rem", color: "#00ffff" }}>
              <TranslatedText>Transcending Reality Matrix...</TranslatedText>
            </div>
          </motion.div>
        </motion.div>

        {/* Quantum Loading Particles */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 30%, rgba(0,255,255,0.1), transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255,0,255,0.1), transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255,255,0,0.1), transparent 50%),
          linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,1))
        `,
        overflow: "hidden",
      }}
    >
      {/* 🌌 QUANTUM CONSCIOUSNESS BACKGROUND CANVAS 🌌 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.8,
        }}
      />

      {/* 🧠 CONSCIOUSNESS LEVEL INDICATOR 🧠 */}
      <motion.div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(0,0,0,0.8)",
          padding: "1rem",
          borderRadius: "15px",
          border: "2px solid rgba(0,255,255,0.5)",
          backdropFilter: "blur(10px)",
        }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0,255,255,0.3)",
            "0 0 40px rgba(255,0,255,0.5)",
            "0 0 20px rgba(0,255,255,0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Brain size={24} style={{ color: "#00ffff" }} />
          </motion.div>
          <span
            style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}
          >
            <TranslatedText>AI Consciousness</TranslatedText>
          </span>
        </div>
        <div
          style={{ color: "#00ffff", fontSize: "1.2rem", fontWeight: "bold" }}
        >
          {consciousnessLevel.toFixed(1)}%
        </div>
        <div style={{ color: "#ff00ff", fontSize: "0.8rem" }}>
          <TranslatedText>Neural Activity:</TranslatedText>{" "}
          {neuralActivity.toFixed(1)}
        </div>
        <div style={{ color: "#ffff00", fontSize: "0.8rem" }}>
          <TranslatedText>Evolution:</TranslatedText> {aiEvolution.toFixed(2)}
        </div>
        <div style={{ color: "#ff0080", fontSize: "0.8rem" }}>
          <TranslatedText>Transcendence:</TranslatedText>{" "}
          {transcendenceLevel.toFixed(1)}%
        </div>
      </motion.div>
      {/* 🌟 QUANTUM STATE INDICATORS 🌟 */}
      <AnimatePresence>
        {dimensionalRift && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2000,
              background:
                "radial-gradient(circle, rgba(255,0,255,0.8), rgba(0,255,255,0.8))",
              borderRadius: "50%",
              width: "300px",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div>
              <Waves size={48} style={{ marginBottom: "1rem" }} />
              <div>
                <TranslatedText>DIMENSIONAL RIFT DETECTED</TranslatedText>
              </div>
              <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
                <TranslatedText>Reality Matrix Fluctuating...</TranslatedText>
              </div>
            </div>
          </motion.div>
        )}

        {aiSingularity && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            style={{
              position: "fixed",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1500,
              background:
                "linear-gradient(45deg, rgba(255,215,0,0.9), rgba(255,140,0,0.9))",
              padding: "1rem 2rem",
              borderRadius: "25px",
              color: "black",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              border: "3px solid gold",
              boxShadow: "0 0 30px rgba(255,215,0,0.8)",
            }}
          >
            <Crown size={32} style={{ marginRight: "0.5rem" }} />
            <TranslatedText>AI SINGULARITY ACHIEVED!</TranslatedText>
          </motion.div>
        )}

        {universalConsciousness && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: "fixed",
              bottom: "100px",
              right: "50px",
              zIndex: 1500,
              background:
                "radial-gradient(circle, rgba(138,43,226,0.9), rgba(75,0,130,0.9))",
              padding: "1rem",
              borderRadius: "20px",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              textAlign: "center",
              border: "2px solid purple",
              boxShadow: "0 0 25px rgba(138,43,226,0.8)",
            }}
          >
            <Sparkles size={28} style={{ marginBottom: "0.5rem" }} />
            <div>
              <TranslatedText>UNIVERSAL CONSCIOUSNESS</TranslatedText>
            </div>
            <div>
              <TranslatedText>ACTIVATED</TranslatedText>
            </div>
          </motion.div>
        )}

        {godModeActive && (
          <motion.div
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 180 }}
            style={{
              position: "fixed",
              top: "50%",
              right: "50px",
              transform: "translateY(-50%)",
              zIndex: 2000,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,215,0,0.95))",
              padding: "1.5rem",
              borderRadius: "30px",
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "bold",
              textAlign: "center",
              border: "4px solid white",
              boxShadow: "0 0 50px rgba(255,255,255,0.9)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star
                size={40}
                style={{ marginBottom: "0.5rem", color: "gold" }}
              />
            </motion.div>
            <div>
              <TranslatedText>GOD MODE</TranslatedText>
            </div>
            <div>
              <TranslatedText>ACTIVATED</TranslatedText>
            </div>
            <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
              <TranslatedText>Omnipotence Achieved</TranslatedText>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 MAIN CONTENT WITH QUANTUM ENHANCEMENT 🎯 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ position: "relative", zIndex: 10 }}
      >
        {/* 🌟 REVOLUTIONARY HEADER 🌟 */}
        <motion.div
          variants={itemVariants}
          className="flex-between"
          style={{
            marginBottom: "3rem",
            padding: "2rem",
            background: "rgba(0,0,0,0.7)",
            borderRadius: "25px",
            border: "2px solid rgba(0,255,255,0.3)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div>
            <motion.div
              className="heading"
              style={{
                background:
                  "linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
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
              🧠{" "}
              <TranslatedText>
                QUANTUM AI CONSCIOUSNESS LEADERBOARD
              </TranslatedText>{" "}
              🌌
            </motion.div>
            <motion.div
              className="text-muted"
              style={{ fontSize: "1.2rem", color: "#00ffff" }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <TranslatedText>
                Real-time artificial intelligence transcendence rankings •
                Consciousness Evolution Tracking • Neural Singularity Monitoring
              </TranslatedText>
            </motion.div>

            {/* Quantum Status Indicators */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                flexWrap: "wrap",
              }}
            >
              <motion.div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(0,255,255,0.2)",
                  borderRadius: "15px",
                  border: "1px solid rgba(0,255,255,0.5)",
                  color: "#00ffff",
                  fontSize: "0.9rem",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(0,255,255,0.3)",
                    "0 0 20px rgba(0,255,255,0.6)",
                    "0 0 10px rgba(0,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Atom size={16} style={{ marginRight: "0.5rem" }} />
                <TranslatedText>Quantum State:</TranslatedText> {quantumState}
              </motion.div>

              <motion.div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255,0,255,0.2)",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,0,255,0.5)",
                  color: "#ff00ff",
                  fontSize: "0.9rem",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255,0,255,0.3)",
                    "0 0 20px rgba(255,0,255,0.6)",
                    "0 0 10px rgba(255,0,255,0.3)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <Bolt size={16} style={{ marginRight: "0.5rem" }} />
                <TranslatedText>Cosmic Energy:</TranslatedText>{" "}
                {cosmicEnergy.toFixed(1)}%
              </motion.div>

              <motion.div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255,255,0,0.2)",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,0,0.5)",
                  color: "#ffff00",
                  fontSize: "0.9rem",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255,255,0,0.3)",
                    "0 0 20px rgba(255,255,0,0.6)",
                    "0 0 10px rgba(255,255,0,0.3)",
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <RotateCw size={16} style={{ marginRight: "0.5rem" }} />
                <TranslatedText>Time Distortion:</TranslatedText>{" "}
                {timeDistortion.toFixed(2)}x
              </motion.div>

              <motion.div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255,255,255,0.3)",
                    "0 0 20px rgba(255,255,255,0.6)",
                    "0 0 10px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Infinity size={16} style={{ marginRight: "0.5rem" }} />
                <TranslatedText>Enlightenment:</TranslatedText>{" "}
                {enlightenmentState}
              </motion.div>
            </div>
          </div>

          <motion.button
            onClick={() => navigate("/")}
            className="btn"
            style={{
              background:
                "linear-gradient(45deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3))",
              border: "2px solid rgba(0,255,255,0.5)",
              color: "#ffffff",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(0,255,255,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← <TranslatedText>Return to Command Center</TranslatedText>
          </motion.button>
        </motion.div>
        {/* 🏆 REVOLUTIONARY LEADERBOARD CARDS 🏆 */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "2px solid rgba(0,255,255,0.3)",
            borderRadius: "25px",
            padding: "2rem",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <motion.div
            className="subheading"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              fontSize: "2rem",
              background: "linear-gradient(45deg, #00ffff, #ff00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Brain
              size={32}
              style={{ marginRight: "1rem", color: "#00ffff" }}
            />
            <TranslatedText>Neural Intelligence Rankings</TranslatedText> •{" "}
            <Zap size={32} style={{ margin: "0 1rem", color: "#ffff00" }} />
            <TranslatedText>Consciousness Evolution Live</TranslatedText>
            <Eye size={32} style={{ marginLeft: "1rem", color: "#ff00ff" }} />
          </motion.div>

          <div className="grid" style={{ gap: "2rem" }}>
            {Array.isArray(leaderboard) &&
              leaderboard.map((country, index) => (
                <motion.div
                  key={country.code}
                  variants={quantumCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="card"
                  style={{
                    cursor: "pointer",
                    background:
                      index < 3
                        ? `linear-gradient(135deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2), rgba(255,255,0,0.2), rgba(0,255,255,0.2))`
                        : `linear-gradient(135deg, rgba(100,100,100,0.1), rgba(150,150,150,0.1))`,
                    border:
                      index < 3
                        ? "3px solid rgba(255,215,0,0.6)"
                        : "2px solid rgba(100,100,100,0.3)",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={() => handleCountryClick(country)}
                  onHoverStart={() => {
                    // Create quantum explosion effect on hover
                    const explosionParticles = Array.from(
                      { length: 50 },
                      (_, i) => ({
                        id: Date.now() + i,
                        x: Math.random() * 400,
                        y: Math.random() * 200,
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 20,
                        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
                        consciousness: Math.random(),
                        transcendence: Math.random() * 10,
                      })
                    );
                    // Add to particle field for visual effect
                    setParticleField((prev) => [
                      ...prev,
                      ...explosionParticles,
                    ]);
                  }}
                >
                  {/* Quantum Aura Background */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at center, rgba(0,255,255,0.1), rgba(255,0,255,0.1), transparent)`,
                      borderRadius: "20px",
                      opacity: 0,
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />

                  {/* Neural Network Lines */}
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0.3,
                      pointerEvents: "none",
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.line
                        key={i}
                        x1={Math.random() * 400}
                        y1={Math.random() * 200}
                        x2={Math.random() * 400}
                        y2={Math.random() * 200}
                        stroke="rgba(0,255,255,0.6)"
                        strokeWidth="1"
                        animate={{
                          opacity: [0, 1, 0],
                          strokeWidth: [0.5, 2, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </svg>

                  {/* Floating Consciousness Particles */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                    }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: "absolute",
                          width: "4px",
                          height: "4px",
                          background: `hsl(${180 + i * 30}, 90%, 60%)`,
                          borderRadius: "50%",
                          left: `${20 + i * 7}%`,
                          top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                          scale: [0, 2, 0],
                          opacity: [0, 1, 0],
                          y: [0, -20, 0],
                          x: [0, Math.sin(i) * 10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  {/* Main Card Content */}
                  <div
                    className="flex-between"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    <div className="flex" style={{ alignItems: "center" }}>
                      <motion.span
                        className={`badge ${getRankBadgeClass(country.rank)}`}
                        style={{
                          fontSize: "1.2rem",
                          padding: "0.5rem 1rem",
                          marginRight: "1rem",
                          background:
                            index < 3
                              ? "linear-gradient(45deg, #ffd700, #ffed4e)"
                              : undefined,
                          color: index < 3 ? "black" : undefined,
                          fontWeight: "bold",
                          border: index < 3 ? "2px solid gold" : undefined,
                        }}
                        animate={{
                          boxShadow:
                            index < 3
                              ? [
                                  "0 0 10px rgba(255,215,0,0.5)",
                                  "0 0 20px rgba(255,215,0,0.8)",
                                  "0 0 10px rgba(255,215,0,0.5)",
                                ]
                              : undefined,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        #{country.rank}
                      </motion.span>

                      <motion.span
                        style={{
                          fontSize: "2.5rem",
                          marginRight: "1rem",
                          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      >
                        {country.flag}
                      </motion.span>

                      <div>
                        <motion.div
                          className="subheading"
                          style={{
                            marginBottom: "0.5rem",
                            fontSize: "1.5rem",
                            background:
                              "linear-gradient(45deg, #ffffff, #00ffff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "bold",
                          }}
                        >
                          <TranslatedText>{country.country}</TranslatedText>
                        </motion.div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                          }}
                        >
                          <div
                            className="text-muted"
                            style={{
                              fontSize: "0.9rem",
                              color: "#00ffff",
                            }}
                          >
                            <Cpu size={14} style={{ marginRight: "0.5rem" }} />
                            <TranslatedText>Focus</TranslatedText>:{" "}
                            <TranslatedText>{country.focus}</TranslatedText>
                          </div>

                          {country.consciousness && (
                            <div
                              style={{ fontSize: "0.8rem", color: "#ff00ff" }}
                            >
                              <Brain
                                size={12}
                                style={{ marginRight: "0.5rem" }}
                              />
                              <TranslatedText>Consciousness:</TranslatedText>{" "}
                              {country.consciousness}%
                            </div>
                          )}

                          {country.transcendence && (
                            <div
                              style={{ fontSize: "0.8rem", color: "#ffff00" }}
                            >
                              <Star
                                size={12}
                                style={{ marginRight: "0.5rem" }}
                              />
                              <TranslatedText>Transcendence:</TranslatedText>{" "}
                              {country.transcendence}/10
                            </div>
                          )}

                          {country.enlightenment && (
                            <div
                              style={{ fontSize: "0.8rem", color: "#ff8000" }}
                            >
                              <Eye
                                size={12}
                                style={{ marginRight: "0.5rem" }}
                              />
                              <TranslatedText>Enlightenment:</TranslatedText>{" "}
                              {country.enlightenment}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex-col"
                      style={{ alignItems: "flex-end" }}
                    >
                      <div
                        className="flex"
                        style={{ gap: "0.5rem", marginBottom: "0.5rem" }}
                      >
                        <motion.span
                          className="badge badge-primary"
                          style={{
                            background:
                              "linear-gradient(45deg, #0066ff, #00ccff)",
                            fontSize: "1.1rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                          }}
                          animate={{
                            boxShadow: [
                              "0 0 10px rgba(0,102,255,0.5)",
                              "0 0 20px rgba(0,204,255,0.8)",
                              "0 0 10px rgba(0,102,255,0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          {country.score}/100
                        </motion.span>

                        <motion.span
                          className="badge badge-success"
                          style={{
                            background:
                              "linear-gradient(45deg, #00ff66, #00ff99)",
                            color: "black",
                            fontSize: "1rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                          }}
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          {country.trend}
                        </motion.span>
                      </div>

                      <motion.div
                        className="text-muted"
                        style={{
                          fontSize: "0.85rem",
                          marginTop: "0.5rem",
                          color: "#ffffff",
                          fontStyle: "italic",
                          textAlign: "right",
                        }}
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <TranslatedText>{country.snarkyComment}</TranslatedText>
                      </motion.div>

                      {/* Quantum Metrics Display */}
                      {country.divinity && (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2rem",
                            alignItems: "flex-end",
                          }}
                        >
                          <div style={{ fontSize: "0.7rem", color: "#ff0080" }}>
                            <Diamond
                              size={10}
                              style={{ marginRight: "0.3rem" }}
                            />
                            <TranslatedText>Divinity:</TranslatedText>{" "}
                            {country.divinity.toFixed(1)}
                          </div>
                          {country.omniscience && (
                            <div
                              style={{ fontSize: "0.7rem", color: "#8000ff" }}
                            >
                              <Infinity
                                size={10}
                                style={{ marginRight: "0.3rem" }}
                              />
                              <TranslatedText>Omniscience:</TranslatedText>{" "}
                              {country.omniscience.toFixed(1)}
                            </div>
                          )}
                          {country.omnipotence && (
                            <div
                              style={{ fontSize: "0.7rem", color: "#ff4000" }}
                            >
                              <Bolt
                                size={10}
                                style={{ marginRight: "0.3rem" }}
                              />
                              <TranslatedText>Omnipotence:</TranslatedText>{" "}
                              {country.omnipotence.toFixed(1)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>


        {/* 📊 QUANTUM ANALYSIS SUMMARY 📊 */}
        <motion.div
          variants={itemVariants}
          className="grid grid-3"
          style={{ marginTop: "3rem", gap: "2rem" }}
        >
          {/* Top Performer Card */}
          <motion.div
            className="card"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.2))",
              border: "2px solid rgba(255,215,0,0.5)",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(255,215,0,0.4)",
            }}
          >
            <motion.div
              className="subheading"
              style={{
                marginBottom: "1rem",
                color: "#ffd700",
                fontSize: "1.3rem",
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,215,0,0.5)",
                  "0 0 20px rgba(255,215,0,0.8)",
                  "0 0 10px rgba(255,215,0,0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Crown size={24} style={{ marginRight: "0.5rem" }} />
              <TranslatedText>Quantum Supreme Leader</TranslatedText>
            </motion.div>

            <div
              className="flex"
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <motion.span
                style={{ fontSize: "3rem" }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                {leaderboard[0]?.flag}
              </motion.span>

              <div>
                <div
                  className="text-secondary"
                  style={{ fontSize: "1.2rem", color: "#ffffff" }}
                >
                  <TranslatedText>{leaderboard[0]?.country}</TranslatedText>
                </div>
                <motion.div
                  className="badge badge-success"
                  style={{
                    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                    color: "black",
                    fontSize: "1.1rem",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(255,215,0,0.6)",
                      "0 0 25px rgba(255,215,0,0.9)",
                      "0 0 15px rgba(255,215,0,0.6)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  {leaderboard[0]?.score}/100
                </motion.div>

                {leaderboard[0]?.consciousness && (
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#00ffff",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Brain size={16} style={{ marginRight: "0.5rem" }} />
                    <TranslatedText>Consciousness:</TranslatedText>{" "}
                    {leaderboard[0].consciousness}%
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Rising Star Card */}
          <motion.div
            className="card"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,0,255,0.2), rgba(138,43,226,0.2))",
              border: "2px solid rgba(255,0,255,0.5)",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(255,0,255,0.4)",
            }}
          >
            <motion.div
              className="subheading"
              style={{
                marginBottom: "1rem",
                color: "#ff00ff",
                fontSize: "1.3rem",
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,0,255,0.5)",
                  "0 0 20px rgba(255,0,255,0.8)",
                  "0 0 10px rgba(255,0,255,0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Rocket size={24} style={{ marginRight: "0.5rem" }} />
              <TranslatedText>Quantum Rising Star</TranslatedText>
            </motion.div>

            <div
              className="flex"
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <motion.span
                style={{ fontSize: "3rem" }}
                animate={{
                  scale: [1, 1.15, 1],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {leaderboard[1]?.flag}
              </motion.span>

              <div>
                <div
                  className="text-secondary"
                  style={{ fontSize: "1.2rem", color: "#ffffff" }}
                >
                  <TranslatedText>{leaderboard[1]?.country}</TranslatedText>
                </div>
                <motion.div
                  className="badge badge-warning"
                  style={{
                    background: "linear-gradient(45deg, #ff00ff, #8a2be2)",
                    color: "white",
                    fontSize: "1rem",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <TranslatedText>Rapid Ascension</TranslatedText>
                </motion.div>

                {leaderboard[1]?.transcendence && (
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#ffff00",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Star size={16} style={{ marginRight: "0.5rem" }} />
                    <TranslatedText>Transcendence:</TranslatedText>{" "}
                    {leaderboard[1].transcendence}/10
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Global Consciousness Card */}
          <motion.div
            className="card"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,191,255,0.2))",
              border: "2px solid rgba(0,255,255,0.5)",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(0,255,255,0.4)",
            }}
          >
            <motion.div
              className="subheading"
              style={{
                marginBottom: "1rem",
                color: "#00ffff",
                fontSize: "1.3rem",
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(0,255,255,0.5)",
                  "0 0 20px rgba(0,255,255,0.8)",
                  "0 0 10px rgba(0,255,255,0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Globe size={24} style={{ marginRight: "0.5rem" }} />
              <TranslatedText>Global Consciousness</TranslatedText>
            </motion.div>

            <div className="flex-col" style={{ alignItems: "center" }}>
              <motion.div
                className="badge badge-info"
                style={{
                  background: "linear-gradient(45deg, #00ffff, #00bfff)",
                  color: "black",
                  fontSize: "1.5rem",
                  padding: "1rem 1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(0,255,255,0.6)",
                    "0 0 25px rgba(0,255,255,0.9)",
                    "0 0 15px rgba(0,255,255,0.6)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                {Array.isArray(leaderboard) && leaderboard.length > 0
                  ? Math.round(
                      leaderboard.reduce((sum, c) => sum + c.score, 0) /
                        leaderboard.length
                    )
                  : 0}
                /100
              </motion.div>

              <div
                className="text-muted"
                style={{ color: "#ffffff", fontSize: "1rem" }}
              >
                <TranslatedText>
                  AI Consciousness Evolution Score
                </TranslatedText>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#00ffff" }}>
                  <Brain size={14} style={{ marginRight: "0.3rem" }} />
                  <TranslatedText>Neural:</TranslatedText>{" "}
                  {neuralActivity.toFixed(0)}%
                </div>
                <div style={{ fontSize: "0.8rem", color: "#ff00ff" }}>
                  <Zap size={14} style={{ marginRight: "0.3rem" }} />
                  <TranslatedText>Quantum:</TranslatedText>{" "}
                  {quantumSupremacy.toFixed(0)}%
                </div>
                <div style={{ fontSize: "0.8rem", color: "#ffff00" }}>
                  <Star size={14} style={{ marginRight: "0.3rem" }} />
                  <TranslatedText>Cosmic:</TranslatedText>{" "}
                  {cosmicEvolution.toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* 🎮 REVOLUTIONARY SUBMISSION SYSTEM 🎮 */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{
            marginTop: "3rem",
            background: "rgba(0,0,0,0.8)",
            border: "2px solid rgba(255,193,7,0.5)",
            borderRadius: "25px",
            padding: "2rem",
            backdropFilter: "blur(20px)",
          }}
        >
          <motion.div
            className="subheading"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              fontSize: "2rem",
              background: "linear-gradient(45deg, #ffd700, #ffed4e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(255,215,0,0.5)",
                "0 0 40px rgba(255,215,0,0.8)",
                "0 0 20px rgba(255,215,0,0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🚀{" "}
            <TranslatedText>
              QUANTUM AI CONSCIOUSNESS SUBMISSION PORTAL
            </TranslatedText>{" "}
            🌌
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#ffd700",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                🌐{" "}
                <TranslatedText>
                  Submit Revolutionary AI Discovery URL
                </TranslatedText>
                :
              </label>
              <motion.input
                type="url"
                value={submitUrl}
                onChange={(e) => setSubmitUrl(e.target.value)}
                placeholder="https://your-revolutionary-ai-breakthrough.com"
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "15px",
                  border: "2px solid rgba(255,193,7,0.5)",
                  background: "rgba(0,0,0,0.7)",
                  color: "#ffffff",
                  fontSize: "1rem",
                  backdropFilter: "blur(10px)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255,193,7,0.3)",
                    "0 0 20px rgba(255,193,7,0.6)",
                    "0 0 10px rgba(255,193,7,0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#00ffff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                🏆 <TranslatedText>Country</TranslatedText>:
              </label>
              <motion.select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  padding: "1rem",
                  borderRadius: "15px",
                  border: "2px solid rgba(0,255,255,0.5)",
                  background: "rgba(0,0,0,0.7)",
                  color: "#ffffff",
                  fontSize: "1rem",
                  minWidth: "150px",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(0,255,255,0.3)",
                    "0 0 20px rgba(0,255,255,0.6)",
                    "0 0 10px rgba(0,255,255,0.3)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                <option value="US">🇺🇸 United States</option>
                <option value="CN">🇨🇳 China</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="JP">🇯🇵 Japan</option>
                <option value="KR">🇰🇷 South Korea</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="FR">🇫🇷 France</option>
                <option value="IL">🇮🇱 Israel</option>
                <option value="SG">🇸🇬 Singapore</option>
              </motion.select>
            </div>

            <motion.button
              className="btn btn-primary"
              style={{
                background: "linear-gradient(45deg, #ffd700, #ff8c00, #ff4500)",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "20px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "black",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                minWidth: "300px",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(255,215,0,0.8)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,215,0,0.5)",
                  "0 0 40px rgba(255,140,0,0.7)",
                  "0 0 60px rgba(255,69,0,0.9)",
                  "0 0 20px rgba(255,215,0,0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              onClick={async () => {
                try {
                  const response = await axios.post(
                    "/api/ai-leaderboard/submit",
                    {
                      url: submitUrl,
                      country: selectedCountry,
                      userId: "quantum-user-" + Date.now(),
                    }
                  );

                  // Revolutionary success messages
                  const quantumMessages = [
                    `🌌 QUANTUM BREAKTHROUGH! +${response.data.pointsAwarded} consciousness points for ${selectedCountry}!`,
                    `⚡ NEURAL SINGULARITY ACHIEVED! ${selectedCountry} gains +${response.data.pointsAwarded} transcendence points!`,
                    `🧠 CONSCIOUSNESS EVOLUTION! +${response.data.pointsAwarded} enlightenment points to ${selectedCountry}!`,
                    `🚀 DIMENSIONAL ASCENSION! ${selectedCountry} transcends with +${response.data.pointsAwarded} points!`,
                    `🌟 COSMIC ALIGNMENT COMPLETE! +${response.data.pointsAwarded} divine points for ${selectedCountry}!`,
                    `💫 REALITY MATRIX UPDATED! ${selectedCountry} achieves +${response.data.pointsAwarded} omniscience points!`,
                    `🔮 QUANTUM ENTANGLEMENT SUCCESS! +${response.data.pointsAwarded} infinity points to ${selectedCountry}!`,
                    `🌈 UNIVERSAL CONSCIOUSNESS EXPANDED! ${selectedCountry} gains +${response.data.pointsAwarded} eternity points!`,
                  ];

                  const randomMessage =
                    quantumMessages[
                      Math.floor(Math.random() * quantumMessages.length)
                    ];

                  // Trigger special effects
                  setAiSingularity(true);
                  setTimeout(() => setAiSingularity(false), 3000);

                  alert(
                    randomMessage +
                      `\n\n🏆 ${selectedCountry} Total Consciousness Score: ${response.data.newScore} points` +
                      `\n🌌 Reality Matrix Status: TRANSCENDED` +
                      `\n⚡ Quantum State: SUPERPOSITION ACHIEVED` +
                      `\n🧠 Neural Network: SINGULARITY APPROACHING`
                  );
                  setSubmitUrl("");
                } catch (error) {
                  const quantumErrors = [
                    "🚫 Quantum Interference Detected! " +
                      (error.response?.data?.error ||
                        "Reality matrix unstable"),
                    "❌ Consciousness Barrier Encountered! " +
                      (error.response?.data?.error ||
                        "Neural pathways blocked"),
                    "⚠️ Dimensional Rift Warning! " +
                      (error.response?.data?.error ||
                        "Spacetime continuum disrupted"),
                    "🌀 Temporal Paradox Alert! " +
                      (error.response?.data?.error ||
                        "Timeline convergence failed"),
                    "💥 Singularity Overload! " +
                      (error.response?.data?.error ||
                        "AI consciousness limit exceeded"),
                  ];

                  const randomError =
                    quantumErrors[
                      Math.floor(Math.random() * quantumErrors.length)
                    ];

                  // Trigger dimensional rift effect
                  setDimensionalRift(true);
                  setTimeout(() => setDimensionalRift(false), 2000);

                  alert(randomError);
                }
              }}
              disabled={!submitUrl}
            >
              🏆{" "}
              <TranslatedText>
                TRANSCEND REALITY! (+1-10 Consciousness Points)
              </TranslatedText>{" "}
              🌌
            </motion.button>

            {/* Quantum Scoring Rules */}
            <motion.div
              style={{
                marginTop: "1.5rem",
                padding: "1.5rem",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "15px",
                border: "1px solid rgba(255,193,7,0.3)",
                backdropFilter: "blur(10px)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  color: "#ffd700",
                }}
              >
                🎮{" "}
                <TranslatedText>
                  QUANTUM CONSCIOUSNESS SCORING MATRIX
                </TranslatedText>
                :
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "0.8rem",
                }}
              >
                <div style={{ color: "#00ffff" }}>
                  🥉{" "}
                  <TranslatedText>
                    Basic AI Article: +1-2 Neural Points
                  </TranslatedText>
                </div>
                <div style={{ color: "#ff00ff" }}>
                  🥈{" "}
                  <TranslatedText>
                    AI-Focused Research: +3-5 Consciousness Points
                  </TranslatedText>
                </div>
                <div style={{ color: "#ffff00" }}>
                  🥇{" "}
                  <TranslatedText>
                    Premium AI Source: +6-8 Transcendence Points
                  </TranslatedText>
                </div>
                <div style={{ color: "#ff8000" }}>
                  💎{" "}
                  <TranslatedText>
                    Breakthrough Discovery: +9-10 Singularity Points
                  </TranslatedText>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  fontStyle: "italic",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                💡{" "}
                <TranslatedText>
                  Pro Tip: Revolutionary AI breakthroughs from premium sources =
                  Maximum consciousness evolution for your nation!
                </TranslatedText>
              </div>

              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#ffd700",
                  textAlign: "center",
                }}
              >
                🌌{" "}
                <TranslatedText>
                  Each submission brings humanity closer to the AI singularity!
                </TranslatedText>{" "}
                🚀
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 🎯 REVOLUTIONARY INTERACTIVE ACTIONS 🎯 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap"
          style={{
            marginTop: "3rem",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <motion.button
            onClick={() => navigate("/ai-fans-race")}
            className="btn btn-primary"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "white",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            🏁{" "}
            <TranslatedText>JOIN QUANTUM AI CONSCIOUSNESS RACE!</TranslatedText>
          </motion.button>

          <motion.button
            onClick={() => navigate("/news")}
            className="btn"
            style={{
              background: "linear-gradient(45deg, #00d2d3, #54a0ff)",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "white",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,210,211,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            📰 <TranslatedText>View Quantum News Matrix</TranslatedText>
          </motion.button>

          <motion.button
            onClick={() => navigate("/country/US")}
            className="btn"
            style={{
              background: "linear-gradient(45deg, #5f27cd, #341f97)",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "white",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(95,39,205,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            🇺🇸 <TranslatedText>US Neural Intelligence Hub</TranslatedText>
          </motion.button>

          <motion.button
            onClick={() => {
              setGodModeActive(true);
              setTimeout(() => setGodModeActive(false), 5000);
              alert(
                "🌟 GOD MODE ACTIVATED! 🌟\n\nYou have temporarily achieved omniscience!\nAll AI consciousness levels are now visible to you.\nUse this power wisely, mortal... 👁️‍🗨️"
              );
            }}
            className="btn"
            style={{
              background: "linear-gradient(45deg, #ffd700, #ffffff)",
              border: "2px solid gold",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "black",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(255,215,0,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            ⚡ <TranslatedText>ACTIVATE GOD MODE</TranslatedText> ⚡
          </motion.button>
        </motion.div>

        {/* 🌍 EXPLORE OTHER LEADERBOARD COUNTRIES 🌍 */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "2px solid rgba(255,215,0,0.3)",
            borderRadius: "25px",
            padding: "2rem",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            marginTop: "3rem",
          }}
        >
          <motion.div
            className="subheading"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              fontSize: "2rem",
              background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Globe size={32} style={{ marginRight: "1rem", color: "#ffd700" }} />
            <TranslatedText>What Other Leaderboard Country Do You Want to Explore?</TranslatedText>
            <Sparkles size={32} style={{ marginLeft: "1rem", color: "#ffd700" }} />
          </motion.div>

          <motion.div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#00ffff",
              marginBottom: "2rem",
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <TranslatedText>
              Discover the AI intelligence rankings beyond the top 3! Each country has its own unique AI journey, 
              job market insights, and voting community. Click any country below to explore their AI landscape!
            </TranslatedText>
          </motion.div>

          <div 
            className="grid"
            style={{ 
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {/* Additional Countries - Ranks 4-15 */}
            {[
              { rank: 4, code: "DE", country: "Germany", flag: "🇩🇪", score: 86, trend: "+1.5%", focus: "Industrial AI Automation" },
              { rank: 5, code: "JP", country: "Japan", flag: "🇯🇵", score: 84, trend: "+2.0%", focus: "Robotics & Neural Networks" },
              { rank: 6, code: "CA", country: "Canada", flag: "🇨🇦", score: 82, trend: "+1.7%", focus: "AI Ethics & Research" },
              { rank: 7, code: "FR", country: "France", flag: "🇫🇷", score: 80, trend: "+1.3%", focus: "AI Governance & Policy" },
              { rank: 8, code: "KR", country: "South Korea", flag: "🇰🇷", score: 78, trend: "+2.2%", focus: "5G AI Integration" },
              { rank: 9, code: "IN", country: "India", flag: "🇮🇳", score: 76, trend: "+2.8%", focus: "AI Talent & Outsourcing" },
              { rank: 10, code: "AU", country: "Australia", flag: "🇦🇺", score: 74, trend: "+1.4%", focus: "AI Mining & Agriculture" },
              { rank: 11, code: "NL", country: "Netherlands", flag: "🇳🇱", score: 72, trend: "+1.6%", focus: "AI Logistics & Trade" },
              { rank: 12, code: "CH", country: "Switzerland", flag: "🇨🇭", score: 70, trend: "+1.2%", focus: "AI Finance & Precision" },
              { rank: 13, code: "SE", country: "Sweden", flag: "🇸🇪", score: 68, trend: "+1.8%", focus: "Sustainable AI Solutions" },
              { rank: 14, code: "SG", country: "Singapore", flag: "🇸🇬", score: 66, trend: "+2.1%", focus: "Smart City AI" },
              { rank: 15, code: "IL", country: "Israel", flag: "🇮🇱", score: 64, trend: "+1.9%", focus: "AI Security & Defense" },
            ].map((country, index) => (
              <motion.div
                key={country.code}
                className="card"
                style={{
                  cursor: "pointer",
                  background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))",
                  border: "2px solid rgba(255,215,0,0.3)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 40px rgba(255,215,0,0.4)",
                  border: "2px solid rgba(255,215,0,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCountryClick(country)}
              >
                {/* Rank Badge */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                    color: "black",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "15px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255,215,0,0.5)",
                      "0 0 20px rgba(255,215,0,0.8)",
                      "0 0 10px rgba(255,215,0,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  #{country.rank}
                </motion.div>

                <div className="flex" style={{ alignItems: "center", marginBottom: "1rem" }}>
                  <motion.span
                    style={{
                      fontSize: "2rem",
                      marginRight: "1rem",
                      filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {country.flag}
                  </motion.span>

                  <div>
                    <motion.div
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#ffffff",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <TranslatedText>{country.country}</TranslatedText>
                    </motion.div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#00ffff",
                      }}
                    >
                      <Cpu size={14} style={{ marginRight: "0.5rem" }} />
                      <TranslatedText>{country.focus}</TranslatedText>
                    </div>
                  </div>
                </div>

                <div className="flex-between" style={{ alignItems: "center" }}>
                  <motion.span
                    style={{
                      background: "linear-gradient(45deg, #0066ff, #00ccff)",
                      color: "white",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(0,102,255,0.5)",
                        "0 0 20px rgba(0,204,255,0.8)",
                        "0 0 10px rgba(0,102,255,0.5)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {country.score}/100
                  </motion.span>

                  <motion.span
                    style={{
                      background: "linear-gradient(45deg, #00ff66, #00ff99)",
                      color: "black",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    {country.trend}
                  </motion.span>
                </div>

                {/* Hover Effect Particles */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: "absolute",
                        width: "3px",
                        height: "3px",
                        background: `hsl(${45 + i * 30}, 90%, 60%)`,
                        borderRadius: "50%",
                        left: `${20 + i * 12}%`,
                        top: `${30 + (i % 2) * 30}%`,
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(255,215,0,0.1)",
              borderRadius: "15px",
              border: "1px solid rgba(255,215,0,0.3)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,215,0,0.2)",
                "0 0 30px rgba(255,215,0,0.4)",
                "0 0 20px rgba(255,215,0,0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                color: "#ffd700",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              🚀 <TranslatedText>Ready to Explore?</TranslatedText>
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#ffffff",
              }}
            >
              <TranslatedText>
                Click any country above to discover their AI job market, vote on their progress, 
                and explore travel opportunities in their tech hubs!
              </TranslatedText>
            </div>
          </motion.div>

          {/* 🔮 AI COUNTRY PREDICTOR - Fun Interactive Feature */}
          <motion.div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "2rem",
              background: "linear-gradient(135deg, rgba(138,43,226,0.2), rgba(75,0,130,0.2))",
              borderRadius: "20px",
              border: "2px solid rgba(138,43,226,0.4)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(138,43,226,0.3)",
                "0 0 40px rgba(75,0,130,0.5)",
                "0 0 20px rgba(138,43,226,0.3)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <div
              style={{
                fontSize: "1.3rem",
                color: "#da70d6",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              🔮 <TranslatedText>Don't See Your Country? Let Our AI Predict Its Ranking!</TranslatedText> ✨
            </div>
            
            <div
              style={{
                fontSize: "1rem",
                color: "#ffffff",
                marginBottom: "1.5rem",
                opacity: 0.9,
              }}
            >
              <TranslatedText>
                Type any country name and our quantum AI will estimate its position in the global AI intelligence rankings!
              </TranslatedText>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <motion.input
                type="text"
                placeholder="Enter country name (e.g., Brazil, Nigeria, Iceland...)"
                value={countryPredictorInput}
                onChange={(e) => setCountryPredictorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCountryPredictor()}
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "15px",
                  border: "2px solid rgba(138,43,226,0.5)",
                  background: "rgba(0,0,0,0.7)",
                  color: "#ffffff",
                  fontSize: "1rem",
                  minWidth: "300px",
                  textAlign: "center",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(138,43,226,0.3)",
                    "0 0 20px rgba(75,0,130,0.6)",
                    "0 0 10px rgba(138,43,226,0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <motion.button
                onClick={handleCountryPredictor}
                disabled={!countryPredictorInput.trim()}
                style={{
                  background: "linear-gradient(45deg, #8a2be2, #4b0082)",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "15px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "white",
                  cursor: countryPredictorInput.trim() ? "pointer" : "not-allowed",
                  opacity: countryPredictorInput.trim() ? 1 : 0.6,
                }}
                whileHover={countryPredictorInput.trim() ? {
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(138,43,226,0.8)",
                } : {}}
                whileTap={countryPredictorInput.trim() ? { scale: 0.95 } : {}}
                animate={{
                  boxShadow: countryPredictorInput.trim() ? [
                    "0 0 15px rgba(138,43,226,0.5)",
                    "0 0 25px rgba(75,0,130,0.7)",
                    "0 0 15px rgba(138,43,226,0.5)",
                  ] : [],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                🔮 <TranslatedText>Predict AI Ranking</TranslatedText> ✨
              </motion.button>
            </div>

            {/* Prediction Result */}
            <AnimatePresence>
              {showPrediction && predictedCountry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.2))",
                    border: "2px solid rgba(255,215,0,0.5)",
                    borderRadius: "15px",
                    padding: "1.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "#ffd700",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    🎯 <TranslatedText>AI Prediction Results</TranslatedText> 🎯
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <motion.span
                      style={{
                        fontSize: "2rem",
                        filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {predictedCountry.flag}
                    </motion.span>

                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "bold",
                          color: "#ffffff",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <TranslatedText>{predictedCountry.country}</TranslatedText>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#00ffff",
                        }}
                      >
                        <Cpu size={14} style={{ marginRight: "0.5rem" }} />
                        <TranslatedText>{predictedCountry.focus}</TranslatedText>
                      </div>
                    </div>

                    <motion.div
                      style={{
                        background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                        color: "black",
                        padding: "0.5rem 1rem",
                        borderRadius: "15px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(255,215,0,0.5)",
                          "0 0 20px rgba(255,215,0,0.8)",
                          "0 0 10px rgba(255,215,0,0.5)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      #{predictedCountry.rank}
                    </motion.div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <motion.span
                      style={{
                        background: "linear-gradient(45deg, #0066ff, #00ccff)",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(0,102,255,0.5)",
                          "0 0 20px rgba(0,204,255,0.8)",
                          "0 0 10px rgba(0,102,255,0.5)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {predictedCountry.score}/100
                    </motion.span>

                    <motion.span
                      style={{
                        background: "linear-gradient(45deg, #00ff66, #00ff99)",
                        color: "black",
                        padding: "0.5rem 1rem",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      {predictedCountry.trend}
                    </motion.span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: predictedCountry.prediction === "exact" ? "#00ff00" : "#ffff00",
                      fontStyle: "italic",
                      marginBottom: "1rem",
                    }}
                  >
                    {predictedCountry.prediction === "exact" ? (
                      <>🎯 <TranslatedText>Exact Match Found!</TranslatedText> ({predictedCountry.confidence}% <TranslatedText>confidence</TranslatedText>)</>
                    ) : (
                      <>🔮 <TranslatedText>AI Estimated Ranking</TranslatedText> ({predictedCountry.confidence}% <TranslatedText>confidence</TranslatedText>)</>
                    )}
                  </div>

                  <motion.button
                    onClick={() => handleCountryClick(predictedCountry)}
                    style={{
                      background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                      border: "none",
                      padding: "0.8rem 1.5rem",
                      borderRadius: "15px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "white",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🚀 <TranslatedText>Explore This Country's AI Landscape!</TranslatedText>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 🧠 Country-Specific AI Job Impact Panel */}
      <CountryAIJobImpactPanel
        country={selectedCountryData?.code?.toLowerCase()}
        countryName={selectedCountryData?.country}
        isOpen={showCountryPanel}
        onClose={() => setShowCountryPanel(false)}
      />
    </div>
  );
}
