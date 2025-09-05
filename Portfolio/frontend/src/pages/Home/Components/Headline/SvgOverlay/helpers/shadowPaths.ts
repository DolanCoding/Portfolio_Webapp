// AI-AGENT CONTEXT: FILE=shadowPaths.ts | ROLE=Shadow_Path_Builder | PURPOSE=Utility functions for building shadow paths from spark paths

import { SparkPath, AvatarCircle } from "../sparkTypes";

/**
 * Build shadow paths by combining backbone and branch paths
 * @param paths Array of all spark paths
 * @param avatarCircle Avatar circle configuration
 * @param gridSize Current grid size for scaling
 * @returns Array of shadow path objects with combined geometry
 */
export function buildShadowPaths(
  paths: SparkPath[],
  avatarCircle: AvatarCircle | null | undefined,
  gridSize: number
): { d: string; id: string; side: "left" | "right" }[] {
  const hlLeft = paths.find((p) => p.id === "h1-left");
  const hlRight = paths.find((p) => p.id === "h1-right");
  const branches = paths.filter((p) => p.kind === "branch");

  const result: { d: string; id: string; side: "left" | "right" }[] = [];

  const avatarYOffset = 3 * gridSize;
  const avatarR = avatarCircle ? avatarCircle.r : 7 * gridSize; // Use actual radius from avatarCircle
  const avatarLeftX = avatarCircle ? avatarCircle.cx - avatarR : 0;
  const avatarRightX = avatarCircle ? avatarCircle.cx + avatarR : 0;
  const avatarEdgeY = avatarCircle ? avatarCircle.cy - avatarYOffset : 0;

  for (const branch of branches) {
    let hl = branch.side === "left" ? hlLeft : branch.side === "right" ? hlRight : undefined;
    if (hl && (branch.side === "left" || branch.side === "right")) {
      const startX = branch.side === "left" ? avatarLeftX : avatarRightX;
      const startY = avatarEdgeY;
      const backbone = hl.d.replace(/^M\s*[^\s]+\s+[^\s]+/, "");
      const branchPath = branch.d.replace(/^M\s*[^\s]+\s+[^\s]+/, "");
      const combinedPath = `M ${startX} ${startY}${backbone}${branchPath}`;
      result.push({ d: combinedPath, id: `shadow-${branch.id}`, side: branch.side });
    }
  }

  return result;
}

/**
 * Split shadow paths by side for easier processing
 * @param shadowPaths Array of shadow path objects
 * @returns Object with left and right shadow path arrays
 */
export function splitShadowPathsBySide(
  shadowPaths: { d: string; id: string; side: "left" | "right" }[]
): {
  leftShadowPaths: { d: string; id: string; side: "left" | "right" }[];
  rightShadowPaths: { d: string; id: string; side: "left" | "right" }[];
} {
  const leftShadowPaths = shadowPaths.filter((sp) => sp.side === "left");
  const rightShadowPaths = shadowPaths.filter((sp) => sp.side === "right");

  return { leftShadowPaths, rightShadowPaths };
}
