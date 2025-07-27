# 🔧 Netlify Blobs Setup Guide

## 🚨 Problem Fixed

The `MissingBlobsEnvironmentError` was occurring because the environment variables for Netlify Blobs were not properly configured. This has been fixed by:

1. **Updated Environment Variables**: Changed `NETLIFY_SITE_ID` and `NETLIFY_ACCESS_TOKEN` to `NETLIFY_BLOBS_SITE_ID` and `NETLIFY_BLOBS_TOKEN` in `netlify.toml`
2. **Updated All Functions**: Modified `banners.js`, `events.js`, and `participants.js` to use a consistent `createStore()` helper function
3. **Added Environment Variables to All Contexts**: Ensured the variables are available in build, production, and deploy-preview contexts

## ✅ Changes Made

### 1. Updated `netlify.toml`

```toml
[build.environment]
  NETLIFY_BLOBS_SITE_ID = "6a528881-522e-4e8e-a178-2ac8f44c1a97"
  NETLIFY_BLOBS_TOKEN = "nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3"

[context.production.environment]
  NETLIFY_BLOBS_SITE_ID = "6a528881-522e-4e8e-a178-2ac8f44c1a97"
  NETLIFY_BLOBS_TOKEN = "nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3"

[context.deploy-preview.environment]
  NETLIFY_BLOBS_SITE_ID = "6a528881-522e-4e8e-a178-2ac8f44c1a97"
  NETLIFY_BLOBS_TOKEN = "nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3"
```

### 2. Updated All Functions

All functions now use a consistent `createStore()` helper that:
- Automatically detects environment variables
- Works in both production and local development
- Provides proper error handling

### 3. Added Test Function

Created `netlify/functions/test-blobs.js` to verify the setup is working.

## 🚀 Deployment Steps

### 1. Deploy to Netlify

```bash
# Commit and push your changes
git add .
git commit -m "Fix Netlify Blobs configuration"
git push origin main
```

### 2. Verify Environment Variables

In your Netlify dashboard, ensure these environment variables are set:
- `NETLIFY_BLOBS_SITE_ID`: `6a528881-522e-4e8e-a178-2ac8f44c1a97`
- `NETLIFY_BLOBS_TOKEN`: `nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3`

### 3. Test the Setup

After deployment, test the Blobs configuration:

```bash
# Test the Blobs setup
curl https://your-site.netlify.app/.netlify/functions/test-blobs
```

Expected response:
```json
{
  "success": true,
  "message": "Netlify Blobs is working correctly!",
  "environment": {
    "hasSiteID": true,
    "hasToken": true,
    "siteID": "***"
  },
  "testData": {
    "message": "Hello from Netlify Blobs!",
    "timestamp": "2024-01-XX..."
  }
}
```

## 🧪 Testing Your Functions

### Test Banners API

```bash
# List banners
curl https://your-site.netlify.app/.netlify/functions/banners

# Upload a banner (requires authentication)
curl -X POST https://your-site.netlify.app/.netlify/functions/banners \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.png","dataBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="}'
```

### Test Events API

```bash
# List events
curl https://your-site.netlify.app/.netlify/functions/events

# Create an event
curl -X POST https://your-site.netlify.app/.netlify/functions/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","banner_url":"https://example.com/banner.jpg"}'
```

### Test Participants API

```bash
# Add a participant
curl -X POST https://your-site.netlify.app/.netlify/functions/participants \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"I want to attend!"}'
```

## 🔍 Troubleshooting

### If You Still Get MissingBlobsEnvironmentError

1. **Check Environment Variables**: Verify they're set in Netlify dashboard
2. **Check Function Logs**: Look at Netlify function logs for detailed error messages
3. **Test Locally**: Use `netlify dev` with environment variables set

### Local Development

For local development, create a `.env` file in your project root:

```env
NETLIFY_BLOBS_SITE_ID=6a528881-522e-4e8e-a178-2ac8f44c1a97
NETLIFY_BLOBS_TOKEN=nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3
```

### Common Issues

1. **Token Expired**: Generate a new token in Netlify dashboard
2. **Wrong Site ID**: Verify the site ID matches your Netlify site
3. **Function Timeout**: Increase function timeout in `netlify.toml` if needed

## 📝 Notes

- The `createStore()` helper function automatically handles both production and local development
- Environment variables are injected automatically in production
- Local development requires manual environment variable setup
- All functions now use the same pattern for consistency

## ✅ Success Criteria

- [ ] `test-blobs` function returns success
- [ ] Banner uploads work
- [ ] Event creation works
- [ ] Participant registration works
- [ ] No more MissingBlobsEnvironmentError