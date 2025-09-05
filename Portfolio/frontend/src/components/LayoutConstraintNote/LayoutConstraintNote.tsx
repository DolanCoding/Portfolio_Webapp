// AI-AGENT CONTEXT: FILE=LayoutConstraintNote.tsx | ROLE=Viewport_Constraint_Notice | PURPOSE=Explain intentional non-render below minimum grid size

import React from "react";
import "./LayoutConstraintNote.css";

interface LayoutConstraintNoteProps {
  minMajorBlocksH?: number;
  minMajorBlocksW?: number;
  currentMajorBlocksH?: number;
  currentMajorBlocksW?: number;
}

const LayoutConstraintNote: React.FC<LayoutConstraintNoteProps> = ({
  minMajorBlocksH = 5,
  minMajorBlocksW = 6,
  currentMajorBlocksH,
  currentMajorBlocksW,
}) => {
  return (
    <section
      className="layout-constraint-note"
      role="region"
      aria-labelledby="layout-constraint-title"
      data-min-blocks-h={minMajorBlocksH}
      data-min-blocks-w={minMajorBlocksW}
      data-current-blocks-h={currentMajorBlocksH ?? ""}
      data-current-blocks-w={currentMajorBlocksW ?? ""}
    >
      <header className="lcn-header">
        <h1 id="layout-constraint-title" className="lcn-title">
          Display Resolution not Compatible.
        </h1>
        <p className="lcn-subtitle">
          ⚙️ This portfolio uses a precision grid layout designed for landscape view to reflect my
          "Blueprint" theme. I intentionally prioritized visual structure over responsiveness to
          demonstrate control over layout engines and adherence to a strict design spec.
        </p>
      </header>

      <div className="lcn-body">
        <p>
          The interface is designed around a blueprint grid system with structural proportions that
          are meaningful, not decorative. Rendering it below the required width or height would
          force compromises (shrinking typography to illegibility, collapsing spacing, or
          introducing awkward scrolling stutters) that dilute the aesthetic and misrepresent the
          standard I set for my work.
        </p>

        <p>
          I recognize this is unconventional for a public portfolio. The decision is deliberate:
          consistency, readability, and spatial hierarchy are integral to the concept—not optional
          polish.
        </p>

        <p className="lcn-instructions">To view the full experience:</p>
        <ul className="lcn-actions">
          <li>Increase the window size (maximize or resize vertically or horizontally).</li>
          <li>Rotate a mobile device to landscape orientation.</li>
          <li>Use a device with a larger display.</li>
        </ul>
      </div>

      <footer className="lcn-footer">
        <p>
          This constraint reflects a design principle: I do not reduce intent to fit an edge case at
          the cost of clarity. Thank you for understanding.
        </p>
      </footer>
    </section>
  );
};

export default LayoutConstraintNote;
