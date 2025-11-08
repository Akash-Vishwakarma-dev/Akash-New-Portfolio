# Lottie Animations

This directory contains all Lottie animations used throughout the portfolio application.

## Theme System

All animations follow a theme-aware naming convention:
- `{name}-dark.json` - Dark theme variant
- `{name}-light.json` - Light theme variant

### Color Guidelines

#### Dark Mode (bg: #020817)
- **Primary strokes/fills**: `#22d3ee` (cyan), `#a78bfa` (indigo-violet)
- **Neutral strokes**: `#e5e7eb`
- **Background flourishes opacity**: 8-16%

#### Light Mode (bg: white)
- **Primary strokes/fills**: `#0ea5e9` (cyan), `#6366f1` (indigo)
- **Text color**: `#0f172a`
- **Background flourishes opacity**: 6-10%

### File Size Constraints
- Each JSON file should be ≤60 KB
- Total payload target: ≤800 KB for SPA route
- Use monoline vector animations for optimal file size

## Animation Inventory

### Global Utilities
✅ `loader-dark.json` / `loader-light.json` - Loading spinner
✅ `success-dark.json` / `success-light.json` - Success toast icon
✅ `error-dark.json` / `error-light.json` - Error toast icon
✅ `toggle-dark.json` / `toggle-light.json` - Theme toggle animation
⏳ `section-divider-dark.json` / `section-divider-light.json` - Section divider

### Hero Section
⏳ `hero-circuit-bg-dark.json` / `hero-circuit-bg-light.json` - Background circuit pattern (loop)
⏳ `scroll-down-arrow-dark.json` / `scroll-down-arrow-light.json` - Scroll indicator
⏳ `hero-blob-morph-dark.json` / `hero-blob-morph-light.json` - Scroll-linked blob morph

### About Section
⏳ `profile-line-draw-dark.json` / `profile-line-draw-light.json` - Avatar line drawing
⏳ `chip-pulse-dark.json` / `chip-pulse-light.json` - Skill chip pulse effect

### Research Section
⏳ `equation-reveal-dark.json` / `equation-reveal-light.json` - Graph/equation drawing
⏳ `doc-analyze-dark.json` / `doc-analyze-light.json` - Document scanning effect

### Achievements Section
⏳ `medal-shimmer-dark.json` / `medal-shimmer-light.json` - Medal shimmer effect
⏳ `timeline-dot-pop-dark.json` / `timeline-dot-pop-light.json` - Timeline dot animation

### Gallery Section
⏳ `gallery-shutter-dark.json` / `gallery-shutter-light.json` - Camera shutter effect
⏳ `lens-flare-sweep-dark.json` / `lens-flare-sweep-light.json` - Lens flare sweep (loop)

### Resume Section
⏳ `pdf-open-dark.json` / `pdf-open-light.json` - PDF opening animation
⏳ `download-tick-dark.json` / `download-tick-light.json` - Download success tick

### Contact Section
⏳ `message-send-dark.json` / `message-send-light.json` - Message send animation
⏳ `error-shake-dark.json` / `error-shake-light.json` - Error shake effect

### Projects Page
⏳ `code-window-load-dark.json` / `code-window-load-light.json` - Code window animation
⏳ `card-glow-border-dark.json` / `card-glow-border-light.json` - Card hover glow
⏳ `deploy-rocket-dark.json` / `deploy-rocket-light.json` - Deploy button animation

### Certifications Page
⏳ `certificate-reveal-dark.json` / `certificate-reveal-light.json` - Certificate reveal
⏳ `seal-stamp-dark.json` / `seal-stamp-light.json` - Credential seal stamp

### Blog Page
⏳ `typing-cursor-dark.json` / `typing-cursor-light.json` - Typing cursor animation
⏳ `page-turn-dark.json` / `page-turn-light.json` - Page turn effect
⏳ `empty-folder-soft-dark.json` / `empty-folder-soft-light.json` - Empty state

## Usage Examples

### Theme-Aware Component
```tsx
import { LottieThemed } from "@/components/LottieThemed";

<LottieThemed 
  name="loader" 
  loop={true} 
  size={120} 
/>
```

### Scroll-Triggered Animation
```tsx
import { LottieOnView } from "@/components/LottieOnView";

<LottieOnView 
  name="medal-shimmer" 
  threshold={0.2}
  triggerOnce={true}
/>
```

### Scroll-Linked Progress
```tsx
import { LottieScrollProgress } from "@/components/LottieScrollProgress";

<LottieScrollProgress 
  name="hero-blob-morph"
  scrollRange={[0, 0.25]}
/>
```

## Accessibility

All components check for `prefers-reduced-motion` and will not render animations if the user has this preference enabled.

## Performance Tips

1. Use lazy loading for section-specific animations
2. Preload critical animations (loader, success, error)
3. Use intersection observer for scroll-triggered animations
4. Keep background animations at very low opacity
5. Prefer one-shot animations over loops where possible

## Legend
✅ Implemented
⏳ Pending / To be created
