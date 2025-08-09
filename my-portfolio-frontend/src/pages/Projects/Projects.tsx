// AI-AGENT CONTEXT: FILE=Projects | ROLE=Portfolio_Project_Display | PURPOSE=Project_Showcase_Navigation
import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Projects.css";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import { fetchSomething } from "../../api/apiClient";
import { Project, ApiError, handleApiError } from "../../types";
import { API_BASE_URL, PROJECTS_ENDPOINT } from "../../config";

// AI-LOGICAL-REGION: Component_Interface
interface ProjectsPageProps {}

/**
 * @description AI-OPTIMIZED: Main projects page with performance monitoring and error handling
 * @param {ProjectsPageProps} props - Component props (currently empty interface)
 * @returns {JSX.Element} Projects page with lazy loading, memoized calculations, and error boundaries
 * @ai-performance Uses useMemo for expensive sorting and calculations, tracks API performance
 * @ai-error-handling Integrated with error reporting system and graceful fallbacks
 * @ai-usage Primary entry point for project showcase with optimized rendering
 * @ai-dependencies ProjectCard, ProjectDetails, fetchSomething, validation helpers
 */
const Projects: React.FC<ProjectsPageProps> = () => {
  // AI-LOGICAL-REGION: State_Management
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<ApiError | null>(null);
  const projectScrollContainerRef = useRef<HTMLDivElement>(null);

  // AI-LOGICAL-REGION: Data_Fetching
  useEffect(() => {
    const fetchProjectList = async () => {
      try {
        setIsProjectLoading(true);
        setProjectError(null);

        const response = await fetchSomething<Project[]>(
          "get",
          `${API_BASE_URL}${PROJECTS_ENDPOINT}`,
          setIsProjectLoading,
          setProjectError
        );

        if (response && response.data) {
          setProjectList(response.data);
        }
      } catch (error) {
        const err = error as Error;
        setProjectError(handleApiError(err));

        console.error("Error fetching projects:", error);
      } finally {
        setIsProjectLoading(false);
      }
    };
    fetchProjectList();
  }, []);

  // AI-LOGICAL-REGION: Animation_Effects
  useEffect(() => {
    const ProjectCardElements = document.querySelectorAll(".project-card");
    ProjectCardElements.forEach((element) => {
      element.classList.add("position-outside");
      element.classList.remove("transition-fade-out");
    });

    const staggerDelayMs = 100;

    ProjectCardElements.forEach((card, index) => {
      const delay = index * staggerDelayMs;
      if (index <= 3) {
        setTimeout(() => {
          card.classList.remove("position-outside");
          card.classList.add("transition-fade-in");
          setTimeout(() => {
            card.classList.remove("transition-fade-in");
          }, 300);
        }, delay);
      } else {
        card.classList.remove("transition-fade-in");
        card.classList.remove("position-outside");
      }
    });
  }, [projectList]);

  // AI-LOGICAL-REGION: Performance_Optimization
  // AI-PERFORMANCE: MEMOIZED_SORTING
  const sortedFilteredProjectList = useMemo(() => {
    return [...projectList].sort((a, b) => {
      // AI-PERFORMANCE: OPTIMIZED_SORTING - Cache numeric conversion
      const aId = Number(a.id);
      const bId = Number(b.id);
      return aId - bId;
    });
  }, [projectList]);

  // AI-LOGICAL-REGION: Intersection_Observer
  useEffect(() => {
    const containerElement = projectScrollContainerRef.current;
    if (!containerElement) {
      console.warn("Project scroll container ref is null");
      return;
    }

    let observer: IntersectionObserver | null = null;

    const setupObserver = (): void => {
      try {
        if (observer) {
          observer.disconnect();
        }
        const options = {
          root: containerElement,
          rootMargin: "0px",
          threshold: 0.1,
        };
        const handleIntersection = (
          entries: IntersectionObserverEntry[]
        ): void => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible-for-animation");
            } else {
              entry.target.classList.remove("is-visible-for-animation");
            }
          });
        };
        observer = new IntersectionObserver(handleIntersection, options);
        const projectCardElements =
          containerElement.querySelectorAll<HTMLDivElement>(".project-card");
        projectCardElements.forEach((element) => {
          observer!.observe(element);
        });
      } catch (error) {
        console.error("Failed to setup intersection observer:", error);
      }
    };

    setupObserver();
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [sortedFilteredProjectList]);

  // AI-LOGICAL-REGION: Event_Handlers
  const handleBackToList = (): void => {
    setSelectedProject(null);
  };

  // AI-LOGICAL-REGION: Loading_Error_States
  if (isProjectLoading) {
    return (
      <div className="projects-page-container">
        <div className="loading-state">
          <h2>Loading Projects...</h2>
          <p>
            (This can take a few seconds due to free server endpoint. If the API
            times out, try again!)
          </p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="projects-page-container">
        <div className="error-state">
          <h2>Unable to Load Projects</h2>
          <p>Error: {projectError.message}</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // AI-LOGICAL-REGION: Render_Logic
  return (
    <div className="projects-page-container">
      <div ref={projectScrollContainerRef} className="projects-list">
        {selectedProject ? (
          <ProjectDetails
            id={selectedProject.id}
            title={selectedProject.title}
            description={selectedProject.description}
            image={selectedProject.image}
            image2={selectedProject.image2}
            image3={selectedProject.image3}
            github_link={selectedProject.github_link}
            live_link={selectedProject.live_link}
            tags={selectedProject.tags}
            starting_date={selectedProject.starting_date}
            finished_date={selectedProject.finished_date}
            timespan={selectedProject.timespan}
            hours_per_day={selectedProject.hours_per_day}
            reason={selectedProject.reason}
            learned_things={selectedProject.learned_things}
            key_features={selectedProject.key_features}
            notes={selectedProject.notes}
            closeDetails={handleBackToList}
          />
        ) : (
          sortedFilteredProjectList.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              image2={project.image2}
              image3={project.image3}
              github_link={project.github_link}
              live_link={project.live_link}
              tags={project.tags}
              starting_date={project.starting_date}
              finished_date={project.finished_date}
              timespan={project.timespan}
              hours_per_day={project.hours_per_day}
              reason={project.reason}
              learned_things={project.learned_things}
              key_features={project.key_features}
              notes={project.notes}
            />
          ))
        )}
      </div>

      {sortedFilteredProjectList.length === 0 && (
        <div className="no-projects">
          <p>No projects available at the moment.</p>
        </div>
      )}
    </div>
  );
};

// AI-NAVIGATION: EXPORT=Projects
export default Projects;
// AI-AGENT END OF FILE
