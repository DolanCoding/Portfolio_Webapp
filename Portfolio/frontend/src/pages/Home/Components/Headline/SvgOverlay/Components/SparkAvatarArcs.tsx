// AI-AGENT CONTEXT: FILE=SparkAvatarArcs.tsx | ROLE=Avatar Arcs Component | PURPOSE=Render glowing arcs following avatar sparks

import React from "react";
import { AvatarCircle } from "../sparkTypes";

interface SparkAvatarArcsProps {
  showAvatarSparks: boolean;
  avatarUpperPos: { x: number; y: number } | null;
  avatarLowerPos: { x: number; y: number } | null;
  avatarCircle: AvatarCircle | null | undefined;
  avatarProgress: number;
  gridSize: number;
}

export const SparkAvatarArcs: React.FC<SparkAvatarArcsProps> = ({
  showAvatarSparks,
  avatarUpperPos,
  avatarLowerPos,
  avatarCircle,
  avatarProgress,
  gridSize,
}) => {
  const renderArc = (sparkPos: { x: number; y: number } | null, startAngle: number) => {
    if (!sparkPos || !avatarCircle) return null;

    // Calculate spark's current position angle
    const adjustedCy = avatarCircle.cy - 3 * gridSize;
    const dx = sparkPos.x - avatarCircle.cx;
    const dy = sparkPos.y - adjustedCy;
    const sparkAngle = Math.atan2(dy, dx);
    const sparkAngleNormalized = ((sparkAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const progress = avatarProgress;
    const circumference = 2 * Math.PI * avatarCircle.r;

    let arcLength: number;
    let opacity: number = 1;

    // Arc follows spark with moving start point that catches up
    const endAngle = sparkAngleNormalized; // Always end at current spark position

    // Move the effective start point towards the spark position
    // At 50%: start moves halfway to spark
    // At 100%: start reaches spark position (arc disappears)
    const startProgress = progress < 0.5 ? 0 : (progress - 0.5) * 2; // 0 to 1 after 50%
    const effectiveStartAngle = startAngle + (sparkAngleNormalized - startAngle) * startProgress;

    // Calculate arc from effective start to spark
    const effectiveAngleDiff = Math.abs(endAngle - effectiveStartAngle);
    arcLength = (effectiveAngleDiff / (2 * Math.PI)) * circumference;

    // Fade out as it gets shorter
    opacity = 1 - progress;

    // Calculate dash offset for SVG (start from effective start angle)
    const effectiveStartAngleDeg = (effectiveStartAngle * 180) / Math.PI;
    const dashOffset = -(effectiveStartAngleDeg * circumference) / 360;

    return (
      <circle
        cx={avatarCircle.cx}
        cy={avatarCircle.cy - 3 * gridSize}
        r={avatarCircle.r}
        className="spark-arc-glow"
        style={{
          strokeDasharray: arcLength > 0 ? `${arcLength},9999` : "0,0",
          strokeDashoffset: dashOffset,
          opacity: arcLength > 0 ? opacity : 0,
          pointerEvents: "none",
        }}
      />
    );
  };

  return (
    <>
      {/* Render glowing arc on circle border following avatar sparks */}
      {showAvatarSparks && renderArc(avatarUpperPos, Math.PI)}
      {showAvatarSparks && renderArc(avatarLowerPos, 0)}
    </>
  );
};
