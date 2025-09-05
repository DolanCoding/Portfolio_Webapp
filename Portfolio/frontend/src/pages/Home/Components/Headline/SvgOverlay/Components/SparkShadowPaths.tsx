// AI-AGENT CONTEXT: FILE=SparkShadowPaths.tsx | ROLE=Shadow Paths Component | PURPOSE=Render transparent shadow paths for animation logic

import React from "react";
import { SparkPath } from "../sparkTypes";

interface SparkShadowPathsProps {
  shadowPaths: SparkPath[];
  showAvatarSparks: boolean;
  avatarUpperPath: string;
  avatarLowerPath: string;
}

export const SparkShadowPaths: React.FC<SparkShadowPathsProps> = ({
  shadowPaths,
  showAvatarSparks,
  avatarUpperPath,
  avatarLowerPath,
}) => {
  return (
    <g className="spark-shadow-group">
      {shadowPaths.map((sp) => (
        <path
          key={sp.id}
          id={sp.id}
          d={sp.d}
          className="spark-shadow-path"
          style={{ stroke: "transparent", fill: "none", pointerEvents: "none" }}
        />
      ))}
      {showAvatarSparks && (
        <>
          <path
            id="avatar-half-upper"
            d={avatarUpperPath}
            className="spark-shadow-path"
            style={{ stroke: "transparent", fill: "none", pointerEvents: "none" }}
          />
          <path
            id="avatar-half-lower"
            d={avatarLowerPath}
            className="spark-shadow-path"
            style={{ stroke: "transparent", fill: "none", pointerEvents: "none" }}
          />
        </>
      )}
    </g>
  );
};
