#!/bin/bash

# AI-IDP Server Stop Script

echo "🛑 Stopping AI-IDP Server..."

if lsof -ti:8000 > /dev/null 2>&1; then
    echo "⚠️  Found process on port 8000. Stopping..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Server stopped"
else
    echo "ℹ️  No server running on port 8000"
fi

# Also kill any uvicorn processes
pkill -9 -f "uvicorn app.main" 2>/dev/null && echo "✅ All uvicorn processes stopped"

echo ""
echo "✅ Done!"
