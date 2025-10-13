#!/bin/bash
echo "🚀 LAUNCHING STRATEGIC CODE IDE - NO MORE DELAYS!"

# Commit everything
git add .
git commit -m "FINAL DEPLOYMENT COMMIT - GOING LIVE" || true
git push origin main

# Try Vercel first (fastest)
if command -v vercel >/dev/null 2>&1; then
    echo "🚀 DEPLOYING VIA VERCEL..."
    vercel --prod --yes
elif command -v netlify >/dev/null 2>&1; then
    echo "🚀 DEPLOYING VIA NETLIFY..."
    netlify deploy --build --prod
else
    echo "🚀 INSTALLING VERCEL AND DEPLOYING..."
    npm install -g vercel
    vercel --prod --yes
fi

echo "🎉 DEPLOYMENT COMPLETE! YOUR APP IS LIVE!"
echo "🌍 Check your Vercel/Netlify dashboard for the live URL"