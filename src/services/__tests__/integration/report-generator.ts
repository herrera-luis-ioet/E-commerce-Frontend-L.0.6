/**
 * Integration Test Report Generator
 * 
 * This utility hooks into Jest's test results and generates comprehensive reports
 * for integration tests between E-commerce-Frontend-L.0.6 and API-Performance-Optimization-L.0.8.
 * 
 * Features:
 * - Generates summary of test results (pass/fail)
 * - Includes details of failed tests
 * - Shows performance metrics (response times)
 * - Provides recommendations for improvements
 * - Exports report in both console and HTML formats
 */

import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// Types for test results
interface TestResult {
  testFilePath: string;
  testResults: TestCaseResult[];
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  numTodoTests: number;
  perfStats: {
    start: number;
    end: number;
  };
}

interface TestCaseResult {
  ancestorTitles: string[];
  fullName: string;
  status: 'passed' | 'failed' | 'pending' | 'todo' | 'skipped';
  title: string;
  duration?: number;
  failureMessages: string[];
}

interface PerformanceMetric {
  testName: string;
  duration: number;
  apiEndpoint?: string;
  timestamp: number;
}

interface ReportData {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    pendingTests: number;
    skippedTests: number;
    totalDuration: number;
    startTime: Date;
    endTime: Date;
  };
  testResults: {
    passed: TestCaseDetail[];
    failed: TestCaseDetail[];
    pending: TestCaseDetail[];
    skipped: TestCaseDetail[];
  };
  performanceMetrics: {
    averageResponseTime: number;
    slowestTests: PerformanceMetric[];
    fastestTests: PerformanceMetric[];
    endpointPerformance: Record<string, {
      averageResponseTime: number;
      totalCalls: number;
      slowestCall: number;
      fastestCall: number;
    }>;
  };
  recommendations: string[];
}

interface TestCaseDetail {
  name: string;
  file: string;
  duration: number;
  failureMessages?: string[];
}

// Global storage for performance metrics
const performanceMetrics: PerformanceMetric[] = [];
const apiCallMetrics: Map<string, number[]> = new Map();
const testStartTimes: Map<string, number> = new Map();

/**
 * Test Reporter Class
 */
class IntegrationTestReporter {
  private reportData: ReportData;
  private outputDir: string;
  private consoleEnabled: boolean;
  private htmlEnabled: boolean;

  constructor(options: {
    outputDir?: string;
    consoleEnabled?: boolean;
    htmlEnabled?: boolean;
  } = {}) {
    this.outputDir = options.outputDir || path.join(process.cwd(), 'test-reports');
    this.consoleEnabled = options.consoleEnabled !== false;
    this.htmlEnabled = options.htmlEnabled !== false;

    // Initialize report data structure
    this.reportData = {
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        pendingTests: 0,
        skippedTests: 0,
        totalDuration: 0,
        startTime: new Date(),
        endTime: new Date(),
      },
      testResults: {
        passed: [],
        failed: [],
        pending: [],
        skipped: [],
      },
      performanceMetrics: {
        averageResponseTime: 0,
        slowestTests: [],
        fastestTests: [],
        endpointPerformance: {},
      },
      recommendations: [],
    };

