# Vercel Deployment Guide

## What Changed for Serverless Compatibility

### 1. **Environment Variable Loading**

- **Before**: Environment variables were validated at module load time
- **After**: Lazy validation on first access to prevent build-time crashes
- **Why**: Vercel injects environment variables at runtime, not build time

### 2. **Database Connections**

- **Before**: Single connection established once
- **After**: Connection reuse across function invocations with proper checks
- **Why**: Serverless functions can be reused ("warm starts"), so we check and reuse existing connections

### 3. **Project Structure**

- **Added**: `/api/index.ts` as the serverless entry point
- **Why**: Vercel expects serverless functions in the `/api` directory

### 4. **Rate Limiting Consideration**

- **Note**: In-memory rate limiting has limitations in serverless
- **Each function instance** has its own memory, limits aren't globally shared
- **For production**: Consider Vercel's built-in rate limiting or external stores (Redis)

## Environment Variables Required on Vercel

Make sure to set these in your Vercel project dashboard:

```
DATABASE_URL=mongodb+srv://...
SECRET=your-secret-key-minimum-32-characters
BETTER_AUTH_SECRET=your-better-auth-secret-minimum-32-chars
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_SERVICE_NAME=gmail
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-specific-password
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true
BETTER_AUTH_URL=https://your-app.vercel.app
BETTER_AUTH_TRUSTED_ORIGINS=https://your-app.vercel.app,https://your-frontend.vercel.app
CLIENT_HOST=https://your-frontend.vercel.app
NODE_ENV=production
```

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy to preview**:

   ```bash
   vercel
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Testing Locally with Vercel Environment

```bash
vercel dev
```

This will run your app locally but simulate the Vercel serverless environment.

## Common Issues and Solutions

### Issue: "FUNCTION_INVOCATION_FAILED"

**Causes:**

- Environment variables not set in Vercel dashboard
- Database connection timeout
- Unhandled promise rejection
- Module failing to load

**Solutions:**

1. Check Vercel function logs: `vercel logs [deployment-url]`
2. Verify all environment variables are set
3. Ensure MongoDB connection string is correct and accessible from Vercel
4. Check that MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or Vercel IPs

### Issue: Cold Starts Taking Too Long

**Solution:**

- Optimize database connection pooling (already configured)
- Consider upgrading to Vercel Pro for better performance
- Use MongoDB connection pooling effectively

### Issue: Rate Limiting Not Working Across Requests

**Expected Behavior:** In-memory rate limiting only works per function instance
**Solution:**

- For production, use Vercel's Edge Config or external Redis store
- Or rely on Vercel's built-in DDoS protection

## Monitoring

- View logs: `vercel logs [deployment-url]`
- Check function metrics in Vercel Dashboard
- Monitor database connections in MongoDB Atlas

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] MongoDB Atlas allows Vercel IP ranges
- [ ] CORS origins updated for production URLs
- [ ] Better-Auth URLs configured correctly
- [ ] Test all auth endpoints
- [ ] Test all API endpoints
- [ ] Monitor first few deployments for errors
