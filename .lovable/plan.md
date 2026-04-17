
The landing page already has some animations (fade-up on hero, pulse-glow on background blobs). Here are meaningful additions that would elevate it without feeling gimmicky.

## Proposed animations

**1. Scroll-triggered reveals (sections)**
Each section (HowItWorks, ProductModes, Benefits, Install, Customization, Pricing) fades and slides up as it enters the viewport. Uses IntersectionObserver + existing `animate-fade-up` keyframe. Staggered for grid items (benefits cards, mode cards) so they cascade in.

**2. Card hover micro-interactions**
- Benefits / Customization cards: subtle lift (`translateY(-4px)`) + soft shadow on hover
- Icon containers: gentle scale (`scale-110`) and slight rotation on card hover
- Border color shift to brand accent (already partially there)

**3. Hero mock popup — "live" feel**
- Typing indicator (3 animated dots) before the AI draft appears
- AI draft text fades in line-by-line
- Loops every ~6s to feel alive
- Green status dot gets a pulsing ring

**4. Animated gradient text**
The `text-gradient` span in the hero ("Intelligently.") gets a slow shifting gradient (background-position animation) so the colors drift.

**5. Number / stat count-up**
If pricing or benefits show numbers (500 emails, 2M tokens), count up from 0 when scrolled into view.

**6. Navbar polish**
- Background blur + border appears once user scrolls past hero (already may exist — verify)
- Nav links get the `story-link` underline-grow effect on hover

**7. Button shimmer on primary CTAs**
Subtle diagonal light sweep across "Get the Extension" buttons every few seconds, or on hover only (less distracting).

**8. Section divider flourishes**
Thin animated gradient line between major sections that draws in on scroll.

**9. How It Works — sequential step animation**
Steps animate in one after another with a connecting line that "draws" between them as you scroll.

**10. Pricing card emphasis**
Recommended/featured plan gently floats (slow vertical bob) or has a soft glow pulse to draw the eye.

## Recommended starter set (high impact, low risk)

If you want a focused first pass rather than all ten:
1. Scroll-triggered fade-up reveals for all sections (universal polish)
2. Card hover lift on Benefits + Customization
3. Animated typing + reply reveal in the hero mock
4. Gradient text drift on the hero headline
5. Nav link underline hover effect

## Technical approach

- Add a lightweight `useInViewAnimation` hook (IntersectionObserver) — no new dependencies
- Extend `tailwind.config.ts` with new keyframes: `gradient-shift`, `float`, `shimmer`, `typing-dots`, `draw-line`
- Add utility classes in `src/index.css`: `.card-lift`, `.story-link` (already documented in design system), `.gradient-animated`
- Apply per-component — no structural changes to existing components
- Respect `prefers-reduced-motion` so users with motion sensitivity get static fallbacks

## What I'd like to know

Want the full set, the recommended starter set (5 items), or pick specific ones from the list?
