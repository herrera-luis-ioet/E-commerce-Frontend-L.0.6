import apiService from './api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    request: jest.fn()
  })),
  isAxiosError: jest.fn()
}));

describe('ApiService', () => {
  describe('getPaginated', () => {
    it('should handle responses without meta property', async () => {
      // Mock the internal request method to return a response without meta
      const mockResponse = {
        data: [{ id: 1, name: 'Test' }, { id: 2, name: 'Test 2' }],
        success: true,
        statusCode: 200,
        message: 'Success'
      };
      
      // @ts-ignore - Accessing private method for testing
      apiService['request'] = jest.fn().mockResolvedValue(mockResponse);
      
      // Call getPaginated with some params
      const params = { params: { page: 2, limit: 10 } };
      const result = await apiService.getPaginated('/test', params);
      
      // Verify that meta was added to the response
      expect(result.meta).toBeDefined();
      expect(result.meta.total).toBe(2); // Length of the data array
      expect(result.meta.currentPage).toBe(2); // From params
      expect(result.meta.itemsPerPage).toBe(10); // From params
    });

    it('should preserve existing meta property in responses', async () => {
      // Mock the internal request method to return a response with meta
      const mockResponse = {
        data: [{ id: 1, name: 'Test' }, { id: 2, name: 'Test 2' }],
        success: true,
        statusCode: 200,
        message: 'Success',
        meta: {
          total: 100,
          totalPages: 10,
          currentPage: 2,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: true
        }
      };
      
      // @ts-ignore - Accessing private method for testing
      apiService['request'] = jest.fn().mockResolvedValue(mockResponse);
      
      // Call getPaginated with some params
      const params = { params: { page: 2, limit: 10 } };
      const result = await apiService.getPaginated('/test', params);
      
      // Verify that the original meta was preserved
      expect(result.meta).toBeDefined();
      expect(result.meta.total).toBe(100); // From original meta
      expect(result.meta.totalPages).toBe(10); // From original meta
    });
  });
});