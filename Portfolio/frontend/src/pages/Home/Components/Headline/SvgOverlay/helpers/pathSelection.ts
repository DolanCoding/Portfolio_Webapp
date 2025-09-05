// AI-AGENT CONTEXT: FILE=pathSelection.ts | ROLE=Path_Selection_Helper | PURPOSE=Utility functions for selecting and managing animation paths

/**
 * Pick next random, not-yet-hit index for a side
 * @param paths Array of path objects with side information
 * @param visited Set of already visited indices
 * @returns Tuple of [selectedIndex, updatedVisitedSet]
 */
export function pickNextIdx(
  paths: { d: string; id: string; side: "left" | "right" }[],
  visited: Set<number>
): [number, Set<number>] {
  const candidates = paths.map((sp, idx) => ({ idx, sp })).filter(({ idx }) => !visited.has(idx));
  let newVisited = new Set(visited);

  if (candidates.length === 0) {
    // Reset if all have been visited
    newVisited = new Set();
    const all = paths.map((sp, idx) => ({ idx, sp }));
    const pick = all[Math.floor(Math.random() * all.length)];
    newVisited.add(pick.idx);
    return [pick.idx, newVisited];
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  newVisited.add(pick.idx);
  return [pick.idx, newVisited];
}
