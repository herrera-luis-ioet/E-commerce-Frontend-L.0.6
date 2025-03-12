// Import the necessary modules
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('API Service Endpoint URL Tests', () => {
  let apiService;
  let Endpoints;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset modules to ensure fresh imports
    jest.resetModules();
    
    // Mock axios.create to return a mocked axios instance
    axios.create = jest.fn().mockReturnValue(axios);
    
    // Mock successful response
    axios.request = jest.fn().mockResolvedValue({
      data: { success: true, data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    
    // Import the modules after mocking
    apiService = require('../api').default;
    Endpoints = require('../../types/api.types').Endpoints;
  });

  test('API should be configured with the correct base URL', () => {
    // Check that axios.create was called with the correct baseURL
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://8000_172_31_44_95.workspace.develop.kavia.ai',
      })
    );
  });

  test('GET request should use the correct products endpoint URL', async () => {
    // Make a GET request to the products endpoint
    await apiService.get(Endpoints.PRODUCTS);
    
    // Check that the request was made with the correct URL
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products',
        method: 'GET',
      })
    );
  });

  test('Full URL construction should include the base URL and endpoint', async () => {
    // This test verifies that the complete URL will be correctly formed
    // by checking how axios is configured and used
    
    // Make a request
    await apiService.get(Endpoints.PRODUCTS);
    
    // Verify axios.create was called with the correct baseURL
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://8000_172_31_44_95.workspace.develop.kavia.ai',
      })
    );
    
    // Verify the request was made with the correct endpoint
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products',
      })
    );
    
    // The full URL that will be used is baseURL + url = 
    // https://8000_172_31_44_95.workspace.develop.kavia.ai/api/v1/products
  });
});