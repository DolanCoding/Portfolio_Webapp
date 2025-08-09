// AI-AGENT CONTEXT: FILE=LazyImage | ROLE=Performance_Component | PURPOSE=Lazy_Image_Loading_Optimization
// AI-DEPENDENCY: React.memo,useRef,useState,useEffect,IntersectionObserver
// AI-PERFORMANCE: INTERSECTION_OBSERVER,LAZY_LOADING,MEMOIZED_COMPONENT

import React, { useState, useRef, useEffect, memo } from "react";
import "./LazyImage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleXmark } from "@fortawesome/free-solid-svg-icons";

// AI-LOGICAL-REGION: Component_Interface
/**
 * @description AI-OPTIMIZED: Lazy loading image component with Intersection Observer
 * @param {LazyImageProps} props - Image source, alt text, and styling
 * @returns {JSX.Element} Image that loads only when visible in viewport
 * @ai-performance Uses Intersection Observer to defer image loading until needed
 * @ai-usage Replace standard img tags in ProjectCard and CertificateCard for performance
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = memo(
  ({
    src,
    alt,
    className = "",
    placeholder = "data:image/svg+xml;utf8,<svg width='300' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%23022c57'/></svg>",
    onLoad,
    onError,
  }) => {
    // AI-LOGICAL-REGION: Lazy_Loading_State
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isInView, setIsInView] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // AI-LOGICAL-REGION: Intersection_Observer_Setup
    useEffect(() => {
      // AI-PERFORMANCE: INTERSECTION_OBSERVER - Only load images when they enter viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px", // Start loading 50px before image enters viewport
          threshold: 0.1,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, []);

    // AI-LOGICAL-REGION: Image_Loading_Handlers
    const handleLoad = (): void => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = (): void => {
      setHasError(true);
      onError?.();
    };

    // AI-LOGICAL-REGION: Render_Logic
    return (
      <div className="lazy-image-wrapper">
        {!hasError && (
          <img
            ref={imgRef}
            src={isInView ? src : placeholder}
            className={`lazy-image ${className} ${isLoaded ? "loaded" : ""} ${
              hasError ? "error" : ""
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}
        {hasError && alt && (
          <div className="lazy-image-alt">
            <FontAwesomeIcon
              icon={faFileCircleXmark}
              className="lazy-image-fail-symbol"
              size="2x"
            />
            <span>{alt}</span>
          </div>
        )}
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";

// AI-NAVIGATION: EXPORT=LazyImage
export default LazyImage;
