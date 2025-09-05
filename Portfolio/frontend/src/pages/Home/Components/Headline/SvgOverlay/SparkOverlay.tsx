// AI-AGENT CONTEXT: FILE=SparkOverlay.tsx | ROLE=Spark_Overlay | PURPOSE=SVG overlay with animated spark, one path at a time, alternating sides, no repeats until all used

import React from "react";
import {
  SparkPath,
  SparkConnector,
  SparkOverlayProps,
  AvatarCircle,
  BoundingBox,
  OutGlowState,
} from "./sparkTypes";
import { pickNextIdx, buildShadowPaths, splitShadowPathsBySide, useGridSize } from "./helpers";
import { SparkConnectors } from "./Components/SparkConnectors";
import { SparkShadowPaths } from "./Components/SparkShadowPaths";
import { SparkGlowPaths } from "./Components/SparkGlowPaths";
import { SparkMainSparks } from "./Components/SparkMainSparks";
import { SparkAvatarSparks } from "./Components/SparkAvatarSparks";
import { SparkAvatarArcs } from "./Components/SparkAvatarArcs";
import { SparkOutGlowPaths } from "./Components/SparkOutGlowPaths";
import { SvgLabel } from "./Components/SvgLabel";
import "./spark.css";

export const SparkOverlay: React.FC<SparkOverlayProps> = ({
  paths,
  connectors = [],
  avatarCircle,
  isCalibrating = false,
}) => {
  const { gridSize, isReady } = useGridSize();
  if (!isReady) {
    return null;
  }
  const labelWidth = gridSize * 10;
  const labelHeight = gridSize * 2;

  // Memoize static shadow paths calculation
  const shadowPaths = React.useMemo(() => {
    return buildShadowPaths(paths, avatarCircle, gridSize);
  }, [paths, gridSize, avatarCircle?.cx, avatarCircle?.cy, avatarCircle?.r]);

  // Split shadowPaths by side
  const { leftShadowPaths, rightShadowPaths } = React.useMemo(() => {
    return splitShadowPathsBySide(shadowPaths);
  }, [shadowPaths]);

  // Memoize avatar paths - use individual properties to avoid object reference issues
  const avatarPaths = React.useMemo(() => {
    if (!avatarCircle) return { borderPath: "", upperPath: "", lowerPath: "" };
    const { cx, cy, r } = avatarCircle;
    const adjustedCy = cy - 3 * gridSize;
    const borderPath = [
      `M ${cx + r} ${adjustedCy}`,
      `A ${r} ${r} 0 1 0 ${cx - r} ${adjustedCy}`,
      `A ${r} ${r} 0 1 0 ${cx + r} ${adjustedCy}`,
    ].join(" ");
    const upperPath = buildAvatarHalfCirclePath(cx, adjustedCy, r, true, 0);
    const lowerPath = buildAvatarHalfCirclePath(cx, adjustedCy, r, false, 0);
    return { borderPath, upperPath, lowerPath };
  }, [avatarCircle?.cx, avatarCircle?.cy, avatarCircle?.r, gridSize]);

  // Animation state for both sparks
  const [leftIdx, setLeftIdx] = React.useState<number>(0);
  const [rightIdx, setRightIdx] = React.useState<number>(0);
  const [leftVisited, setLeftVisited] = React.useState<Set<number>>(new Set());
  const [rightVisited, setRightVisited] = React.useState<Set<number>>(new Set());
  const [leftSparkPos, setLeftSparkPos] = React.useState<{ x: number; y: number } | null>(null);
  const [rightSparkPos, setRightSparkPos] = React.useState<{ x: number; y: number } | null>(null);

  // Add state for return spark visibility enhancement
  const [leftReturnSpark, setLeftReturnSpark] = React.useState(false);
  const [rightReturnSpark, setRightReturnSpark] = React.useState(false);

  // Avatar half-circle spark animation state
  const [showAvatarSparks, setShowAvatarSparks] = React.useState(false);
  const [avatarUpperPos, setAvatarUpperPos] = React.useState<{ x: number; y: number } | null>(null);
  const [avatarLowerPos, setAvatarLowerPos] = React.useState<{ x: number; y: number } | null>(null);
  const [avatarProgress, setAvatarProgress] = React.useState(0);

  // Add state for the glowing path length
  const [leftLitLength, setLeftLitLength] = React.useState(0);
  const [rightLitLength, setRightLitLength] = React.useState(0);

  // Use refs for values that don't affect rendering
  const leftLitLengthRef = React.useRef(0);
  const rightLitLengthRef = React.useRef(0);
  const leftSparkPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const rightSparkPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const avatarUpperPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const avatarLowerPosRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    leftLitLengthRef.current = leftLitLength;
  }, [leftLitLength]);
  React.useEffect(() => {
    rightLitLengthRef.current = rightLitLength;
  }, [rightLitLength]);
  React.useEffect(() => {
    leftSparkPosRef.current = leftSparkPos;
  }, [leftSparkPos]);
  React.useEffect(() => {
    rightSparkPosRef.current = rightSparkPos;
  }, [rightSparkPos]);
  React.useEffect(() => {
    avatarUpperPosRef.current = avatarUpperPos;
  }, [avatarUpperPos]);
  React.useEffect(() => {
    avatarLowerPosRef.current = avatarLowerPos;
  }, [avatarLowerPos]);

  // Handle calibration: abort animations and reset states
  React.useEffect(() => {
    if (isCalibrating) {
      // Reset all animation states to zero
      setLeftIdx(0);
      setRightIdx(0);
      setLeftVisited(new Set());
      setRightVisited(new Set());
      setLeftSparkPos(null);
      setRightSparkPos(null);
      setShowAvatarSparks(false);
      setAvatarUpperPos(null);
      setAvatarLowerPos(null);
      setLeftLitLength(0);
      setRightLitLength(0);
      setLeftOutGlow(null);
      setRightOutGlow(null);
      setLeftReturnSpark(false);
      setRightReturnSpark(false);

      // Reset refs
      leftSparkPosRef.current = null;
      rightSparkPosRef.current = null;
      avatarUpperPosRef.current = null;
      avatarLowerPosRef.current = null;
      leftLitLengthRef.current = 0;
      rightLitLengthRef.current = 0;
    }
  }, [isCalibrating]);

  // Visibility state to pause animations when tab is hidden
  const isVisibleRef = React.useRef(true);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      isVisibleRef.current = visible;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Outglow state (for fading sweep)
  const [leftOutGlow, setLeftOutGlow] = React.useState<OutGlowState | null>(null);
  const [rightOutGlow, setRightOutGlow] = React.useState<OutGlowState | null>(null);

  // Helper to build a half-circle SVG path (upper or lower), with vertical offset
  function buildAvatarHalfCirclePath(
    cx: number,
    cy: number,
    r: number,
    upper: boolean,
    offsetY: number = 0
  ) {
    const adjCy = cy - offsetY;
    if (upper) {
      // Upper half: left center to right center, sweep-flag 0
      return `M ${cx - r} ${adjCy} A ${r} ${r} 0 0 1 ${cx + r} ${adjCy}`;
    } else {
      // Lower half: right center to left center, sweep-flag 1
      return `M ${cx + r} ${adjCy} A ${r} ${r} 0 0 1 ${cx - r} ${adjCy}`;
    }
  }

  // --- SYNCHRONIZED ANIMATION LOGIC ---
  React.useEffect(() => {
    let frameLeft: number | undefined = undefined,
      frameRight: number | undefined = undefined,
      frameUpper: number | undefined = undefined,
      frameLower: number | undefined = undefined;
    let running = true;

    async function animateSpark(
      pathEl: SVGPathElement,
      setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>,
      backward = false,
      setLitLength?: React.Dispatch<React.SetStateAction<number>>,
      setReturnSpark?: React.Dispatch<React.SetStateAction<boolean>>
    ) {
      await new Promise<void>((resolve) => {
        let start: number | null = null;
        function step(ts: number) {
          if (!running || !isVisibleRef.current || isCalibrating) return;
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
            if (backward) frameRight = requestAnimationFrame(step);
            else frameLeft = requestAnimationFrame(step);
          } else {
            // Clear return spark state when backward animation completes
            if (backward && setReturnSpark) {
              setReturnSpark(false);
            }
            resolve();
          }
        }
        if (backward) frameRight = requestAnimationFrame(step);
        else frameLeft = requestAnimationFrame(step);
      });
      // Do NOT setPos(null) here! Leave the spark visible for overlap.
    }

    async function animateAvatarSparks() {
      if (!avatarCircle || !isVisibleRef.current) return;
      setShowAvatarSparks(true);

      // Wait for DOM update
      await new Promise((res) => setTimeout(res, 0));
      const upperEl =
        avatarUpperRef.current ||
        (document.getElementById("avatar-half-upper") as SVGPathElement | null);
      const lowerEl =
        avatarLowerRef.current ||
        (document.getElementById("avatar-half-lower") as SVGPathElement | null);
      if (!(upperEl instanceof SVGPathElement) || !(lowerEl instanceof SVGPathElement)) return;

      // Cache the elements
      avatarUpperRef.current = upperEl;
      avatarLowerRef.current = lowerEl;

      // Animate both sparks in parallel
      await Promise.all([
        new Promise<void>((resolve) => {
          let start: number | null = null;
          function step(ts: number) {
            if (!running || !isVisibleRef.current || isCalibrating) return;
            if (!start) start = ts;

            const elapsed = ts - start;
            const duration = 1500;
            const t = Math.min(elapsed / duration, 1);
            if (!(upperEl instanceof SVGPathElement)) {
              resolve();
              return;
            }
            const len = upperEl.getTotalLength();
            // Upper: left center to right center (t: 0 → 1)
            const pos = upperEl.getPointAtLength(len * t);
            setAvatarUpperPos((prev) => {
              if (!prev || Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.y - pos.y) > 0.5) {
                return { x: pos.x, y: pos.y };
              }
              return prev;
            });
            setAvatarProgress(t);
            if (t < 1) {
              frameUpper = requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          frameUpper = requestAnimationFrame(step);
        }),
        new Promise<void>((resolve) => {
          let start: number | null = null;
          function step(ts: number) {
            if (!running || !isVisibleRef.current || isCalibrating) return;
            if (!start) start = ts;

            const elapsed = ts - start;
            const duration = 1500;
            const t = Math.min(elapsed / duration, 1);
            if (!(lowerEl instanceof SVGPathElement)) {
              resolve();
              return;
            }
            const len = lowerEl.getTotalLength();
            // Lower: right center to left center (t: 0 → 1)
            const pos = lowerEl.getPointAtLength(len * t);
            setAvatarLowerPos((prev) => {
              if (!prev || Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.y - pos.y) > 0.5) {
                return { x: pos.x, y: pos.y };
              }
              return prev;
            });
            setAvatarProgress(t);
            if (t < 1) {
              frameLower = requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          frameLower = requestAnimationFrame(step);
        }),
      ]);
      // Do NOT setAvatarUpperPos(null) or setAvatarLowerPos(null) here!
      // Let the main cycle handle hiding after overlap.
    }

    // --- Main synchronized animation cycle ---
    const runCycle = async () => {
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

      // Hide outer sparks, show avatar sparks
      setLeftSparkPos(null);
      setRightSparkPos(null);
      setShowAvatarSparks(true);

      // Start outglow sweep (fade from bubble to center) and avatar sparks in sync
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
      // Run avatar sparks and outglow in parallel, wait for both
      await Promise.all([animateAvatarSparks(), ...outGlowPromises]);

      // Handoff: hide avatar sparks, immediately start next outer sparks
      setShowAvatarSparks(false);
      setAvatarUpperPos(null);
      setAvatarLowerPos(null);

      // Pick next targets (random, not-yet-hit)
      const [nextLeftIdx, newLeftVisited] = pickNextIdx(leftShadowPaths, leftVisited);
      const [nextRightIdx, newRightVisited] = pickNextIdx(rightShadowPaths, rightVisited);
      setLeftIdx(nextLeftIdx);
      setLeftVisited(newLeftVisited);
      setRightIdx(nextRightIdx);
      setRightVisited(newRightVisited);

      // The next cycle will immediately start the outer sparks again
    };

    runCycle();

    return () => {
      running = false;
      if (frameLeft !== undefined) cancelAnimationFrame(frameLeft);
      if (frameRight !== undefined) cancelAnimationFrame(frameRight);
      if (frameUpper !== undefined) cancelAnimationFrame(frameUpper);
      if (frameLower !== undefined) cancelAnimationFrame(frameLower);
    };
    // eslint-disable-next-line
  }, [leftIdx, rightIdx, leftShadowPaths.length, rightShadowPaths.length, avatarCircle]);

  // Track per-path bounding boxes so we can position labels reliably after render
  const [bboxes, setBboxes] = React.useState<Record<string, BoundingBox>>({});

  React.useLayoutEffect(() => {
    if (!labelWidth) return;
    const next: Record<string, BoundingBox> = {};
    paths.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el instanceof SVGGraphicsElement) {
        const bb = el.getBBox();
        next[p.id] = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
      }
    });
    setBboxes(next);
  }, [paths, labelWidth, labelHeight]);

  // Build avatar border path if avatarCircle is provided
  const avatarBorderPath = avatarPaths.borderPath;
  const avatarUpperPath = avatarPaths.upperPath;
  const avatarLowerPath = avatarPaths.lowerPath;

  // Cache DOM element refs to avoid getElementById queries
  const leftPathRefs = React.useRef<Map<number, SVGPathElement | null>>(new Map());
  const rightPathRefs = React.useRef<Map<number, SVGPathElement | null>>(new Map());
  const avatarUpperRef = React.useRef<SVGPathElement | null>(null);
  const avatarLowerRef = React.useRef<SVGPathElement | null>(null);

  // Outglow animation: fade from bubble to center, sweeping the lit path away
  function animateOutGlow(
    setOutGlow: typeof setLeftOutGlow,
    pathIdx: number,
    fromLength: number,
    duration = 700
  ) {
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
  }

  return (
    <svg className="spark-overlay" aria-hidden="true">
      <defs>
        <filter id="spark-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="0 0 0 0 0  0 0.6 1 0 0  0 0.8 1 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
      {/* Render visible connectors (static, no animation or glow) */}
      {/* Render visible connectors (static, always below glowing path) */}
      <SparkConnectors paths={paths} connectors={connectors} />
      {/* Render transparent shadow paths for animation (never visible, only for spark and glow logic) */}
      <SparkShadowPaths
        shadowPaths={shadowPaths}
        showAvatarSparks={showAvatarSparks}
        avatarUpperPath={avatarUpperPath}
        avatarLowerPath={avatarLowerPath}
      />
      {/* Render the glowing/lighting path ONLY on the fused shadow paths, never on visible connectors! */}
      <SparkGlowPaths
        leftLitLength={leftLitLength}
        rightLitLength={rightLitLength}
        leftShadowPaths={leftShadowPaths}
        rightShadowPaths={rightShadowPaths}
        leftIdx={leftIdx}
        rightIdx={rightIdx}
      />
      {/* Render both main sparks */}
      <SparkMainSparks
        leftSparkPos={leftSparkPos}
        rightSparkPos={rightSparkPos}
        gridSize={gridSize}
        leftReturnSpark={leftReturnSpark}
        rightReturnSpark={rightReturnSpark}
      />
      {/* Render avatar sparks (upper and lower) */}
      <SparkAvatarSparks
        showAvatarSparks={showAvatarSparks}
        avatarUpperPos={avatarUpperPos}
        avatarLowerPos={avatarLowerPos}
        gridSize={gridSize}
      />
      {/* Render glowing arc on circle border following avatar sparks */}
      <SparkAvatarArcs
        showAvatarSparks={showAvatarSparks}
        avatarUpperPos={avatarUpperPos}
        avatarLowerPos={avatarLowerPos}
        avatarCircle={avatarCircle}
        avatarProgress={avatarProgress}
        gridSize={gridSize}
      />
      <SvgLabel
        paths={paths}
        bboxes={bboxes}
        labelWidth={labelWidth}
        labelHeight={labelHeight}
        gridSize={gridSize}
      />
      {avatarBorderPath && (
        <path
          d={avatarBorderPath}
          className="spark-circle-animate"
          style={{ pointerEvents: "none" }}
        />
      )}
      {/* Render the out-glow path for each side */}
      <SparkOutGlowPaths
        leftOutGlow={leftOutGlow}
        rightOutGlow={rightOutGlow}
        leftShadowPaths={leftShadowPaths}
        rightShadowPaths={rightShadowPaths}
      />
    </svg>
  );
};
