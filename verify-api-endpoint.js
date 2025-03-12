// This script verifies that the API endpoint URL is correctly set to
// 'https://8000_172_31_44_95.workspace.develop.kavia.ai/api/v1/products'

const fs = require('fs');
const path = require('path');

// Read the API service file
const apiServicePath = path.join(__dirname, 'src', 'services', 'api.ts');
const apiServiceContent = fs.readFileSync(apiServicePath, 'utf8');

// Read the API types file
const apiTypesPath = path.join(__dirname, 'src', 'types', 'api.types.ts');
const apiTypesContent = fs.readFileSync(apiTypesPath, 'utf8');

// Check if the base URL is correctly set
const baseUrlRegex = /baseURL: process\.env\.REACT_APP_API_URL \|\| ['"]([^'"]+)['"]/;
const baseUrlMatch = apiServiceContent.match(baseUrlRegex);
const baseUrl = baseUrlMatch ? baseUrlMatch[1] : null;

// Check if the products endpoint is correctly set
const productsEndpointRegex = /PRODUCTS = ['"]([^'"]+)['"]/;
const productsEndpointMatch = apiTypesContent.match(productsEndpointRegex);
const productsEndpoint = productsEndpointMatch ? productsEndpointMatch[1] : null;

// Verify the full URL
const expectedBaseUrl = 'https://8000_172_31_44_95.workspace.develop.kavia.ai';
const expectedProductsEndpoint = '/api/v1/products';
const expectedFullUrl = expectedBaseUrl + expectedProductsEndpoint;

console.log('API Endpoint URL Verification:');
console.log('----------------------------');
console.log(`Base URL: ${baseUrl}`);
console.log(`Products Endpoint: ${productsEndpoint}`);
console.log(`Full URL: ${baseUrl}${productsEndpoint}`);
console.log('----------------------------');
console.log(`Expected Full URL: ${expectedFullUrl}`);
console.log('----------------------------');

if (baseUrl === expectedBaseUrl && productsEndpoint === expectedProductsEndpoint) {
  console.log('✅ API endpoint URL is correctly configured!');
  process.exit(0);
} else {
  console.log('❌ API endpoint URL is NOT correctly configured!');
  
  if (baseUrl !== expectedBaseUrl) {
    console.log(`   - Base URL should be '${expectedBaseUrl}' but is '${baseUrl}'`);
  }
  
  if (productsEndpoint !== expectedProductsEndpoint) {
    console.log(`   - Products endpoint should be '${expectedProductsEndpoint}' but is '${productsEndpoint}'`);
  }
  
  process.exit(1);
}