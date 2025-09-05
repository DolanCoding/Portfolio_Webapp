// AI-AGENT CONTEXT: FILE=useSparkState.tsx | ROLE=Spark_State_Hook | PURPOSE=Manages all animation state and refs for the spark overlay system

import React from "react";
import { OutGlowState } from "../sparkTypes";

interface UseSparkStateProps {
  isCalibrating: boolean;
}

export const useSparkState = ({ isCalibrating }: UseSparkStateProps) => {
  // Animation state for both sparks
  const [leftIdx, setLeftIdx] = React.useState<number>(0);
  const [rightIdx, setRightIdx] = React.useState<number>(0);
  const [leftVisited, setLeftVisited] = React.useState<Set<number>>(new Set());
  const [rightVisited, setRightVisited] = React.useState<Set<number>>(new Set());
  const [leftSparkPos, setLeftSparkPos] = React.useState<{ x: number; y: number } | null>(null);
  const [rightSparkPos, setRightSparkPos] = React.useState<{ x: number; y: number } | null>(null);

  // Add state for return spark visibility enhancement
  const [leftReturnSpark, setLeftReturnSpark] = React.useState(false);
  const [rightReturnSpark, setRightReturnSpark] = React.useState(false);

  // Avatar half-circle spark animation state
  const [showAvatarSparks, setShowAvatarSparks] = React.useState(false);
  const [avatarUpperPos, setAvatarUpperPos] = React.useState<{ x: number; y: number } | null>(null);
  const [avatarLowerPos, setAvatarLowerPos] = React.useState<{ x: number; y: number } | null>(null);
  const [avatarProgress, setAvatarProgress] = React.useState(0);

  // Add state for the glowing path length
  const [leftLitLength, setLeftLitLength] = React.useState(0);
  const [rightLitLength, setRightLitLength] = React.useState(0);

  // Outglow state (for fading sweep)
  const [leftOutGlow, setLeftOutGlow] = React.useState<OutGlowState | null>(null);
  const [rightOutGlow, setRightOutGlow] = React.useState<OutGlowState | null>(null);

  // Use refs for values that don't affect rendering
  const leftLitLengthRef = React.useRef(0);
  const rightLitLengthRef = React.useRef(0);
  const leftSparkPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const rightSparkPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const avatarUpperPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const avatarLowerPosRef = React.useRef<{ x: number; y: number } | null>(null);

  // Cache DOM element refs to avoid getElementById queries
  const leftPathRefs = React.useRef<Map<number, SVGPathElement | null>>(new Map());
  const rightPathRefs = React.useRef<Map<number, SVGPathElement | null>>(new Map());
  const avatarUpperRef = React.useRef<SVGPathElement | null>(null);
  const avatarLowerRef = React.useRef<SVGPathElement | null>(null);

  // Visibility state to pause animations when tab is hidden
  const isVisibleRef = React.useRef(true);

  // Sync refs with state
  React.useEffect(() => {
    leftLitLengthRef.current = leftLitLength;
  }, [leftLitLength]);
  React.useEffect(() => {
    rightLitLengthRef.current = rightLitLength;
  }, [rightLitLength]);
  React.useEffect(() => {
    leftSparkPosRef.current = leftSparkPos;
  }, [leftSparkPos]);
  React.useEffect(() => {
    rightSparkPosRef.current = rightSparkPos;
  }, [rightSparkPos]);
  React.useEffect(() => {
    avatarUpperPosRef.current = avatarUpperPos;
  }, [avatarUpperPos]);
  React.useEffect(() => {
    avatarLowerPosRef.current = avatarLowerPos;
  }, [avatarLowerPos]);

  // Handle calibration: abort animations and reset states
  React.useEffect(() => {
    if (isCalibrating) {
      // Reset all animation states to zero
      setLeftIdx(0);
      setRightIdx(0);
      setLeftVisited(new Set());
      setRightVisited(new Set());
      setLeftSparkPos(null);
      setRightSparkPos(null);
      setShowAvatarSparks(false);
      setAvatarUpperPos(null);
      setAvatarLowerPos(null);
      setLeftLitLength(0);
      setRightLitLength(0);
      setLeftOutGlow(null);
      setRightOutGlow(null);
      setLeftReturnSpark(false);
      setRightReturnSpark(false);

      // Reset refs
      leftSparkPosRef.current = null;
      rightSparkPosRef.current = null;
      avatarUpperPosRef.current = null;
      avatarLowerPosRef.current = null;
      leftLitLengthRef.current = 0;
      rightLitLengthRef.current = 0;
    }
  }, [isCalibrating]);

  // Handle visibility changes
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      isVisibleRef.current = visible;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return {
    // State
    leftIdx,
    rightIdx,
    leftVisited,
    rightVisited,
    leftSparkPos,
    rightSparkPos,
    leftReturnSpark,
    rightReturnSpark,
    showAvatarSparks,
    avatarUpperPos,
    avatarLowerPos,
    avatarProgress,
    leftLitLength,
    rightLitLength,
    leftOutGlow,
    rightOutGlow,

    // Setters
    setLeftIdx,
    setRightIdx,
    setLeftVisited,
    setRightVisited,
    setLeftSparkPos,
    setRightSparkPos,
    setLeftReturnSpark,
    setRightReturnSpark,
    setShowAvatarSparks,
    setAvatarUpperPos,
    setAvatarLowerPos,
    setAvatarProgress,
    setLeftLitLength,
    setRightLitLength,
    setLeftOutGlow,
    setRightOutGlow,

    // Refs
    leftLitLengthRef,
    rightLitLengthRef,
    leftSparkPosRef,
    rightSparkPosRef,
    avatarUpperPosRef,
    avatarLowerPosRef,
    leftPathRefs,
    rightPathRefs,
    avatarUpperRef,
    avatarLowerRef,
    isVisibleRef,
  };
};
