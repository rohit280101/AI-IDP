#!/bin/bash

# AI-IDP Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "==================================="
echo "AI-IDP Deployment Script"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    echo "Run: cp .env.example .env"
    exit 1
fi

# Check if required environment variables are set
echo -e "${YELLOW}Checking environment variables...${NC}"
source .env

if [ "$JWT_SECRET_KEY" == "your-super-secret-jwt-key-change-this-in-production" ]; then
    echo -e "${RED}Error: JWT_SECRET_KEY is still set to default value${NC}"
    echo "Please update JWT_SECRET_KEY in .env file"
    exit 1
fi

if [ "$POSTGRES_PASSWORD" == "your-secure-password-here" ]; then
    echo -e "${RED}Error: POSTGRES_PASSWORD is still set to default value${NC}"
    echo "Please update POSTGRES_PASSWORD in .env file"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"

# Check Docker and Docker Compose
echo -e "${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"

# Ask for deployment type
echo ""
echo "Select deployment type:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized)"
echo "3) Production with Nginx"
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        COMPOSE_FILE="docker-compose.yml"
        DEPLOY_TYPE="Development"
        ;;
    2)
        COMPOSE_FILE="docker-compose.prod.yml"
        DEPLOY_TYPE="Production"
        ;;
    3)
        COMPOSE_FILE="docker-compose.prod.yml"
        DEPLOY_TYPE="Production with Nginx"
        PROFILE_FLAG="--profile production"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Deploying ${DEPLOY_TYPE}...${NC}"

# Build images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose -f $COMPOSE_FILE build

# Start services
echo -e "${YELLOW}Starting services...${NC}"
if [ -n "$PROFILE_FLAG" ]; then
    docker-compose -f $COMPOSE_FILE $PROFILE_FLAG up -d
else
    docker-compose -f $COMPOSE_FILE up -d
fi

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f $COMPOSE_FILE exec -T backend alembic upgrade head

echo ""
echo -e "${GREEN}==================================="
echo "Deployment Complete!"
echo "===================================${NC}"
echo ""
echo "Services:"
if [ "$choice" == "3" ]; then
    echo "  - Application: http://localhost (via Nginx)"
    echo "  - Backend API: http://localhost/api/v1"
else
    echo "  - Frontend: http://localhost:5173"
    echo "  - Backend API: http://localhost:8000"
fi
echo "  - API Documentation: http://localhost:8000/docs"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "  - Stop services: docker-compose -f $COMPOSE_FILE down"
echo "  - Restart services: docker-compose -f $COMPOSE_FILE restart"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
