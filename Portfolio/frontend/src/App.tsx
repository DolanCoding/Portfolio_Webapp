// AI-AGENT CONTEXT: FILE=App | ROLE=Root_Application_Component | PURPOSE=Routing_State_Management_Layout
// AI-DEPENDENCY: Header,Footer,React.lazy(pages),react-router-dom
// AI-PERFORMANCE: LAZY_LOADING,ROUTE_SPLITTING,SUSPENSE_BOUNDARIES
import React, { useState, Suspense, lazy, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Background from "./components/Background/Background";
import LayoutConstraintNote from "./components/LayoutConstraintNote/LayoutConstraintNote";

// AI-LOGICAL-REGION: Component_Imports
// AI-PERFORMANCE: CODE_SPLITTING - Components are loaded only when needed
import "./components/Header/Header.css";
import "./components/Footer/Footer.css";
import "./components/Background/Background.css";

// AI-LOGICAL-REGION: Page_Imports
// AI-PERFORMANCE: CODE_SPLITTING - Pages are loaded only when needed

// AI-LOGICAL-REGION: Component_Interface
interface AppComponentProps {}

// AI-LOGICAL-REGION: Lazy_Component_Imports
// AI-PERFORMANCE: CODE_SPLITTING - Each page is loaded only when needed
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Certificates = lazy(() => import("./pages/Certificates/Certificates"));

// Wrapper component for Home to pass isCalibrating prop
const HomeWrapper = ({ isCalibrating }: { isCalibrating: boolean }) => (
  <Home isCalibrating={isCalibrating} />
);

const App: React.FC<AppComponentProps> = () => {
  const [pageName, setPageName] = useState<string>("home");
  const [layoutInfo, setLayoutInfo] = useState<{
    blocksH: number;
    blocksW: number;
    unitPx: number;
  } | null>(null);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const calibrationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const changePageName = (newPageName: string) => setPageName(newPageName);

  // Calibration functions
  const startCalibration = useCallback(() => {
    if (calibrationTimeoutRef.current) {
      clearTimeout(calibrationTimeoutRef.current);
    }
    setIsCalibrating(true);
    calibrationTimeoutRef.current = setTimeout(() => {
      setIsCalibrating(false);
    }, 1000);
  }, []);

  const handleResize = useCallback(() => {
    startCalibration();
  }, [startCalibration]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (calibrationTimeoutRef.current) {
        clearTimeout(calibrationTimeoutRef.current);
      }
    };
  }, []);

  // Attach event listeners for calibration triggers
  React.useEffect(() => {
    const handleWindowResize = () => handleResize();
    const handleOrientationChange = () => handleResize();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, abort any ongoing calibration
        if (calibrationTimeoutRef.current) {
          clearTimeout(calibrationTimeoutRef.current);
          setIsCalibrating(false);
        }
      }
    };

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleResize]);

  const handleLayout = useCallback((info: { blocksH: number; blocksW: number; unitPx: number }) => {
    setLayoutInfo((prev) =>
      prev &&
      prev.blocksH === info.blocksH &&
      prev.blocksW === info.blocksW &&
      Math.abs(prev.unitPx - info.unitPx) < 0.0001
        ? prev
        : info
    );
  }, []);

  const blocksH = layoutInfo?.blocksH ?? 0;
  const blocksW = layoutInfo?.blocksW ?? 0;

  const visibility = blocksH < 6 || blocksW < 9 ? "hidden" : "visible";
  console.log(`App: layout ${blocksW}×${blocksH} blocks, bg visibility=${visibility}`);

  return (
    <div className="App">
      {/* AI-PERFORMANCE: ROUTER_PERFORMANCE_TRACKING */}
      <Header changePageName={changePageName} />
      <Background pageName={pageName} visibility={visibility} onLayout={handleLayout} />
      {isCalibrating ? (
        // Calibration loading screen
        <div className="calibration-screen">
          <div className="calibration-content">
            <div className="calibration-spinner"></div>
            <h2>Calibrating Layout</h2>
            <p>Optimizing display for your screen size...</p>
          </div>
        </div>
      ) : blocksH == null || blocksW == null ? (
        // Optional lightweight placeholder while first layout computes
        <div className="layout-scan-placeholder">Initializing layout…</div>
      ) : blocksH < 6 || blocksW < 9 ? (
        <LayoutConstraintNote
          minMajorBlocksH={6}
          minMajorBlocksW={9}
          currentMajorBlocksH={blocksH}
          currentMajorBlocksW={blocksW}
        />
      ) : (
        <div className="app-content">
          <div className={"main-content-wrapper " + pageName}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/Portfolio" element={<HomeWrapper isCalibrating={isCalibrating} />} />
                <Route path="/home" element={<HomeWrapper isCalibrating={isCalibrating} />} />
                <Route path="/" element={<HomeWrapper isCalibrating={isCalibrating} />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      )}
      <Footer changePageName={changePageName} />
    </div>
  );
};

// AI-NAVIGATION: EXPORT=App
export default App;