    // Ensure output directory exists
    if (this.htmlEnabled && !fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Process Jest test results
   * @param testResults - Array of Jest test results
   */
  processTestResults(testResults: TestResult[]): void {
    const startTime = Math.min(...testResults.map(r => r.perfStats.start));
    const endTime = Math.max(...testResults.map(r => r.perfStats.end));
    let totalDuration = 0;

    // Process each test file
    testResults.forEach(result => {
      // Process individual test cases
      result.testResults.forEach(testCase => {
        const testDuration = testCase.duration || 0;
        totalDuration += testDuration;

        const testDetail: TestCaseDetail = {
          name: testCase.fullName,
          file: path.basename(result.testFilePath),
          duration: testDuration,
        };

        // Categorize by status
        switch (testCase.status) {
          case 'passed':
            this.reportData.testResults.passed.push(testDetail);
            this.reportData.summary.passedTests++;
            break;
          case 'failed':
            testDetail.failureMessages = testCase.failureMessages;
            this.reportData.testResults.failed.push(testDetail);
            this.reportData.summary.failedTests++;
            break;
          case 'pending':
            this.reportData.testResults.pending.push(testDetail);
            this.reportData.summary.pendingTests++;
            break;
          case 'skipped':
            this.reportData.testResults.skipped.push(testDetail);
            this.reportData.summary.skippedTests++;
            break;
        }

        this.reportData.summary.totalTests++;
      });
    });

    // Update summary timing information
    this.reportData.summary.totalDuration = totalDuration;
    this.reportData.summary.startTime = new Date(startTime);
    this.reportData.summary.endTime = new Date(endTime);

    // Process performance metrics
    this.processPerformanceMetrics();

    // Generate recommendations
    this.generateRecommendations();

    // Generate reports
    if (this.consoleEnabled) {
      this.generateConsoleReport();
    }

    if (this.htmlEnabled) {
      this.generateHtmlReport();
    }
  }

  /**
   * Process performance metrics collected during tests
   */
  private processPerformanceMetrics(): void {
    if (performanceMetrics.length === 0) {
      return;
    }

    // Calculate average response time
    const totalResponseTime = performanceMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    this.reportData.performanceMetrics.averageResponseTime = totalResponseTime / performanceMetrics.length;

    // Find slowest and fastest tests
    const sortedByDuration = [...performanceMetrics].sort((a, b) => b.duration - a.duration);
    this.reportData.performanceMetrics.slowestTests = sortedByDuration.slice(0, 5);
    this.reportData.performanceMetrics.fastestTests = sortedByDuration.reverse().slice(0, 5);

    // Process endpoint performance
    apiCallMetrics.forEach((durations, endpoint) => {
      const totalCalls = durations.length;
      const totalTime = durations.reduce((sum, duration) => sum + duration, 0);
      const averageTime = totalTime / totalCalls;
      const slowestCall = Math.max(...durations);
      const fastestCall = Math.min(...durations);

      this.reportData.performanceMetrics.endpointPerformance[endpoint] = {
        averageResponseTime: averageTime,
        totalCalls,
        slowestCall,
        fastestCall,
      };
    });
  }

  /**
   * Generate recommendations based on test results and performance metrics
   */
  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Recommendations based on failed tests
    if (this.reportData.summary.failedTests > 0) {
      recommendations.push(
        'Fix failing tests: Address the failed tests as a priority to ensure API integration stability.'
      );
    }

    // Recommendations based on performance metrics
    if (this.reportData.performanceMetrics.averageResponseTime > 500) {
      recommendations.push(
        'Improve overall API response time: The average response time exceeds 500ms, which may impact user experience.'
      );
    }

    // Find slow endpoints
    const slowEndpoints = Object.entries(this.reportData.performanceMetrics.endpointPerformance)
      .filter(([_, stats]) => stats.averageResponseTime > 1000)
      .map(([endpoint, _]) => endpoint);

    if (slowEndpoints.length > 0) {
      recommendations.push(
        `Optimize slow endpoints: The following endpoints have high response times: ${slowEndpoints.join(', ')}`
      );
    }

    // Check for skipped tests
    if (this.reportData.summary.skippedTests > 0) {
      recommendations.push(
        'Review skipped tests: Ensure skipped tests are intentional and not due to configuration issues.'
      );
    }

    // Add general recommendations
    recommendations.push(
      'Implement caching: Consider implementing or improving caching for frequently accessed data.',
      'Add more test coverage: Expand test coverage to include edge cases and error scenarios.',
      'Monitor API performance: Set up continuous monitoring of API performance in production.'
    );

    this.reportData.recommendations = recommendations;
  }

