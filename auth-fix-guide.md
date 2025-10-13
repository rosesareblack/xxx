# Authentication Fix Guide

This guide helps resolve common authentication issues in the Strategic Code IDE.

## Overview

Authentication problems can prevent users from accessing AI features, GitHub integration, and other services. This guide provides step-by-step solutions for the most common authentication issues.

## Common Authentication Issues

### 1. GitHub Authentication Errors

#### Symptoms
- "Unauthorized" errors when accessing repositories
- Unable to fetch repository data
- GitHub API rate limiting messages

#### Solutions

**Update GitHub Token**
```bash
# Set environment variable
export GITHUB_TOKEN="your_new_token_here"

# Or update .env.local
echo "GITHUB_TOKEN=your_new_token_here" >> .env.local
```

**Generate New Personal Access Token**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with required scopes:
   - `repo` - Full repository access
   - `user` - User profile access
   - `read:org` - Read organization data

**Test Token Validity**
```bash
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### 2. API Authentication Issues

#### Symptoms
- AI services returning 401/403 errors
- "Invalid API key" messages
- Service unavailable errors

#### Solutions

**Verify API Keys**
```bash
# Check if API keys are set
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY
```

**Update API Configuration**
```typescript
// In your API configuration
const apiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1'
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com'
  }
};
```

### 3. Session Management Issues

#### Symptoms
- Frequent re-authentication requests
- Session expires quickly
- Login state not persisting

#### Solutions

**Configure Session Storage**
```typescript
// app/api/auth/[...nextauth]/route.ts
export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
});
```

**Clear Browser Storage**
```javascript
// Clear all authentication data
localStorage.clear();
sessionStorage.clear();
// Clear cookies for the domain
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

## Authentication Flow

### 1. Initial Setup

**Environment Configuration**
```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local
```

**Required Environment Variables**
```env
# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Services
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

### 2. OAuth Setup

**GitHub OAuth Application**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App with:
   - Application name: "Strategic Code IDE"
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/github`

**NextAuth Configuration**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});
```

## Debugging Authentication

### 1. Enable Debug Logging

```bash
# Enable NextAuth debug mode
DEBUG=nextauth* npm run dev

# Enable detailed logging
NEXTAUTH_DEBUG=true npm run dev
```

### 2. Check Network Requests

```javascript
// Monitor authentication requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', response);
      return response;
    });
};
```

### 3. Validate Token Format

```javascript
// Check JWT token structure
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
}
```

## Security Best Practices

### 1. Token Management

**Secure Storage**
```typescript
// Use httpOnly cookies for sensitive tokens
export function setSecureToken(token: string) {
  document.cookie = `auth_token=${token}; httpOnly; secure; sameSite=strict; path=/`;
}

// Use sessionStorage for temporary tokens
sessionStorage.setItem('temp_token', token);
```

**Token Rotation**
```typescript
// Implement automatic token refresh
async function refreshToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      const { token } = await response.json();
      return token;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Redirect to login
    window.location.href = '/auth/signin';
  }
}
```

### 2. API Security

**Rate Limiting**
```typescript
// Implement client-side rate limiting
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
}
```

**Request Validation**
```typescript
// Validate and sanitize API requests
function validateApiRequest(request: any) {
  const schema = {
    endpoint: 'string',
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    headers: 'object'
  };
  
  // Perform validation logic
  return isValid;
}
```

## Testing Authentication

### 1. Unit Tests

```typescript
// Test authentication utilities
import { validateToken, refreshToken } from '../auth/utils';

describe('Authentication Utils', () => {
  test('validates correct token format', () => {
    const validToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';
    expect(validateToken(validToken)).toBe(true);
  });

  test('handles token refresh', async () => {
    const newToken = await refreshToken();
    expect(newToken).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// Test complete authentication flow
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../components/AuthProvider';

test('authentication flow', async () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
  
  fireEvent.click(screen.getByText('Sign in with GitHub'));
  
  await waitFor(() => {
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });
});
```

## Recovery Procedures

### 1. Complete Reset

```bash
# Clear all authentication data
rm -rf .next
rm -f .env.local
npm run clean

# Reinstall dependencies
npm install

# Restart development server
npm run dev
```

### 2. Database Reset

```sql
-- Clear user sessions (if using database sessions)
DELETE FROM sessions WHERE expires < NOW();
DELETE FROM accounts WHERE provider = 'github';
DELETE FROM users WHERE email = 'your@email.com';
```

### 3. Service Reset

```bash
# Restart all services
docker-compose down
docker-compose up -d

# Or for development
npm run dev:clean
```

## Monitoring and Alerts

### 1. Authentication Metrics

```typescript
// Track authentication events
function trackAuthEvent(event: string, data?: any) {
  console.log(`Auth Event: ${event}`, data);
  
  // Send to analytics service
  analytics.track('auth_event', {
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
}
```

### 2. Error Reporting

```typescript
// Report authentication errors
function reportAuthError(error: Error, context: any) {
  console.error('Authentication Error:', error, context);
  
  // Send to error tracking service
  errorReporting.captureException(error, {
    tags: { type: 'authentication' },
    extra: context
  });
}
```

## Support Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [JWT Debugging Tools](https://jwt.io/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)g