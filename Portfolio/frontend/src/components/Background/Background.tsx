import { useEffect, useMemo, useState, useRef } from "react";
import "./Background.css";

import solveAlignment from "../../layout/BackgroundSizing";
import { dynamicInnerGridPadding, layoutAdjust } from "../../layout/layouts";
import recalcRootFontAndAspectWeights from "../../utils/aspect";

// Configuration: Desired square size in rem units
const DESIRED_SQUARE_SIZE_REM_Multiplikator = 1; // Adjustable square size in rem

// AI-LOGICAL-REGION: Component_Interface
interface BackgroundProps {
  pageName?: string;
  visibility?: "visible" | "hidden";
  onLayout?: (info: { blocksH: number; blocksW: number; unitPx: number }) => void;
}

export function Background({ pageName = "", visibility = "visible", onLayout }: BackgroundProps) {
  const background = "#031b2a";
  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) cancelAnimationFrame(raf);
      // Recalculate root font-size and aspect weights first so any CSS using rem/vw/vh
      // picks up the new font metrics before we measure and recalc the background grid.
      recalcRootFontAndAspectWeights();
      // One extra frame lets mobile browsers settle after rotation
      raf = requestAnimationFrame(() => {
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      });
    };

    const onOrientation = () => {
      // Some devices fire orientationchange before new innerWidth/innerHeight
      // Run font recalculation immediately, then schedule the update after a short delay
      // so the browser can perform reflow and innerWidth/innerHeight settle.
      recalcRootFontAndAspectWeights();
      setTimeout(update, 50); // small delay to allow reflow
    };

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", onOrientation, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update, { passive: true });
    }
    update();
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", onOrientation);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", update);
      }
      if (raf) cancelAnimationFrame(raf);
    };
    
  }, []);

  const { w: wCss, h: hCss } = viewport;

  const remPx = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""));

  const solved = useMemo(() => (
    solveAlignment({
      wCss,
      hCss,
      remPx,            // or desiredRem: DESIRED_SQUARE_SIZE_REM
    })
  ), [wCss, hCss, remPx]);

  // Fixed zoom handling: the algorithm already accounts for zoom in its calculations
  const gridUnitSize = solved.u; // Use the solved unit size directly
  const thinPx = "0.1vmin"; // Fixed thin line thickness
  const thickPx = "0.15vmin"; // Fixed thick line thickness

  const r = document.documentElement.style;
  r.setProperty("--bp-grid-width", `${gridUnitSize * solved.blocksW}px`);
  r.setProperty("--bp-grid-height", `${gridUnitSize * solved.blocksH}px`);
  r.setProperty("--bp-grid-size", `${gridUnitSize}px`);
  r.setProperty("--bp-blocks-W", `${solved.blocksW}`);
  r.setProperty("--bp-blocks-H", `${solved.blocksH}`);
  r.setProperty("--bp-bg", background);
  r.setProperty("--bp-weak", `rgba(10,166,255,0.1)`);
  r.setProperty("--bp-mid", `rgba(10,166,255,0.15)`);
  r.setProperty("--bp-frame", `rgba(10,166,255,0.667)`);
  r.setProperty("--bp-thin", thinPx);
  r.setProperty("--bp-thick", thickPx);
  r.setProperty("--padTop", `${(solved as any).padTop || solved.padTop}px`);
  r.setProperty("--padRight", `${(solved as any).padRight || solved.padRight}px`);
  r.setProperty("--padBottom", `${(solved as any).padBottom || solved.padBottom}px`);
  r.setProperty("--padLeft", `${(solved as any).padLeft || solved.padLeft}px`);

  // Call the layout defining functions
  dynamicInnerGridPadding();
  layoutAdjust(pageName ?? "");

  const lastPayloadRef = useRef<{ bH: number; bW: number; u: number } | null>(null);

  useEffect(() => {
    if (!onLayout || !solved) return;
    const payload = { bH: solved.blocksH, bW: solved.blocksW, u: gridUnitSize };
    const prev = lastPayloadRef.current;
    if (
      prev &&
      prev.bH === payload.bH &&
      prev.bW === payload.bW &&
      Math.abs(prev.u - payload.u) < 0.0001
    ) {
      return; // no change
    }
    lastPayloadRef.current = payload;
    onLayout({ blocksH: payload.bH, blocksW: payload.bW, unitPx: payload.u });
  }, [solved?.blocksH, solved?.blocksW, gridUnitSize, onLayout]);

  return (
    <div style={{ visibility }} className="bp-root" data-exact={String(!!(solved as any).exact)}>
      <div className="bp-inner" />
    </div>
  );
}

export default Background;
