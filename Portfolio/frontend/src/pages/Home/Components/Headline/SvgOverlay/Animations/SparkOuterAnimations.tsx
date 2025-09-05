// AI-AGENT CONTEXT: FILE=SparkOuterAnimations.tsx | ROLE=Outer Animations | PURPOSE=Handle outer spark animations from avatar to bubble and back

import React from "react";
import { SparkPath, OutGlowState } from "../sparkTypes";

interface SparkOuterAnimationsProps {
  leftIdx: number;
  rightIdx: number;
  leftShadowPaths: SparkPath[];
  rightShadowPaths: SparkPath[];
  isCalibrating: boolean;
  isVisibleRef: React.MutableRefObject<boolean>;
  setLeftSparkPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setRightSparkPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setLeftLitLength: React.Dispatch<React.SetStateAction<number>>;
  setRightLitLength: React.Dispatch<React.SetStateAction<number>>;
  setLeftReturnSpark: React.Dispatch<React.SetStateAction<boolean>>;
  setRightReturnSpark: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftOutGlow: React.Dispatch<React.SetStateAction<OutGlowState | null>>;
  setRightOutGlow: React.Dispatch<React.SetStateAction<OutGlowState | null>>;
  leftPathRefs: React.MutableRefObject<Map<number, SVGPathElement | null>>;
  rightPathRefs: React.MutableRefObject<Map<number, SVGPathElement | null>>;
  leftLitLengthRef: React.MutableRefObject<number>;
  rightLitLengthRef: React.MutableRefObject<number>;
}

export const useSparkOuterAnimations = ({
  leftIdx,
  rightIdx,
  leftShadowPaths,
  rightShadowPaths,
  isCalibrating,
  isVisibleRef,
  setLeftSparkPos,
  setRightSparkPos,
  setLeftLitLength,
  setRightLitLength,
  setLeftReturnSpark,
  setRightReturnSpark,
  setLeftOutGlow,
  setRightOutGlow,
  leftPathRefs,
  rightPathRefs,
  leftLitLengthRef,
  rightLitLengthRef,
}: SparkOuterAnimationsProps) => {
  // Outglow animation: fade from bubble to center, sweeping the lit path away
  const animateOutGlow = React.useCallback(
    (setOutGlow: typeof setLeftOutGlow, pathIdx: number, fromLength: number, duration = 700) => {
      let start: number | null = null;
      function step(ts: number) {
        if (!isVisibleRef.current || isCalibrating) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        setOutGlow({ progress: t, pathIdx, fromLength });
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setOutGlow(null);
        }
      }
      requestAnimationFrame(step);
    },
    [isVisibleRef, isCalibrating]
  );

  // Helper to animate a single spark along a path
  const animateSpark = React.useCallback(
    async (
      pathEl: SVGPathElement,
      setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>,
      backward = false,
      setLitLength?: React.Dispatch<React.SetStateAction<number>>,
      setReturnSpark?: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      await new Promise<void>((resolve) => {
        let start: number | null = null;
        function step(ts: number) {
          if (!isVisibleRef.current || isCalibrating) return;
          if (!start) {
            start = ts;
            // Set return spark state at the start of backward animation
            if (backward && setReturnSpark) {
              setReturnSpark(true);
            }
          }

          const elapsed = ts - start;
          const duration = 1500;
          const t = Math.min(elapsed / duration, 1);
          const len = pathEl.getTotalLength();
          const pos = pathEl.getPointAtLength(backward ? len * (1 - t) : len * t);

          // Throttle position updates to reduce React renders
          setPos((prev) => {
            if (!prev || Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.y - pos.y) > 0.5) {
              return { x: pos.x, y: pos.y };
            }
            return prev;
          });

          if (setLitLength) {
            // Forward: grow lit length with spark. Backward: keep fully lit until fade-out.
            if (!backward) {
              setLitLength(t * len);
            } else {
              setLitLength(len); // Keep fully lit during backward spark
            }
          }

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            // Clear return spark state when backward animation completes
            if (backward && setReturnSpark) {
              setReturnSpark(false);
            }
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
      // Do NOT setPos(null) here! Leave the spark visible for overlap.
    },
    [isVisibleRef, isCalibrating]
  );

  // Main outer animation cycle
  const runOuterCycle = React.useCallback(async () => {
    if (!leftShadowPaths.length || !rightShadowPaths.length || !isVisibleRef.current) return;

    // Get the current SVGPathElements for left and right using refs
    const leftEl =
      leftPathRefs.current.get(leftIdx) ||
      (document.getElementById(leftShadowPaths[leftIdx]?.id) as SVGPathElement | null);
    const rightEl =
      rightPathRefs.current.get(rightIdx) ||
      (document.getElementById(rightShadowPaths[rightIdx]?.id) as SVGPathElement | null);
    if (!leftEl || !rightEl) return;

    // Cache the elements in refs for future use
    leftPathRefs.current.set(leftIdx, leftEl);
    rightPathRefs.current.set(rightIdx, rightEl);

    // Animate both sparks forward (avatar → bubble)
    await Promise.all([
      animateSpark(leftEl, setLeftSparkPos, false, setLeftLitLength),
      animateSpark(rightEl, setRightSparkPos, false, setRightLitLength),
    ]);

    // Animate both sparks backward (bubble → avatar), keep path fully lit
    await Promise.all([
      animateSpark(leftEl, setLeftSparkPos, true, setLeftLitLength, setLeftReturnSpark),
      animateSpark(rightEl, setRightSparkPos, true, setRightLitLength, setRightReturnSpark),
    ]);

    // Start outglow sweep (fade from bubble to center)
    const OUTGLOW_DURATION = 900;
    const outGlowPromises: Promise<void>[] = [];

    // Use refs to get latest lit length (avoid stale closure)
    const leftLit = leftLitLengthRef.current;
    const rightLit = rightLitLengthRef.current;

    if (leftLit > 0) {
      outGlowPromises.push(
        new Promise((resolve) => {
          animateOutGlow(
            (v) => {
              setLeftOutGlow(v);
              if (!v) resolve();
            },
            leftIdx,
            leftLit,
            OUTGLOW_DURATION
          );
          setLeftLitLength(0);
        })
      );
    }

    if (rightLit > 0) {
      outGlowPromises.push(
        new Promise((resolve) => {
          animateOutGlow(
            (v) => {
              setRightOutGlow(v);
              if (!v) resolve();
            },
            rightIdx,
            rightLit,
            OUTGLOW_DURATION
          );
          setRightLitLength(0);
        })
      );
    }

    // Wait for outglow animations to complete
    await Promise.all(outGlowPromises);
  }, [
    leftIdx,
    rightIdx,
    leftShadowPaths,
    rightShadowPaths,
    isVisibleRef,
    leftPathRefs,
    rightPathRefs,
    animateSpark,
    setLeftSparkPos,
    setRightSparkPos,
    setLeftLitLength,
    setRightLitLength,
    setLeftReturnSpark,
    setRightReturnSpark,
    animateOutGlow,
    leftLitLengthRef,
    rightLitLengthRef,
    setLeftOutGlow,
    setRightOutGlow,
  ]);

  return {
    animateSpark,
    animateOutGlow,
    runOuterCycle,
  };
};
