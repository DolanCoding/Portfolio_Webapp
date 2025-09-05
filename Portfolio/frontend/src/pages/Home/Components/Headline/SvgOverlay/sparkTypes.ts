// Basic shared types for spark system
export interface Point {
  x: number;
  y: number;
}
export interface SparkPath {
  id: string;
  d: string;
  kind?: "shared" | "branch";
  end?: Point;
  label?: string; // optional label text for this path
  labelX?: number; // hero-relative x for label placement
  labelY?: number; // hero-relative y for label placement
  vertical?: "top" | "bottom" | "center"; // branch orientation for label positioning (center has two labels)
  labels?: string[]; // optional multiple labels (first mirrors legacy label)
  side?: "left" | "right"; // which side of avatar/bubble
}
export interface SparkConnector {
  id: string;
  cx: number; // bubble edge center x (hero-relative)
  cy: number; // bubble edge center y (hero-relative)
  side: "left" | "right";
  shape?: "arc" | "trapez";
  rx?: number; // legacy (arc)
  ry?: number; // legacy (arc)
  d?: string; // path for rendering (arc or trapez)
}

// Component-specific types
export interface SparkOverlayProps {
  paths: SparkPath[];
  connectors?: SparkConnector[];
  avatarCircle?: AvatarCircle | null;
  isCalibrating?: boolean;
}

export interface AvatarCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OutGlowState {
  progress: number;
  pathIdx: number;
  fromLength: number;
}
