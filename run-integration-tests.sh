#!/bin/bash

# run-integration-tests.sh
# Script to automate running integration tests between the E-commerce Frontend and API Performance Optimization backend

# Set variables
BACKEND_DIR="/home/kavia/workspace/code-maintenance-job-8f1ac8b1-49e7-402b-b303-11ca603936f6/API-Performance-Optimization-L.0.8"
FRONTEND_DIR="/home/kavia/workspace/code-maintenance-job-8f1ac8b1-49e7-402b-b303-11ca603936f6/E-commerce-Frontend-L.0.6"
API_URL="http://localhost:8000"
MAX_RETRIES=30
RETRY_INTERVAL=2

# Function to display help message
show_help() {
    echo "Usage: ./run-integration-tests.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help                 Show this help message"
    echo "  --skip-backend-start   Skip starting the backend services (use if already running)"
    echo "  --skip-backend-stop    Skip stopping the backend services after tests"
    echo "  --test-file FILE       Run specific test file (relative to src/services/__tests__/integration/)"
    echo "  --watch                Run tests in watch mode"
    echo ""
    echo "Examples:"
    echo "  ./run-integration-tests.sh                                  # Run all integration tests"
    echo "  ./run-integration-tests.sh --test-file productService.integration.test.ts  # Run specific test file"
    echo "  ./run-integration-tests.sh --skip-backend-start             # Skip starting backend services"
}

# Parse command line arguments
SKIP_BACKEND_START=false
SKIP_BACKEND_STOP=false
TEST_FILE=""
WATCH_MODE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --help)
            show_help
            exit 0
            ;;
        --skip-backend-start)
            SKIP_BACKEND_START=true
            shift
            ;;
        --skip-backend-stop)
            SKIP_BACKEND_STOP=true
            shift
            ;;
        --test-file)
            TEST_FILE="$2"
            shift 2
            ;;
        --watch)
            WATCH_MODE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Function to check if the API is available
check_api_health() {
    echo "Checking API health at $API_URL/api/v1/health..."
    if curl -s -f "$API_URL/api/v1/health" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to wait for the API to be ready
wait_for_api() {
    echo "Waiting for API to be ready..."
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if check_api_health; then
            echo "API is ready!"
            return 0
        fi
        
        echo "API not ready yet. Retrying in $RETRY_INTERVAL seconds... (Attempt $((retries+1))/$MAX_RETRIES)"
        sleep $RETRY_INTERVAL
        retries=$((retries+1))
    done
    
    echo "Error: API did not become ready within the timeout period."
    return 1
}

# Function to start backend services
start_backend() {
    echo "Starting backend services..."
    cd "$BACKEND_DIR" || { echo "Error: Backend directory not found"; exit 1; }
    
    # Use the existing docker-scripts.sh to start the development environment
    ./docker-scripts.sh dev-up
    
    # Return to the frontend directory
    cd "$FRONTEND_DIR" || { echo "Error: Frontend directory not found"; exit 1; }
}

# Function to stop backend services
stop_backend() {
    echo "Stopping backend services..."
    cd "$BACKEND_DIR" || { echo "Error: Backend directory not found"; exit 1; }
    
    # Use the existing docker-scripts.sh to stop the development environment
    ./docker-scripts.sh dev-down
    
    # Return to the frontend directory
    cd "$FRONTEND_DIR" || { echo "Error: Frontend directory not found"; exit 1; }
}

# Function to run integration tests
run_tests() {
    echo "Running integration tests..."
    cd "$FRONTEND_DIR" || { echo "Error: Frontend directory not found"; exit 1; }
    
    # Build the test command
    TEST_COMMAND="npm test"
    
    if [ -n "$TEST_FILE" ]; then
        # Run specific test file
        TEST_COMMAND="$TEST_COMMAND -- --testMatch=\"**/__tests__/integration/$TEST_FILE\""
    else
        # Run all integration tests
        TEST_COMMAND="$TEST_COMMAND -- --testMatch=\"**/__tests__/integration/**/*.ts\""
    fi
    
    if [ "$WATCH_MODE" = false ]; then
        TEST_COMMAND="$TEST_COMMAND --watchAll=false"
    fi
    
    # Execute the test command
    echo "Executing: $TEST_COMMAND"
    eval "$TEST_COMMAND"
    
    # Store the test result
    TEST_RESULT=$?
    
    return $TEST_RESULT
}

# Main script execution
echo "=== E-commerce Frontend Integration Tests ==="
echo "Backend directory: $BACKEND_DIR"
echo "Frontend directory: $FRONTEND_DIR"
echo ""

# Make the script executable
chmod +x "$0"

# Start backend services if not skipped
if [ "$SKIP_BACKEND_START" = false ]; then
    start_backend
    
    # Wait for the API to be ready
    wait_for_api || { 
        echo "Error: Backend API is not available. Stopping services and exiting."
        stop_backend
        exit 1
    }
else
    echo "Skipping backend services startup (--skip-backend-start flag provided)"
    
    # Check if API is available
    if ! check_api_health; then
        echo "Warning: Backend API does not appear to be running at $API_URL"
        echo "Tests may fail if the API is not available."
        echo "Press Ctrl+C to cancel or Enter to continue anyway..."
        read -r
    fi
fi

# Run the integration tests
run_tests
TEST_RESULT=$?

# Stop backend services if not skipped
if [ "$SKIP_BACKEND_START" = false ] && [ "$SKIP_BACKEND_STOP" = false ]; then
    stop_backend
else
    if [ "$SKIP_BACKEND_STOP" = true ]; then
        echo "Skipping backend services shutdown (--skip-backend-stop flag provided)"
    fi
fi

# Exit with the test result
echo ""
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ Integration tests completed successfully!"
else
    echo "❌ Integration tests failed with exit code $TEST_RESULT"
fi

exit $TEST_RESULT