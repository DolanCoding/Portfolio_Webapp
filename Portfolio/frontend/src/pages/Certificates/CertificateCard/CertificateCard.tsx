// AI-AGENT CONTEXT: FILE=CertificateCard | ROLE=Certificate_Display_Component | PURPOSE=Professional_Certification_Card_Display
// AI-DEPENDENCY: Certificates,types.Certificate,LazyImage
// AI-PERFORMANCE: MEMOIZED_COMPONENT,LAZY_IMAGES
import React, { memo, useMemo } from "react";
import "./CertificateCard.css";
import LazyImage from "../../../components/LazyImage/LazyImage";
import { getImageUrl } from "../../../config";

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
  ({ id: _id, title, type, date, issuer, image, link, description, skills }) => {
    const skillTags = useMemo(() => {
      return (skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }, [skills]);

    // AI-LOGICAL-REGION: Render_Logic
    return (
      <div className="certificate-card">
        <div className="certificate-card-overview">
          <div className="certificate-image-container">
            {image && (
              <LazyImage
                src={getImageUrl(image)}
                alt={`${title} certificate`}
                className="certificate-image"
              />
            )}
          </div>

          <div className="certificate-content">
            <div className="certificate-header">
              <h3 className="certificate-title">{title}</h3>
              <p className="certificate-meta">
                <span className="certificate-type">{type}</span>
                <span className="certificate-dot" aria-hidden>
                  •
                </span>
                <span className="certificate-date">{date}</span>
                {issuer && (
                  <>
                    <span className="certificate-dot" aria-hidden>
                      •
                    </span>
                    <span className="certificate-issuer">{issuer}</span>
                  </>
                )}
              </p>
            </div>

            {description && <p className="certificate-description">{description}</p>}

            {skillTags.length > 0 && (
              <div className="certificate-skills">
                <strong className="skills-label">Skills</strong>
                <div className="skills-tags">
                  {skillTags.map((tag, i) => (
                    <span key={i} className="skill-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {link && (
              <div className="certificate-actions">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certificate-button"
                >
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// AI-NAVIGATION: EXPORT=CertificateCard
export default CertificateCard;
