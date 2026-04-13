# Deployment Guide

Complete guide for deploying the Portfolio Backend to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Database Setup](#database-setup)
- [Cloudflare R2 Setup](#cloudflare-r2-setup)
- [Upstash Redis Setup](#upstash-redis-setup)
- [Email Setup (Resend)](#email-setup-resend)
- [OAuth Configuration](#oauth-configuration)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database created and accessible
- [ ] R2 bucket created with custom domain
- [ ] Redis instance created
- [ ] OAuth apps configured for production URLs
- [ ] Admin emails list updated
- [ ] NextAuth secret generated
- [ ] All tests passing locally
- [ ] Code pushed to GitHub

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### 3. Environment Variables

Add all environment variables from `.env` in Vercel's project settings:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env` file
3. Select appropriate environments (Production, Preview, Development)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to use your custom domain

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (M0 free tier is fine to start)
   - Select region closest to your users

2. **Create DB User and Network Access**
   - Create a database user with read/write access
   - Add network access entry (for cloud deploys, `0.0.0.0/0` is common)

3. **Get Connection String**
   - Click Connect → Drivers
   - Copy connection string
   - Format: `mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority`

4. **Configure Vercel**
   - Add `DATABASE_URL` to Vercel environment variables

5. **Push Prisma Schema**
   ```bash
   # From local machine with production DATABASE_URL set
   pnpm db:push
   ```

### Option 2: Self-Hosted MongoDB

1. **Provision MongoDB**
   - Deploy MongoDB on your own infrastructure
   - Ensure public connectivity from deployment environment

2. **Get Connection String**
   - Format: `mongodb://[user]:[password]@[host]:27017/[dbname]?authSource=admin`

3. **Configure Vercel**
   - Add `DATABASE_URL` to environment variables

4. **Push Prisma Schema**
   ```bash
   pnpm db:push
   ```

### Migration Strategy

**Important:** Vercel doesn't automatically apply Prisma schema changes.

**Option 1: Manual Migration**
```bash
# Set DATABASE_URL to production database
export DATABASE_URL="mongodb+srv://..."

# Run migration
pnpm db:push
```

**Option 2: GitHub Actions**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm db:push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Cloudflare R2 Setup

### 1. Create R2 Bucket

1. Log in to Cloudflare dashboard
2. Go to R2 → Create bucket
3. Name: `portfolio-assets` (or your choice)
4. Location: Automatic (or specific region)

### 2. Create API Token

1. Go to R2 → Manage R2 API Tokens
2. Create API token
3. Permissions: Object Read & Write
4. Copy Access Key ID and Secret Access Key

### 3. Configure Custom Domain

1. Go to R2 → your bucket → Settings
2. Custom Domains → Connect Domain
3. Add your domain (e.g., `cdn.yourdomain.com`)
4. Update DNS with provided CNAME record

### 4. Enable Public Access

1. Go to Settings → Public Access
2. Allow Access (if you want public URLs)
3. Or configure bucket policies for restricted access

### 5. Environment Variables

```env
R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
R2_BUCKET="portfolio-assets"
R2_ACCESS_KEY="your-access-key-id"
R2_SECRET_KEY="your-secret-access-key"
R2_PUBLIC_URL="https://cdn.yourdomain.com"
```

### CORS Configuration

If accessing R2 from browser:

1. Go to bucket settings
2. Add CORS policy:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## Upstash Redis Setup

### 1. Create Redis Database

1. Go to [upstash.com](https://upstash.com)
2. Create account / Log in
3. Create new Redis database
4. Select region closest to your Vercel deployment
5. Choose: "Global" for multi-region or "Regional" for single region

### 2. Get Credentials

1. Go to database details
2. Copy REST URL and Token
3. Format:
   ```
   REST URL: https://[name]-[id].upstash.io
   REST Token: [token]
   ```

### 3. Environment Variables

```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

## Email Setup (Resend)

### 1. Create Account

1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Verify your email

### 2. Add Domain

1. Go to Domains → Add Domain
2. Add your domain (e.g., `yourdomain.com`)
3. Add provided DNS records (SPF, DKIM, DMARC)
4. Wait for verification (can take up to 24 hours)

### 3. Create API Key

1. Go to API Keys → Create API Key
2. Name: "Portfolio Backend"
3. Permission: Full Access
4. Copy the API key (starts with `re_`)

### 4. Environment Variables

```env
RESEND_API_KEY="re_your_api_key"
ADMIN_EMAIL="your-email@yourdomain.com"
```

## OAuth Configuration

### GitHub OAuth (Production)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Edit your OAuth App (or create new one for production)
3. Update URLs:
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`
4. Update environment variables:
   ```env
   GITHUB_CLIENT_ID="your-production-client-id"
   GITHUB_CLIENT_SECRET="your-production-client-secret"
   ```

### Google OAuth (Production)

1. Go to Google Cloud Console
2. Select your project
3. Go to Credentials → Edit OAuth client
4. Add to Authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
5. Update environment variables:
   ```env
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   ```

## Environment Variables

Complete production `.env` template:

```env
# Database
DATABASE_URL="mongodb+srv://[production-db-url]"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[generate-with-openssl-rand-base64-32]"

# OAuth
GITHUB_CLIENT_ID="[production-github-id]"
GITHUB_CLIENT_SECRET="[production-github-secret]"
GOOGLE_CLIENT_ID="[production-google-id]"
GOOGLE_CLIENT_SECRET="[production-google-secret]"

# Cloudflare R2
R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
R2_BUCKET="portfolio-assets"
R2_ACCESS_KEY="[r2-access-key]"
R2_SECRET_KEY="[r2-secret-key]"
R2_PUBLIC_URL="https://cdn.yourdomain.com"

# Email
RESEND_API_KEY="re_[your-api-key]"
ADMIN_EMAIL="admin@yourdomain.com"

# Rate Limiting
UPSTASH_REDIS_REST_URL="https://[your-redis].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[your-token]"

# Admin Authorization
ADMIN_EMAILS="admin@yourdomain.com,team@yourdomain.com"

# Optional
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Check deployment logs in Vercel
- [ ] Visit your production URL
- [ ] Check all public API endpoints
- [ ] Test OAuth login
- [ ] Verify admin access

### 2. Seed Production Database

```bash
# Set production DATABASE_URL
export DATABASE_URL="mongodb+srv://..."

# Run seed
pnpm db:seed
```

Or create initial data through admin panel.

### 3. Test File Uploads

1. Log in as admin
2. Try uploading an image
3. Verify it appears in R2 bucket
4. Check public URL works

### 4. Configure Monitoring

Add monitoring for:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to your project
2. Analytics tab
3. Enable Web Analytics
4. View real-time metrics

### Error Tracking with Sentry (Optional)

```bash
pnpm add @sentry/nextjs
```

Follow Sentry Next.js setup guide.

### Logging

Vercel automatically captures logs:
- Go to your project → Logs
- Filter by function, status, etc.
- Set up log drains for long-term storage

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check MongoDB Atlas network access/IP allowlist
4. Ensure connection string includes correct database/user

### OAuth Not Working

**Error:** `OAuthCallback error`

**Solution:**
1. Verify callback URLs match exactly
2. Check client ID and secret are correct
3. Ensure NEXTAUTH_URL is set correctly
4. Clear browser cookies and try again

### File Upload Fails

**Error:** `Failed to generate presigned URL`

**Solution:**
1. Check R2 credentials are correct
2. Verify R2 bucket exists
3. Check API token has correct permissions
4. Ensure CORS is configured for R2

### Rate Limiting Not Working

**Error:** Rate limits not being enforced

**Solution:**
1. Verify Upstash Redis credentials
2. Check Redis connection in logs
3. Ensure environment variables are set
4. Test Redis connection manually

### Build Failures

**Error:** Build fails on Vercel

**Solution:**
1. Check build logs for specific error
2. Ensure all dependencies are in package.json
3. Verify TypeScript types are correct
4. Check environment variables are set
5. Try building locally: `pnpm build`

## Performance Optimization

### Database

1. Add indexes for frequently queried fields
2. Use connection pooling
3. Enable read replicas if needed

### Caching

1. Enable Vercel's edge caching
2. Use ISR for static content
3. Cache R2 responses with CDN

### Monitoring

1. Set up performance budgets
2. Monitor Core Web Vitals
3. Track API response times
4. Monitor database query performance

---

For more help, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
