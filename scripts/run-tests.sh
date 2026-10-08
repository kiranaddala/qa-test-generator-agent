#!/bin/bash

# Run Tests Script
# This script runs all Playwright tests

echo "🎭 Starting Playwright Tests..."
echo "================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests
echo "Running tests..."
npm test

echo "✅ Tests complete!"
echo "📊 View report with: npm run test:report"
