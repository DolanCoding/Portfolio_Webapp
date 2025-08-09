// AI-AGENT CONTEXT: FILE=Home | ROLE=Landing_Page_Component | PURPOSE=Introduction_Profile_CTA_Display
import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import profile from "../../images/profile.png";

// AI-LOGICAL-REGION: Component_Interface
interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <section className="home-section">
      <div className="intro-container">
        <img
          src={profile}
          alt="Sascha Fischer - Full-stack Developer"
          className="profile-photo"
        />

        <h1 className="intro-headline">
          Sascha Fischer: Transforming Complex Challenges into Seamless Web
          Experiences
        </h1>

        <div className="home-text">
          <p className="intro-paragraph">
            My journey into the world of web development wasn't just about
            writing code; it was fueled by a deep-seated fascination with how
            technology can connect people, simplify processes, and empower
            businesses. I thrive on taking abstract ideas and molding them into
            tangible, intuitive applications that genuinely solve problems.
          </p>

          <p className="intro-paragraph">
            Leveraging a robust toolkit that includes <b>React</b>,{" "}
            <b>Node.js</b>, <b>HTML</b>, <b>CSS</b> and <b>JavaScript</b>, I
            specialize in building modern, responsive, and high-performance
            full-stack applications. My focus isn't just on functionality, but
            on crafting user experiences that are both delightful and effective,
            ensuring your project stands out.
          </p>

          <p className="intro-paragraph">
            I approach every project with a problem-solver's mindset, constantly
            seeking elegant and efficient solutions. My goal is to not just meet
            requirements, but to exceed expectations and deliver applications
            that drive measurable results and create lasting value.
          </p>
        </div>

        <Link to="/projects" className="cta-button primary-cta">
          See How I Bring Ideas to Life &rarr;
        </Link>
      </div>
    </section>
  );
};

// AI-NAVIGATION: EXPORT=Home
export default Home;
