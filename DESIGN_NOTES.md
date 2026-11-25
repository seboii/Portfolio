# Engineering in Motion — implementation notes

## Responsive system

- Desktop: 1440px reference canvas; fluid layout above 1000px.
- Tablet: 834px reference; project narrative remains sticky with a balanced 1:1 split.
- Mobile: 390px reference; breakpoint at 700px. Sticky scenes become inline visuals.
- Small mobile: tested layout rule at 350px and designed to remain usable down to 320px.
- Spacing uses fluid viewport-relative gutters on large screens and an 18px mobile gutter.

## Motion

- The implementation uses native scrolling, CSS transitions, and IntersectionObserver.
- Featured work has three discrete states. The observer switches the sticky scene as each text story enters the center reading zone.
- The hero system diagram uses restrained CSS pulses; no scroll hijacking is used.
- Mobile and `prefers-reduced-motion` remove pinning and collapse to normal document flow.
- If GSAP is added later, keep native scroll and use ScrollTrigger only to map story progress to the same three states. Do not use scroll smoothing. Suggested transitions: 450ms scene dissolve, 650ms scale settle, `power2.out`.

## Components and states

- Header: desktop/mobile and menu open/closed.
- Buttons: accent/ghost/light with hover and keyboard focus.
- Project story: three content variants and synchronized active stage.
- Tags: technology and representative-data labels.
- Timeline: work and education entries.
- Clipboard action: idle/success/error states.
- Detail view: shared responsive template for all three featured projects.

## SVG export

- Flow, logistics path, and pose visuals are inline SVG and stay resolution-independent.
- Preserve `viewBox` values when exporting. Convert CSS token colors to presentation attributes only if a standalone file is required.
- Keep pose and flow paths editable; do not flatten to bitmap.
