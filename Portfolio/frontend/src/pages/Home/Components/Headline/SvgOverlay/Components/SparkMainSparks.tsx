// AI-AGENT CONTEXT: FILE=SparkMainSparks.tsx | ROLE=Main Sparks Component | PURPOSE=Render the main animated sparks (left and right)

import React from "react";

interface SparkMainSparksProps {
  leftSparkPos: { x: number; y: number } | null;
  rightSparkPos: { x: number; y: number } | null;
  gridSize: number;
  leftReturnSpark: boolean;
  rightReturnSpark: boolean;
}

export const SparkMainSparks: React.FC<SparkMainSparksProps> = ({
  leftSparkPos,
  rightSparkPos,
  gridSize,
  leftReturnSpark,
  rightReturnSpark,
}) => {
  return (
    <>
      {/* Render both main sparks */}
      {leftSparkPos && (
        <ellipse
          cx={leftSparkPos.x}
          cy={leftSparkPos.y}
          rx={gridSize * 0.2}
          ry={gridSize * 0.2}
          fill="#00aaff"
          className={`spark-moving spark-outer-animate ${leftReturnSpark ? "spark-return" : ""}`}
          style={{
            transform: `scaleX(var(--spark-beam-scale, 1))`,
            transformOrigin: "center",
          }}
        />
      )}
      {rightSparkPos && (
        <ellipse
          cx={rightSparkPos.x}
          cy={rightSparkPos.y}
          rx={gridSize * 0.2}
          ry={gridSize * 0.2}
          fill="#00aaff"
          className={`spark-moving spark-outer-animate ${rightReturnSpark ? "spark-return" : ""}`}
          style={{
            transform: `scaleX(var(--spark-beam-scale, 1))`,
            transformOrigin: "center",
          }}
        />
      )}
    </>
  );
};
