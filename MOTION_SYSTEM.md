# Motion System Documentation

## Overview

This document describes the comprehensive motion and animation system implemented in the portfolio. The system provides cursor effects, scroll animations, hover interactions, and accessible motion controls.

## Components

### 1. CursorFXProvider

**Location**: `src/components/fx/CursorFXProvider.tsx`

Custom cursor system with magnetic effects and optional particle trail.

#### Features
- Custom dot + ring cursor
- Magnetic hover effects
- Optional particle trail
- Theme-aware colors (cyan/indigo)
- Automatic mobile detection
- Respects `prefers-reduced-motion`
- 60fps performance with RAF

#### Usage
```tsx
import { CursorFXProvider } from '@/components/fx/CursorFXProvider';

<CursorFXProvider config={{
  magnet: true,
  trail: false,
  intensity: 0.3,
  disableOnMobile: true
}}>
  {children}
</CursorFXProvider>
```

#### Hook: useCursorFX
```tsx
import { useCursorFX } from '@/components/fx/CursorFXProvider';

const { setMagnetic, clearMagnetic } = useCursorFX();

// Enable magnetic effect on element
setMagnetic(elementRef.current, 0.5);

// Clear magnetic effect
clearMagnetic();
```

### 2. ScrollReveal

**Location**: `src/components/fx/ScrollReveal.tsx`

Intersection Observer-based reveal animations.

#### Variants
- `fade` - Fade in
- `slide-up` - Slide + fade from bottom
- `slide-down` - Slide + fade from top
- `slide-left` - Slide + fade from right
- `slide-right` - Slide + fade from left
- `scale` - Scale + fade
- `blur` - Blur + fade

#### Usage
```tsx
import { ScrollReveal } from '@/components/fx/ScrollReveal';

<ScrollReveal 
  variant="slide-up"
  delay={0.2}
  duration={0.6}
  threshold={0.1}
  once={true}
>
  <div>Content to reveal</div>
</ScrollReveal>
```

### 3. ParallaxContainer

**Location**: `src/components/fx/ParallaxContainer.tsx`

Smooth parallax scrolling with spring physics.

#### Features
- Vertical/horizontal parallax
- Spring-based smoothing
- Configurable speed (-1 to 1)
- GPU-accelerated

#### Usage
```tsx
import { ParallaxContainer } from '@/components/fx/ParallaxContainer';

<ParallaxContainer 
  speed={0.5}
  direction="vertical"
  springConfig={{ stiffness: 100, damping: 30 }}
>
  <img src="..." />
</ParallaxContainer>
```

### 4. MorphBlob

**Location**: `src/components/fx/MorphBlob.tsx`

SVG path morphing animation using Flubber.

#### Features
- Smooth shape transitions
- Theme-aware gradient colors
- Custom shapes support
- Configurable duration
- Goo filter effect

#### Usage
```tsx
import { MorphBlob } from '@/components/fx/MorphBlob';

<MorphBlob 
  duration={3000}
  className="w-96 h-96"
  colors={{
    light: ['#0ea5e9', '#6366f1'],
    dark: ['#22d3ee', '#a78bfa']
  }}
/>
```

### 5. HoverCard

**Location**: `src/components/fx/HoverCard.tsx`

3D tilt effect with gradient border and glow.

#### Features
- 3D perspective tilt
- Gradient border on hover
- Radial glow effect
- Scale on hover
- Theme-aware

#### Usage
```tsx
import { HoverCard } from '@/components/fx/HoverCard';

<HoverCard 
  intensity={0.3}
  glowEffect={true}
  scaleOnHover={true}
>
  <div>Card content</div>
</HoverCard>
```

### 6. MagneticButton

**Location**: `src/components/fx/MagneticButton.tsx`

Magnetic pull effect for interactive elements.

#### Features
- Magnetic attraction to cursor
- Works with button/a/div
- Spring physics
- Integrates with CursorFXProvider

#### Usage
```tsx
import { MagneticButton } from '@/components/fx/MagneticButton';

<MagneticButton 
  as="button"
  intensity={0.5}
  onClick={handleClick}
>
  Click me
</MagneticButton>
```

## Utilities

### Scroll Utilities

**Location**: `src/lib/scroll.ts`

#### Functions

**clamp(value, min, max)**
```tsx
const clamped = clamp(50, 0, 100); // 50
```

**lerp(start, end, factor)**
```tsx
const interpolated = lerp(0, 100, 0.5); // 50
```

**mapRange(value, inMin, inMax, outMin, outMax)**
```tsx
const mapped = mapRange(50, 0, 100, 0, 1); // 0.5
```

#### Hooks

**useScrollProgress(targetRef, options)**
```tsx
const progress = useScrollProgress(ref, {
  start: 0,
  end: 1,
  offset: 0
});
// Returns 0-1 based on scroll position
```

**useBoundedScroll()**
```tsx
const scrollY = useBoundedScroll();
// Returns 0-1 for entire page scroll
```

**useParallax(ref, speed)**
```tsx
const { y } = useParallax(ref, 0.5);
// Returns y offset for parallax
```

#### Helper Functions

**scrollToElement(id, options)**
```tsx
scrollToElement('section-id', {
  offset: 100,
  behavior: 'smooth'
});
```

**isInViewport(element, threshold)**
```tsx
const visible = isInViewport(element, 100);
```

## Theme Integration

