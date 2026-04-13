# Quick Start Guide

Get your Portfolio Backend up and running in 5 minutes.

## Prerequisites

✅ Node.js 20+ installed  
✅ pnpm installed (`npm install -g pnpm`)  
✅ Git installed

## Step 1: Clone and Install

```bash
# Navigate to your project directory
cd "C:\Users\yuvra\OneDrive\Documents\08_11_2025 Portfolio"

# Install dependencies
pnpm install
```

## Step 2: Set Up Environment Variables

```bash
# Copy the example environment file
copy .env.example .env

# Open .env in your text editor
notepad .env
```

### Minimum Required Variables (for local development)

```env
# Database (MongoDB Atlas recommended)
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"

# NextAuth (generate a random secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# For now, use placeholder values for OAuth (you'll set these up later)
GITHUB_CLIENT_ID="placeholder"
GITHUB_CLIENT_SECRET="placeholder"
GOOGLE_CLIENT_ID="placeholder"
GOOGLE_CLIENT_SECRET="placeholder"

# Cloudflare R2 (set up later)
R2_ENDPOINT="https://placeholder.r2.cloudflarestorage.com"
R2_BUCKET="placeholder"
R2_ACCESS_KEY="placeholder"
R2_SECRET_KEY="placeholder"
R2_PUBLIC_URL="https://placeholder.com"

# Resend (set up later)
RESEND_API_KEY="re_placeholder"
ADMIN_EMAIL="your-email@example.com"

# Upstash Redis (set up later)
UPSTASH_REDIS_REST_URL="https://placeholder.upstash.io"
UPSTASH_REDIS_REST_TOKEN="placeholder"

# Your admin email
ADMIN_EMAILS="your-email@example.com"
```

### Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 3: Set Up Database

### Option A: Local MongoDB

```bash
# Install MongoDB Community Server (if not installed)
# Download from: https://www.mongodb.com/try/download/community

# Update .env
DATABASE_URL="mongodb://localhost:27017/portfolio"
```

### Option B: MongoDB Atlas (Recommended - Free Tier)

1. Go to https://www.mongodb.com/atlas
2. Create account and a new cluster
3. Create a database user and allow network access
4. Copy connection string from Connect → Drivers
5. Paste into `.env` as `DATABASE_URL`

### Option C: Self-Hosted MongoDB

1. Provision a MongoDB instance/server
2. Create user and database
3. Copy connection string
4. Paste into `.env` as `DATABASE_URL`

## Step 4: Initialize Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with example data (optional)
pnpm db:seed
```

## Step 5: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser!

## Step 6: Test the API

### Test Public Endpoints

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/projects" | Select-Object -ExpandProperty Content
```

Or open in browser:
- http://localhost:3000/api/projects
- http://localhost:3000/api/blog
- http://localhost:3000/api/research

### View Data with Prisma Studio

```bash
pnpm db:studio
```

Opens a visual database browser at http://localhost:5555

## Step 7: Set Up OAuth (Optional for Admin Access)

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. OAuth Apps → New OAuth App
3. Fill in:
   - **Application name**: Portfolio Backend Dev
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Click "Register application"
5. Copy Client ID and generate Client Secret
6. Update `.env`:
   ```env
   GITHUB_CLIENT_ID="your_client_id"
   GITHUB_CLIENT_SECRET="your_client_secret"
   ```

### Google OAuth

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
7. Copy Client ID and Client Secret
8. Update `.env`:
   ```env
   GOOGLE_CLIENT_ID="your_client_id"
   GOOGLE_CLIENT_SECRET="your_client_secret"
   ```

### Test Authentication

1. Visit http://localhost:3000/api/auth/signin
2. Sign in with GitHub or Google
3. Make sure your email is in `ADMIN_EMAILS` in `.env`
4. Try accessing http://localhost:3000/api/admin/projects

## Common Issues

### "Can't reach database server"
- Check MongoDB is running
- Verify DATABASE_URL is correct
- Check firewall/network settings

### "NEXTAUTH_SECRET is not set"
- Generate a secret (see Step 2)
- Make sure it's in your `.env` file

### "Port 3000 is already in use"
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
pnpm dev -- -p 3001
```

### OAuth not working
- Check callback URLs match exactly
- Verify Client ID and Secret are correct
- Clear browser cookies and try again

## Next Steps

✅ **Explore the API**: Check out [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
✅ **View Examples**: See [EXAMPLES.md](./EXAMPLES.md)  
✅ **Deploy to Production**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)  
✅ **Set up remaining services**:
   - Cloudflare R2 for file storage
   - Upstash Redis for rate limiting
   - Resend for email notifications

## Full Services Setup (When Ready)

### Cloudflare R2
- Sign up at https://cloudflare.com
- Create R2 bucket
- Generate API tokens
- See [DEPLOYMENT.md](./DEPLOYMENT.md#cloudflare-r2-setup)

### Upstash Redis
- Sign up at https://upstash.com
- Create Redis database
- Copy REST URL and token
- Update `.env`

### Resend
- Sign up at https://resend.com
- Verify your domain
- Generate API key
- Update `.env`

## Development Workflow

```bash
# Daily development
pnpm dev                  # Start dev server
pnpm db:studio           # View database
pnpm lint                # Check code quality
pnpm type-check          # Check TypeScript

# Making schema changes
# 1. Edit prisma/schema.prisma
# 2. Run:
pnpm db:push             # Push changes to database
pnpm db:generate         # Regenerate Prisma Client

# Before committing
pnpm lint                # Fix linting issues
pnpm type-check          # Ensure no TypeScript errors
pnpm format              # Format code with Prettier
```

## Getting Help

- **Documentation**: Check README.md, API_DOCUMENTATION.md
- **Examples**: See EXAMPLES.md for code samples
- **Structure**: See PROJECT_STRUCTURE.md for file organization
- **Deployment**: See DEPLOYMENT.md when ready to deploy

---

🎉 **You're all set!** Start building your amazing portfolio backend.
