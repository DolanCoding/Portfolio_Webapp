// AI-AGENT CONTEXT: FILE=About | ROLE=page_component | PURPOSE=Personal_Bio_Skills_Learning_Journey
import React from "react";
import "./About.css";

// AI-LOGICAL-REGION: Component_Interface
interface AboutPageProps {}

const About: React.FC<AboutPageProps> = () => {
  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="about-page-container">
      <section className="about-section summary-section">
        <h3>My Journey & What Drives Me</h3>
        <p>
          My journey into the world of technology began not in a classroom, but
          in my youth, where I was <em>captivated by stories of hackers</em> and
          spent countless hours gaming. This early fascination instilled in me a
          deep-seated curiosity for the digital world and how it operates, which
          has been the driving force behind my career.
        </p>
        <p>
          My true passion ignited around <strong>2022</strong>, when I began
          building web applications as a hobby. This is where I discovered the
          profound satisfaction of{" "}
          <strong>structuring clean, maintainable code</strong>. This wasn't
          just work; it was a puzzle I had fun solving. I also found that my
          journey was accelerated by having <em>fun learning with AI</em>, which
          has made me highly adaptable and open to new technologies.
        </p>
        <p>
          Building upon this solid foundation in{" "}
          <strong>full-stack development</strong>, my attention naturally turned
          to the field of <strong>IT security</strong>, a journey I formally
          began in <strong>early 2025</strong> and continue to pursue with
          unrelenting curiosity. My goal is to do more than just build
          applications; I want to build systems that are fundamentally{" "}
          <strong>robust, secure, and trustworthy</strong>.
        </p>
        <p>
          Ultimately, my path is guided by a long-standing fascination with AI
          and a commitment to security. I am driven by the challenge of
          protecting complex systems and have set my sights on a long-term goal
          of specializing in <strong>AI security architecture</strong>.
        </p>
      </section>

      <section className="about-section skills-section">
        <h3>Key Skills</h3>
        <p className="centered-p">
          Here are some of the technologies and areas I excel in:
        </p>

        <div className="skill-category">
          <h4>Core Development</h4>
          <ul>
            <li>
              <span className="skill-name">JavaScript</span>
              <span className="skill-level" data-level="expert">
                Expert
              </span>
            </li>
            <li>
              <span className="skill-name">Python</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">HTML & CSS</span>
              <span className="skill-level" data-level="expert">
                Expert
              </span>
            </li>
          </ul>
        </div>

        <div className="skill-category">
          <h4>Frontend Frameworks</h4>
          <ul>
            <li>
              <span className="skill-name">React</span>
              <span className="skill-level" data-level="expert">
                Expert
              </span>
            </li>
            <li>
              <span className="skill-name">Redux</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">Responsive Design</span>
              <span className="skill-level" data-level="expert">
                Expert
              </span>
            </li>
          </ul>
        </div>

        <div className="skill-category">
          <h4>Backend & Databases</h4>
          <ul>
            <li>
              <span className="skill-name">Node.js</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">Express.js</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">REST APIs</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">SQL</span>
              <span className="skill-level" data-level="intermediate">
                Intermediate
              </span>
            </li>
            <li>
              <span className="skill-name">PostgreSQL</span>
              <span className="skill-level" data-level="intermediate">
                Intermediate
              </span>
            </li>
            <li>
              <span className="skill-name">Database Design</span>
              <span className="skill-level" data-level="intermediate">
                Intermediate
              </span>
            </li>
            <li>
              <span className="skill-name">Security Best Practices</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
          </ul>
        </div>

        <div className="skill-category">
          <h4>Tools & Practices</h4>
          <ul>
            <li>
              <span className="skill-name">Version Control</span>
              <span className="skill-level" data-level="expert">
                Expert
              </span>
            </li>
            <li>
              <span className="skill-name">
                Problem Solving & Algorithm Design
              </span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
            <li>
              <span className="skill-name">Modular Project Structure</span>
              <span className="skill-level" data-level="proficient">
                Proficient
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="about-section">
        <h3>Continuous Learning</h3>
        <p className="centered-p">
          Details about my ongoing personal learning initiatives and areas of
          exploration:
        </p>

        <div className="learning-development-section">
          <div className="learning-entry">
            <h4>Mastering the Fullstack Foundation</h4>
            <p className="learning-date" data-status="ongoing">
              Status: Ongoing
            </p>
            <p>
              My journey begins with a commitment to mastering fullstack
              development. This includes deepening my understanding of core
              principles across both front-end and back-end ecosystems, serving
              as the solid foundation for all my specialized learning and
              projects.
            </p>
          </div>

          <div className="wire-connector">
            <div className="io-port output-port"></div>
            <div className="v-wire-top"></div>
            <div className="h-wire"></div>
            <div className="v-wire-bottom"></div>
            <div className="io-port input-port"></div>
            <div className="spark"></div>
          </div>

          <div className="learning-entry">
            <h4>Deep Dive into Cybersecurity</h4>
            <p className="learning-date" data-status="ongoing">
              Status: Ongoing
            </p>
            <p>
              I'm currently exploring the core principles of cybersecurity,
              focusing on real-world applications in network defense,
              cryptography, and secure system design. I find this area of
              computer science to be the most critical and intriguing.
            </p>
          </div>

          <div className="wire-connector inverted-connector">
            <div className="io-port output-port"></div>
            <div className="v-wire-top"></div>
            <div className="h-wire"></div>
            <div className="v-wire-bottom"></div>
            <div className="io-port input-port"></div>
            <div className="spark"></div>
          </div>

          <div className="learning-entry">
            <h4>Building an AI-Optimized Workspace</h4>
            <p className="learning-date" data-status="ongoing">
              Status: Ongoing
            </p>
            <p>
              My personal project is centered on designing a development
              environment for maximum efficiency. I am configuring specialized
              Visual Studio Code workspaces and workflows to leverage the full
              potential of AI agents like GitHub Copilot for seamless
              development and maintenance.
            </p>
          </div>

          <div className="wire-connector">
            <div className="io-port output-port"></div>
            <div className="v-wire-top"></div>
            <div className="h-wire"></div>
            <div className="v-wire-bottom"></div>
            <div className="io-port input-port"></div>
            <div className="spark"></div>
          </div>

          <div className="learning-entry">
            <h4>AI-Oriented Information Security Research</h4>
            <p className="learning-date" data-status="ongoing">
              Status: Ongoing
            </p>
            <p>
              While I currently lack fundamental knowledge in machine learning
              and information security, I believe this is my dream field of
              work. I am fascinated by the future of cybersecurity where hackers
              abuse and manipulate the "thought flaws" of AIs, and I am actively
              exploring how to prevent this by securing the AI models and
              guidelines themselves.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// AI-NAVIGATION: EXPORT=About
export default About;
