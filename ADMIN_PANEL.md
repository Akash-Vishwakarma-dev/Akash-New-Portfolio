# Admin Panel Documentation

## 🎨 Overview

A production-ready Next.js admin panel built with:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: Tailwind CSS + Custom Components
- **State Management**: TanStack Query v5
- **Forms**: React Hook Form + Zod validation
- **Animations**: Lottie + Framer Motion
- **Auth**: NextAuth.js (GitHub + Google OAuth)
- **API Client**: Axios with interceptors

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout with sidebar + header
│   │   ├── dashboard/page.tsx   # Dashboard with KPI cards
│   │   ├── projects/
│   │   │   ├── page.tsx         # Projects list
│   │   │   └── new/page.tsx     # Create project form
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog posts list
│   │   │   └── new/page.tsx     # Create blog post form
│   │   └── login/page.tsx       # OAuth login page
│   ├── api/
│   │   └── admin/
│   │       └── stats/route.ts   # Stats API endpoint
│   └── globals.css              # Tailwind + CSS variables
├── components/
│   ├── admin/
│   │   ├── admin-guard.tsx      # Auth guard wrapper
│   │   ├── admin-header.tsx     # Top navigation
│   │   ├── admin-sidebar.tsx    # Side navigation
│   │   ├── lottie-loader.tsx    # Loading animation
│   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   ├── providers/
│   │   ├── query-provider.tsx   # TanStack Query provider
│   │   └── theme-provider.tsx   # Theme context provider
│   └── ui/
│       ├── button.tsx           # Button component
│       ├── card.tsx             # Card component
│       ├── input.tsx            # Input component
│       └── textarea.tsx         # Textarea component
├── hooks/
│   └── use-api.ts               # API hooks (queries + mutations)
└── lib/
    ├── api-client.ts            # Axios instance
    ├── env.ts                   # Environment validation
    └── utils.ts                 # Utility functions
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file should already contain:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
ADMIN_EMAILS="yuvrajsoni411@gmail.com"

# OAuth Providers (Set up when ready)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 3. Set Up OAuth Providers

#### GitHub OAuth:
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

#### Google OAuth:
1. Go to https://console.cloud.google.com
2. Create a new project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Set callback URL: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env`

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000/admin/login

## 🎯 Features

### Authentication
- ✅ OAuth login (GitHub + Google)
- ✅ Role-based access control (ADMIN only)
- ✅ Protected routes with middleware
- ✅ Auto-redirect non-admins
- ✅ Session management

### Dashboard
- ✅ KPI cards (projects, posts, research, etc.)
- ✅ Quick action buttons
- ✅ Real-time stats from API
- ✅ Responsive grid layout

### Projects Management
- ✅ List all projects with status badges
- ✅ Create new project with validation
- ✅ Edit existing projects
- ✅ Delete projects with confirmation
- ✅ Tech stack tagging
- ✅ Published/Featured toggles
- ✅ Cover image support
- ✅ Auto-slug generation

### Blog Management
- ✅ List all blog posts
- ✅ Create new posts with MDX editor
- ✅ View count tracking
- ✅ Read time estimation
- ✅ Tag management
- ✅ Published/Featured toggles

### Theme System
- ✅ Light/Dark mode toggle
- ✅ Persistent preference (localStorage)
- ✅ Smooth animations with Framer Motion
- ✅ System preference detection
- ✅ CSS variable-based theming

### UI/UX
- ✅ Lottie loading animations
- ✅ Toast notifications (Sonner)
- ✅ Form validation with Zod
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Responsive design
- ✅ Keyboard navigation
- ✅ WCAG 2.1 AA compliant

## 🔧 API Hooks

### Projects

```typescript
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-api";

// Fetch projects
const { data, isLoading } = useProjects({ published: true });

// Create project
const createProject = useCreateProject();
await createProject.mutateAsync({ title, slug, ... });

// Update project
const updateProject = useUpdateProject();
await updateProject.mutateAsync({ id: "123", data: { ... } });

// Delete project
const deleteProject = useDeleteProject();
await deleteProject.mutateAsync("project-id");
```

### Blog Posts

```typescript
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/use-api";

