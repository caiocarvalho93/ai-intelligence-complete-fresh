import React from "react";
import ReactDOM from "react-dom/client";

function TestApp() {
  return (
    <div style={{ color: 'white', padding: '20px', background: '#000', minHeight: '100vh' }}>
      <h1>🚀 Test App Working</h1>
      <p>If you see this, React is working!</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TestApp />);