### Color Variables

All motion components use theme-aware colors from `globals.css`:

**Light Mode**:
- Accent Cyan: `#0ea5e9` (hsl(199 89% 48%))
- Accent Indigo: `#6366f1` (hsl(239 45% 60%))

**Dark Mode**:
- Accent Cyan: `#22d3ee` (hsl(187 85% 53%))
- Accent Indigo: `#a78bfa` (hsl(264 51% 71%))

### CSS Variables
```css
--accent-cyan: 199 89% 48%;
--accent-indigo: 239 45% 60%;
```

Use in components:
```tsx
const isDark = theme === 'dark';
const color = isDark ? '#22d3ee' : '#0ea5e9';
```

## Accessibility

### Reduced Motion

All components respect `prefers-reduced-motion: reduce`:

```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);
}, []);

// Skip animations if reduced motion
if (prefersReducedMotion) {
  return <div>{children}</div>;
}
```

### Mobile Detection

Cursor effects automatically disabled on touch devices:

```tsx
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

## Performance

### Optimization Strategies

1. **GPU Acceleration**
```css
.gpu-accelerated {
  will-change: transform;
  transform: translateZ(0);
}
```

2. **RequestAnimationFrame**
```tsx
const animate = () => {
  // Update positions
  rafRef.current = requestAnimationFrame(animate);
};
```

3. **Passive Event Listeners**
```tsx
window.addEventListener('scroll', handleScroll, { passive: true });
```

4. **Debouncing/Throttling**
```tsx
// Particle creation throttled with Math.random()
if (trail && Math.random() > 0.7) {
  addParticle();
}
```

### Target: 60fps

All animations optimized for 60fps:
- RAF for smooth updates
- CSS transforms (not width/height)
- will-change hints
- Minimal DOM manipulation

## Integration Examples

### Hero Section with Blob
```tsx
import { MorphBlob } from '@/components/fx/MorphBlob';
import { ScrollReveal } from '@/components/fx/ScrollReveal';

export default function Hero() {
  return (
    <section className="relative">
      <MorphBlob className="absolute top-0 right-0 w-96 h-96 opacity-30" />
      
      <ScrollReveal variant="fade">
        <h1>Welcome</h1>
      </ScrollReveal>
      
      <ScrollReveal variant="slide-up" delay={0.2}>
        <p>Subheading</p>
      </ScrollReveal>
    </section>
  );
}
```

### Project Card with Hover Effect
```tsx
import { HoverCard } from '@/components/fx/HoverCard';

export function ProjectCard({ project }) {
  return (
    <HoverCard intensity={0.3} glowEffect={true}>
      <div className="p-6">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </HoverCard>
  );
}
```

### CTA with Magnetic Button
```tsx
import { MagneticButton } from '@/components/fx/MagneticButton';

export function CTA() {
  return (
    <MagneticButton 
      as="button"
      intensity={0.5}
      className="px-6 py-3 bg-primary text-white rounded-lg"
    >
      Get Started
    </MagneticButton>
  );
}
```

### Parallax Image Section
```tsx
import { ParallaxContainer } from '@/components/fx/ParallaxContainer';

export function AboutSection() {
  return (
    <section className="grid grid-cols-2 gap-8">
      <div>
        <h2>About Me</h2>
        <p>Content...</p>
      </div>
      
      <ParallaxContainer speed={0.5}>
        <img src="/profile.jpg" alt="Profile" />
      </ParallaxContainer>
    </section>
  );
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks

- Reduced motion: Static rendering
- No Intersection Observer: Immediate reveal
- Mobile: Cursor disabled
- Old browsers: Graceful degradation

## Testing

### Manual QA Checklist

- [ ] Cursor follows mouse smoothly
- [ ] Magnetic effects work on hover
- [ ] Scroll reveals trigger at correct positions
- [ ] Parallax moves in correct direction
- [ ] Blob morphs continuously
- [ ] Hover cards tilt on mouse move
- [ ] Magnetic buttons pull cursor
- [ ] Theme switches update colors
- [ ] Reduced motion disables effects
- [ ] Mobile disables cursor
- [ ] 60fps maintained during scrolling

### Performance Testing
```tsx
// Use browser DevTools Performance panel
// Check for:
// - No layout thrashing
// - Consistent 60fps
// - Low CPU usage
// - Smooth animations
```

## Troubleshooting

### Cursor not appearing
- Check `disableOnMobile` setting
- Verify `CursorFXProvider` wraps app
- Check for `prefers-reduced-motion`
- Inspect z-index conflicts

### Animations not running
- Check `prefersReducedMotion` state
- Verify Framer Motion installation
- Check component threshold values
- Inspect `once` prop settings

### Performance issues
- Reduce particle count in trail
- Lower spring stiffness
- Increase debounce threshold
- Check for memory leaks

### Theme colors not updating
- Verify `useTheme` hook usage
- Check CSS variable definitions
- Inspect theme provider nesting
- Clear browser cache

## Future Enhancements

- [ ] Page transition animations
- [ ] Shared element transitions
- [ ] Gesture controls (pinch, swipe)
- [ ] Sound effects toggle
- [ ] Animation preset library
- [ ] Visual animation editor
- [ ] Performance monitoring dashboard
- [ ] A/B testing framework

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Flubber SVG Morphing](https://github.com/veltman/flubber)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Prefers Reduced Motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
