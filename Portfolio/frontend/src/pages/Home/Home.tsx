// AI-AGENT CONTEXT: FILE=Home | ROLE=Landing_Page_Component | PURPOSE=Introduction_Profile_CTA_Display
import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Headline from "./Components/Headline/Headline";
import WorkflowDiagram from "./Components/WorkflowDiagram/WorkflowDiagram";
// import Mermaid from "../../components/Mermaid/Mermaid"; // removed

// AI-LOGICAL-REGION: Component_Interface
interface HomePageProps {
  isCalibrating?: boolean;
}

const Home: React.FC<HomePageProps> = ({ isCalibrating = false }) => {
  // Removed Mermaid workflowChart definition

  return (
    <section className="home-section">
      <Headline isCalibrating={isCalibrating} />
      <div className="intro-container">
        <div id="home-text" className="home-text">
          <p className="intro-paragraph first-paragraph">
            <span className="welcoming">
              Welcome to my Portfolio, <em>"The Digital Blueprint"</em>.
            </span>
            <span className="introduction">
              I’m a full‑stack developer with a blueprint mindset, that means I work in detail,
              measure and plan precisely, and follow a structured, consistent approach, This is how
              I turn rough requirements into dependable web features.
            </span>
          </p>

          <div className="diagram-container" aria-label="Recursive workflow diagram">
            <h5>Recursive Workflow Diagram</h5>
            <WorkflowDiagram />
          </div>

          <p className="intro-paragraph second-paragraph">
            <span>
              While coding with this routine, I strictly follow constraints like predictable
              interfaces, performance budgets, accessible defaults, and low‑drama deploys. All that
              of course while I keep changes readable, reversible, and documented.
            </span>
            <br></br>
            <span>
              If that’s how you like to build, the Projects page is the quickest way to evaluate me,
              one click below, or feel free to browse the portfolio at your own pace.
            </span>
          </p>
          <Link to="/projects" className="cta-button primary-cta">
            See How I Bring Ideas to Life &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

// AI-NAVIGATION: EXPORT=Home
export default Home;
