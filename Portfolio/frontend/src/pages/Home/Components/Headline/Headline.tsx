import { useRef, useEffect, useState } from "react";
import profile from "./images/profile.png";
import "./Headline.css";
import { SparkOverlay } from "./SvgOverlay/SparkOverlay";
import { buildAllConnections } from "./SvgOverlay/sparkGeometry";
import { SparkPath } from "./SvgOverlay/sparkTypes";

export default function Headline({ isCalibrating = false }: { isCalibrating?: boolean }) {
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const leftTopRef = useRef<HTMLDivElement | null>(null);
  const leftBottomRef = useRef<HTMLDivElement | null>(null);
  const leftCenterRef = useRef<HTMLDivElement | null>(null);
  const rightTopRef = useRef<HTMLDivElement | null>(null);
  const rightBottomRef = useRef<HTMLDivElement | null>(null);
  const rightCenterRef = useRef<HTMLDivElement | null>(null);

  // Replaces LeaderLine segments: single SVG path per connection
  const [paths, setPaths] = useState<SparkPath[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);

  // Compute avatar center and radius for SVG overlay
  const [avatarCircle, setAvatarCircle] = useState<{ cx: number; cy: number; r: number } | null>(
    null
  );

  // Generate SVG connectors once on mount + lightweight responsive rebuild on hero resize / window resize
  useEffect(() => {
    const avatar = avatarRef.current;
    const heroEl = heroRef.current;
    if (!avatar || !heroEl) return;

    let frame = 0;
    const build = () => {
      const { paths: newPaths, connectors: newConnectors } = buildAllConnections(
        avatarRef.current!,
        leftTopRef.current,
        leftCenterRef.current,
        leftBottomRef.current,
        rightTopRef.current,
        rightCenterRef.current,
        rightBottomRef.current,
        heroRef.current!
      );
      setPaths(newPaths);
      setConnectors(newConnectors);
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        build();
      });
    };

    // Initial build (next frame ensures layout settled)
    schedule();

    // Hero resize observer (avatar + bubbles move proportionally inside hero grid; measuring them keeps accuracy)
    const ro = new ResizeObserver(schedule);
    ro.observe(heroEl);
    if (avatar) ro.observe(avatar);
    if (leftTopRef.current) ro.observe(leftTopRef.current);
    if (leftBottomRef.current) ro.observe(leftBottomRef.current);
    if (rightTopRef.current) ro.observe(rightTopRef.current);
    if (rightBottomRef.current) ro.observe(rightBottomRef.current);

    // Window resize (layout shift) — debounced via rAF
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const updateAvatarCircle = () => {
      const avatar = avatarRef.current;
      const hero = heroRef.current;
      if (avatar && hero) {
        const avatarRect = avatar.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        const cx = avatarRect.left - heroRect.left + avatarRect.width / 2;
        const cy = avatarRect.top - heroRect.top + avatarRect.height / 2;
        const r = Math.max(avatarRect.width, avatarRect.height) / 2;

        setAvatarCircle({ cx, cy, r });
      }
    };

    // Initial update
    updateAvatarCircle();

    // Use ResizeObserver for more reliable updates
    const ro = new ResizeObserver(() => {
      // Small delay to ensure DOM has settled, then use rAF for smooth updates
      setTimeout(() => {
        requestAnimationFrame(updateAvatarCircle);
      }, 16); // ~1 frame at 60fps
    });

    const avatar = avatarRef.current;
    const hero = heroRef.current;
    if (hero) ro.observe(hero);
    if (avatar) ro.observe(avatar);

    // Also listen to window resize as backup
    const handleResize = () => {
      requestAnimationFrame(updateAvatarCircle);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={heroRef} className="hero">
      <div className="hero-grid">
        <div className="left">
          <div
            ref={leftTopRef}
            className="headline-bubble bubble-top"
            data-label="dedication |ambition"
          >
            <span className="descriptive-text">Passion-Driven Coding</span>
            <span className="reason-text">because passion fuels motivation.</span>
          </div>
          <div
            ref={leftCenterRef}
            className="headline-bubble bubble-bottom"
            data-label="openness | versatility"
          >
            <span className="descriptive-text">Continuous Curiosity</span>
            <span className="reason-text">because discoveries are possibilities</span>
          </div>
          <div
            ref={leftBottomRef}
            className="headline-bubble bubble-bottom"
            data-label="motivation |competence"
          >
            <span className="descriptive-text">Recursive Learning</span>
            <span className="reason-text">because learning opens new horizons.</span>
          </div>
        </div>
        <div className="profileDiv">
          <img id="avatar" ref={avatarRef} src={profile} className="avatar" alt="Profile" />
          <p className="name">
            <span>Sascha</span> <span>Fischer</span>
          </p>
        </div>
        <div className="right">
          <div
            ref={rightTopRef}
            className="headline-bubble bubble-bottom"
            data-label="empathy |flexibility"
          >
            <span className="descriptive-text">Adaptive Development</span>
            <span className="reason-text">
              because requirements form the foundation of solutions.
            </span>
          </div>
          <div
            ref={rightCenterRef}
            className="headline-bubble bubble-bottom"
            data-label="confidence |assurance"
          >
            <span className="descriptive-text">Applied Knowledge</span>
            <span className="reason-text">because progress never stops.</span>
          </div>
          <div
            ref={rightBottomRef}
            className="headline-bubble bubble-top"
            data-label="reliability |validity"
          >
            <span className="descriptive-text">Reliable Results</span>
            <span className="reason-text">because reliability is my standard.</span>
          </div>
        </div>
      </div>
      {/* SVG overlay replaces LeaderLine drawing */}
      <SparkOverlay
        paths={paths}
        connectors={connectors}
        avatarCircle={avatarCircle}
        isCalibrating={isCalibrating}
      />
    </div>
  );
}
