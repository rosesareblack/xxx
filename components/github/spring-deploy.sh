#!/bin/bash

# 🌀 Spring Deployment System
# Progressively advances through stages, recoils on errors

SPRING_STATE_FILE=".spring-state"
MAX_COIL=7  # Total deployment stages

# Colors for visual feedback
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Spring stages (coil levels)
STAGES=(
  "init:🔧 Initialization"
  "lint:🔍 Code Quality Check" 
  "type:📝 TypeScript Validation"
  "build:🏗️  Build Process"
  "test:🧪 Testing Suite"
  "export:📦 Static Export"
  "deploy:🚀 Final Deployment"
)

# Load current spring position
load_spring_state() {
  if [ -f "$SPRING_STATE_FILE" ]; then
    CURRENT_COIL=$(cat "$SPRING_STATE_FILE")
  else
    CURRENT_COIL=0
  fi
}

# Save spring position
save_spring_state() {
  echo "$1" > "$SPRING_STATE_FILE"
}

# Visual spring representation
draw_spring() {
  local current=$1
  local max=$2
  local status=$3
  
  echo -e "\n${BLUE}🌀 SPRING DEPLOYMENT STATUS 🌀${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  for i in $(seq 0 $((max-1))); do
    if [ $i -lt $current ]; then
      echo -e "${GREEN}✅ Stage $((i+1)): ${STAGES[$i]#*:}${NC}"
    elif [ $i -eq $current ]; then
      if [ "$status" = "error" ]; then
        echo -e "${RED}❌ Stage $((i+1)): ${STAGES[$i]#*:} (FAILED)${NC}"
      elif [ "$status" = "running" ]; then
        echo -e "${YELLOW}⏳ Stage $((i+1)): ${STAGES[$i]#*:} (RUNNING)${NC}"
      else
        echo -e "${BLUE}🔄 Stage $((i+1)): ${STAGES[$i]#*:}${NC}"
      fi
    else
      echo -e "⚪ Stage $((i+1)): ${STAGES[$i]#*:}"
    fi
  done
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "Spring Position: ${BLUE}$current/$max${NC}"
}

# Execute a deployment stage
execute_stage() {
  local stage_num=$1
  local stage_info=${STAGES[$stage_num]}
  local stage_name=${stage_info%%:*}
  local stage_desc=${stage_info#*:}
  
  draw_spring $stage_num $MAX_COIL "running"
  echo -e "\n${YELLOW}Executing: $stage_desc${NC}"
  
  case $stage_name in
    "init")
      # Check prerequisites
      command -v node >/dev/null 2>&1 || { echo "Node.js required"; return 1; }
      [ -f package.json ] || { echo "package.json not found"; return 1; }
      ;;
    "lint")
      npm run lint --silent 2>/dev/null || return 1
      ;;
    "type")
      npx tsc --noEmit --skipLibCheck 2>/dev/null || return 1
      ;;
    "build")
      npm run build >/dev/null 2>&1 || return 1
      ;;
    "test")
      npm test --silent --passWithNoTests 2>/dev/null || return 1
      ;;
    "export")
      npm run export >/dev/null 2>&1 || echo "Export skipped or failed, continuing..."
      ;;
    "deploy")
      echo "🎉 Deployment simulation complete!"
      ;;
  esac
  
  return 0
}

# Spring mechanism - advance or recoil
spring_deploy() {
  load_spring_state
  
  echo -e "${BLUE}🌀 Starting Spring Deployment from coil $CURRENT_COIL${NC}"
  
  while [ $CURRENT_COIL -lt $MAX_COIL ]; do
    if execute_stage $CURRENT_COIL; then
      # Success - advance spring
      CURRENT_COIL=$((CURRENT_COIL + 1))
      save_spring_state $CURRENT_COIL
      draw_spring $CURRENT_COIL $MAX_COIL "success"
      sleep 0.5  # Visual delay
    else
      # Error - recoil spring
      draw_spring $CURRENT_COIL $MAX_COIL "error"
      echo -e "\n${RED}💥 SPRING RECOILED! Error at stage $((CURRENT_COIL + 1))${NC}"
      echo -e "${YELLOW}🔧 Fix the error and run again to continue from this point${NC}"
      return 1
    fi
  done
  
  # Spring fully extended - deployment complete!
  echo -e "\n${GREEN}🎉 SPRING FULLY EXTENDED - DEPLOYMENT COMPLETE! 🎉${NC}"
  rm -f "$SPRING_STATE_FILE"  # Reset spring
  return 0
}

# Reset spring to beginning
reset_spring() {
  rm -f "$SPRING_STATE_FILE"
  echo -e "${BLUE}🔄 Spring reset to initial position${NC}"
}

# Show current spring state
show_spring() {
  load_spring_state
  draw_spring $CURRENT_COIL $MAX_COIL "idle"
}

# Main script logic
case "${1:-deploy}" in
  "deploy"|"")
    spring_deploy
    ;;
  "reset")
    reset_spring
    ;;
  "status")
    show_spring
    ;;
  "watch")
    # Continuous spring deployment on file changes
    echo -e "${BLUE}👁️  Spring watch mode activated${NC}"
    if command -v fswatch >/dev/null 2>&1; then
      fswatch -o . --exclude=".spring-state" | while read; do
        echo -e "\n${YELLOW}📁 Changes detected - triggering spring...${NC}"
        spring_deploy
      done
    else
      echo "fswatch not found. Install with: brew install fswatch"
    fi
    ;;
  *)
    echo "Usage: $0 [deploy|reset|status|watch]"
    ;;
esac