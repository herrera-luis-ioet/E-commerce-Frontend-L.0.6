// This script starts a simple HTTP server to serve a test page that makes API requests
// and logs them to the console for verification

const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple HTML page that makes API requests
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>API Request Test</title>
  <script>
    // Function to log network requests
    function logRequest(url, method, status) {
      const logElement = document.getElementById('request-log');
      const logEntry = document.createElement('div');
      logEntry.className = status >= 200 && status < 300 ? 'success' : 'error';
      logEntry.textContent = \`[\${new Date().toLocaleTimeString()}] \${method} \${url} - Status: \${status}\`;
      logElement.appendChild(logEntry);
    }

    // Function to make an API request
    async function makeApiRequest() {
      const baseUrl = 'https://8000_172_31_44_95.workspace.develop.kavia.ai';
      const endpoint = '/api/v1/products';
      const url = baseUrl + endpoint;
      
      try {
        document.getElementById('status').textContent = 'Making request to: ' + url;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const status = response.status;
        logRequest(url, 'GET', status);
        
        if (response.ok) {
          const data = await response.json();
          document.getElementById('result').textContent = JSON.stringify(data, null, 2);
          document.getElementById('status').textContent = 'Request successful!';
        } else {
          document.getElementById('status').textContent = 'Request failed with status: ' + status;
        }
      } catch (error) {
        logRequest(url, 'GET', 'ERROR');
        document.getElementById('status').textContent = 'Error: ' + error.message;
      }
    }
  </script>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    button { padding: 10px; margin: 10px 0; }
    #request-log { margin-top: 20px; border: 1px solid #ccc; padding: 10px; max-height: 200px; overflow-y: auto; }
    #result { margin-top: 20px; border: 1px solid #ccc; padding: 10px; white-space: pre-wrap; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>API Request Test</h1>
  <p>This page tests API requests to verify the endpoint URL.</p>
  
  <button onclick="makeApiRequest()">Make API Request</button>
  
  <div>
    <h3>Status:</h3>
    <div id="status">Ready to test</div>
  </div>
  
  <div>
    <h3>Request Log:</h3>
    <div id="request-log"></div>
  </div>
  
  <div>
    <h3>Response:</h3>
    <pre id="result">No response yet</pre>
  </div>
  
  <script>
    // Log the API configuration
    document.getElementById('request-log').innerHTML = 
      '<div>API Base URL: https://8000_172_31_44_95.workspace.develop.kavia.ai</div>' +
      '<div>Products Endpoint: /api/v1/products</div>' +
      '<div>Full URL: https://8000_172_31_44_95.workspace.develop.kavia.ai/api/v1/products</div>';
  </script>
</body>
</html>
`;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Open this URL in a browser to test API requests');
  console.log('Press Ctrl+C to stop the server');
});