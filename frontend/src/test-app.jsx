import React from "react";

export default function TestApp() {
  return (
    <div style={{
      background: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)",
      color: "white",
      fontSize: "30px",
      textAlign: "center",
      padding: "50px",
      minHeight: "100vh"
    }}>
      <h1>🚀 REACT TEST - IF YOU SEE THIS, REACT IS WORKING</h1>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <p>If you see colors and this text, React is loading properly</p>
      <p>If black screen, React is not mounting</p>
    </div>
  );
}