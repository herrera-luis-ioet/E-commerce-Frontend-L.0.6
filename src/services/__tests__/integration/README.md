# Integration Testing Setup

This directory contains utilities for integration testing between the E-commerce Frontend and the API Performance Optimization backend.

## Overview

The integration test setup provides:

1. Configuration of the API base URL for testing
2. Utilities for creating test data in the backend
3. Cleanup functions to remove test data after tests
4. Helper methods for common operations

## Files

- `setup.ts` - The main setup script that provides the integration test utilities
- `test_api_integration.ts` - Example tests demonstrating how to use the setup script

## Usage

### Basic Setup

Import the setup script in your test file:

```typescript
import integrationTestSetup from './setup';
```

### Configuration

Configure the API URL (optional, defaults to http://localhost:8000):

```typescript
// Configure the API URL
integrationTestSetup.configureApi('http://localhost:8000');
```

### Creating Test Data

Create test products:

```typescript
// Generate sample product data
const testProduct = integrationTestSetup.generateSampleProduct({
  name: 'Custom Product Name',
  price: 49.99
});

// Create the product in the backend
const createdProduct = await integrationTestSetup.createTestProduct(testProduct);
```

Create test orders:

```typescript
// Create a product first
const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

// Generate sample order data using the product ID
const testOrder = integrationTestSetup.generateSampleOrder([createdProduct.id]);

// Create the order in the backend
const createdOrder = await integrationTestSetup.createTestOrder(testOrder);
```

### Cleaning Up Test Data

Clean up all test data after each test:

```typescript
afterEach(async () => {
  await integrationTestSetup.cleanupTestData();
});
```

### Complete Test Example

```typescript
describe('Product API Integration', () => {
  // Clean up after each test
  afterEach(async () => {
    await integrationTestSetup.cleanupTestData();
  });

  test('should create and retrieve a product', async () => {
    // Create test data
    const testProduct = integrationTestSetup.generateSampleProduct();
    const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

    // Test the frontend service
    const response = await productService.getProductById(createdProduct.id.toString());
    
    // Assertions
    expect(response.success).toBe(true);
    expect(response.data.name).toBe(testProduct.name);
  });
});
```

## Running Integration Tests

To run the integration tests, make sure the backend API is running, then use:

```bash
# Run all integration tests
npm test -- --testMatch="**/__tests__/integration/**/*.ts" --watchAll=false

# Run a specific integration test file
npm test -- --testMatch="**/__tests__/integration/test_api_integration.ts" --watchAll=false
```

## Prerequisites

Before running integration tests:

1. Start the backend API using Docker Compose:
   ```bash
   cd /path/to/API-Performance-Optimization-L.0.8
   docker-compose up -d
   ```

2. Wait for the API to be fully initialized (check health endpoint)

3. Run the integration tests

## Best Practices

1. Always clean up test data after tests
2. Use unique identifiers for test data (the setup script handles this)
3. Check if the API is available before running tests
4. Keep tests isolated and independent
5. Use the provided helper methods instead of direct API calls when possible