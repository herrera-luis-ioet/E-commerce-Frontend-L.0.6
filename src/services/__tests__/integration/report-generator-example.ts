/**
 * Report Generator Example
 * 
 * This file demonstrates how to use the integration test report generator.
 */

import { IntegrationTestReporter, PerformanceTracker } from './report-generator';

/**
 * Example of how to use the performance tracker in tests
 */
describe('Example Test with Performance Tracking', () => {
  test('should track performance of a test', async () => {
    // Start timing the test
    PerformanceTracker.startTest('Example Test');
    
    // Simulate some API call
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call taking 100ms
    const duration = Date.now() - startTime;
    
    // Record the API call
    PerformanceTracker.recordApiCall('/api/v1/products', duration);
    
    // End timing the test
    PerformanceTracker.endTest('Example Test', '/api/v1/products');
    
    // Your normal test assertions
    expect(true).toBe(true);
  });
});

/**
 * Example of how to manually generate a report
 */
function generateManualReport() {
  // Create a reporter instance
  const reporter = new IntegrationTestReporter({
    outputDir: './test-reports',
    consoleEnabled: true,
    htmlEnabled: true
  });
  
  // Example test results (normally provided by Jest)
  const mockTestResults = [
    {
      testFilePath: '/path/to/test/file.ts',
      testResults: [
        {
          ancestorTitles: ['Product Service'],
          fullName: 'Product Service should fetch products',
          status: 'passed',
          title: 'should fetch products',
          duration: 150,
          failureMessages: []
        },
        {
          ancestorTitles: ['Product Service'],
          fullName: 'Product Service should handle errors',
          status: 'failed',
          title: 'should handle errors',
          duration: 75,
          failureMessages: ['Expected 200 but received 500']
        }
      ],
      numFailingTests: 1,
      numPassingTests: 1,
      numPendingTests: 0,
      numTodoTests: 0,
      perfStats: {
        start: Date.now() - 1000,
        end: Date.now()
      }
    }
  ];
  
  // Process the results
  reporter.processTestResults(mockTestResults as any);
}

/**
 * How to configure Jest to use the reporter
 * 
 * In your Jest configuration (jest.config.js or package.json):
 * 
 * ```
 * {
 *   "reporters": [
 *     "default",
 *     ["./src/services/__tests__/integration/report-generator.ts", {
 *       "outputDir": "./test-reports",
 *       "consoleEnabled": true,
 *       "htmlEnabled": true
 *     }]
 *   ]
 * }
 * ```
 */

/**
 * How to use the performance tracker in your actual tests
 * 
 * ```
 * import { PerformanceTracker } from './report-generator';
 * 
 * describe('Product Service Integration Tests', () => {
 *   test('should fetch products', async () => {
 *     PerformanceTracker.startTest('Fetch Products');
 *     
 *     // Your test code
 *     const response = await productService.getProducts();
 *     
 *     PerformanceTracker.endTest('Fetch Products', '/api/v1/products');
 *     
 *     // Your assertions
 *     expect(response.success).toBe(true);
 *   });
 * });
 * ```
 */

export { generateManualReport };