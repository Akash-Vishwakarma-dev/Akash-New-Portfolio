# Lenis Smooth Scrolling Integration

## Overview

Your portfolio now features buttery-smooth scrolling powered by [Lenis](https://github.com/studio-freight/lenis), a lightweight and high-performance smooth scrolling library.

## Features

✅ **Smooth, momentum-based scrolling** with easeOutExpo easing  
✅ **Reduced motion support** - Automatically disabled for users with `prefers-reduced-motion`  
✅ **Performance optimized** - Uses `requestAnimationFrame` for 60fps smoothness  
✅ **Touch-friendly** - Optimized for both mouse wheel and touch gestures  
✅ **Programmatic scrolling** - Helper functions for scroll-to behavior  

---

## Implementation

### 1. SmoothScrollProvider Component

Located at: `src/components/SmoothScrollProvider.tsx`

**Configuration:**
```tsx
{
  duration: 1.2,              // Scroll animation duration (seconds)
  easing: easeOutExpo,        // Smooth easing function
  orientation: "vertical",     // Only vertical scrolling
  smoothWheel: true,          // Enable smooth wheel scrolling
  wheelMultiplier: 1,         // Wheel sensitivity
  touchMultiplier: 2,         // Touch sensitivity
  infinite: false,            // No infinite scroll
}
```

**Features:**
- Auto-detects `prefers-reduced-motion` and disables smooth scrolling for accessibility
- Cleans up Lenis instance on component unmount
- Runs on `requestAnimationFrame` for optimal performance

### 2. Integration in Root Layout

The provider wraps your entire app:

```tsx
<SmoothScrollProvider>
  <CursorFXProvider>
    {/* Your app */}
  </CursorFXProvider>
</SmoothScrollProvider>
```

### 3. Programmatic Scrolling

Use the `scrollTo` helper function anywhere in your app:

```tsx
import { scrollTo } from "@/components/SmoothScrollProvider";

// Scroll to element by selector
scrollTo("#featured-projects", { duration: 1.5 });

// Scroll to specific position
scrollTo(0, { duration: 1.5 }); // Scroll to top

// With offset
scrollTo("#section", { offset: -100, duration: 2 });
```

---

## Usage Examples

### Homepage Scroll Indicator

Click the scroll indicator on the homepage hero to smoothly scroll to the featured projects section:

```tsx
<motion.div
  onClick={() => scrollTo("#featured-projects", { duration: 1.5 })}
  className="cursor-pointer"
>
  {/* Scroll indicator UI */}
</motion.div>
```

### Footer "Back to Top" Button

The footer now includes a "Back to Top" button with smooth scrolling:

```tsx
<Button onClick={() => scrollTo(0, { duration: 1.5 })}>
  <ArrowUp className="h-4 w-4" />
  Back to Top
</Button>
```

### Section IDs

Sections support optional `id` props for scroll targets:

```tsx
<Section id="featured-projects">
  {/* Content */}
</Section>
```

---

## Browser Compatibility

✅ Chrome, Edge, Safari, Firefox (latest 2 versions)  
✅ Mobile Safari, Chrome Mobile  
✅ Fallback to native `scrollIntoView` if Lenis fails  

---

## Performance

- **No layout shift** - Lenis doesn't affect page layout
- **GPU accelerated** - Uses `transform` for smooth animations
- **Memory efficient** - Single RAF loop for entire app
- **Bundle size** - ~4KB gzipped

---

## Customization

To adjust scroll behavior, edit `SmoothScrollProvider.tsx`:

```tsx
const lenis = new Lenis({
  duration: 1.5,           // Slower scrolling
  wheelMultiplier: 0.8,    // Less sensitive wheel
  // ... other options
});
```

---

## Accessibility

The smooth scrolling **automatically disables** for users who have enabled "Reduce Motion" in their OS settings, ensuring WCAG 2.1 AA compliance.

---

## Testing

1. **Homepage**: Click the scroll indicator to test smooth scroll to featured projects
2. **Footer**: Click "Back to Top" button to test smooth scroll to top
3. **Navigation**: Use mouse wheel to experience smooth scrolling
4. **Reduced Motion**: Enable in OS settings and verify smooth scrolling is disabled

---

## Troubleshooting

**Scrolling feels janky:**
- Check if other scroll libraries are conflicting
- Verify RAF is running (check console for errors)

**Smooth scrolling not working:**
- Ensure `SmoothScrollProvider` is in the layout
- Check browser console for Lenis errors
- Verify `prefers-reduced-motion` is not enabled

**Scroll anchors not working:**
- Make sure sections have proper `id` attributes
- Use the `scrollTo` helper instead of native anchors

---

## Credits

- [Lenis](https://github.com/studio-freight/lenis) by Studio Freight
- Integration pattern inspired by modern web best practices

---

**Enjoy the smooth scrolling experience! 🚀**
