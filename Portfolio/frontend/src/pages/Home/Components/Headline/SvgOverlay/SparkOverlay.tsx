// AI-AGENT CONTEXT: FILE=SparkOverlay.tsx | ROLE=Spark_Overlay | PURPOSE=SVG overlay with animated spark, one path at a time, alternating sides, no repeats until all used

import React from "react";
import { SparkOverlayProps } from "./sparkTypes";
import { pickNextIdx, buildShadowPaths, splitShadowPathsBySide, useGridSize } from "./helpers";
import { SparkConnectors } from "./Components/SparkConnectors";
import { SparkShadowPaths } from "./Components/SparkShadowPaths";
import { SparkGlowPaths } from "./Components/SparkGlowPaths";
import { SparkMainSparks } from "./Components/SparkMainSparks";
import { SparkAvatarSparks } from "./Components/SparkAvatarSparks";
import { SparkAvatarArcs } from "./Components/SparkAvatarArcs";
import { SparkOutGlowPaths } from "./Components/SparkOutGlowPaths";
import { useSparkOuterAnimations, useSparkInnerAnimations } from "./Animations";
import { useSparkState, useAvatarPaths, useBoundingBoxes } from "./helpers";
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

  // Use avatar paths hook
  const { avatarPaths } = useAvatarPaths({ avatarCircle, gridSize });

  // Use state management hook
  const sparkState = useSparkState({ isCalibrating });

  // Use bounding boxes hook
  const bboxes = useBoundingBoxes({ paths, labelWidth, labelHeight });

  // Build avatar border path if avatarCircle is provided
  const avatarBorderPath = avatarPaths.borderPath;
  const avatarUpperPath = avatarPaths.upperPath;
  const avatarLowerPath = avatarPaths.lowerPath;

  // Use animation hooks
  const { runOuterCycle } = useSparkOuterAnimations({
    leftIdx: sparkState.leftIdx,
    rightIdx: sparkState.rightIdx,
    leftShadowPaths,
    rightShadowPaths,
    isCalibrating,
    isVisibleRef: sparkState.isVisibleRef,
    setLeftSparkPos: sparkState.setLeftSparkPos,
    setRightSparkPos: sparkState.setRightSparkPos,
    setLeftLitLength: sparkState.setLeftLitLength,
    setRightLitLength: sparkState.setRightLitLength,
    setLeftReturnSpark: sparkState.setLeftReturnSpark,
    setRightReturnSpark: sparkState.setRightReturnSpark,
    setLeftOutGlow: sparkState.setLeftOutGlow,
    setRightOutGlow: sparkState.setRightOutGlow,
    leftPathRefs: sparkState.leftPathRefs,
    rightPathRefs: sparkState.rightPathRefs,
    leftLitLengthRef: sparkState.leftLitLengthRef,
    rightLitLengthRef: sparkState.rightLitLengthRef,
  });

  const { animateAvatarSparks } = useSparkInnerAnimations({
    avatarCircle,
    isVisibleRef: sparkState.isVisibleRef,
    isCalibrating,
    setShowAvatarSparks: sparkState.setShowAvatarSparks,
    setAvatarUpperPos: sparkState.setAvatarUpperPos,
    setAvatarLowerPos: sparkState.setAvatarLowerPos,
    setAvatarProgress: sparkState.setAvatarProgress,
    avatarUpperRef: sparkState.avatarUpperRef,
    avatarLowerRef: sparkState.avatarLowerRef,
  });

  // --- SYNCHRONIZED ANIMATION LOGIC ---
  React.useEffect(() => {
    const runCycle = async () => {
      if (!leftShadowPaths.length || !rightShadowPaths.length || !sparkState.isVisibleRef.current)
        return;

      // Run outer cycle (sparks going to bubbles and back)
      await runOuterCycle();

      // Hide outer sparks, show avatar sparks
      sparkState.setLeftSparkPos(null);
      sparkState.setRightSparkPos(null);
      sparkState.setShowAvatarSparks(true);

      // Run inner animations (avatar sparks)
      await animateAvatarSparks();

      // Handoff: hide avatar sparks, pick next targets
      sparkState.setShowAvatarSparks(false);
      sparkState.setAvatarUpperPos(null);
      sparkState.setAvatarLowerPos(null);

      // Pick next targets (random, not-yet-hit)
      const [nextLeftIdx, newLeftVisited] = pickNextIdx(leftShadowPaths, sparkState.leftVisited);
      const [nextRightIdx, newRightVisited] = pickNextIdx(
        rightShadowPaths,
        sparkState.rightVisited
      );
      sparkState.setLeftIdx(nextLeftIdx);
      sparkState.setLeftVisited(newLeftVisited);
      sparkState.setRightIdx(nextRightIdx);
      sparkState.setRightVisited(newRightVisited);
    };

    runCycle();

    return () => {
      // Cleanup
    };
  }, [
    sparkState.leftIdx,
    sparkState.rightIdx,
    leftShadowPaths.length,
    rightShadowPaths.length,
    avatarCircle,
    runOuterCycle,
    animateAvatarSparks,
  ]);

  // --- SYNCHRONIZED ANIMATION LOGIC ---

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
        showAvatarSparks={sparkState.showAvatarSparks}
        avatarUpperPath={avatarUpperPath}
        avatarLowerPath={avatarLowerPath}
      />
      {/* Render the glowing/lighting path ONLY on the fused shadow paths, never on visible connectors! */}
      <SparkGlowPaths
        leftLitLength={sparkState.leftLitLength}
        rightLitLength={sparkState.rightLitLength}
        leftShadowPaths={leftShadowPaths}
        rightShadowPaths={rightShadowPaths}
        leftIdx={sparkState.leftIdx}
        rightIdx={sparkState.rightIdx}
      />
      {/* Render both main sparks */}
      <SparkMainSparks
        leftSparkPos={sparkState.leftSparkPos}
        rightSparkPos={sparkState.rightSparkPos}
        gridSize={gridSize}
        leftReturnSpark={sparkState.leftReturnSpark}
        rightReturnSpark={sparkState.rightReturnSpark}
      />
      {/* Render avatar sparks (upper and lower) */}
      <SparkAvatarSparks
        showAvatarSparks={sparkState.showAvatarSparks}
        avatarUpperPos={sparkState.avatarUpperPos}
        avatarLowerPos={sparkState.avatarLowerPos}
        gridSize={gridSize}
      />
      {/* Render glowing arc on circle border following avatar sparks */}
      <SparkAvatarArcs
        showAvatarSparks={sparkState.showAvatarSparks}
        avatarUpperPos={sparkState.avatarUpperPos}
        avatarLowerPos={sparkState.avatarLowerPos}
        avatarCircle={avatarCircle}
        avatarProgress={sparkState.avatarProgress}
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
        leftOutGlow={sparkState.leftOutGlow}
        rightOutGlow={sparkState.rightOutGlow}
        leftShadowPaths={leftShadowPaths}
        rightShadowPaths={rightShadowPaths}
      />
    </svg>
  );
};
