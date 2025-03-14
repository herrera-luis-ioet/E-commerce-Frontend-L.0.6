# Integration Test Report Generator

This utility generates comprehensive reports for integration tests between E-commerce-Frontend-L.0.6 and API-Performance-Optimization-L.0.8.

## Features

- Generates summary of test results (pass/fail)
- Includes details of failed tests
- Shows performance metrics (response times)
- Provides recommendations for improvements
- Exports report in both console and HTML formats

## Usage

### Configuration

The report generator is already configured in the project's Jest configuration in `package.json`. It will automatically generate reports when you run integration tests.

### Running Tests with Report Generation

To run integration tests and generate reports:

```bash
# Run all integration tests with report generation
./run-integration-tests.sh

# Run specific integration test file with report generation
./run-integration-tests.sh --test-file productService.integration.test.ts
```

The reports will be generated in the `test-reports` directory in both console output and HTML format.

### Adding Performance Tracking to Tests

To add performance tracking to your tests, use the `PerformanceTracker` class:

```typescript
import { PerformanceTracker } from './report-generator';

test('should perform some API operation', async () => {
  // Start timing the test
  PerformanceTracker.startTest('Test Name');
  
  // Perform API operation
  const response = await someApiService.someOperation();
  
  // End timing and record the endpoint
  PerformanceTracker.endTest('Test Name', '/api/v1/some-endpoint');
  
  // Record API call performance (if response time is available)
  PerformanceTracker.recordApiCall('/api/v1/some-endpoint', response.meta?.responseTime || 0);
  
  // Your test assertions
  expect(response.success).toBe(true);
});
```

### Report Generator API

#### PerformanceTracker

- `PerformanceTracker.startTest(testName: string)`: Start timing a test
- `PerformanceTracker.endTest(testName: string, apiEndpoint?: string)`: End timing a test and record the metric
- `PerformanceTracker.recordApiCall(endpoint: string, duration: number)`: Record an API call metric

#### IntegrationTestReporter

- `new IntegrationTestReporter(options)`: Create a new reporter instance
  - `options.outputDir`: Directory to output HTML reports (default: './test-reports')
  - `options.consoleEnabled`: Enable console reports (default: true)
  - `options.htmlEnabled`: Enable HTML reports (default: true)
- `processTestResults(testResults)`: Process Jest test results and generate reports

## Report Format

### Console Report

The console report includes:

- Summary of test results (total, passed, failed, pending, skipped)
- Details of failed tests
- Performance metrics (average response time, slowest tests, endpoint performance)
- Recommendations for improvements

### HTML Report

The HTML report includes all the information from the console report in a more visual format, with:

- Summary cards
- Detailed tables for failed tests
- Performance metrics tables
- Recommendations list

## Customizing the Report Generator

You can customize the report generator by modifying the `report-generator.ts` file. Some possible customizations:

- Add more performance metrics
- Change the HTML report styling
- Add more recommendation rules
- Include additional test metadata

## Troubleshooting

If you encounter issues with the report generator:

1. Make sure the `test-reports` directory exists and is writable
2. Check that the Jest configuration in `package.json` is correct
3. Verify that the performance tracking calls are properly placed in your tests
4. Check the console output for any errors related to report generation

## Example

See `report-generator-example.ts` for examples of how to use the report generator in your tests.