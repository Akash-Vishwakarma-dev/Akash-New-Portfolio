# Installation & Testing Checklist

Use this checklist to verify your Portfolio Backend is correctly set up and working.

## ✅ Pre-Installation

- [ ] Node.js 20+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)
- [ ] Terminal/PowerShell open

## ✅ Installation Steps

- [ ] All files created in project directory
- [ ] Dependencies installed (`pnpm install`)
- [ ] No installation errors
- [ ] `.env` file created from `.env.example`
- [ ] Environment variables filled in

## ✅ Database Setup

- [ ] Database created (PostgreSQL/Supabase/Neon)
- [ ] `DATABASE_URL` set correctly in `.env`
- [ ] Prisma Client generated (`pnpm db:generate`)
- [ ] Schema pushed to database (`pnpm db:push`)
- [ ] Database seeded (optional) (`pnpm db:seed`)
- [ ] Prisma Studio accessible (`pnpm db:studio`)

## ✅ OAuth Setup (Optional for Testing)

### GitHub OAuth
- [ ] GitHub OAuth App created
- [ ] Callback URL set to `http://localhost:3000/api/auth/callback/github`
- [ ] Client ID in `.env`
- [ ] Client Secret in `.env`

### Google OAuth
- [ ] Google Cloud Project created
- [ ] OAuth 2.0 Client created
- [ ] Callback URL set to `http://localhost:3000/api/auth/callback/google`
- [ ] Client ID in `.env`
- [ ] Client Secret in `.env`

## ✅ Development Server

- [ ] Server starts without errors (`pnpm dev`)
- [ ] Server running on http://localhost:3000
- [ ] Homepage loads successfully
- [ ] No console errors in browser
- [ ] API info page displays correctly

## ✅ Public API Endpoints

Test each endpoint in browser or with curl/Postman:

- [ ] http://localhost:3000/api/projects (returns 200)
- [ ] http://localhost:3000/api/projects/ai-powered-portfolio (if seeded)
- [ ] http://localhost:3000/api/blog
- [ ] http://localhost:3000/api/research
- [ ] http://localhost:3000/api/certifications
- [ ] http://localhost:3000/api/achievements
- [ ] http://localhost:3000/api/gallery
- [ ] http://localhost:3000/api/resume/latest
- [ ] http://localhost:3000/api/theme

### Verify Response Format
- [ ] All responses have `{ "success": true, "data": [...] }`
- [ ] Pagination includes `meta` object
- [ ] No error responses (unless expected)

## ✅ Authentication

- [ ] http://localhost:3000/api/auth/signin loads
- [ ] Can sign in with GitHub (if configured)
- [ ] Can sign in with Google (if configured)
- [ ] User created in database
- [ ] Role set to ADMIN (if email in ADMIN_EMAILS)
- [ ] Can sign out

## ✅ Admin API Endpoints (Requires Auth)

After signing in as admin:

### Projects
- [ ] Can create project (POST /api/admin/projects)
- [ ] Can update project (PATCH /api/admin/projects/[id])
- [ ] Can delete project (DELETE /api/admin/projects/[id])

### Blog
- [ ] Can create blog post (POST /api/admin/blog)
- [ ] Can update blog post (PATCH /api/admin/blog/[id])
- [ ] Can delete blog post (DELETE /api/admin/blog/[id])

### File Upload
- [ ] Can get presigned URL (POST /api/admin/upload-url)
- [ ] Presigned URL works (if R2 configured)

### Theme
- [ ] Can toggle theme (PATCH /api/admin/theme)
- [ ] Theme preference persists

## ✅ External Services (Optional)

### Cloudflare R2
- [ ] R2 bucket created
- [ ] API token created
- [ ] Environment variables set
- [ ] Can generate presigned URLs
- [ ] Can upload files
- [ ] Public URLs accessible

### Upstash Redis
- [ ] Redis instance created
- [ ] REST URL and token in `.env`
- [ ] Rate limiting working
- [ ] 429 status when limit exceeded

### Resend
- [ ] Account created
- [ ] Domain verified
- [ ] API key in `.env`

## ✅ Data Validation

