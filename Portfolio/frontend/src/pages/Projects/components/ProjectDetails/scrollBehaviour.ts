import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

export const GRID_REM = 0.9525;
const SCROLL_EPSILON_PX = 1.5; // treat <= ~1px overflow as "no scroll"
const NEARLY_FITS_RATIO = 0.985; // if 98.5% or more fits, treat as no-scroll for full pen

export function useScrollBehaviour(page: number) {
  // Refs for the scrollable content and custom scrollbar parts
  const contentRef = useRef<HTMLUListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // State for custom scrollbar visuals
  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  // Cache root font-size (px) to avoid layout thrash on wheel
  const rootFontPxRef = useRef<number>(16);
  useEffect(() => {
    const updateRootFont = () => {
      rootFontPxRef.current = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
    };
    updateRootFont();
    window.addEventListener("resize", updateRootFont);
    return () => window.removeEventListener("resize", updateRootFont);
  }, []);

  // Helper to convert rem to px responsively (uses cached root font size)
  const remToPx = (rem: number): number => rem * rootFontPxRef.current;
  const stepPx = () => remToPx(GRID_REM);
  const effectiveMaxScroll = () => {
    const el = contentRef.current;
    if (!el) return 0;
    const maxScrollRaw = Math.max(0, el.scrollHeight - el.clientHeight);
    // Ignore tiny fractional overflows that come from borders/rounding
    if (maxScrollRaw <= SCROLL_EPSILON_PX) return 0;
    const spx = stepPx();
    if (spx <= 0) return maxScrollRaw;
    // Quantize the maximum scroll so the last reachable position is a multiple of step
    return Math.floor(maxScrollRaw / spx) * spx;
  };

  // Compute thumb size and visibility
  const calculateThumbMetrics = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollHeight, clientHeight } = contentRef.current;

    const effMax = effectiveMaxScroll();
    const viewableRatio = clientHeight > 0 ? clientHeight / scrollHeight : 1;

    // If practically nothing to scroll, show a full-height pen
    if (effMax <= 0 || viewableRatio >= NEARLY_FITS_RATIO) {
      setIsScrollable(false);
      setThumbHeight(100);
      if (contentRef.current.scrollTop !== 0) {
        contentRef.current.scrollTop = 0;
      }
      setThumbTop(0);
      return;
    }

    // Scrollable
    setIsScrollable(true);
    const newThumbHeight = Math.max(viewableRatio * 100, 66.66); // min height ~ 2/3 of track
    setThumbHeight(newThumbHeight);

    // Also update thumb position on resize
    const currentTop = Math.min(contentRef.current.scrollTop, effMax);
    if (currentTop !== contentRef.current.scrollTop) {
      contentRef.current.scrollTop = currentTop;
    }
    const scrollPercentage = (currentTop / effMax) * 100;
    const trackHeight = trackRef.current?.clientHeight ?? clientHeight;
    const thumbTrackSpace = trackHeight - trackHeight * (newThumbHeight / 100);
    setThumbTop((scrollPercentage / 100) * thumbTrackSpace);
  }, []);

  // Scroll handler for content
  const handleContentScroll = useCallback(() => {
    if (!contentRef.current || !trackRef.current) return;
    const { scrollTop } = contentRef.current;

    const effMax = effectiveMaxScroll();

    // If native interactions moved past the quantized max, clamp it back
    if (scrollTop > effMax) {
      contentRef.current.scrollTop = effMax;
      return;
    }

    const scrollPercentage = effMax > 0 ? scrollTop / effMax : 0;

    const trackHeight = trackRef.current.clientHeight;
    const thumbElementHeight = thumbRef.current?.clientHeight ?? 0;
    const thumbTrackSpace = trackHeight - thumbElementHeight;

    setThumbTop(scrollPercentage * thumbTrackSpace);
  }, []);

  // Initial calculation and listeners
  useEffect(() => {
    const kick = () => {
      calculateThumbMetrics();
      requestAnimationFrame(() => calculateThumbMetrics());
      setTimeout(() => calculateThumbMetrics(), 150);
    };
    const timer = setTimeout(kick, 0);

    const contentEl = contentRef.current;
    const trackEl = trackRef.current;

    contentEl?.addEventListener("scroll", handleContentScroll);
    window.addEventListener("resize", calculateThumbMetrics);

    // Observe size changes of the content and track to keep thumb in sync
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && (contentEl || trackEl)) {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(() => calculateThumbMetrics());
      });
      if (contentEl) ro.observe(contentEl);
      if (trackEl) ro.observe(trackEl);
    }

    // Observe DOM mutations within the content (page list changes)
    let mo: MutationObserver | null = null;
    if (contentEl && typeof MutationObserver !== "undefined") {
      mo = new MutationObserver(() => {
        requestAnimationFrame(() => calculateThumbMetrics());
      });
      mo.observe(contentEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(timer);
      contentEl?.removeEventListener("scroll", handleContentScroll);
      window.removeEventListener("resize", calculateThumbMetrics);
      ro?.disconnect();
      mo?.disconnect();
    };
  }, [calculateThumbMetrics, handleContentScroll]);

  // Recalculate when page changes
  useEffect(() => {
    const rafId = requestAnimationFrame(() => calculateThumbMetrics());
    const timer = window.setTimeout(() => {
      calculateThumbMetrics();
    }, 0);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [page, calculateThumbMetrics]);

  // Drag logic
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!thumbRef.current || !trackRef.current || !contentRef.current) return;

    const startY = e.clientY;
    const thumbStartTop = thumbRef.current.offsetTop;

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      const deltaY = moveEvent.clientY - startY;
      let newThumbTop = thumbStartTop + deltaY;

      const trackHeight = trackRef.current?.clientHeight ?? 0;
      const thumbHeightVal = thumbRef.current?.clientHeight ?? 0;
      const maxThumbTop = trackHeight - thumbHeightVal;

      // Clamp the thumb's position within the track
      newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));

      const scrollPercentage =
        maxThumbTop === 0 ? 0 : newThumbTop / maxThumbTop;

      if (contentRef.current) {
        const effMax = effectiveMaxScroll();
        const desiredTop = scrollPercentage * effMax;
        contentRef.current.scrollTop = Math.max(
          0,
          Math.min(desiredTop, effMax)
        );
      }
    };

    const handleMouseUp = (): void => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Scroll content by multiples of grid spacing
  const scrollContent = (
    amountInRem: number,
    opts?: { smooth?: boolean }
  ): void => {
    if (contentRef.current) {
      const smooth = opts?.smooth ?? true;
      const amountPx = remToPx(amountInRem);
      const { scrollTop } = contentRef.current;
      const effMax = effectiveMaxScroll();
      let newScrollTop = scrollTop + amountPx;
      // Clamp to valid scroll range using quantized max
      newScrollTop = Math.max(0, Math.min(newScrollTop, effMax));
      if (smooth) {
        contentRef.current.scrollTo({ top: newScrollTop, behavior: "smooth" });
      } else {
        contentRef.current.scrollTop = newScrollTop;
      }
    }
  };

  // Replace React onWheel with a native non-passive listener for snappy steps
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!contentRef.current) return;
      // Always consume the event to avoid native smooth scrolling
      e.preventDefault();
      const sign = Math.sign(e.deltaY) || 1;
      const amountPx = remToPx(GRID_REM) * sign;
      const { scrollTop } = contentRef.current;
      const effMax = effectiveMaxScroll();
      const newScrollTop = Math.max(0, Math.min(scrollTop + amountPx, effMax));
      // Instant update for responsiveness
      contentRef.current.scrollTop = newScrollTop;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as EventListener);
  }, []);

  // Keyboard support with GRID_REM increments
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        scrollContent(GRID_REM);
        break;
      case "ArrowUp":
        e.preventDefault();
        scrollContent(-GRID_REM);
        break;
      case "PageDown":
        e.preventDefault();
        scrollContent(GRID_REM * 8);
        break;
      case "PageUp":
        e.preventDefault();
        scrollContent(-GRID_REM * 8);
        break;
      case "Home":
        e.preventDefault();
        if (contentRef.current)
          contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "End":
        e.preventDefault();
        if (contentRef.current) {
          const effMax = effectiveMaxScroll();
          contentRef.current.scrollTo({
            top: effMax,
            behavior: "smooth",
          });
        }
        break;
      default:
        break;
    }
  };

  return {
    contentRef,
    trackRef,
    thumbRef,
    thumbHeight,
    thumbTop,
    isScrollable,
    handleThumbMouseDown,
    handleKeyDown,
    scrollContent,
  } as const;
}
