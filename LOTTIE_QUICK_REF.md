# Lottie Quick Reference Card

## Import Components
```tsx
import { LottieThemed } from "@/components/LottieThemed";
import { LottieOnView } from "@/components/LottieOnView";
import { LottieScrollProgress } from "@/components/LottieScrollProgress";
import { LoaderOverlay } from "@/components/LoaderOverlay";
```

## Usage Patterns

### 1️⃣ Simple Animation
```tsx
<LottieThemed name="success" size={40} />
```

### 2️⃣ Looping Background
```tsx
<LottieThemed 
  name="hero-circuit-bg" 
  loop={true}
  className="absolute inset-0 opacity-10"
/>
```

### 3️⃣ Play Once on Scroll
```tsx
<LottieOnView 
  name="medal-shimmer"
  threshold={0.2}
  triggerOnce={true}
/>
```

### 4️⃣ Scroll-Linked Progress
```tsx
<LottieScrollProgress 
  name="hero-blob-morph"
  scrollRange={[0, 0.25]}
/>
```

### 5️⃣ With Callback
```tsx
<LottieThemed 
  name="message-send"
  onComplete={() => console.log("Sent!")}
/>
```

### 6️⃣ Loading Overlay
```tsx
<LoaderOverlay 
  isLoading={loading}
  message="Loading..."
/>
```

## Color Codes

### Dark Mode (#020817)
- Cyan: `#22d3ee`
- Violet: `#a78bfa`
- Neutral: `#e5e7eb`
- BG Opacity: 8-16%

### Light Mode (white)
- Cyan: `#0ea5e9`
- Indigo: `#6366f1`
- Text: `#0f172a`
- BG Opacity: 6-10%

## File Naming
```
{name}-dark.json   ← Dark theme variant
{name}-light.json  ← Light theme variant
```

## Animation List (56 total)

### Global (8) ✅⏳
- loader ✅
- success ✅
- error ✅
- toggle ✅
- section-divider ⏳

### Hero (6) ⏳
- hero-circuit-bg
- scroll-down-arrow
- hero-blob-morph

### About (4) ⏳
- profile-line-draw
- chip-pulse

### Research (4) ⏳
- equation-reveal
- doc-analyze

### Achievements (4) ⏳
- medal-shimmer
- timeline-dot-pop

### Gallery (4) ⏳
- gallery-shutter
- lens-flare-sweep

### Resume (4) ⏳
- pdf-open
- download-tick

### Contact (4) ⏳
- message-send
- error-shake

### Projects (6) ⏳
- code-window-load
- card-glow-border
- deploy-rocket

### Certifications (4) ⏳
- certificate-reveal
- seal-stamp

### Blog (6) ⏳
- typing-cursor
- page-turn
- empty-folder-soft

## Common Props

```tsx
name: LottieAnimation        // Required
loop?: boolean               // Default: false
autoplay?: boolean           // Default: true
className?: string           // CSS classes
size?: number                // Width/height in px
onComplete?: () => void      // Callback
threshold?: number           // 0-1 (OnView only)
triggerOnce?: boolean        // Default: true (OnView)
scrollRange?: [number, number] // [0, 1] (ScrollProgress)
```

## Performance Tips

1. ✅ Preload critical animations
2. ✅ Use lazy loading for sections
3. ✅ Keep files ≤60 KB
4. ✅ Use intersection observer
5. ✅ Test reduced motion

## Accessibility

All components automatically check for `prefers-reduced-motion` and skip animations if enabled.

Manual check:
```tsx
import { prefersReducedMotion } from "@/lib/lottie";

if (prefersReducedMotion()) {
  // Show static alternative
}
```

## Troubleshooting

❌ Animation not loading
→ Check file exists at `/public/animations/{name}-{mode}.json`

❌ Wrong theme
→ Verify ThemeProvider wraps app

❌ Not playing
→ Check `autoplay={true}` or `inView` state

❌ Performance issues
→ Reduce complexity, enable lazy loading

## File Locations

- Components: `src/components/`
- Library: `src/lib/lottie.ts`
- Animations: `public/animations/`
- Docs: `LOTTIE_*.md`

## Quick Commands

```bash
# Check file sizes
ls -lh public/animations/

# Count files
ls public/animations/*.json | wc -l

# Test build
npm run build
```

---
📖 Full Guide: [LOTTIE_IMPLEMENTATION_GUIDE.md](./LOTTIE_IMPLEMENTATION_GUIDE.md)  
📋 Checklist: [LOTTIE_CHECKLIST.md](./LOTTIE_CHECKLIST.md)  
📊 Summary: [LOTTIE_SUMMARY.md](./LOTTIE_SUMMARY.md)