### Database
- [ ] Can view data in Prisma Studio
- [ ] Relationships work correctly
- [ ] Timestamps auto-populate
- [ ] Unique constraints enforced

### API Validation
- [ ] Invalid request returns 400
- [ ] Missing fields return validation errors
- [ ] Invalid types rejected
- [ ] Unauthorized access returns 401
- [ ] Admin-only routes return 403 for non-admins

## ✅ Performance

- [ ] API responses under 500ms (local)
- [ ] No N+1 query issues
- [ ] Rate limiting enforces limits
- [ ] Pagination works with large datasets

## ✅ Security

- [ ] Admin routes protected (401 without auth)
- [ ] Non-admin users can't access admin routes (403)
- [ ] Security headers present in responses
- [ ] No sensitive data in error messages
- [ ] CSRF protection active
- [ ] Rate limiting prevents abuse

## ✅ Code Quality

- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code formatted with Prettier (`pnpm format`)
- [ ] No console warnings in production build
- [ ] Build succeeds (`pnpm build`)

## ✅ Documentation

- [ ] README.md explains setup
- [ ] API_DOCUMENTATION.md has all endpoints
- [ ] EXAMPLES.md has working code samples
- [ ] DEPLOYMENT.md has deployment steps
- [ ] All links work

## 🧪 Testing Commands

### Test Public API
```powershell
# Projects
Invoke-WebRequest -Uri "http://localhost:3000/api/projects" | ConvertFrom-Json

# Blog
Invoke-WebRequest -Uri "http://localhost:3000/api/blog" | ConvertFrom-Json

# Single project (if seeded)
Invoke-WebRequest -Uri "http://localhost:3000/api/projects/ai-powered-portfolio" | ConvertFrom-Json
```

### Test Admin API (requires authentication)
```javascript
// In browser console after signing in
fetch('/api/admin/projects', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'test-project',
    title: 'Test Project',
    summary: 'A test project',
    description: 'Description',
    stack: ['Test'],
    published: false
  })
}).then(r => r.json()).then(console.log);
```

### Test Rate Limiting
```bash
# Run 20 times quickly - should get 429 after 10
for ($i=0; $i -lt 20; $i++) { Invoke-WebRequest "http://localhost:3000/api/projects" }
```

## 🐛 Common Issues

### Port Already in Use
```powershell
# Find process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Failed
- [ ] Check DATABASE_URL is correct
- [ ] Verify database is running
- [ ] Check firewall settings
- [ ] Test connection with Prisma Studio

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build Fails
```bash
# Check TypeScript
pnpm type-check

# Check for errors
pnpm lint

# Clear cache
rm -rf .next
pnpm build
```

## 📋 Production Deployment Checklist

See DEPLOYMENT.md for full guide. Summary:

- [ ] All tests passing
- [ ] Environment variables set in Vercel
- [ ] Database created (Supabase/Neon)
- [ ] R2 bucket configured
- [ ] Redis instance configured
- [ ] OAuth apps configured for production URLs
- [ ] Domain configured (optional)
- [ ] SSL verified
- [ ] First deployment successful
- [ ] Database migrated/seeded
- [ ] API endpoints working in production
- [ ] Authentication working
- [ ] File uploads working

## ✨ Success Criteria

Your installation is successful when:

✅ All public API endpoints return data  
✅ Authentication works  
✅ Admin can create/update/delete content  
✅ File uploads work (if R2 configured)  
✅ Rate limiting enforces limits  
✅ No errors in logs  
✅ Database has seed data  
✅ Prisma Studio shows data correctly  
✅ Build succeeds without errors  
✅ All TypeScript/ESLint checks pass  

## 🎉 Next Steps After Verification

1. **Build Frontend**: Create React/Next.js frontend to consume this API
2. **Add Content**: Use admin APIs to add your real projects, blogs, etc.
3. **Customize**: Adjust to your specific needs
4. **Deploy**: Follow DEPLOYMENT.md to go live
5. **Monitor**: Set up logging and analytics

---

**Need Help?** Check the troubleshooting sections in:
- README.md
- DEPLOYMENT.md
- QUICKSTART.md

**Happy Building! 🚀**
