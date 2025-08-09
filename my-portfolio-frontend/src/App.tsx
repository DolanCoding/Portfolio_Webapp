// AI-AGENT CONTEXT: FILE=App | ROLE=Root_Application_Component | PURPOSE=Routing_State_Management_Layout
// AI-DEPENDENCY: Header,Footer,React.lazy(pages),react-router-dom
// AI-PERFORMANCE: LAZY_LOADING,ROUTE_SPLITTING,SUSPENSE_BOUNDARIES
import React, { useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// AI-LOGICAL-REGION: Lazy_Component_Imports
// AI-PERFORMANCE: CODE_SPLITTING - Each page is loaded only when needed
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Certificates = lazy(() => import("./pages/Certificates/Certificates"));

// AI-LOGICAL-REGION: Component_Interface
interface AppComponentProps {}

const App: React.FC<AppComponentProps> = () => {
  // AI-LOGICAL-REGION: State_Management
  // AI-PERFORMANCE: MINIMAL_STATE - Only essential UI state
  const [pageName, setPageName] = useState<string>("home");

  // AI-LOGICAL-REGION: Event_Handlers
  // AI-PERFORMANCE: CALLBACK_OPTIMIZATION - Stable reference for child components
  const changePageName = (newPageName: string): void => {
    setPageName(newPageName);
  };

  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="App">
      {/* AI-PERFORMANCE: ROUTER_PERFORMANCE_TRACKING */}
      <Header changePageName={changePageName} />
      <div className={"main-content-wrapper " + pageName}>
        {/* AI-PERFORMANCE: SUSPENSE_BOUNDARY - Fallback for lazy loading */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/Portfolio" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer changePageName={changePageName} />
    </div>
  );
};

// AI-NAVIGATION: EXPORT=App
export default App;
