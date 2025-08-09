// AI-AGENT CONTEXT: FILE=Certificates | ROLE=Certificate_Display_Component | PURPOSE=Professional_Certifications_Gallery
// AI-DEPENDENCY: CertificateCard,apiClient,types,config
// AI-ERROR-BOUNDARY: API_FAILURE,LOADING_STATE
// AI-PERFORMANCE: OPTIMIZED_RENDERING,MEMOIZATION
import React, { useEffect, useState, useMemo } from "react";
import "./Certificates.css";
import { fetchSomething } from "../../api/apiClient";
import CertificateCard from "./CertificateCard/CertificateCard";
import { API_BASE_URL, CERTIFICATES_ENDPOINT } from "../../config";
import { Certificate, ApiError, handleApiError } from "../../types";
import {
  validateApiResponse,
  validateCertificate,
  debugLogValidation,
  memoizedValidation,
} from "../../utils/aiValidationHelpers";

/**
 * @description AI-OPTIMIZED: Certificates page with performance monitoring and memoized components
 * @param {CertificatesPageProps} props - Component props (currently empty interface)
 * @returns {JSX.Element} Certificates page with lazy loading images and error handling
 * @ai-performance Uses memoized sorting, lazy image loading, and performance tracking
 * @ai-error-handling Integrated with error reporting system and graceful fallbacks
 * @ai-usage Entry point for professional certifications showcase
 * @ai-dependencies CertificateCard, LazyImage, fetchSomething, validation helpers
 */
// AI-LOGICAL-REGION: Component_Interface
interface CertificatesPageProps {}

const Certificates: React.FC<CertificatesPageProps> = () => {
  // AI-LOGICAL-REGION: State_Management
  const [certificateList, setCertificateList] = useState<Certificate[]>([]);
  const [isCertificateLoading, setIsCertificateLoading] =
    useState<boolean>(true);
  const [certificateError, setCertificateError] = useState<ApiError | null>(
    null
  );

  // AI-LOGICAL-REGION: Data_Fetching
  useEffect(() => {
    const fetchCertificateList = async () => {
      try {
        setIsCertificateLoading(true);
        setCertificateError(null);

        const response = await fetchSomething<Certificate[]>(
          "get",
          `${API_BASE_URL}${CERTIFICATES_ENDPOINT}`,
          setIsCertificateLoading,
          setCertificateError
        );

        if (response && response.data) {
          // AI-VALIDATION: RUNTIME_TYPE_CHECKING with caching
          const cacheKey = `certificates_${JSON.stringify(response.data).slice(0, 50)}`;
          const isValid = memoizedValidation(
            response.data,
            (data) => validateApiResponse(data, validateCertificate),
            cacheKey
          );

          if (isValid) {
            setCertificateList(response.data);
            debugLogValidation(
              response.data,
              validateApiResponse,
              "CertificateList"
            );
          } else {
            throw new Error("Invalid certificate data received from API");
          }
        }
      } catch (error) {
        const err = error as Error;
        setCertificateError(handleApiError(err));

        console.error("Error fetching certificates:", error);
      } finally {
        setIsCertificateLoading(false);
      }
    };

    fetchCertificateList();
  }, []);

  // AI-LOGICAL-REGION: Performance_Optimization
  // AI-PERFORMANCE: MEMOIZED_SORTING
  const sortedCertificateList = useMemo(() => {
    return [...certificateList].sort((a, b) => {
      // Sort by date (newest first), then by title
      const dateComparison =
        new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.title.localeCompare(b.title);
    });
  }, [certificateList]);

  // AI-LOGICAL-REGION: Loading_Error_States
  // AI-ERROR-BOUNDARY: UI_STATE_FALLBACKS
  if (isCertificateLoading) {
    return (
      <div className="certificates-page-container">
        <div className="loading-state">
          <h2>Loading Certificates...</h2>
          <p>
            (This can take a few seconds due to free server endpoint. If the API
            times out, try again!)
          </p>
        </div>
      </div>
    );
  }

  if (certificateError) {
    return (
      <div className="certificates-page-container">
        <div className="error-state">
          <h2>Unable to Load Certificates</h2>
          <p>Error: {certificateError.message}</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="certificates-page-container">
      <div className="certificates-header">
        <h1>Professional Certificates</h1>
        <p>My journey in continuous learning and professional development</p>
      </div>

      <div className="certificates-list">
        {sortedCertificateList.map((certificate) => (
          <CertificateCard key={certificate.id} {...certificate} />
        ))}
      </div>

      {sortedCertificateList.length === 0 && (
        <div className="no-certificates">
          <p>No certificates available at the moment.</p>
        </div>
      )}
    </div>
  );
};

// AI-NAVIGATION: EXPORT=Certificates
export default Certificates;

// AI-AGENT END OF FILE
