// 🚀 STEP 4: Test with AILeaderboard component only
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AILeaderboard from "./components/AILeaderboard";

function Step4App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ background: '#000', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<AILeaderboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Step4App />);