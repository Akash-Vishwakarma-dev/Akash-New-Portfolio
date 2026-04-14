# Portfolio Backend - Production-Grade Next.js API

A secure, scalable backend system for a professional developer portfolio platform built with Next.js 16, Prisma, MongoDB, and Cloudflare R2.

## Checkout the Portfolio
[Click here](https://akash-new-portfolio.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)

## ✨ Features

- **Authentication & Authorization**: OAuth with GitHub/Google, role-based access control
- **CRUD APIs**: Full REST API for all portfolio entities
- **File Storage**: Cloudflare R2 integration with presigned URLs
- **Rate Limiting**: Redis-based rate limiting for all endpoints
- **Theme System**: Per-user light/dark mode preferences
- **Lottie Animations**: Manage and serve Lottie animation files
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Security**: CSRF protection, input sanitization, secure headers
- **Performance**: Optimized queries, caching, edge-ready

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| ORM | Prisma |
| Database | MongoDB (Atlas or self-hosted) |
| Auth | Auth.js (NextAuth v5) |
| Validation | Zod |
| Storage | Cloudflare R2 |
| Rate Limiting | Upstash Redis |
| Email | Resend |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- MongoDB database (MongoDB Atlas recommended)
- Cloudflare R2 bucket
- Upstash Redis instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in all required environment variables (see [Environment Variables](#environment-variables))

4. **Generate Prisma client**
   ```bash
   pnpm db:generate
   ```

5. **Run database migrations**
   ```bash
   pnpm db:push
   # or
   pnpm db:migrate
   ```

6. **Seed the database** (optional)
   ```bash
   pnpm db:seed
   ```

7. **Start development server**
   ```bash
   pnpm dev
   ```

The server will be running at `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudflare R2
R2_ENDPOINT="https://your-account.r2.cloudflarestorage.com"
R2_BUCKET="portfolio-assets"
R2_ACCESS_KEY="your-r2-access-key"
R2_SECRET_KEY="your-r2-secret-key"
R2_PUBLIC_URL="https://your-domain.com"

# Email
RESEND_API_KEY="re_your-api-key"
ADMIN_EMAIL="your-email@example.com"

# Rate Limiting
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Admin Authorization
ADMIN_EMAILS="admin@example.com,another@example.com"
```

### Setting Up OAuth

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

#### Google OAuth
1. Go to Google Cloud Console
2. Create a new project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
5. Copy Client ID and Client Secret to `.env`

## 💾 Database Setup

### Using MongoDB Atlas (Recommended)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user and whitelist your IP (or use `0.0.0.0/0` for cloud deploys)
4. Copy the connection string and update `DATABASE_URL` in `.env`

Example:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
```

### Local MongoDB

```bash
# Start local MongoDB and create database
# Then set .env
DATABASE_URL="mongodb://localhost:27017/portfolio"
```

### Migrations

```bash
# MongoDB uses Prisma db push (migrations are not supported like SQL providers)
pnpm db:push

# Open Prisma Studio
pnpm db:studio
```

## 📚 API Documentation

### Public Endpoints

All public endpoints are rate-limited to **10 requests per 10 seconds**.

#### Projects

```http
GET /api/projects
Query params: page, limit, published, featured, tag, search

GET /api/projects/[slug]
```

#### Blog

```http
GET /api/blog
Query params: page, limit, published, featured, tag, search

GET /api/blog/[slug]
```

#### Research

```http
GET /api/research
```

#### Certifications

```http
GET /api/certifications
```

#### Achievements

```http
GET /api/achievements
```

#### Gallery

```http
GET /api/gallery
Query params: category, projectId
```

#### Resume

```http
GET /api/resume/latest
```

#### Theme

```http
GET /api/theme
```

#### Lottie Animations

```http
GET /api/lottie/[name]
```

### Admin Endpoints

All admin endpoints require **authentication** and **ADMIN role**. Rate-limited to **100 requests per minute**.

#### Projects

```http
POST /api/admin/projects
PATCH /api/admin/projects/[id]
DELETE /api/admin/projects/[id]
```

#### Blog

```http
POST /api/admin/blog
PATCH /api/admin/blog/[id]
DELETE /api/admin/blog/[id]
```

#### File Upload

```http
POST /api/admin/upload-url
Body: { fileName, contentType, fileSize, folder }
Returns: { uploadUrl, publicUrl, key }
```

#### Resume

```http
POST /api/admin/resume
```

#### Theme

```http
PATCH /api/admin/theme
Body: { mode: "LIGHT" | "DARK" }
```

#### Lottie Animations

```http
POST /api/admin/lottie
DELETE /api/admin/lottie/[name]
```

### Response Format

All endpoints return a consistent JSON response:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## 🚢 Deployment

### Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env`
   - Deploy

3. **Update OAuth Callbacks**
   - Update GitHub OAuth callback URL to `https://your-domain.vercel.app/api/auth/callback/github`
   - Update Google OAuth callback URL to `https://your-domain.vercel.app/api/auth/callback/google`
   - Update `NEXTAUTH_URL` environment variable

### Database Migration on Vercel

Vercel doesn't run migrations automatically. Use one of these approaches:

**Option 1: Prisma Data Platform**
```bash
# Push schema directly
pnpm db:push
```

**Option 2: GitHub Actions**
Create `.github/workflows/migrate.yml` to run migrations on deploy

### Setting Up Cloudflare R2

1. Create R2 bucket in Cloudflare dashboard
2. Create API token with R2 permissions
3. Configure custom domain for public access
4. Update R2 environment variables

## 🛠 Development

### Project Structure

```
portfolio-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── app/
│   │   └── api/            # API routes
│   │       ├── projects/
│   │       ├── blog/
│   │       ├── admin/
│   │       └── ...
│   ├── lib/
│   │   ├── db.ts           # Prisma client
│   │   ├── auth.ts         # Auth utilities
│   │   ├── storage.ts      # R2 storage
│   │   ├── validations.ts  # Zod schemas
│   │   ├── api-utils.ts    # API helpers
│   │   └── rate-limit.ts   # Rate limiting
│   ├── middleware.ts       # Global middleware
│   └── env.ts              # Environment validation
├── .env                    # Environment variables
├── .env.example            # Environment template
├── next.config.mjs         # Next.js config
├── tsconfig.json           # TypeScript config
└── package.json
```

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler
pnpm format           # Format code with Prettier
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database
```

### Adding a New Entity

1. **Update Prisma Schema**
   ```prisma
   model NewEntity {
     id        String   @id @default(cuid())
     // ... fields
     createdAt DateTime @default(now())
   }
   ```

2. **Create Zod Schemas**
   ```typescript
   // src/lib/validations.ts
   export const createNewEntitySchema = z.object({
     // ... validation
   });
   ```

3. **Create API Routes**
   ```
   src/app/api/new-entity/route.ts
   src/app/api/admin/new-entity/route.ts
   ```

4. **Run Migration**
   ```bash
   pnpm db:migrate
   ```

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ by Akash Vishwakarma
