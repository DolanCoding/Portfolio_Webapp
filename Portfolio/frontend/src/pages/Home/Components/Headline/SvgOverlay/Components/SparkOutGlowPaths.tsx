// AI-AGENT CONTEXT: FILE=SparkOutGlowPaths.tsx | ROLE=Out-Glow Paths Component | PURPOSE=Render out-glow paths for each side

import React from "react";
import { SparkPath, OutGlowState } from "../sparkTypes";

interface SparkOutGlowPathsProps {
  leftOutGlow: OutGlowState | null;
  rightOutGlow: OutGlowState | null;
  leftShadowPaths: SparkPath[];
  rightShadowPaths: SparkPath[];
}

export const SparkOutGlowPaths: React.FC<SparkOutGlowPathsProps> = ({
  leftOutGlow,
  rightOutGlow,
  leftShadowPaths,
  rightShadowPaths,
}) => {
  return (
    <>
      {/* Render the out-glow path for each side */}
      {leftOutGlow && leftShadowPaths[leftOutGlow.pathIdx] && (
        <path
          d={leftShadowPaths[leftOutGlow.pathIdx].d}
          className="spark-glow-path"
          style={{
            strokeDasharray: `${leftOutGlow.fromLength * (1 - leftOutGlow.progress)},9999`,
            opacity: 1 - leftOutGlow.progress,
            transition: "opacity 0.1s linear",
          }}
        />
      )}
      {rightOutGlow && rightShadowPaths[rightOutGlow.pathIdx] && (
        <path
          d={rightShadowPaths[rightOutGlow.pathIdx].d}
          className="spark-glow-path"
          style={{
            strokeDasharray: `${rightOutGlow.fromLength * (1 - rightOutGlow.progress)},9999`,
            opacity: 1 - rightOutGlow.progress,
            transition: "opacity 0.1s linear",
          }}
        />
      )}
    </>
  );
};
