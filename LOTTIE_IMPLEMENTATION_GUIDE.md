# Lottie Animation System - Implementation Guide

## Overview

This portfolio uses a comprehensive, theme-aware Lottie animation system with automatic dark/light mode support, scroll-triggered animations, and accessibility features.

## Core Components

### 1. LottieThemed
**Path**: `src/components/LottieThemed.tsx`

Theme-aware Lottie component that automatically loads the correct animation variant.

```tsx
import { LottieThemed } from "@/components/LottieThemed";

// Simple usage
<LottieThemed name="loader" loop={true} size={120} />

// With callback
<LottieThemed 
  name="success" 
  onComplete={() => console.log("Animation complete!")}
/>
```

**Props**:
- `name` - Animation name (required)
- `loop` - Loop animation (default: false)
- `autoplay` - Auto-play on mount (default: true)
- `className` - Additional CSS classes
- `size` - Fixed width/height in pixels
- `onComplete` - Callback when animation finishes

### 2. LottieOnView
**Path**: `src/components/LottieOnView.tsx`

Plays animation when element enters viewport using Intersection Observer.

```tsx
import { LottieOnView } from "@/components/LottieOnView";

<LottieOnView 
  name="medal-shimmer"
  threshold={0.2}
  triggerOnce={true}
  size={100}
/>
```

**Props**:
- `name` - Animation name (required)
- `threshold` - Visibility threshold (0-1, default: 0.2)
- `triggerOnce` - Play only once (default: true)
- `loop` - Loop animation (default: false)
- `className` - Additional CSS classes
- `size` - Fixed width/height in pixels

### 3. LottieScrollProgress
**Path**: `src/components/LottieScrollProgress.tsx`

Controls animation progress based on scroll position.

```tsx
import { LottieScrollProgress } from "@/components/LottieScrollProgress";

<LottieScrollProgress 
  name="hero-blob-morph"
  scrollRange={[0, 0.25]} // First 25% of page scroll
  size={600}
/>
```

**Props**:
- `name` - Animation name (required)
- `scrollRange` - Scroll percentage range ([start, end], default: [0, 0.25])
- `className` - Additional CSS classes
- `size` - Fixed width/height in pixels

## Animation Catalog

### SPA Sections

#### Hero Section
```tsx
// Background circuit pattern (loop, ultra-low opacity)
<LottieThemed 
  name="hero-circuit-bg" 
  loop={true}
  className="absolute inset-0 opacity-10"
/>

// Scroll indicator (hide on first scroll)
const [showScroll, setShowScroll] = useState(true);
useEffect(() => {
  const handleScroll = () => setShowScroll(false);
  window.addEventListener('scroll', handleScroll, { once: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

{showScroll && (
  <LottieThemed name="scroll-down-arrow" loop={true} size={40} />
)}

// Scroll-linked blob morph
<LottieScrollProgress 
  name="hero-blob-morph"
  scrollRange={[0, 0.25]}
  className="absolute right-0 top-0 w-1/2 h-full opacity-40"
/>
```

#### About Section
```tsx
// Profile line drawing (play once on reveal)
<LottieOnView 
  name="profile-line-draw"
  className="w-full max-w-md"
/>

// Skill chip pulse
<LottieOnView 
  name="chip-pulse"
  size={24}
  className="inline-block"
/>
```

#### Research Section
```tsx
// Equation reveal
<LottieOnView 
  name="equation-reveal"
  threshold={0.3}
/>

// Document analyze
<LottieOnView 
  name="doc-analyze"
  size={200}
/>
```

#### Achievements Section
```tsx
// Medal shimmer
<LottieOnView 
  name="medal-shimmer"
  size={60}
  className="inline-block"
/>

// Timeline dot pop (per item)
{achievements.map((item, index) => (
  <div key={item.id}>
    <LottieOnView 
      name="timeline-dot-pop"
      size={16}
    />
  </div>
))}
```

#### Gallery Section
```tsx
// Camera shutter (play once on section reveal)
<LottieOnView 
  name="gallery-shutter"
  size={100}
/>

// Lens flare sweep (loop slow)
<LottieThemed 
  name="lens-flare-sweep"
  loop={true}
  className="absolute top-0 left-0 w-full opacity-20"
/>
```

#### Resume Section
```tsx
// PDF open animation
const [showPdf, setShowPdf] = useState(false);

<LottieOnView 
  name="pdf-open"
  onComplete={() => setShowPdf(true)}
/>

// Download success tick
const [downloaded, setDownloaded] = useState(false);

{downloaded && (
  <LottieThemed 
    name="download-tick"
    size={24}
  />
)}
```

