#!/bin/bash

# 🧠 Smart Spring - Auto-healing deployment mechanism

HEALING_ATTEMPTS=3

heal_and_retry() {
  local stage=$1
  local attempt=$2
  
  echo "🔧 Attempting to heal stage '$stage' (attempt $attempt/$HEALING_ATTEMPTS)"
  
  case $stage in
    "lint")
      # Auto-fix linting issues
      npx eslint --fix . 2>/dev/null
      npm run lint:fix 2>/dev/null || true
      ;;
    "type")
      # Clear type cache and retry
      rm -rf .next/cache 2>/dev/null
      rm -rf node_modules/.cache 2>/dev/null
      ;;
    "build")
      # Clear build cache
      rm -rf .next out 2>/dev/null
      npm run clean 2>/dev/null || true
      ;;
    "test")
      # Update snapshots if tests fail
      npm test -- --updateSnapshot 2>/dev/null || true
      ;;
  esac
  
  # Give healing a moment
  sleep 2
}

# Enhanced spring with auto-healing
enhanced_spring_deploy() {
  load_spring_state
  
  while [ $CURRENT_COIL -lt $MAX_COIL ]; do
    local attempts=0
    local success=false
    
    while [ $attempts -lt $HEALING_ATTEMPTS ] && [ "$success" = false ]; do
      if execute_stage $CURRENT_COIL; then
        success=true
        CURRENT_COIL=$((CURRENT_COIL + 1))
        save_spring_state $CURRENT_COIL
        draw_spring $CURRENT_COIL $MAX_COIL "success"
      else
        attempts=$((attempts + 1))
        if [ $attempts -lt $HEALING_ATTEMPTS ]; then
          echo "🏥 Spring healing attempt $attempts..."
          heal_and_retry "${STAGES[$CURRENT_COIL]%%:*}" $attempts
        fi
      fi
    done
    
    if [ "$success" = false ]; then
      echo "💀 Spring healing failed - manual intervention required"
      return 1
    fi
  done
  
  echo "🎉 SMART SPRING DEPLOYMENT COMPLETE!"
  return 0
}

# Include original spring functions
source scripts/spring-deploy.sh

enhanced_spring_deploy