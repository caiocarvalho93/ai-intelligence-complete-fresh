import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NewsFeed from "./components/NewsFeed";
import AILeaderboard from "./components/AILeaderboard";
import CountryPage from "./pages/Country";
import AIFansRace from "./pages/AIFansRace";
import MatrixRain from "./components/MatrixRain";
import CursorGlow from "./components/CursorGlow";
import { LanguageProvider } from "./contexts/LanguageContext";

import "./styles/revolutionary-ai.css";

import UniversalLanguageButton from "./components/UniversalLanguageButton";
import LanguageDebugger from "./components/LanguageDebugger";
import QuantumCAIChat from "./components/QuantumCAIChat";
import AIOptimizationDashboard from "./components/AIOptimizationDashboard";
import AIAdvancedDashboard from "./components/AIAdvancedDashboard";
import AIUltimateDashboard from "./components/AIUltimateDashboard";
import CryptoTreasuryDashboard from "./components/CryptoTreasuryDashboard";

import ErrorBoundary from "./components/ErrorBoundary";
import DeveloperAccess from "./components/DeveloperAccess";
import TranslationAPIPage from "./pages/TranslationAPIPage";

export default function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <MatrixRain />
        <CursorGlow />
        
        <UniversalLanguageButton />
        <LanguageDebugger />
        <QuantumCAIChat />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/ai-leaderboard" element={<AILeaderboard />} />
          <Route path="/ai-fans-race" element={<AIFansRace />} />
          <Route path="/ai-optimization" element={
            <ErrorBoundary>
              <DeveloperAccess requiredLevel="developer">
                <AIOptimizationDashboard />
              </DeveloperAccess>
            </ErrorBoundary>
          } />
          <Route path="/ai-advanced" element={
            <ErrorBoundary>
              <DeveloperAccess requiredLevel="developer">
                <AIAdvancedDashboard />
              </DeveloperAccess>
            </ErrorBoundary>
          } />
          <Route path="/ai-ultimate" element={
            <ErrorBoundary>
              <DeveloperAccess requiredLevel="developer">
                <AIUltimateDashboard />
              </DeveloperAccess>
            </ErrorBoundary>
          } />
          <Route path="/crypto-treasury" element={<CryptoTreasuryDashboard />} />

          <Route path="/translation-api" element={<TranslationAPIPage />} />
          <Route path="/country/:code" element={<CountryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}
 
// redeploy trigger
 
// redeploy trigger
