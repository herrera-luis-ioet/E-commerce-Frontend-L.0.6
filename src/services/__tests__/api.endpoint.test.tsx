import axios from 'axios';
import apiService from '../api';
import { Endpoints } from '../../types/api.types';

// Mock axios
jest.mock('axios');

describe('API Service Endpoint URL Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mocked instance
    (axios.create as jest.Mock).mockReturnValue(axios);
    
    // Mock successful response
    (axios.request as jest.Mock).mockResolvedValue({
      data: { success: true, data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
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