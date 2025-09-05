// Geometry helpers for spark/connector replacement (formerly LeaderLine logic)
import { SparkPath, SparkConnector } from "./sparkTypes"; // removed unused Point

/*************************************
 * Central Visual Configuration (grid-unit based)
 * Values are in multiples of the dynamic grid unit (--bp-grid-size), not rem.
 *************************************/
export interface ConnectionVisualParams {
  horizontalFromAvatarUnits: number; // first straight segment from avatar (grid units)
  diagHorizontalUnits: number; // horizontal run of diagonal (grid units)
  diagVerticalUnits: number; // vertical rise/fall magnitude of diagonal (grid units)
  horizontalToBubbleUnits: number; // final horizontal run to bubble edge (grid units)
  // Legacy fallback (if older code still passes rem-based props)
  horizontalFromAvatarRem?: number;
  diagHorizontalRem?: number;
  diagVerticalRem?: number;
  horizontalToBubbleRem?: number;
}

export const defaultVisualParams: ConnectionVisualParams = {
  horizontalFromAvatarUnits: 3,
  diagHorizontalUnits: 5,
  diagVerticalUnits: 6, // mid of suggested 2-5 range; can be overridden dynamically
  horizontalToBubbleUnits: 10,
};

function gridUnitPx(): number {
  const v = Number(getComputedStyle(document.documentElement).getPropertyValue("--bp-grid-size").replace("px", ""));
  return Number.isFinite(v) && v > 0 ? v : 20;
}

