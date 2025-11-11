import React from "react";
import ReactDOM from "react-dom/client";

console.log("🚀 DEBUG: Starting React test...");

function DebugApp() {
  console.log("🚀 DEBUG: DebugApp rendering...");
  
  // Force visible content
  React.useEffect(() => {
    console.log("🚀 DEBUG: useEffect running");
    document.body.style.background = "red";
    document.body.style.color = "white";
  }, []);
  
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
        <h1>🚀 REACT IS WORKING!</h1>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

console.log("🚀 DEBUG: Creating root...");
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("🚀 DEBUG: Rendering...");
root.render(<DebugApp />);
console.log("🚀 DEBUG: Render complete!");