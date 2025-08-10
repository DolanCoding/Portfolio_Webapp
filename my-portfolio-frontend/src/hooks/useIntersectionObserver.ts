// AI-AGENT CONTEXT: FILE=useIntersectionObserver | ROLE=custom_hook | PURPOSE=observe_element_visibility
// AI-DEPENDENCY: React
import { useEffect, RefObject } from "react";

// AI-LOGICAL-REGION: Hook_Interface
interface IntersectionObserverParams<T extends HTMLElement = HTMLElement> {
  /**
   * Ref to the container whose descendants should be observed.
   */
  containerRef: RefObject<T | null>;
  /**
   * Callback executed when observed elements intersect with the container.
   */
  onIntersect: (entries: IntersectionObserverEntry[]) => void;
  /**
   * Dependencies that re-initialize the observer when changed.
   */
  deps?: unknown[];
}

// AI-LOGICAL-REGION: Hook_Implementation
/**
 * Sets up an IntersectionObserver on all descendants of the provided container.
 * Designed for project card animations but usable for any intersection-driven effects.
 *
 * @param {RefObject<HTMLElement>} containerRef - Scroll container reference.
 * @param {(entries: IntersectionObserverEntry[]) => void} onIntersect - Intersection callback.
 * @param {unknown[]} [deps] - Optional dependencies for effect re-initialization.
 *
 * @example
 * useIntersectionObserver(projectScrollContainerRef, entries => {
 *   entries.forEach(entry => {
 *     entry.target.classList.toggle('is-visible-for-animation', entry.isIntersecting);
 *   });
 * }, [projectList]);
 *
 * @ai-usage Provides reusable observer logic for consistent animation triggering.
 */
const useIntersectionObserver = <T extends HTMLElement = HTMLElement>({
  containerRef,
  onIntersect,
  deps = [],
}: IntersectionObserverParams<T>): void => {
  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      console.warn("IntersectionObserver container ref is null");
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(onIntersect, {
        root: containerElement,
        rootMargin: "0px",
        threshold: 0.1,
      });
      const targets = containerElement.querySelectorAll<HTMLElement>(".project-card");
      targets.forEach((el) => observer!.observe(el));
    } catch (error) {
      console.error("Failed to setup intersection observer:", error);
    }
    return () => {
      observer?.disconnect();
    };
  }, [containerRef, onIntersect, ...deps]);
};

// AI-NAVIGATION: EXPORT=useIntersectionObserver
export default useIntersectionObserver;
// AI-AGENT END OF FILE
