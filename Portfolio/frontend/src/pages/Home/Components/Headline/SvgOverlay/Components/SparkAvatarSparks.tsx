// AI-AGENT CONTEXT: FILE=SparkAvatarSparks.tsx | ROLE=Avatar Sparks Component | PURPOSE=Render avatar sparks (upper and lower circles)

import React from "react";

interface SparkAvatarSparksProps {
  showAvatarSparks: boolean;
  avatarUpperPos: { x: number; y: number } | null;
  avatarLowerPos: { x: number; y: number } | null;
  gridSize: number;
}

export const SparkAvatarSparks: React.FC<SparkAvatarSparksProps> = ({
  showAvatarSparks,
  avatarUpperPos,
  avatarLowerPos,
  gridSize,
}) => {
  return (
    <>
      {/* Render avatar sparks (upper and lower) */}
      {showAvatarSparks && avatarUpperPos && (
        <circle
          cx={avatarUpperPos.x}
          cy={avatarUpperPos.y}
          r={gridSize * 0.2}
          fill="#00aaff"
          filter="url(#spark-glow)"
          className="spark-moving"
        />
      )}
      {showAvatarSparks && avatarLowerPos && (
        <circle
          cx={avatarLowerPos.x}
          cy={avatarLowerPos.y}
          r={gridSize * 0.2}
          fill="#00aaff"
          filter="url(#spark-glow)"
          className="spark-moving"
        />
      )}
    </>
  );
};
