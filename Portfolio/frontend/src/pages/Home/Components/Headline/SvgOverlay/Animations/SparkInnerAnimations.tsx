// AI-AGENT CONTEXT: FILE=SparkInnerAnimations.tsx | ROLE=Inner Animations | PURPOSE=Handle inner avatar spark animations and related logic

import React from "react";
import { AvatarCircle } from "../sparkTypes";

interface SparkInnerAnimationsProps {
  avatarCircle: AvatarCircle | null | undefined;
  isCalibrating: boolean;
  isVisibleRef: React.MutableRefObject<boolean>;
  setShowAvatarSparks: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarUpperPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setAvatarLowerPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setAvatarProgress: React.Dispatch<React.SetStateAction<number>>;
  avatarUpperRef: React.MutableRefObject<SVGPathElement | null>;
  avatarLowerRef: React.MutableRefObject<SVGPathElement | null>;
}

export const useSparkInnerAnimations = ({
  avatarCircle,
  isCalibrating,
  isVisibleRef,
  setShowAvatarSparks,
  setAvatarUpperPos,
  setAvatarLowerPos,
  setAvatarProgress,
  avatarUpperRef,
  avatarLowerRef,
}: SparkInnerAnimationsProps) => {
  // Animate avatar sparks (inner circle animation)
  const animateAvatarSparks = React.useCallback(async () => {
    if (!avatarCircle || !isVisibleRef.current) return;
    setShowAvatarSparks(true);

    // Wait for DOM update
    await new Promise((res) => setTimeout(res, 0));

    const upperEl =
      avatarUpperRef.current ||
      (document.getElementById("avatar-half-upper") as SVGPathElement | null);
    const lowerEl =
      avatarLowerRef.current ||
      (document.getElementById("avatar-half-lower") as SVGPathElement | null);

    if (!(upperEl instanceof SVGPathElement) || !(lowerEl instanceof SVGPathElement)) return;

    // Cache the elements
    avatarUpperRef.current = upperEl;
    avatarLowerRef.current = lowerEl;

    // Animate both sparks in parallel
    await Promise.all([
      new Promise<void>((resolve) => {
        let start: number | null = null;
        function step(ts: number) {
          if (!isVisibleRef.current || isCalibrating) return;
          if (!start) start = ts;

          const elapsed = ts - start;
          const duration = 1500;
          const t = Math.min(elapsed / duration, 1);

          if (!(upperEl instanceof SVGPathElement)) {
            resolve();
            return;
          }

          const len = upperEl.getTotalLength();
          // Upper: left center to right center (t: 0 → 1)
          const pos = upperEl.getPointAtLength(len * t);

          setAvatarUpperPos((prev) => {
            if (!prev || Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.y - pos.y) > 0.5) {
              return { x: pos.x, y: pos.y };
            }
            return prev;
          });

          setAvatarProgress(t);

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      }),
      new Promise<void>((resolve) => {
        let start: number | null = null;
        function step(ts: number) {
          if (!isVisibleRef.current || isCalibrating) return;
          if (!start) start = ts;

          const elapsed = ts - start;
          const duration = 1500;
          const t = Math.min(elapsed / duration, 1);

          if (!(lowerEl instanceof SVGPathElement)) {
            resolve();
            return;
          }

          const len = lowerEl.getTotalLength();
          // Lower: right center to left center (t: 0 → 1)
          const pos = lowerEl.getPointAtLength(len * t);

          setAvatarLowerPos((prev) => {
            if (!prev || Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.y - pos.y) > 0.5) {
              return { x: pos.x, y: pos.y };
            }
            return prev;
          });

          setAvatarProgress(t);

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      }),
    ]);

    // Do NOT setAvatarUpperPos(null) or setAvatarLowerPos(null) here!
    // Let the main cycle handle hiding after overlap.
  }, [
    avatarCircle,
    isVisibleRef,
    isCalibrating,
    setShowAvatarSparks,
    avatarUpperRef,
    avatarLowerRef,
    setAvatarUpperPos,
    setAvatarLowerPos,
    setAvatarProgress,
  ]);

  return {
    animateAvatarSparks,
  };
};
