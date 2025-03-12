const axios = require('axios');
const apiService = require('../api').default;
const { Endpoints } = require('../../types/api.types');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Service Endpoint URL Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mocked instance
    mockedAxios.create.mockReturnValue(mockedAxios);
    
    // Mock successful response
    mockedAxios.request.mockResolvedValue({
      data: { success: true, data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
  });

  test('API should be configured with the correct base URL', () => {
    // Check that axios.create was called with the correct baseURL
    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://8000_172_31_44_95.workspace.develop.kavia.ai',
      })
    );
  });

  test('GET request should use the correct products endpoint URL', async () => {
    // Make a GET request to the products endpoint
    await apiService.get(Endpoints.PRODUCTS);
    
    // Check that the request was made with the correct URL
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products',
        method: 'GET',
      })
    );
  });

  test('POST request should use the correct products endpoint URL', async () => {
    const testData = { name: 'Test Product' };
    
    // Make a POST request to the products endpoint
    await apiService.post(Endpoints.PRODUCTS, testData);
    
    // Check that the request was made with the correct URL and data
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products',
        method: 'POST',
        data: testData,
      })
    );
  });

  test('GET request with product ID should use the correct endpoint URL', async () => {
    const productId = '123';
    
    // Make a GET request to fetch a specific product
    await apiService.get(`${Endpoints.PRODUCT_BY_ID}${productId}`);
    
    // Check that the request was made with the correct URL
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products/123',
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
    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://8000_172_31_44_95.workspace.develop.kavia.ai',
      })
    );
    
    // Verify the request was made with the correct endpoint
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/products',
      })
    );
    
    // The full URL that will be used is baseURL + url = 
    // https://8000_172_31_44_95.workspace.develop.kavia.ai/api/v1/products
  });
});
