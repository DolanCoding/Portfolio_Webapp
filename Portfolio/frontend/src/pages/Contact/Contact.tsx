import React from "react";
import "./Contact.css";

// AI-AGENT CONTEXT: FILE=Contact | ROLE=Contact_Page_Component | PURPOSE=Contact_Form_Information_Display
// AI-LOGICAL-REGION: Component_Interface
interface ContactPageProps {}

const Contact: React.FC<ContactPageProps> = () => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="contact-page-container">
      <section className="contact-section">
        <h2>Get In Touch</h2>
        <p>
          I'm always interested in new opportunities and collaborations. Whether
          you have a project in mind or just want to connect, feel free to reach
          out!
        </p>

        <div className="contact-info">
          <div className="contact-method">
            <h3>Email</h3>
            <p>sascha.fischer@example.com</p>
          </div>

          <div className="contact-method">
            <h3>LinkedIn</h3>
            <p>Connect with me on LinkedIn</p>
          </div>

          <div className="contact-method">
            <h3>GitHub</h3>
            <p>Check out my code repositories</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// AI-NAVIGATION: EXPORT=Contact
export default Contact;
// AI-AGENT END OF FILE
