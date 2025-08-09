// AI-AGENT CONTEXT: FILE=NotFound | ROLE=NotFound_Page_Component | PURPOSE=404_Error_Page_Display
import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";

// AI-LOGICAL-REGION: Component_Interface
interface NotFoundPageProps {}

const NotFound: React.FC<NotFoundPageProps> = () => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="notfound-page-container">
      <section className="notfound-section">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-link">
          Return to Home
        </Link>
      </section>
    </div>
  );
};

// AI-NAVIGATION: EXPORT=NotFound
export default NotFound;
// AI-AGENT END OF FILE
