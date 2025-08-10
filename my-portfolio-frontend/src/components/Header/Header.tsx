// AI-AGENT CONTEXT: FILE=Header | ROLE=Navigation_Component | PURPOSE=Page_Navigation_Route_Links
// AI-DEPENDENCY: react-router-dom.Link
import { Link } from "react-router-dom";
import "./Header.css";

// AI-LOGICAL-REGION: Component_Interface
interface HeaderComponentProps {
  changePageName: (newPageName: string) => void;
}

const Header: React.FC<HeaderComponentProps> = (props) => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={() => props.changePageName("home")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => props.changePageName("about")}>
              About
            </Link>
          </li>
          <li>
            <Link to="/projects" onClick={() => props.changePageName("projects")}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="/certificates" onClick={() => props.changePageName("certificates")}>
              Certificates
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => props.changePageName("contact")}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// AI-NAVIGATION: EXPORT=Header
export default Header;
