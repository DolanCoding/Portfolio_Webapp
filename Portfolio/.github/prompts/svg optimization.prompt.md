---
mode: agent
---

1. Minimize React State Updates in Animation Loops
   Throttle or batch state updates (especially spark positions).
   Use refs for values that don’t affect rendering.
2. Reduce SVG Filter Usage
   Remove or simplify drop-shadow and blur filters.
   Use CSS shadows if possible.
3. Limit requestAnimationFrame Usage
   Only run animation frames when the component is visible.
   Pause animations when the tab is hidden or component unmounts.
   Optionally, lower frame rate (e.g., update every 2nd frame).
4. Memoize Static SVG Paths and Components
   Use React.memo for static SVG elements.
   Memoize path calculations that don’t change per frame.
5. Avoid Unnecessary DOM Queries
   Cache SVG element references instead of querying by ID every frame.
