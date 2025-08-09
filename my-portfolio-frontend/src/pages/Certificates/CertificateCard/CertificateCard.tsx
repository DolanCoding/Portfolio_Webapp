// AI-AGENT CONTEXT: FILE=CertificateCard | ROLE=Certificate_Display_Component | PURPOSE=Professional_Certification_Card_Display
// AI-DEPENDENCY: Certificates,types.Certificate,LazyImage
// AI-PERFORMANCE: MEMOIZED_COMPONENT,LAZY_IMAGES
import React, { memo } from "react";
import "./CertificateCard.css";
import LazyImage from "../../../components/LazyImage/LazyImage";

/**
 * @description AI-OPTIMIZED: Memoized certificate card component for performance
 * @param {CertificateCardProps} props - Certificate data for display
 * @returns {JSX.Element} Rendered certificate card with optimized re-rendering
 * @ai-performance This component is memoized to prevent unnecessary re-renders
 * @ai-usage Use for displaying certificate summaries in grids with stable props
 */
interface CertificateCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  issuer?: string;
  image?: string;
  link?: string;
  description?: string;
  skills?: string;
}

const CertificateCard: React.FC<CertificateCardProps> = memo(
  ({ id, title, type, date, issuer, image, link, description, skills }) => {
    // AI-LOGICAL-REGION: Render_Logic
    return (
      <div className="certificate-card">
        <div className="certificate-image-container">
          {image && (
            <LazyImage
              src={image}
              alt={`${title} certificate`}
              className="certificate-image"
            />
          )}
        </div>

        <div className="certificate-content">
          <h3 className="certificate-title">{title}</h3>
          <p className="certificate-type">{type}</p>
          {issuer && <p className="certificate-issuer">Issued by: {issuer}</p>}
          <p className="certificate-date">Date: {date}</p>

          {description && (
            <p className="certificate-description">{description}</p>
          )}

          {skills && (
            <div className="certificate-skills">
              <span className="skills-label">Skills:</span>
              <span className="skills-text">{skills}</span>
            </div>
          )}

          {link && (
            <div className="certificate-actions">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="certificate-link"
              >
                View Certificate
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// AI-NAVIGATION: EXPORT=CertificateCard
export default CertificateCard;
