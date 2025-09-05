// AI-AGENT CONTEXT: FILE=WorkflowDiagram.tsx | ROLE=Diagram | PURPOSE=SVG workflow diagram overlayed on dynamic grid

import React from "react";
import "./WorkflowDiagram.css";

// All steps in a single linear sequence
const allSteps = [
  { key: "visualize", label: "Visualize", type: "rect" as const },
  { key: "prototype", label: "Prototype", type: "rect" as const },
  { key: "specify", label: "Specify", type: "rect" as const },
  { key: "refine", label: "Refine", type: "rect" as const },
  { key: "decision", label: "New idea?", type: "diamond" as const },
  { key: "finalize", label: "Finalize", type: "rect" as const },
];

export interface WorkflowDiagramProps {}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = () => {
  const gridSize = Number(
    getComputedStyle(document.documentElement).getPropertyValue("--bp-grid-size").replace("px", "")
  );
  const contentUnitsW = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bp-content-width")
      .replace("px", "")
  );
  if (!gridSize || !contentUnitsW || contentUnitsW <= 0) {
    return null;
  }

  // --- Content-Aware Layout Engine ---
  // Nodes have fixed widths to ensure content fits. Gaps are dynamic.
  const rectNodeWidthUnits = 8;
  const diamondNodeWidthUnits = 10;
  const numRects = 5;
  const numDiamonds = 1;
  const numGaps = 5;

  const loopSpaceUnits = 2; // Reserved space for the 'Yes' loop path on the left
  const minPaddingUnits = 2; // Minimum padding on each side for stroke clearance

  const totalNodeWidthUnits = numRects * rectNodeWidthUnits + numDiamonds * diamondNodeWidthUnits;
  const fixedSpaceUnits = totalNodeWidthUnits + loopSpaceUnits + minPaddingUnits * 2;

  const totalGapWidthUnits = contentUnitsW - fixedSpaceUnits;

  // If there's not enough space for at least 1 unit per gap, don't render.
  if (totalGapWidthUnits < numGaps) {
    return null;
  }

  // Distribute the available space evenly among the gaps.
  const baseGapWidth = Math.floor(totalGapWidthUnits / numGaps);
  const remainder = totalGapWidthUnits % numGaps;
  const gapWidths = Array(numGaps).fill(baseGapWidth);
  // The last gap absorbs any remainder to maintain integer alignment.
  gapWidths[numGaps - 1] += remainder;

  // --- Position all elements based on the calculated widths ---
  const rectNodeHeightUnits = 2;
  const diamondNodeHeightUnits = 4;
  const centerY = 5 * gridSize; // Vertical center for the diagram
  const leftMarginUnits = minPaddingUnits + loopSpaceUnits;
  console.log("leftMarginUnits:", leftMarginUnits);
  let cursorXUnits = leftMarginUnits;

  const positionedSteps = allSteps.map((step, index) => {
    const widthUnits = step.type === "rect" ? rectNodeWidthUnits : diamondNodeWidthUnits;
    const heightUnits = step.type === "rect" ? rectNodeHeightUnits : diamondNodeHeightUnits;

    const width = widthUnits * gridSize;
    const height = heightUnits * gridSize;
    const x = cursorXUnits * gridSize;
    const y = centerY - height / 2;

    // Advance cursor for the next element
    cursorXUnits += widthUnits;
    if (index < numGaps) {
      cursorXUnits += gapWidths[index];
    }

    return { ...step, width, height, x, y };
  });

  const svgWidth = contentUnitsW * gridSize;
  const svgHeight = 10 * gridSize;

  // --- Path Coordinates for Connectors and Loop ---
  const decisionNode = positionedSteps[4];
  const visualizeNode = positionedSteps[0];

  const decisionCenterBottom = {
    x: decisionNode.x + decisionNode.width / 2,
    y: decisionNode.y + decisionNode.height,
  };
  const decisionCenterRight = {
    x: decisionNode.x + decisionNode.width,
    y: decisionNode.y + decisionNode.height / 2,
  };
  const visualizeCenterLeft = {
    x: visualizeNode.x,
    y: visualizeNode.y + visualizeNode.height / 2,
  };

  // The loop path starts from the decision node and curves back to the visualize node.
  const loopPath = `M ${decisionCenterBottom.x},${decisionCenterBottom.y} V ${svgHeight - 2 * gridSize} H ${
    minPaddingUnits * gridSize
  } V ${visualizeCenterLeft.y} H ${visualizeCenterLeft.x}`;

  const cornerRadius = Math.round(gridSize * 0.5);

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", position: "absolute" }}>
      <svg
        className="workflow-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" className="wf-arrow-head" />
          </marker>
          <marker
            id="wf-arrow-loop"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" className="wf-arrow-head loop" />
          </marker>
        </defs>

        {/* Render All Nodes */}
        {positionedSteps.map((s) => (
          <g
            key={s.key}
            transform={`translate(${s.x}, ${s.y})`}
            className={`wf-node ${s.type === "diamond" ? "wf-decision" : ""}`}
          >
            {s.type === "rect" ? (
              <rect width={s.width} height={s.height} rx={cornerRadius} />
            ) : (
              <polygon
                points={`${s.width / 2},0 ${s.width},${s.height / 2} ${
                  s.width / 2
                },${s.height} 0,${s.height / 2}`}
              />
            )}
            <text x={s.width / 2} y={s.height / 2} textLength={s.width - 2 * gridSize}>
              {s.label}
            </text>
          </g>
        ))}

        {/* Render Connecting Arrows */}
        {positionedSteps.slice(0, -1).map((a, i) => {
          const b = positionedSteps[i + 1];
          const start = { x: a.x + a.width, y: a.y + a.height / 2 };
          const end = { x: b.x, y: b.y + b.height / 2 };
          return (
            <path
              key={`line-${i}`}
              d={`M${start.x},${start.y} L${end.x},${end.y}`}
              className="wf-edge"
              markerEnd="url(#wf-arrow)"
            />
          );
        })}

        {/* Render Labels */}
        <text
          x={decisionCenterRight.x + 1.5 * gridSize}
          y={decisionCenterRight.y - 0.2 * gridSize}
          className="wf-label"
        >
          No
        </text>
        <text
          x={decisionCenterBottom.x + 1 * gridSize}
          y={decisionCenterBottom.y + 1.8 * gridSize}
          className="wf-label"
        >
          Yes
        </text>

        {/* Render "Yes" Loop Path */}
        <path d={loopPath} className="wf-loop" markerEnd="url(#wf-arrow-loop)" />
      </svg>
    </div>
  );
};

export default WorkflowDiagram;
