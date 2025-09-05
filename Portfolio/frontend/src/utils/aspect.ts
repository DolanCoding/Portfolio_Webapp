// Utility to recalculate root font-size (px) and aspect weights (--vwWeight / --vhWeight)
// Ensures font-size is set from JS (same formula as CSS calc((1vw + 1vh)/2))
export function recalcRootFontAndAspectWeights(): void {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const sum = Math.max(1, W + H);
  const wVW = H / sum; // weight for vw
  const wVH = W / sum; // weight for vh
  const root = document.documentElement;
  // set aspect weights for any CSS that consumes them
  root.style.setProperty('--vwWeight', String(wVW));
  root.style.setProperty('--vhWeight', String(wVH));
}

export default recalcRootFontAndAspectWeights;
