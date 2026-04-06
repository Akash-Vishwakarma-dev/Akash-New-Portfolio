# Motion System Quick Start Guide

## ✅ Status: READY TO USE

All motion components have been implemented and integrated into your portfolio. The system is production-ready with no TypeScript errors.

---

## What's Already Configured

### 1. Root Integration ✅
`src/app/layout.tsx` already includes `CursorFXProvider` wrapping your entire app:

```tsx
<CursorFXProvider
  config={{
    magnet: true,
    trail: false,
    intensity: 0.5,
    disableOnMobile: true
  }}
>
  {children}
</CursorFXProvider>
```

**Result**: Custom cursor is live across all pages!

### 2. CSS Variables ✅
`src/app/globals.css` includes theme-aware motion colors:

- Light mode: Cyan (#0ea5e9), Indigo (#6366f1)
- Dark mode: Cyan (#22d3ee), Indigo (#a78bfa)

---

## Quick Examples

### Add Scroll Reveal to Any Component

```tsx
import { ScrollReveal } from '@/components/fx/ScrollReveal';

export default function MyPage() {
  return (
    <ScrollReveal variant="slide-up" delay={0.2}>
      <h1>This heading will slide up on scroll!</h1>
    </ScrollReveal>
  );
}
```

**Available variants**: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `blur`

### Add Hover Effect to Cards

```tsx
import { HoverCard } from '@/components/fx/HoverCard';

export function ProjectCard({ project }) {
  return (
    <HoverCard intensity={0.3} glowEffect={true}>
      <div className="p-6 bg-card rounded-lg">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </HoverCard>
  );
}
```

### Add Magnetic Button

```tsx
import { MagneticButton } from '@/components/fx/MagneticButton';

export function CTA() {
  return (
    <MagneticButton 
      as="button"
      intensity={0.5}
      className="px-6 py-3 bg-primary text-white rounded-lg"
      onClick={() => alert('Clicked!')}
    >
      Contact Me
    </MagneticButton>
  );
}
```

### Add Parallax to Images

```tsx
import { ParallaxContainer } from '@/components/fx/ParallaxContainer';

export function AboutSection() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h2>About Me</h2>
        <p>Content...</p>
      </div>
      
      <ParallaxContainer speed={0.5}>
        <img src="/profile.jpg" alt="Profile" className="rounded-lg" />
      </ParallaxContainer>
    </div>
  );
}
```

### Add Morphing Blob to Hero

```tsx
import { MorphBlob } from '@/components/fx/MorphBlob';

export function Hero() {
  return (
    <section className="relative min-h-screen">
      {/* Animated background blob */}
      <MorphBlob 
        className="absolute top-20 right-20 w-96 h-96 opacity-20 -z-10"
        duration={4000}
      />
      
      <h1>Welcome to My Portfolio</h1>
    </section>
  );
}
```

---

## Recommended Integration Plan

### Phase 1: Hero Section
```tsx
// src/app/page.tsx
import { ScrollReveal } from '@/components/fx/ScrollReveal';
import { MorphBlob } from '@/components/fx/MorphBlob';
import { MagneticButton } from '@/components/fx/MagneticButton';

export default function Home() {
  return (
    <section className="relative">
      <MorphBlob className="absolute top-0 right-0 w-96 h-96 opacity-30" />
      
      <ScrollReveal variant="fade">
        <h1>Akash Vishwakarma</h1>
      </ScrollReveal>
      
      <ScrollReveal variant="slide-up" delay={0.2}>
        <p>Full Stack Developer & AI Engineer</p>
      </ScrollReveal>
      
      <ScrollReveal variant="slide-up" delay={0.4}>
        <MagneticButton as="button">
          View Projects
        </MagneticButton>
      </ScrollReveal>
    </section>
  );
}
```

### Phase 2: Projects Grid
```tsx
// src/app/projects/page.tsx
import { ScrollReveal } from '@/components/fx/ScrollReveal';
import { HoverCard } from '@/components/fx/HoverCard';

export default function Projects() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ScrollReveal 
          key={project.id} 
          variant="slide-up" 
          delay={index * 0.1}
        >
          <HoverCard intensity={0.3}>
            <ProjectCard project={project} />
          </HoverCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
```

### Phase 3: About Section
```tsx
// src/app/about/page.tsx
import { ParallaxContainer } from '@/components/fx/ParallaxContainer';
import { ScrollReveal } from '@/components/fx/ScrollReveal';

export default function About() {
  return (
    <section className="grid grid-cols-2 gap-8">
      <ScrollReveal variant="slide-right">
        <div>
          <h2>About Me</h2>
          <p>Bio content...</p>
        </div>
      </ScrollReveal>
      
      <ParallaxContainer speed={0.3}>
        <img src="/profile.jpg" alt="Profile" />
      </ParallaxContainer>
    </section>
  );
}
```

---

## Testing Checklist

### Visual Tests
1. Open browser DevTools (F12)
2. Navigate to your portfolio
3. **Cursor**: Move mouse → custom dot + ring should follow
4. **Hover**: Hover over buttons → ring should expand
5. **Scroll**: Scroll down → elements should reveal with animations
6. **Theme**: Toggle dark/light → cursor colors should change

### Performance Tests
1. Open DevTools → Performance tab
2. Click Record
3. Scroll page rapidly
4. Stop recording
5. Check FPS counter → should maintain 60fps

### Accessibility Tests
1. Open DevTools → Rendering tab
2. Enable "Emulate CSS media prefers-reduced-motion: reduce"
3. Refresh page
4. Animations should be disabled or minimal
5. Cursor should remain default

### Mobile Tests
1. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Select mobile device
3. Refresh page
4. Default cursor should show (custom cursor disabled)
5. Touch interactions should work normally

---

## Common Use Cases

### Stagger Reveal Multiple Elements
```tsx
const items = ['Item 1', 'Item 2', 'Item 3'];

{items.map((item, index) => (
  <ScrollReveal 
    key={item} 
    variant="slide-up" 
    delay={index * 0.1} // Stagger by 100ms
  >
    <div>{item}</div>
  </ScrollReveal>
))}
```

### Make Element Magnetic
```tsx
import { useCursorFX } from '@/components/fx/CursorFXProvider';

function MyComponent() {
  const elementRef = useRef(null);
  const { setMagnetic, clearMagnetic } = useCursorFX();
  
  return (
    <div
      ref={elementRef}
      onMouseEnter={() => setMagnetic(elementRef.current, 0.5)}
      onMouseLeave={() => clearMagnetic()}
    >
      Magnetic element
    </div>
  );
}
```

### Custom Scroll Animation
```tsx
import { useScrollProgress } from '@/lib/scroll';

function MyComponent() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, { start: 0, end: 1 });
  
  return (
    <div 
      ref={ref}
      style={{ opacity: progress }} // Fade in as scroll progress
    >
      Content
    </div>
  );
}
```

---

## Troubleshooting

### Cursor not visible
✅ **Solution**: Check that `CursorFXProvider` wraps your app in `layout.tsx`

### Animations not triggering
✅ **Solution**: Check browser accessibility settings - disable reduced motion preference

### Performance issues
✅ **Solution**: 
- Reduce number of particles in trail mode
- Lower intensity values
- Check for other heavy scripts

### Theme colors not updating
✅ **Solution**: Verify `next-themes` ThemeProvider is wrapping the app

---

## Advanced Customization

### Custom Cursor Colors
```tsx
// In CursorFXProvider.tsx, modify theme colors:
const dotColor = isDark 
  ? 'rgba(YOUR_DARK_COLOR, 0.8)' 
  : 'rgba(YOUR_LIGHT_COLOR, 0.8)';
```

### Custom Blob Shapes
```tsx
const customShapes = [
  'M60,-60C80,-40,100,-20,100,0C100,20,80,40,60,60...',
  'M40,-40C60,-20,80,0,80,20C80,40,60,60,40,60...',
];

<MorphBlob shapes={customShapes} />
```

### Custom Reveal Timing
```tsx
<ScrollReveal 
  variant="slide-up"
  delay={0}        // Start delay in seconds
  duration={1.2}   // Animation duration in seconds
  threshold={0.2}  // 20% of element visible to trigger
  once={false}     // Repeat on scroll up/down
>
```

---

## Performance Tips

1. **Lazy Load**: Don't wrap entire pages in motion components - only key elements
2. **Stagger Wisely**: Use delays sparingly - too many can feel sluggish
3. **Limit Particles**: Trail mode adds overhead - use sparingly
4. **GPU Acceleration**: Motion components already optimized with `will-change`

---

## Documentation

- **MOTION_SYSTEM.md**: Full API reference and advanced features
- **MOTION_IMPLEMENTATION.md**: Technical implementation details
- **This guide**: Quick start and common patterns

---

## Next Steps

1. **Try the examples above** in your existing pages
2. **Test in browser** - cursor should be visible immediately
3. **Add ScrollReveal** to section headings for subtle reveals
4. **Apply HoverCard** to project/blog cards
5. **Integrate MorphBlob** in hero section background

**Everything is already set up and ready to use!** Just import the components and start adding animations. 🎉

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all imports are correct
3. Test in incognito mode (clears cache)
4. Review examples in MOTION_SYSTEM.md
5. Check that TypeScript compilation succeeds

**Status**: ✅ All components are error-free and production-ready
