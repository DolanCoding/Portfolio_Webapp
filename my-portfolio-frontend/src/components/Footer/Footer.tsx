// src/components/Footer.tsx

// AI-AGENT CONTEXT: FILE=Footer | ROLE=Footer_Component | PURPOSE=Footer_UI_Copyright_Display
import React from "react";
import "./Footer.css";

// AI-LOGICAL-REGION: Component_Interface
interface FooterComponentProps {
  changePageName: (newPageName: string) => void;
}

const Footer: React.FC<FooterComponentProps> = (_props) => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Sascha Fischer. All rights reserved.</p>
      </div>
    </footer>
  );
};

// AI-NAVIGATION: EXPORT=Footer
export default Footer;
