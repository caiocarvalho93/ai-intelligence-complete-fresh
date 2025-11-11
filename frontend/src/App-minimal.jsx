import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

// MINIMAL APP TEST - Only essential components
function MinimalDashboard() {
  return (
    <div style={{
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
      color: "white",
      fontSize: "24px",
      textAlign: "center",
      padding: "50px",
      minHeight: "100vh"
    }}>
      <h1>🚀 MINIMAL DASHBOARD WORKING</h1>
      <p>If you see this, basic routing works</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<MinimalDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}