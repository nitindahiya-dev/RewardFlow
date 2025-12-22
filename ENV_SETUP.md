# Environment Variables Setup

This project uses environment variables to configure the API base URL for different environments (development and production).

## Setup Instructions

### 1. Create `.env` file

Create a `.env` file in the **root directory** (same level as `package.json`) with the following content:

```env
# Frontend Environment Variables
# API Base URL - Change this to your production URL when deploying
VITE_API_URL=http://localhost:5000
```

### 2. For Production

When deploying to production, update the `.env` file with your production API URL:

```env
# Production API URL
VITE_API_URL=https://your-production-api.com
```

**Note:** Make sure to:
- Never commit `.env` file to version control (it's already in `.gitignore`)
- Use `.env.example` as a template for other developers
- Update your deployment platform's environment variables with `VITE_API_URL`

## How It Works

- The API base URL is configured in `src/config/api.ts`
- All API endpoints are centralized and use `VITE_API_URL` from environment variables
- If `VITE_API_URL` is not set, it defaults to `http://localhost:5000`
- Vite requires the `VITE_` prefix for environment variables to be accessible in the browser

## Files Using API Configuration

All API calls now use the centralized configuration from `src/config/api.ts`:

- `src/store/slices/authSlice.ts` - Authentication endpoints
- `src/store/slices/signUpSlice.ts` - Signup endpoint
- `src/store/slices/taskSlice.ts` - Task endpoints
- `src/store/slices/commentSlice.ts` - Comment endpoints
- `src/store/slices/userSlice.ts` - User profile endpoints
- `src/pages/Profile.tsx` - MFA endpoints
- `src/pages/PublicTasks.tsx` - Public tasks endpoints
- `src/services/web3Auth.ts` - Web3 authentication endpoints
- `src/services/realtimeService.ts` - WebSocket connection

## Example Usage

```typescript
import { API_ENDPOINTS } from '../config/api';

// Use predefined endpoints
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  // ...
});

// Or use dynamic endpoints
const taskId = '123';
const response = await fetch(API_ENDPOINTS.TASKS.BY_ID(taskId), {
  method: 'GET',
  // ...
});
```

## Deployment Checklist

- [ ] Create `.env` file with production API URL
- [ ] Update deployment platform environment variables
- [ ] Verify API calls work in production
- [ ] Test WebSocket connections (if using real-time features)

