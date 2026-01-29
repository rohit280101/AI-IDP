#!/bin/bash

# AI-IDP Server Restart Script

echo "🔄 Restarting AI-IDP Server..."
echo ""

# Stop the server
./stop_server.sh

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2

echo ""
# Start the server
./start_server.sh