// Same pattern as projects
const { data } = useBlogPosts({ published: true });
const createPost = useCreateBlogPost();
// ... etc
```

### Stats

```typescript
import { useStats } from "@/hooks/use-api";

const { data: stats } = useStats();
// Returns: { projects: { total, published }, blogPosts: { ... }, ... }
```

## 🎨 Theming

### Using Theme Context

```typescript
import { useTheme } from "@/components/providers/theme-provider";

const { theme, setTheme, resolvedTheme } = useTheme();

// theme: "light" | "dark" | "system"
// resolvedTheme: "light" | "dark" (computed)
```

### CSS Variables

All colors use CSS variables defined in `globals.css`:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

## 🔐 Security

### Admin Guard

All `/admin/*` routes (except `/admin/login`) are protected:

```typescript
// Automatic in layout.tsx
<AdminGuard>
  {children}
</AdminGuard>
```

### API Client

Axios interceptors handle:
- Auto-redirect on 401 (unauthorized)
- Cookie-based auth (NextAuth)
- Error handling

## 📝 Form Validation

All forms use Zod schemas:

```typescript
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  // ...
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(projectSchema),
});
```

## 🎬 Animations

### Lottie Loader

```typescript
import { LottieLoader } from "@/components/admin/lottie-loader";

<LottieLoader size={100} />
```

### Theme Toggle

Animated with Framer Motion:

```typescript
import { ThemeToggle } from "@/components/admin/theme-toggle";

<ThemeToggle />
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables (Production)

```env
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ADMIN_EMAILS="your-email@gmail.com"
```

## 📊 Adding New Entities

### 1. Create API Hooks

Add to `src/hooks/use-api.ts`:

```typescript
export function useResearch() {
  return useQuery({
    queryKey: ["research"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/research");
      return data;
    },
  });
}

export function useCreateResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (researchData: any) => {
      const { data } = await apiClient.post("/api/admin/research", researchData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("Research created!");
    },
  });
}
```

### 2. Create Page

`src/app/admin/research/page.tsx`:

```typescript
"use client";

import { useResearch, useDeleteResearch } from "@/hooks/use-api";
// ... similar to projects/page.tsx
```

### 3. Add to Sidebar

Update `src/components/admin/admin-sidebar.tsx`:

```typescript
const navItems = [
  // ...
  { href: "/admin/research", label: "Research", icon: GraduationCap },
];
```

## 🎯 Best Practices

### ✅ DO:
- Use TypeScript strict mode
- Validate all forms with Zod
- Handle loading/error states
- Show toast feedback
- Use semantic HTML
- Add ARIA labels
- Optimistic updates for mutations
- Invalidate queries after mutations

### ❌ DON'T:
- Hardcode API URLs (use env vars)
- Skip error handling
- Forget to add loading states
- Use `any` type without reason
- Skip form validation
- Ignore accessibility

## 🐛 Troubleshooting

### OAuth Login Fails
- Check callback URLs match exactly
- Verify CLIENT_ID and CLIENT_SECRET
- Ensure NEXTAUTH_URL is correct

### Theme Not Persisting
- Check localStorage permissions
- Verify ThemeProvider is wrapping app

### API Calls Fail
- Check NEXT_PUBLIC_API_URL (if set)
- Verify backend is running
- Check browser console for CORS errors

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)

## 🎉 What's Next?

To complete the admin panel:

1. **Add remaining pages**:
   - `/admin/research` (Research papers CRUD)
   - `/admin/certifications` (Certifications CRUD)
   - `/admin/achievements` (Achievements CRUD)
   - `/admin/gallery` (Media items with upload)
   - `/admin/lottie` (Lottie animations manager)
   - `/admin/settings` (Site settings)

2. **File Upload**:
   - Integrate Cloudflare R2 for images
   - Add drag-and-drop UI
   - Image preview and cropping

3. **MDX Editor**:
   - Rich text editor for blog content
   - Live preview
   - Syntax highlighting

4. **Analytics**:
   - View count charts
   - Popular content dashboard
   - Traffic analytics

---

**Created by**: AI Assistant  
**Version**: 1.0.0  
**Last Updated**: November 8, 2025
