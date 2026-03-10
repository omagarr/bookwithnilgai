#!/bin/bash

echo "🚀 Starting Local Development Environment..."

# Check if .env.local files exist
if [ ! -f ".env.local" ]; then
    echo "⚠️  Frontend .env.local not found. Creating from example..."
    cp env.example .env.local
    echo "✅ Please edit .env.local with your configuration"
fi

if [ ! -f "../nilgaib2bbackend/.env.local" ]; then
    echo "⚠️  Backend .env.local not found. Please create it from .env.example"
    echo "📁 Location: /Users/omagarwal/Documents/GitHub/nilgaib2bbackend/.env.local"
    exit 1
fi

# Start services using docker-compose
echo "🐳 Starting services with Docker Compose..."
docker-compose up --build

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:3001"
echo "🌐 Backend API: http://localhost:3000"
echo "📚 API Docs: http://localhost:3000/api-docs" 