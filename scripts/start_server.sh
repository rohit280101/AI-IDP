#!/bin/bash

# AI-IDP Server Startup Script

echo "🚀 Starting AI-IDP Server..."
echo ""

# Navigate to project directory
cd /Users/rohitgupta/repositories/AI-IDP

# Kill any existing server on port 8000
echo "📋 Checking for existing processes on port 8000..."
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is in use. Killing existing process..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port freed"
else
    echo "✅ Port 8000 is available"
fi

# Use Python 3.13 from miniconda (compatible with SQLAlchemy)
PYTHON_CMD="/Users/rohitgupta/miniconda3/bin/python"

echo ""
echo "🔍 Environment Info:"
echo "   Python: $($PYTHON_CMD --version)"
echo "   Location: $PYTHON_CMD"
echo "   Uvicorn: $($PYTHON_CMD -m uvicorn --version 2>&1 | head -1)"

echo ""
echo "🔧 Starting server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔄 Hot reload: ENABLED"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
$PYTHON_CMD -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