#### Contact Section
```tsx
// Message send (on submit success)
const [sent, setSent] = useState(false);

{sent && (
  <LottieThemed 
    name="message-send"
    onComplete={() => {/* Show success message */}}
  />
)}

// Error shake (on validation error)
const [error, setError] = useState(false);

{error && (
  <LottieThemed 
    name="error-shake"
    onComplete={() => setError(false)}
  />
)}
```

### Standalone Pages

#### Projects Page
```tsx
// Page header
<LottieOnView 
  name="code-window-load"
  size={400}
/>

// Card hover effect
<div 
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
  {hover && (
    <LottieThemed 
      name="card-glow-border"
      loop={true}
      className="absolute inset-0 pointer-events-none"
    />
  )}
</div>

// Deploy button
<button onClick={handleDeploy}>
  Deploy
  <LottieThemed name="deploy-rocket" size={20} />
</button>
```

#### Certifications Page
```tsx
// Section reveal
<LottieOnView 
  name="certificate-reveal"
  threshold={0.2}
/>

// Seal stamp per credential
<LottieOnView 
  name="seal-stamp"
  size={40}
  triggerOnce={true}
/>
```

#### Blog Page
```tsx
// Typing cursor (intro loop, then stop)
const [showCursor, setShowCursor] = useState(true);

setTimeout(() => setShowCursor(false), 3000);

{showCursor && (
  <LottieThemed 
    name="typing-cursor"
    loop={true}
    size={30}
  />
)}

// Page turn
<LottieOnView name="page-turn" />

// Empty state
{posts.length === 0 && (
  <LottieThemed 
    name="empty-folder-soft"
    size={200}
    className="mx-auto opacity-50"
  />
)}
```

### Global Utilities

#### Loading Overlay
```tsx
import { LoaderOverlay } from "@/components/LoaderOverlay";

<LoaderOverlay 
  isLoading={loading}
  message="Loading projects..."
/>
```

#### Toast Notifications
```tsx
// Success
<LottieThemed name="success" size={40} />

// Error
<LottieThemed name="error" size={40} />
```

#### Theme Toggle
```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

// Already implements toggle animation
<ThemeToggle />
```

#### Section Divider
```tsx
<LottieThemed 
  name="section-divider"
  loop={true}
  className="w-full h-2 my-12 opacity-20"
/>
```

## Performance Optimization

### Preloading Critical Animations
```tsx
// In root layout or app component
import { useEffect } from "react";
import { preloadCriticalLotties } from "@/lib/lottie";
import { useTheme } from "next-themes";

export function RootLayout() {
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    preloadCriticalLotties(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);
  
  return <>{children}</>;
}
```

### Lazy Loading Section Animations
```tsx
import dynamic from "next/dynamic";

const LottieOnView = dynamic(() => 
  import("@/components/LottieOnView").then(mod => ({ default: mod.LottieOnView }))
);
```

## Accessibility

All Lottie components automatically:
- Check for `prefers-reduced-motion`
- Skip animations if user prefers reduced motion
- Render nothing instead of static fallback (cleaner UX)

Manual check:
```tsx
import { prefersReducedMotion } from "@/lib/lottie";

if (prefersReducedMotion()) {
  // Show static alternative
}
```

## Best Practices

1. **Keep it subtle**: Use low opacity (6-16%) for background animations
2. **Play once**: Most effects should play once on reveal, not loop
3. **Size matters**: Each JSON should be ≤60 KB
4. **Lazy load**: Use dynamic imports for non-critical animations
5. **Test both themes**: Ensure animations work well in both dark/light modes
6. **Respect preferences**: Always honor reduced motion preferences
7. **Budget wisely**: Target ≤800 KB total Lottie payload

## Troubleshooting

### Animation not loading
- Check file exists: `/public/animations/{name}-{theme}.json`
- Check console for fetch errors
- Verify JSON is valid

### Wrong theme variant loading
- Ensure `ThemeProvider` wraps component tree
- Check `resolvedTheme` value
- Try forcing theme in component props

### Animation not playing
- Verify `autoplay={true}` for simple animations
- Check `inView` state for scroll-triggered animations
- Ensure component is mounted (check `mounted` state)

### Performance issues
- Reduce animation complexity
- Lower frame rate in Lottie file
- Use fewer layers/shapes
- Enable lazy loading

## File Structure
```
public/animations/
├── README.md
├── loader-dark.json ✅
├── loader-light.json ✅
├── success-dark.json ✅
├── success-light.json ✅
├── error-dark.json ✅
├── error-light.json ✅
├── toggle-dark.json ✅
├── toggle-light.json ✅
└── [48 more animation files to create] ⏳
```

## Next Steps

1. Create remaining animation JSON files using LottieFiles Creator
2. Ensure all animations follow color/theme guidelines
3. Test each animation in both themes
4. Optimize file sizes (target ≤60 KB each)
5. Implement animations in relevant components
6. Test with `prefers-reduced-motion` enabled
7. Measure total payload and optimize if needed
