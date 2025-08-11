// AI-AGENT CONTEXT: FILE=Certificates | ROLE=Certificate_Display_Component | PURPOSE=Professional_Certifications_Gallery
// AI-DEPENDENCY: CertificateCard,apiClient,sharedTypes,types,config
// AI-ERROR-BOUNDARY: API_FAILURE,LOADING_STATE
// AI-PERFORMANCE: OPTIMIZED_RENDERING,MEMOIZATION
import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./Certificates.css";
import { fetchSomething } from "../../api/apiClient";
import CertificateCard from "./CertificateCard/CertificateCard";
import { API_BASE_URL, CERTIFICATES_ENDPOINT } from "../../config";
import type { Certificate } from "../../../../shared-types";
import { ApiError, handleApiError } from "../../types";

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
  const [isCertificateLoading, setIsCertificateLoading] = useState<boolean>(true);
  const [certificateError, setCertificateError] = useState<ApiError | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
          // Directly set the data without additional runtime validation
          setCertificateList(response.data);
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
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.title.localeCompare(b.title);
    });
  }, [certificateList]);

  // Keep index in range if data changes
  useEffect(() => {
    if (sortedCertificateList.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex > sortedCertificateList.length - 1) {
      setCurrentIndex(sortedCertificateList.length - 1);
    }
  }, [sortedCertificateList, currentIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < sortedCertificateList.length - 1 ? prev + 1 : prev));
  }, [sortedCertificateList.length]);

  // Optional: keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // AI-LOGICAL-REGION: Loading_Error_States
  // AI-ERROR-BOUNDARY: UI_STATE_FALLBACKS
  if (isCertificateLoading) {
    return (
      <div className="certificates-page-container">
        <div className="loading-state">
          <h2>Loading Certificates...</h2>
          <p>
            (This can take a few seconds due to free server endpoint. If the API times out, try
            again!)
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
          <button onClick={() => window.location.reload()}>Retry Loading</button>
        </div>
      </div>
    );
  }

  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="certificates-page">
      <header className="certificates-header">
        <h1 className="certificates-title">Professional Certificates</h1>
        <p className="certificates-subtitle">One achievement at a time — focused view</p>
      </header>

      <section className="certificates-stage">
        <div className="stage-inner">
          {sortedCertificateList[currentIndex] && (
            <CertificateCard {...sortedCertificateList[currentIndex]} />
          )}
        </div>
      </section>

      <nav className="certificates-nav">
        <button
          type="button"
          className="btn-primary"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          ◀ Previous
        </button>
        <span className="certificates-counter">
          {sortedCertificateList.length > 0
            ? `${currentIndex + 1} / ${sortedCertificateList.length}`
            : "0 / 0"}
        </span>
        <button
          type="button"
          className="btn-primary"
          onClick={goNext}
          disabled={currentIndex >= sortedCertificateList.length - 1}
        >
          Next ▶
        </button>
      </nav>
    </div>
  );
};

// AI-NAVIGATION: EXPORT=Certificates
export default Certificates;

// AI-AGENT END OF FILE
