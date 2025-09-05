// AI-AGENT CONTEXT: FILE=useAvatarPaths.tsx | ROLE=Avatar_Paths_Hook | PURPOSE=Builds and memoizes avatar-related SVG paths

import React from "react";
import { AvatarCircle } from "../sparkTypes";

interface UseAvatarPathsProps {
  avatarCircle: AvatarCircle | null | undefined;
  gridSize: number;
}

export const useAvatarPaths = ({ avatarCircle, gridSize }: UseAvatarPathsProps) => {
  // Helper to build a half-circle SVG path (upper or lower), with vertical offset
  const buildAvatarHalfCirclePath = React.useCallback(
    (cx: number, cy: number, r: number, upper: boolean, offsetY: number = 0) => {
      const adjCy = cy - offsetY;
      if (upper) {
        // Upper half: left center to right center, sweep-flag 0
        return `M ${cx - r} ${adjCy} A ${r} ${r} 0 0 1 ${cx + r} ${adjCy}`;
      } else {
        // Lower half: right center to left center, sweep-flag 1
        return `M ${cx + r} ${adjCy} A ${r} ${r} 0 0 1 ${cx - r} ${adjCy}`;
      }
    },
    []
  );

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
  }, [avatarCircle?.cx, avatarCircle?.cy, avatarCircle?.r, gridSize, buildAvatarHalfCirclePath]);

  return {
    avatarPaths,
    buildAvatarHalfCirclePath,
  };
};
