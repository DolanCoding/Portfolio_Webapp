// AI-AGENT CONTEXT: FILE=SparkLabels.tsx | ROLE=Label Component | PURPOSE=Extracted label rendering logic for spark paths

import React from "react";
import { SparkPath } from "../sparkTypes";

interface SvgLabelsProps {
  paths: SparkPath[];
  bboxes: Record<string, { x: number; y: number; width: number; height: number }>;
  labelWidth: number;
  labelHeight: number;
  gridSize: number;
}

export const SvgLabel: React.FC<SvgLabelsProps> = ({
  paths,
  bboxes,
  labelWidth,
  labelHeight,
  gridSize,
}) => {
  const nodes: React.ReactNode[] = [];

  paths
    .filter((p) => p.label || (p.labels && p.labels.length))
    .forEach((p) => {
      const bb = bboxes[p.id];
      if (!bb) return;

      let startX = bb.x;
      if (gridSize && p.side === "right" && p.end?.x != null) {
        startX = p.end.x - gridSize * 10;
      }

      const pathTop = bb.y;
      const pathBottom = bb.y + bb.height;

      const buildLabel = (
        keySuffix: string,
        topY: number,
        text: string | undefined,
        isFirst: boolean,
        side: "left" | "right"
      ) => {
        if (!gridSize) return null;

        const towardDir = side;
        const arrowDir = isFirst ? towardDir : towardDir === "right" ? "left" : "right";
        const headWidth = gridSize;
        const totalWidth = gridSize * 8;
        const bodyWidth = totalWidth - headWidth;
        const underlineHeight = gridSize * 0.5;
        const midY = underlineHeight / 2;

        const linePath =
          arrowDir === "right"
            ? `M0 ${midY} L${bodyWidth} ${midY}`
            : `M${totalWidth} ${midY} L${headWidth} ${midY}`;

        const headPath =
          arrowDir === "right"
            ? `M${bodyWidth} 0 L${totalWidth} ${midY} L${bodyWidth} ${underlineHeight} Z`
            : `M${headWidth} 0 L0 ${midY} L${headWidth} ${underlineHeight} Z`;

        const viewBox = `0 0 ${totalWidth} ${underlineHeight}`;

        return (
          <foreignObject
            key={p.id + keySuffix}
            x={startX}
            y={topY}
            width={labelWidth}
            height={labelHeight}
            className={`spark-label-fo label-fo-${arrowDir}`}
          >
            <div className={`label-wrapper dir-${arrowDir}`}>
              <span className={`label-text ${towardDir}-${arrowDir}-text`} title={text}>
                {text}
              </span>
              <svg
                className="label-underline"
                viewBox={viewBox}
                preserveAspectRatio="none"
                style={{ height: underlineHeight }}
              >
                <path className="label-line" d={linePath} />
                <path className="label-head" d={headPath} />
              </svg>
            </div>
          </foreignObject>
        );
      };

      if (p.vertical === "center") {
        const upperText = p.labels?.[0] || p.label;
        const lowerText = p.labels?.[1] || p.labels?.[0] || p.label;
        nodes.push(
          buildLabel("-label-upper", pathTop - labelHeight, upperText, true, p.side || "right")
        );
        nodes.push(buildLabel("-label-lower", pathBottom, lowerText, false, p.side || "right"));
      } else if (p.vertical === "top") {
        const firstText = p.labels?.[0] || p.label;
        nodes.push(
          buildLabel("-label-0", pathTop - labelHeight, firstText, true, p.side || "right")
        );
        if (p.labels && p.labels.length > 1) {
          const secondText = p.labels[1];
          nodes.push(buildLabel("-label-1", pathTop, secondText, false, p.side || "right"));
        }
      } else if (p.vertical === "bottom") {
        let firstTopY: number;
        if (gridSize) firstTopY = pathBottom - labelHeight;
        else firstTopY = pathTop - labelHeight;
        const firstText = p.labels?.[0] || p.label;
        nodes.push(buildLabel("-label-0", firstTopY, firstText, true, p.side || "right"));
        if (p.labels && p.labels.length > 1) {
          const secondText = p.labels[1];
          nodes.push(buildLabel("-label-1", pathBottom, secondText, false, p.side || "right"));
        }
      } else {
        nodes.push(buildLabel("-label", pathTop - labelHeight, p.label, true, p.side || "right"));
      }
    });

  return <>{nodes}</>;
};