export function buildGroupedPaths(
  avatar: HTMLElement,
  leftTop: HTMLElement | null,
  leftCenter: HTMLElement | null,
  leftBottom: HTMLElement | null,
  rightTop: HTMLElement | null,
  rightCenter: HTMLElement | null,
  rightBottom: HTMLElement | null,
  hero: HTMLElement,
  params: ConnectionVisualParams = defaultVisualParams
): SparkPath[] {
  // Backward compatibility: if legacy rem fields provided and new unit fields absent, translate.
  if ((params as any).horizontalFromAvatarRem != null && params.horizontalFromAvatarUnits == null) {
    const rf = Number(getComputedStyle(document.documentElement).fontSize.replace("px", "")) || 16;
    params = {
      horizontalFromAvatarUnits: ((params as any).horizontalFromAvatarRem * rf) / gridUnitPx(),
      diagHorizontalUnits: ((params as any).diagHorizontalRem * rf) / gridUnitPx(),
      diagVerticalUnits: ((params as any).diagVerticalRem * rf) / gridUnitPx(),
      horizontalToBubbleUnits: ((params as any).horizontalToBubbleRem * rf) / gridUnitPx(),
    };
  }
  const gu = gridUnitPx();
  const heroRect = hero.getBoundingClientRect();
  const avatarRect = avatar.getBoundingClientRect();
  const wrapper = avatar.closest(".avatar-wrapper") as HTMLElement | null;
  const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : avatarRect;
  const avCenterY = wrapperRect.height / 2;
  const avLeftX = wrapperRect.left - heroRect.left;
  const avRightX = wrapperRect.right - heroRect.left;

  const firstHorizPx = params.horizontalFromAvatarUnits * gu;
  const diagHorizPx = params.diagHorizontalUnits * gu;
  const diagVertPx = params.diagVerticalUnits * gu;
  const finalHorizPx = params.horizontalToBubbleUnits * gu;

  const paths: SparkPath[] = [];

  interface Target {
    el: HTMLElement;
    key: string;
    side: "left" | "right";
    vertical: "top" | "bottom" | "center";
  }
  const targets: Target[] = [];
  if (leftTop) targets.push({ el: leftTop, key: "lt", side: "left", vertical: "top" });
  if (leftCenter) targets.push({ el: leftCenter, key: "lc", side: "left", vertical: "center" });
  if (leftBottom) targets.push({ el: leftBottom, key: "lb", side: "left", vertical: "bottom" });
  if (rightTop) targets.push({ el: rightTop, key: "rt", side: "right", vertical: "top" });
  if (rightCenter) targets.push({ el: rightCenter, key: "rc", side: "right", vertical: "center" });
  if (rightBottom) targets.push({ el: rightBottom, key: "rb", side: "right", vertical: "bottom" });

  // Helper to create branch set for one side
  function buildSide(side: "left" | "right") {
    const sideTargets = targets.filter((t) => t.side === side);
    if (!sideTargets.length) return;
    const dir = side === "right" ? 1 : -1;
    const startX = side === "right" ? avRightX : avLeftX;
    const startY = avCenterY;
    const x1 = startX + dir * firstHorizPx; // end of shared first horizontal

    // Shared backbone first horizontal
    paths.push({ id: `h1-${side}`, d: `M ${startX} ${startY} L ${x1} ${startY}`, kind: "shared" });

    sideTargets.forEach((t) => {
      const vertSign = t.vertical === "top" ? -1 : t.vertical === "bottom" ? 1 : 0; // center keeps horizontal line
      const x2 = x1 + dir * diagHorizPx;
      const y2 = startY + vertSign * diagVertPx;
      const x3 = x2 + dir * finalHorizPx;
      const d = `M ${x1} ${startY} L ${x2} ${y2} L ${x3} ${y2}`;
      // Derive labels: prefer data-label attribute (pipe-separated) for multi-label support
      let labels: string[] | undefined;
      const dataAttr = t.el.getAttribute("data-label");
      if (dataAttr) {
        labels = dataAttr
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      // Legacy single label fallback from descriptive-text if no data-label provided
      if (!labels || !labels.length) {
        const span = t.el.querySelector(".descriptive-text");
        if (span && span.textContent) labels = [span.textContent.trim()];
        else if (t.el.textContent) labels = [t.el.textContent.trim().split("\n")[0]];
      }
      const label = labels ? labels[0] : undefined;
      const labelX = x2 + dir * (finalHorizPx / 2);
      const labelY = y2; // raw y; overlay will adjust
      paths.push({
        id: `branch-${t.key}`,
        d,
        kind: "branch",
        end: { x: x3, y: y2 },
        label,
        labelX,
        labelY,
        vertical: t.vertical, // keep 'center' so SparkOverlay renders dual labels
        labels,
        side, // add side info for arrow direction
      });
    });
  }

  buildSide("left");
  buildSide("right");
  return paths;
}

export function buildAllPaths(
  avatar: HTMLElement | null,
  leftTop: HTMLElement | null,
  leftCenter: HTMLElement | null,
  leftBottom: HTMLElement | null,
  rightTop: HTMLElement | null,
  rightCenter: HTMLElement | null,
  rightBottom: HTMLElement | null,
  hero: HTMLElement | null,
  params: ConnectionVisualParams = defaultVisualParams
): SparkPath[] {
  if (!avatar || !hero) return [];
  return buildGroupedPaths(
    avatar,
    leftTop,
    leftCenter,
    leftBottom,
    rightTop,
    rightCenter,
    rightBottom,
    hero,
    params
  );
}

export function buildAllConnections(
  avatar: HTMLElement | null,
  leftTop: HTMLElement | null,
  leftCenter: HTMLElement | null,
  leftBottom: HTMLElement | null,
  rightTop: HTMLElement | null,
  rightCenter: HTMLElement | null,
  rightBottom: HTMLElement | null,
  hero: HTMLElement | null,
  params: ConnectionVisualParams = defaultVisualParams
): { paths: SparkPath[]; connectors: SparkConnector[] } {
  if (!avatar || !hero) return { paths: [], connectors: [] };
  const paths = buildGroupedPaths(
    avatar,
    leftTop,
    leftCenter,
    leftBottom,
    rightTop,
    rightCenter,
    rightBottom,
    hero,
    params
  );
  return { paths, connectors: [] };
}
