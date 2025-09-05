// AI-AGENT CONTEXT: FILE=SparkConnectors.tsx | ROLE=Connector Component | PURPOSE=Render static connector paths (backbone and branches)

import React from "react";
import { SparkPath, SparkConnector } from "../sparkTypes";

interface SparkConnectorsProps {
  paths: SparkPath[];
  connectors: SparkConnector[];
}

export const SparkConnectors: React.FC<SparkConnectorsProps> = ({ paths, connectors }) => {
  return (
    <g className="spark-connector-group">
      {/* Render backbone (center horizontal) as a static path, never animated */}
      {paths
        .filter((p) => p.id === "h1-left" || p.id === "h1-right")
        .map((p) => (
          <path id={p.id} key={p.id} d={p.d} className="spark-connector" />
        ))}
      {/* Render branches as static paths, never animated */}
      {paths
        .filter((p) => p.kind === "branch")
        .map((p) => (
          <path id={p.id} key={p.id} d={p.d} className="spark-connector" />
        ))}
      {connectors.map((c) =>
        c.d ? <path key={c.id} d={c.d} className="spark-connector-arc" /> : null
      )}
    </g>
  );
};
