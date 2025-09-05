// AI-AGENT CONTEXT: FILE=useBoundingBoxes.tsx | ROLE=Bounding_Boxes_Hook | PURPOSE=Calculates and tracks bounding boxes for path labels

import React from "react";
import { SparkPath, BoundingBox } from "../sparkTypes";

interface UseBoundingBoxesProps {
  paths: SparkPath[];
  labelWidth: number;
  labelHeight: number;
}

export const useBoundingBoxes = ({ paths, labelWidth, labelHeight }: UseBoundingBoxesProps) => {
  const [bboxes, setBboxes] = React.useState<Record<string, BoundingBox>>({});

  React.useLayoutEffect(() => {
    if (!labelWidth) return;
    const next: Record<string, BoundingBox> = {};
    paths.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el instanceof SVGGraphicsElement) {
        const bb = el.getBBox();
        next[p.id] = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
      }
    });
    setBboxes(next);
  }, [paths, labelWidth, labelHeight]);

  return bboxes;
};
