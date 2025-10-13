# Chatbot UI - Replit Configuration

## Overview
This is a Next.js-based Chatbot UI application that has been configured to run on Replit. The application provides a web interface for interacting with various AI chatbot models through Supabase authentication and database services.

## Project Structure
- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Supabase for authentication and database
- **State Management**: React Context API
- **UI Components**: Radix UI components with custom styling
- **Internationalization**: i18next with support for multiple languages

## Recent Changes (October 2025)
- ✅ Configured Next.js to run on port 5000 with host 0.0.0.0 for Replit compatibility
- ✅ Set up Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- ✅ Fixed hydration mismatch warnings by adding 'use client' directive to SVG components
- ✅ Removed husky git hooks to prevent Replit compatibility issues
- ✅ Configured workflow to run the development server

## Environment Variables
The following environment variables are required and stored in Replit Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

Optional API keys for AI providers can be added as needed:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `MISTRAL_API_KEY`
- `GROQ_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENROUTER_API_KEY`

## Running the Application
The application runs automatically via the configured workflow:
- **Command**: `npm run dev`
- **Port**: 5000
- **Host**: 0.0.0.0

To start the application manually:
```bash
npm run dev
```

## Development Notes
- The application is configured as a Progressive Web App (PWA) using next-pwa
- Supports dark and light themes via next-themes
- Uses client-side rendering for components that depend on browser APIs
- Development mode has some expected warnings (GenerateSW, metadata.metadataBase) that don't affect functionality

## Known Issues
- Browser console may show hydration warnings in development mode due to browser caching
- These warnings don't affect the application's functionality
- A hard refresh (Ctrl+Shift+R or Cmd+Shift+R) clears these warnings

## User Preferences
- Web-based deployment preferred over desktop applications (Tauri was not implemented)
- Hybrid/web-based project focus
