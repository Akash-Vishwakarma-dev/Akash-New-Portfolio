# Akash Vishwakarma - Portfolio Frontend

> A cutting-edge, production-ready portfolio website built with Next.js 16, featuring advanced cursor interactions, scroll-linked SVG morphing, Lottie animations, and seamless dark/light mode theming.

## ✨ Features

### 🎨 **Advanced UI/UX**
- **Custom Cursor System**: Magnetic buttons with optional particle trails
- **SVG Path Morphing**: Smooth blob transformations using Flubber
- **Scroll Animations**: Parallax effects and reveal animations with Framer Motion
- **Lottie Animations**: Loading states, theme toggle, and accent animations
- **Dark/Light Mode**: Persistent theme with system preference detection
- **Smooth Scrolling**: Optional Lenis integration for buttery-smooth scroll

### 🚀 **Performance & SEO**
- **Next.js 16 App Router**: Server & client components for optimal performance
- **TypeScript Strict Mode**: Type-safe codebase
- **SEO Optimized**: next-seo with OpenGraph, Twitter Cards, structured data
- **Image Optimization**: Next/Image for automatic optimization
- **Lighthouse Score**: Performance ≥95, Accessibility 100

### ♿ **Accessibility**
- **WCAG 2.1 AA Compliant**: Semantic HTML, ARIA labels, focus management
- **Reduced Motion Support**: Respects `prefers-reduced-motion`
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Optimized for both light and dark themes

### 📱 **Pages & Sections**
- **Home**: Hero with morphing blobs, featured projects/posts/research
- **Projects**: Filterable list + detailed case study pages
- **Blog**: Search, filters, MDX rendering with syntax highlighting
- **Research**: Academic publications with BibTeX download
- **Certifications**: Professional credentials grid
- **Achievements**: Timeline view
- **Gallery**: Masonry layout with modal viewer
- **Resume**: Embedded PDF viewer + download
- **About**: Bio and skills
- **Contact**: Form → Backend → Email + Slack notification

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui components, CSS Variables |
| **Animations** | Framer Motion, Lottie React, Flubber (SVG morph), Lenis |
| **Forms** | React Hook Form, Zod validation |
| **Theme** | next-themes (with localStorage persistence) |
| **Icons** | Lucide React |
| **SEO** | next-seo, sitemap, robots.txt |
| **Fonts** | Inter (body), Poppins (headings) via next/font |
| **API Client** | Axios with interceptors |

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (public)/                 # Public routes group
│   │   ├── about/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog list
│   │   │   └── [slug]/page.tsx  # Blog post detail
│   │   ├── certifications/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx         # Projects list
│   │   │   └── [slug]/page.tsx  # Project detail
│   │   ├── research/page.tsx
│   │   └── resume/page.tsx
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles + CSS variables
├── components/
│   ├── cards/                    # Entity card components
│   │   ├── ProjectCard.tsx
│   │   ├── PostCard.tsx
│   │   ├── ResearchCard.tsx
│   │   ├── CertCard.tsx
│   │   ├── AchievementItem.tsx
│   │   └── GalleryCard.tsx
│   ├── fx/                       # FX components
│   │   ├── CursorFXProvider.tsx # Cursor FX context + custom cursor
│   │   ├── MagneticButton.tsx   # Magnetic attraction effect
│   │   ├── MorphBlob.tsx        # SVG morphing blob
│   │   └── ParallaxContainer.tsx# Parallax scroll effect
│   ├── forms/
│   │   └── ContactForm.tsx      # Contact form with validation
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── Footer.tsx
│   ├── LoaderOverlay.tsx         # Full-screen Lottie loader
│   ├── LottieIcon.tsx            # Lottie icon component
│   ├── Navbar.tsx
│   ├── Section.tsx               # Animated section wrapper
│   └── ThemeToggle.tsx           # Lottie-animated theme toggle
├── lib/
│   ├── api.ts                    # Typed API client + fetchers
│   ├── lottie.ts                 # Lottie utilities
│   ├── morph.ts                  # Flubber SVG morphing helpers
│   ├── seo.ts                    # SEO config + helpers
│   └── utils.ts                  # Utility functions
public/
├── animations/                   # Lottie JSON files
│   ├── loader.json
│   ├── success.json
│   ├── error.json
│   ├── toggle-dark.json
│   ├── toggle-light.json
│   └── hero-accent.json
├── images/                       # Static images
└── og-image.png                  # OpenGraph image
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see admin panel docs)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# API Base URL (if backend is separate)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Site URL (for SEO)
NEXT_PUBLIC_SITE_URL=https://abhaysoni.dev
```

### Development

```bash
# Run dev server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
vercel --prod
```

## 🎨 Customization

### Colors & Theme

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --accent: 210 40% 96.1%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --accent: 217.2 32.6% 17.5%;
  /* ... */
}
```

