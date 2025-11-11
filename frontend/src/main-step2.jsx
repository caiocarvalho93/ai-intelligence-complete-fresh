// 🚀 STEP 2: Test React + Router + LanguageProvider (our first custom component)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

function Step2App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div
          style={{
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
            color: "white",
            fontSize: "30px",
            textAlign: "center",
            padding: "50px",
            minHeight: "100vh",
          }}
        >
          <h1>🚀 STEP 2: LANGUAGE PROVIDER WORKING</h1>
          <p>React + Router + LanguageProvider = SUCCESS</p>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Step2App />);
