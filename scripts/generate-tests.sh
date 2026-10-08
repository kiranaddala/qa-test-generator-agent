#!/bin/bash

# QA Test Case Generator Script
# This script generates test cases using the AI agent

echo "🚀 Starting QA Test Case Generator..."
echo "=================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and add your API keys"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Run the test generator
echo "📝 Generating test cases..."
npm run dev

echo "✅ Test generation complete!"
echo "📁 Check output/ directory for generated test cases"
