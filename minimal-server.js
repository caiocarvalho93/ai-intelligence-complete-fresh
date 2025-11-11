const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<!DOCTYPE html>
<html>
<head>
<style>
body { 
  background: linear-gradient(45deg, red, blue, green) !important; 
  color: white !important; 
  font-size: 40px !important; 
  text-align: center !important;
  padding: 50px !important;
  margin: 0 !important;
  min-height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
</head>
<body>
<div>
<h1>🚨 MINIMAL SERVER TEST</h1>
<p>If you see this colorful page, the issue is with Vite!</p>
<p>Time: ${new Date().toLocaleTimeString()}</p>
<p>This bypasses ALL Vite/React/Node modules!</p>
</div>
</body>
</html>`);
});

server.listen(9999, () => {
  console.log('🚨 MINIMAL SERVER running on http://localhost:9999');
  console.log('🔗 Visit: http://localhost:9999');
});