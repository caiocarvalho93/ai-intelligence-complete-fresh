import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./styles/revolutionary-ai.css";

// MINIMAL APP - Only essential components to test
export default function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}