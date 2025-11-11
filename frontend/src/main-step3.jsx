// 🚀 STEP 3: Test with Dashboard component only
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Dashboard from "./components/Dashboard";

function Step3App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ background: '#000', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Step3App />);