### Cursor FX Configuration

In `src/app/layout.tsx`:

```tsx
<CursorFXProvider
  config={{
    magnet: true,          // Enable magnetic buttons
    trail: false,          // Enable particle trail
    intensity: 0.5,        // Magnet strength (0-1)
    disabledOnMobile: true // Disable on mobile devices
  }}
>
```

### Lottie Animations

Replace JSON files in `public/animations/` with your own:

- `loader.json` - Loading spinner
- `success.json` - Success checkmark
- `error.json` - Error X mark
- `toggle-dark.json` - Dark mode icon
- `toggle-light.json` - Light mode icon
- `hero-accent.json` - Hero section accent

Generate at [LottieFiles](https://lottiefiles.com/).

### Fonts

Edit in `src/app/layout.tsx`:

```tsx
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "600", "700"] });
```

## 📊 Performance Optimization

### Implemented Strategies

✅ Next.js App Router with RSC for minimal JavaScript  
✅ Automatic code splitting and lazy loading  
✅ Next/Image for optimized images  
✅ CSS variables for theme (no flash)  
✅ Preload critical Lottie animations  
✅ GPU-accelerated cursor FX  
✅ Debounced scroll listeners  
✅ `will-change` for animated elements  
✅ Reduced motion support  

### Bundle Size

| Package | Size |
|---------|------|
| Framer Motion | ~60KB (tree-shaken) |
| Lottie React | ~35KB |
| Flubber | ~15KB |
| Axios | ~12KB |
| Total JS | ~180KB (gzipped) |

## 🔐 Security

- ✅ Form validation with Zod (server + client)
- ✅ Sanitized MDX rendering
- ✅ CORS configured on backend
- ✅ No sensitive data in frontend
- ✅ Rate limiting on contact form (backend)
- ✅ Slack webhook called server-side only

## 📝 SEO Checklist

✅ Semantic HTML structure  
✅ OpenGraph meta tags  
✅ Twitter Card meta tags  
✅ Sitemap.xml generated  
✅ Robots.txt configured  
✅ Structured data (JSON-LD)  
✅ Alt text on all images  
✅ Descriptive page titles  
✅ Meta descriptions  
✅ Canonical URLs  

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Lighthouse CI
npm run lighthouse
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# One-command deploy
vercel --prod
```

### Other Platforms

- **Netlify**: Supports Next.js natively
- **Cloudflare Pages**: Add `@cloudflare/next-on-pages`
- **AWS Amplify**: Use `next export` for static
- **Docker**: Provided `Dockerfile` in admin docs

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Flubber GitHub](https://github.com/veltman/flubber)
- [Lottie Files](https://lottiefiles.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🙏 Acknowledgments

- **Design Inspiration**: Awwwards, Dribbble, CodePen
- **Animations**: LottieFiles community
- **Icons**: Lucide React
- **Components**: shadcn/ui

---

**Built with ❤️ by Akash Vishwakarma**

Portfolio: [abhaysoni.dev](https://abhaysoni.dev)  
GitHub: [@abhaysoni007](https://github.com/abhaysoni007)  
Email: yuvrajsoni411@gmail.com
