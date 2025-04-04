#!/bin/bash

# Enhanced script for running AI Interview Assistant in development mode
# This script starts both the frontend and backend servers with error handling

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
  echo -e "${YELLOW}Stopping services...${NC}"
  if [ ! -z "$BACKEND_PID" ]; then
    echo "Stopping backend (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping frontend (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null
  fi
  exit
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup INT TERM EXIT

# Function to check if a port is already in use
check_port() {
  port=$1
  if command -v lsof &> /dev/null; then
    lsof -i :$port -P -n | grep LISTEN &> /dev/null
    return $?
  elif command -v netstat &> /dev/null; then
    netstat -tuln | grep :$port &> /dev/null
    return $?
  else
    # If we can't check, assume it's free
    return 1
  fi
}

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    AI Interview Assistant - Dev Mode      ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check for prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js not found. Please install Node.js v16+${NC}"
    exit 1
else
    node_version=$(node -v)
    echo -e "${GREEN}✓ Node.js found: $node_version${NC}"
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python3 not found. Please install Python 3.10+${NC}"
    exit 1
else
    python_version=$(python3 --version)
    echo -e "${GREEN}✓ Python found: $python_version${NC}"
fi

# Check if ports are already in use
if check_port 3000; then
    echo -e "${RED}Error: Port 3000 is already in use. Please stop any services using this port.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Port 3000 is available${NC}"
fi

if check_port 8000; then
    echo -e "${RED}Error: Port 8000 is already in use. Please stop any services using this port.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Port 8000 is available${NC}"
fi

# Ensure we're in the project root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: backend or frontend directory not found.${NC}"
    echo -e "${YELLOW}Make sure you're running this script from the project root directory.${NC}"
    exit 1
fi

# Start backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend || { echo -e "${RED}Error: Failed to change to backend directory${NC}"; exit 1; }

# Check for requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}Error: requirements.txt not found in backend directory${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Found requirements.txt${NC}"
fi

# Create and activate virtual environment
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv .venv || { echo -e "${RED}Error: Failed to create virtual environment${NC}"; exit 1; }
    echo -e "${GREEN}✓ Created virtual environment${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Different activation syntax depending on shell
if [ -f ".venv/bin/activate" ]; then
    echo -e "${YELLOW}Activating virtual environment...${NC}"
    source .venv/bin/activate || { echo -e "${RED}Error: Failed to activate virtual environment${NC}"; exit 1; }
elif [ -f ".venv/Scripts/activate" ]; then
    echo -e "${YELLOW}Activating virtual environment...${NC}"
    source .venv/Scripts/activate || { echo -e "${RED}Error: Failed to activate virtual environment${NC}"; exit 1; }
else
    echo -e "${RED}Error: Virtual environment activation script not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Installing backend dependencies...${NC}"
pip install -r requirements.txt || { echo -e "${RED}Error: Failed to install backend dependencies${NC}"; exit 1; }
echo -e "${GREEN}✓ Installed backend dependencies${NC}"

# Handle .env file
if [ ! -f ".env.example" ]; then
    echo -e "${YELLOW}Warning: .env.example not found, skipping .env creation${NC}"
else
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
        cp .env.example .env || { echo -e "${RED}Error: Failed to create .env file${NC}"; exit 1; }
        echo -e "${GREEN}✓ Created .env file${NC}"
    else
        echo -e "${GREEN}✓ .env file already exists${NC}"
    fi
fi

echo -e "${BLUE}Starting backend server on http://localhost:8000...${NC}"
uvicorn app.main:app --reload &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started with PID: $BACKEND_PID${NC}"
cd ..

# Start frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend || { echo -e "${RED}Error: Failed to change to frontend directory${NC}"; exit 1; }

# Check for package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found in frontend directory${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Found package.json${NC}"
fi

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install || { echo -e "${RED}Error: Failed to install frontend dependencies${NC}"; exit 1; }
echo -e "${GREEN}✓ Installed frontend dependencies${NC}"

echo -e "${BLUE}Starting frontend server on http://localhost:3000...${NC}"
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started with PID: $FRONTEND_PID${NC}"
cd ..

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${BLUE}Services:${NC}"
echo -e "- Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "- Backend: ${GREEN}http://localhost:8000${NC}"
echo -e "- API Documentation: ${GREEN}http://localhost:8000/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${BLUE}============================================${NC}"

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID 