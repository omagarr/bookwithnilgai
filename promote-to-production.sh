#!/bin/bash

# Script to promote changes from develop -> staging -> main
# Usage: ./promote-to-production.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting promotion: develop → staging → main${NC}"
echo ""

# Store the current branch to return to if needed
CURRENT_BRANCH=$(git branch --show-current)

# Function to handle errors
handle_error() {
    echo -e "${RED}Error occurred! Returning to original branch: $CURRENT_BRANCH${NC}"
    git checkout $CURRENT_BRANCH 2>/dev/null || true
    exit 1
}

# Set trap to handle errors
trap handle_error ERR

# Step 1: Merge develop into staging
echo -e "${GREEN}Step 1: Merging develop into staging...${NC}"
git checkout staging
git merge develop --no-edit
git push origin staging
echo -e "${GREEN}✓ Successfully pushed develop to staging${NC}"
echo ""

# Step 2: Merge staging into main
echo -e "${GREEN}Step 2: Merging staging into main...${NC}"
git checkout main
git merge staging --no-edit
git push origin main
echo -e "${GREEN}✓ Successfully pushed staging to main${NC}"
echo ""

# Step 3: Return to develop
echo -e "${GREEN}Step 3: Returning to develop branch...${NC}"
git checkout develop
echo -e "${GREEN}✓ Back on develop branch${NC}"
echo ""

echo -e "${GREEN}🎉 Successfully promoted changes through all environments!${NC}"
echo -e "${GREEN}   develop → staging → main${NC}"
