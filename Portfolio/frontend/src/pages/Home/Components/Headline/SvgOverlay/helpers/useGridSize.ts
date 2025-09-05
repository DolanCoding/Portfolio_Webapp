// AI-AGENT CONTEXT: FILE=useGridSize.ts | ROLE=Grid_Size_Hook | PURPOSE=Custom hook for managing responsive grid size calculations and polling

import { useState, useEffect } from "react";

/**
 * Custom hook for managing responsive grid size calculations
 * Polls CSS custom property --bp-grid-size and handles resize events
 */
export const useGridSize = () => {
  const [gridSize, setGridSize] = useState(() => {
    return Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--bp-grid-size")
        .replace("px", "")
    );
  });

  useEffect(() => {
    let pollTimeout: number | undefined;
    let lastGridSize = gridSize;

    function pollGridSize() {
      const newSize = Number(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--bp-grid-size")
          .replace("px", "")
      );
      if (newSize !== lastGridSize) {
        lastGridSize = newSize;
        setGridSize(newSize);
      }
      pollTimeout = window.setTimeout(pollGridSize, 40);
    }

    function handleResize() {
      if (pollTimeout) clearTimeout(pollTimeout);
      // Poll for gridSize changes for 200ms after resize
      let elapsed = 0;
      function poll() {
        const newSize = Number(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bp-grid-size")
            .replace("px", "")
        );
        if (newSize !== lastGridSize) {
          lastGridSize = newSize;
          setGridSize(newSize);
        }
        elapsed += 40;
        if (elapsed < 240) {
          pollTimeout = window.setTimeout(poll, 40);
        }
      }
      poll();
    }

    window.addEventListener("resize", handleResize);

    // MutationObserver for layout changes (e.g. maximize/restore)
    const observer = new MutationObserver(() => {
      const newSize = Number(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--bp-grid-size")
          .replace("px", "")
      );
      if (newSize !== lastGridSize) {
        lastGridSize = newSize;
        setGridSize(newSize);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      childList: false,
      subtree: false,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (pollTimeout) clearTimeout(pollTimeout);
      observer.disconnect();
    };
  }, []);

  return {
    gridSize,
    isReady: gridSize > 0,
  };
};
