// 🚨 GROK-KIRO EMERGENCY DIAGNOSTIC SYSTEM
const fs = require('fs');
const { execSync } = require('child_process');

class EmergencyDiagnostics {
  constructor() {
    this.diagnosticResults = [];
    this.solutionFound = false;
  }

  async runFullDiagnostics() {
    console.log("🚨 EMERGENCY DIAGNOSTICS INITIATED");
    
    // Test 1: Basic HTML file outside of any server
    this.testBasicHTML();
    
    // Test 2: Check browser processes
    this.checkBrowserProcesses();
    
    // Test 3: Test different ports
    this.testDifferentPorts();
    
    // Test 4: Create minimal server
    this.createMinimalServer();
    
    return this.diagnosticResults;
  }

  testBasicHTML() {
    console.log("🔍 Test 1: Creating basic HTML file...");
    
    const basicHTML = `<!DOCTYPE html>
<html>
<head>
<style>
body { 
  background: red !important; 
  color: white !important; 
  font-size: 50px !important; 
  text-align: center !important;
  padding: 100px !important;
}
</style>
</head>
<body>
<h1>🚨 EMERGENCY TEST</h1>
<p>If you see this RED page, your browser works!</p>
<script>alert('Browser JavaScript working!');</script>
</body>
</html>`;

    fs.writeFileSync('emergency-test.html', basicHTML);
    console.log("✅ Created emergency-test.html - Open this file directly in browser!");
    
    this.diagnosticResults.push({
      test: "Basic HTML",
      file: "emergency-test.html",
      instruction: "Open this file directly in browser (not localhost)"
    });
  }

  checkBrowserProcesses() {
    console.log("🔍 Test 2: Checking browser processes...");
    
    try {
      const chromeProcesses = execSync('ps aux | grep -i chrome | grep -v grep').toString();
      console.log("Chrome processes:", chromeProcesses);
      
      this.diagnosticResults.push({
        test: "Browser Processes",
        result: chromeProcesses,
        recommendation: "Kill all Chrome processes and restart if needed"
      });
    } catch (error) {
      console.log("No Chrome processes found or error checking");
    }
  }

  testDifferentPorts() {
    console.log("🔍 Test 3: Testing different ports...");
    
    const testPorts = [3000, 3001, 8000, 8080, 9000];
    testPorts.forEach(port => {
      try {
        const result = execSync(`curl -I http://localhost:${port}`, { timeout: 2000 }).toString();
        console.log(`Port ${port}: ACTIVE`);
        this.diagnosticResults.push({
          test: `Port ${port}`,
          status: "ACTIVE",
          result: result
        });
      } catch (error) {
        console.log(`Port ${port}: INACTIVE`);
      }
    });
  }

  createMinimalServer() {
    console.log("🔍 Test 4: Creating minimal server...");
    
    const minimalServer = `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(\`<!DOCTYPE html>
<html>
<head>
<style>
body { 
  background: linear-gradient(45deg, red, blue, green) !important; 
  color: white !important; 
  font-size: 40px !important; 
  text-align: center !important;
  padding: 50px !important;
}
</style>
</head>
<body>
<h1>🚨 MINIMAL SERVER TEST</h1>
<p>If you see this colorful page, the issue is with Vite!</p>
<p>Time: \${new Date().toLocaleTimeString()}</p>
</body>
</html>\`);
});

server.listen(9999, () => {
  console.log('🚨 MINIMAL SERVER running on http://localhost:9999');
});`;

    fs.writeFileSync('minimal-server.js', minimalServer);
    console.log("✅ Created minimal-server.js - Run with: node minimal-server.js");
    
    this.diagnosticResults.push({
      test: "Minimal Server",
      file: "minimal-server.js",
      instruction: "Run 'node minimal-server.js' then visit http://localhost:9999"
    });
  }
}

module.exports = { EmergencyDiagnostics };