  /**
   * Generate console report
   */
  private generateConsoleReport(): void {
    console.log('\n');
    console.log('='.repeat(80));
    console.log('INTEGRATION TEST REPORT');
    console.log('='.repeat(80));

    // Summary
    console.log('\n📊 SUMMARY');
    console.log('-'.repeat(80));
    console.log(`Total Tests: ${this.reportData.summary.totalTests}`);
    console.log(`✅ Passed: ${this.reportData.summary.passedTests}`);
    console.log(`❌ Failed: ${this.reportData.summary.failedTests}`);
    console.log(`⏸️  Pending: ${this.reportData.summary.pendingTests}`);
    console.log(`⏭️  Skipped: ${this.reportData.summary.skippedTests}`);
    console.log(`Total Duration: ${(this.reportData.summary.totalDuration / 1000).toFixed(2)}s`);
    console.log(`Start Time: ${this.reportData.summary.startTime.toISOString()}`);
    console.log(`End Time: ${this.reportData.summary.endTime.toISOString()}`);

    // Failed Tests
    if (this.reportData.testResults.failed.length > 0) {
      console.log('\n❌ FAILED TESTS');
      console.log('-'.repeat(80));
      this.reportData.testResults.failed.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name} (${test.file})`);
        console.log(`   Duration: ${(test.duration / 1000).toFixed(2)}s`);
        console.log('   Failure Messages:');
        test.failureMessages?.forEach(message => {
          console.log(`   - ${message.split('\n')[0]}`); // Show only first line of error
        });
        console.log();
      });
    }

    // Performance Metrics
    console.log('\n⚡ PERFORMANCE METRICS');
    console.log('-'.repeat(80));
    console.log(`Average Response Time: ${this.reportData.performanceMetrics.averageResponseTime.toFixed(2)}ms`);

    if (this.reportData.performanceMetrics.slowestTests.length > 0) {
      console.log('\nSlowest Tests:');
      this.reportData.performanceMetrics.slowestTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.testName} - ${test.duration.toFixed(2)}ms`);
      });
    }

    if (Object.keys(this.reportData.performanceMetrics.endpointPerformance).length > 0) {
      console.log('\nEndpoint Performance:');
      Object.entries(this.reportData.performanceMetrics.endpointPerformance)
        .sort(([_, a], [__, b]) => b.averageResponseTime - a.averageResponseTime)
        .forEach(([endpoint, stats]) => {
          console.log(`- ${endpoint}`);
          console.log(`  Avg: ${stats.averageResponseTime.toFixed(2)}ms | Calls: ${stats.totalCalls} | Slowest: ${stats.slowestCall.toFixed(2)}ms | Fastest: ${stats.fastestCall.toFixed(2)}ms`);
        });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('-'.repeat(80));
    this.reportData.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });

    console.log('\n');
    console.log('='.repeat(80));
    console.log(`Report generated at: ${new Date().toISOString()}`);
    console.log('='.repeat(80));
    console.log('\n');
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(): void {
    const reportDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const reportFilePath = path.join(this.outputDir, `integration-test-report-${reportDate}.html`);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Integration Test Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .header {
      background-color: #34495e;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background-color: #f8f9fa;
      border-radius: 5px;
      padding: 15px;
      flex: 1;
      min-width: 200px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .passed { color: #27ae60; }
    .failed { color: #e74c3c; }
    .pending { color: #f39c12; }
    .skipped { color: #7f8c8d; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .section {
      margin-bottom: 40px;
      padding: 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .recommendations li {
      margin-bottom: 10px;
    }
    .error-message {
      background-color: #ffebee;
      padding: 10px;
      border-radius: 4px;
      color: #c62828;
      font-family: monospace;
      white-space: pre-wrap;
      margin-top: 10px;
    }
    .chart-container {
      height: 300px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Integration Test Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>

  <div class="section">
    <h2>Summary</h2>
    <div class="summary">
      <div class="summary-card">
        <h3>Test Results</h3>
        <p>Total Tests: <strong>${this.reportData.summary.totalTests}</strong></p>
        <p>Passed: <strong class="passed">${this.reportData.summary.passedTests}</strong></p>
        <p>Failed: <strong class="failed">${this.reportData.summary.failedTests}</strong></p>
        <p>Pending: <strong class="pending">${this.reportData.summary.pendingTests}</strong></p>
        <p>Skipped: <strong class="skipped">${this.reportData.summary.skippedTests}</strong></p>
      </div>
      <div class="summary-card">
        <h3>Timing</h3>
        <p>Total Duration: <strong>${(this.reportData.summary.totalDuration / 1000).toFixed(2)}s</strong></p>
        <p>Start Time: <strong>${this.reportData.summary.startTime.toLocaleString()}</strong></p>
        <p>End Time: <strong>${this.reportData.summary.endTime.toLocaleString()}</strong></p>
      </div>
      <div class="summary-card">
        <h3>Performance</h3>
        <p>Average Response Time: <strong>${this.reportData.performanceMetrics.averageResponseTime.toFixed(2)}ms</strong></p>
        <p>Total API Calls: <strong>${performanceMetrics.length}</strong></p>
      </div>
    </div>
  </div>

  ${this.reportData.testResults.failed.length > 0 ? `
  <div class="section">
    <h2>Failed Tests</h2>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>File</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${this.reportData.testResults.failed.map(test => `
          <tr>
            <td>${test.name}</td>
            <td>${test.file}</td>
            <td>${(test.duration / 1000).toFixed(2)}s</td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="error-message">${test.failureMessages?.join('\n\n') || 'No error message'}</div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <h2>Performance Metrics</h2>
    
    <h3>Slowest Tests</h3>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Duration</th>
          <th>API Endpoint</th>
        </tr>
      </thead>
      <tbody>
        ${this.reportData.performanceMetrics.slowestTests.map(test => `
          <tr>
            <td>${test.testName}</td>
            <td>${test.duration.toFixed(2)}ms</td>
            <td>${test.apiEndpoint || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3>Endpoint Performance</h3>
    <table>
      <thead>
        <tr>
          <th>Endpoint</th>
          <th>Avg Response Time</th>
          <th>Total Calls</th>
          <th>Slowest Call</th>
          <th>Fastest Call</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(this.reportData.performanceMetrics.endpointPerformance)
          .sort(([_, a], [__, b]) => b.averageResponseTime - a.averageResponseTime)
          .map(([endpoint, stats]) => `
            <tr>
              <td>${endpoint}</td>
              <td>${stats.averageResponseTime.toFixed(2)}ms</td>
              <td>${stats.totalCalls}</td>
              <td>${stats.slowestCall.toFixed(2)}ms</td>
              <td>${stats.fastestCall.toFixed(2)}ms</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <ul class="recommendations">
      ${this.reportData.recommendations.map(recommendation => `
        <li>${recommendation}</li>
      `).join('')}
    </ul>
  </div>

  <script>
    // You could add interactive charts here using a library like Chart.js
    // This would require including the Chart.js library
  </script>
</body>
</html>
    `;

    fs.writeFileSync(reportFilePath, htmlContent);
    console.log(`HTML report generated at: ${reportFilePath}`);
  }
}

/**
 * Performance tracking utilities
 */
class PerformanceTracker {
  /**
   * Start timing a test
   * @param testName - Name of the test
   */
  static startTest(testName: string): void {
    testStartTimes.set(testName, performance.now());
  }

  /**
   * End timing a test and record the metric
   * @param testName - Name of the test
   * @param apiEndpoint - Optional API endpoint being tested
   */
  static endTest(testName: string, apiEndpoint?: string): void {
    const startTime = testStartTimes.get(testName);
    if (startTime) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceMetrics.push({
        testName,
        duration,
        apiEndpoint,
        timestamp: Date.now()
      });

      testStartTimes.delete(testName);
    }
  }

  /**
   * Record an API call metric
   * @param endpoint - API endpoint
   * @param duration - Call duration in milliseconds
   */
  static recordApiCall(endpoint: string, duration: number): void {
    if (!apiCallMetrics.has(endpoint)) {
      apiCallMetrics.set(endpoint, []);
    }
    apiCallMetrics.get(endpoint)?.push(duration);
  }
}

/**
 * Jest reporter setup
 */
class JestReporter {
  private reporter: IntegrationTestReporter;

  constructor(globalConfig: any, options: any) {
    this.reporter = new IntegrationTestReporter({
      outputDir: options.outputDir,
      consoleEnabled: options.consoleEnabled !== false,
      htmlEnabled: options.htmlEnabled !== false
    });
  }

  onRunComplete(contexts: Set<any>, results: any): void {
    this.reporter.processTestResults(results.testResults);
  }
}

// Export the main classes and utilities
export {
  IntegrationTestReporter,
  PerformanceTracker,
  JestReporter
};

// Default export for Jest reporter
export default JestReporter;