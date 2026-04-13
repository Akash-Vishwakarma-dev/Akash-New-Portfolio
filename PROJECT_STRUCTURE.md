# Project Structure

Complete directory structure of the Portfolio Backend.

```
portfolio-backend/
│
├── prisma/
│   ├── schema.prisma              # Database schema with all models
│   └── seed.ts                    # Seed data for testing
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── projects/
│   │   │   │   ├── route.ts       # GET /api/projects
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts   # GET /api/projects/[slug]
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── route.ts       # GET /api/blog
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts   # GET /api/blog/[slug]
│   │   │   │
│   │   │   ├── research/
│   │   │   │   └── route.ts       # GET /api/research
│   │   │   │
│   │   │   ├── certifications/
│   │   │   │   └── route.ts       # GET /api/certifications
│   │   │   │
│   │   │   ├── achievements/
│   │   │   │   └── route.ts       # GET /api/achievements
│   │   │   │
│   │   │   ├── gallery/
│   │   │   │   └── route.ts       # GET /api/gallery
│   │   │   │
│   │   │   ├── resume/
│   │   │   │   └── latest/
│   │   │   │       └── route.ts   # GET /api/resume/latest
│   │   │   │
│   │   │   ├── theme/
│   │   │   │   └── route.ts       # GET /api/theme
│   │   │   │
│   │   │   ├── lottie/
│   │   │   │   └── [name]/
│   │   │   │       └── route.ts   # GET /api/lottie/[name]
│   │   │   │
│   │   │   ├── admin/             # Admin-only routes (protected)
│   │   │   │   ├── projects/
│   │   │   │   │   ├── route.ts   # POST /api/admin/projects
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts # PATCH/DELETE /api/admin/projects/[id]
│   │   │   │   │
│   │   │   │   ├── blog/
│   │   │   │   │   ├── route.ts   # POST /api/admin/blog
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts # PATCH/DELETE /api/admin/blog/[id]
│   │   │   │   │
│   │   │   │   ├── upload-url/
│   │   │   │   │   └── route.ts   # POST /api/admin/upload-url
│   │   │   │   │
│   │   │   │   ├── theme/
│   │   │   │   │   └── route.ts   # PATCH /api/admin/theme
│   │   │   │   │
│   │   │   │   ├── lottie/
│   │   │   │   │   ├── route.ts   # POST /api/admin/lottie
│   │   │   │   │   └── [name]/
│   │   │   │   │       └── route.ts # DELETE /api/admin/lottie/[name]
│   │   │   │   │
│   │   │   │   └── resume/
│   │   │   │       └── route.ts   # POST /api/admin/resume
│   │   │   │
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts   # NextAuth handlers
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page (API info)
│   │   └── globals.css            # Global styles
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── db.ts                  # Prisma client instance
│   │   ├── auth.ts                # Auth utilities (requireAdmin, etc.)
│   │   ├── auth.config.ts         # NextAuth configuration
│   │   ├── storage.ts             # R2 storage client and helpers
│   │   ├── validations.ts         # Zod schemas for validation
│   │   ├── api-utils.ts           # API helpers (responses, errors)
│   │   └── rate-limit.ts          # Rate limiting with Upstash
│   │
│   ├── middleware.ts              # Global middleware (auth, headers)
│   └── env.ts                     # Environment variable validation
│
├── .github/                       # GitHub workflows (optional)
│   └── workflows/
│       └── deploy.yml             # Auto-deploy and migrations
│
├── .env                           # Environment variables (DO NOT COMMIT)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier configuration
│
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
│
├── package.json                   # Dependencies and scripts
├── pnpm-lock.yaml                 # Lock file (or package-lock.json)
│
├── README.md                      # Main documentation
├── API_DOCUMENTATION.md           # API reference
├── DEPLOYMENT.md                  # Deployment guide
├── EXAMPLES.md                    # Code examples
└── PROJECT_STRUCTURE.md           # This file
```

## Key Directories

### `/prisma`
- Database schema and migrations
- Seed data for development/testing
- Generated Prisma Client

### `/src/app/api`
- All API routes following Next.js App Router conventions
- **Public routes**: `/api/projects`, `/api/blog`, etc.
- **Admin routes**: `/api/admin/*` (protected by middleware)
- **Auth routes**: `/api/auth/*` (handled by NextAuth)

### `/src/lib`
- **Reusable utilities** used across the application
- **Type-safe** database access, validation, storage
- **Centralized** error handling and API responses

### `/src/middleware.ts`
- **Global middleware** that runs before all requests
- Protects admin routes
- Applies security headers
- Can be extended for logging, analytics, etc.

## File Naming Conventions

- **Route handlers**: `route.ts` (Next.js convention)
- **Utility modules**: `kebab-case.ts`
- **React components**: `PascalCase.tsx`
- **Config files**: `lowercase.config.js`

## Import Aliases

Configured in `tsconfig.json`:

```typescript
import { prisma } from "@/lib/db";
import { successResponse } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
```

`@/*` maps to `./src/*`

## Adding New Features

### 1. Add New Entity

1. Update `prisma/schema.prisma`
2. Run `pnpm db:push` or `pnpm db:migrate`
3. Add validation schemas in `src/lib/validations.ts`
4. Create public route in `src/app/api/[entity]/route.ts`
5. Create admin routes in `src/app/api/admin/[entity]/`

### 2. Add New Utility

1. Create file in `src/lib/[utility-name].ts`
2. Export functions/classes
3. Import using `@/lib/[utility-name]`

### 3. Add Middleware

Update `src/middleware.ts`:

```typescript
export async function middleware(request: NextRequest) {
  // Your middleware logic
  
  return response;
}
```

## Environment Variables

All environment variables are validated in `src/env.ts` using Zod.

**To add a new environment variable:**

1. Add to `server` object in `src/env.ts`
2. Add to `runtimeEnv` object
3. Add to `.env.example`
4. Update documentation

## Database Workflow

```bash
# Make schema changes
# Edit prisma/schema.prisma

# Generate Prisma Client
pnpm db:generate

# Push changes to database (dev)
pnpm db:push

# Create migration (production)
pnpm db:migrate

# View data
pnpm db:studio
```

## Testing Locally

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed database (optional)
pnpm db:seed

# Start development server
pnpm dev
```

## Build for Production

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build

# Start production server
pnpm start
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

This structure follows Next.js 16 App Router best practices and is optimized for scalability and maintainability.
