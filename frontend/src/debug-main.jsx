import React from "react";
import ReactDOM from "react-dom/client";

console.log("🚀 DEBUG: Starting React...");

function DebugApp() {
  console.log("🚀 DEBUG: DebugApp rendering...");
  
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '30px',
      zIndex: 9999
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🚀 REACT DEBUG WORKING!</h1>
        <p>If you see this, React is mounting correctly</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

console.log("🚀 DEBUG: Creating root...");
try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  console.log("🚀 DEBUG: Root created, rendering...");
  root.render(<DebugApp />);
  console.log("🚀 DEBUG: Render complete!");
} catch (error) {
  console.error("🚨 DEBUG: Error:", error);
  document.body.innerHTML = `<div style="color: red; font-size: 20px; padding: 20px;">ERROR: ${error.message}</div>`;
}