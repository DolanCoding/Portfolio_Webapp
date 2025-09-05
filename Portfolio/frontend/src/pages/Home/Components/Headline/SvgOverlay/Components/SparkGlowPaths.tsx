// AI-AGENT CONTEXT: FILE=SparkGlowPaths.tsx | ROLE=Glow Paths Component | PURPOSE=Render glowing paths for active sparks

import React from "react";
import { SparkPath } from "../sparkTypes";

interface SparkGlowPathsProps {
  leftLitLength: number;
  rightLitLength: number;
  leftShadowPaths: SparkPath[];
  rightShadowPaths: SparkPath[];
  leftIdx: number;
  rightIdx: number;
}

export const SparkGlowPaths: React.FC<SparkGlowPathsProps> = ({
  leftLitLength,
  rightLitLength,
  leftShadowPaths,
  rightShadowPaths,
  leftIdx,
  rightIdx,
}) => {
  return (
    <>
      {/* Render the glowing/lighting path ONLY on the fused shadow paths, never on visible connectors! */}
      {leftLitLength > 0 && leftShadowPaths[leftIdx] && (
        <path
          d={leftShadowPaths[leftIdx].d}
          className="spark-glow-path"
          style={{
            strokeDasharray: `${leftLitLength},9999`,
            opacity: 1,
            pointerEvents: "none",
          }}
        />
      )}
      {rightLitLength > 0 && rightShadowPaths[rightIdx] && (
        <path
          d={rightShadowPaths[rightIdx].d}
          className="spark-glow-path"
          style={{
            strokeDasharray: `${rightLitLength},9999`,
            opacity: 1,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};
