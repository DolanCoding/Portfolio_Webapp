// AI-AGENT CONTEXT: FILE=ProjectDetails | ROLE=Project_Details_Component | PURPOSE=Detailed_Project_Information_Display
import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import "./ProjectDetails.css";
import LazyImage from "../../../../components/LazyImage/LazyImage";
import { getImageUrl } from "../../../../config";
import { useScrollBehaviour, GRID_REM } from "./scrollBehaviour";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

// AI-LOGICAL-REGION: Component_Interface
interface ReasonItem {
  [key: string]: string;
}
interface LearnedItem {
  [key: string]: string;
}
interface FeatureItem {
  [key: string]: string;
}
interface NoteItem {
  [key: string]: string;
}

interface ProjectDetailsProps {
  id: string;
  title: string;
  description: string;
  image: string;
  image2?: string;
  image3?: string;
  github_link: string;
  live_link: string;
  tags: string;
  starting_date: string;
  finished_date: string;
  timespan: number;
  hours_per_day: number;
  reason: string;
  learned_things: string;
  key_features: string;
  notes: string;
  closeDetails: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = (props) => {
  const [page, setPage] = useState(0);
  const totalPages = 4;
  const pageNames = ["Reasoning", "Learned", "Key-features", "Notes"];

  // Replace local scroll behaviour implementation with custom hook
  const {
    contentRef,
    trackRef,
    thumbRef,
    thumbHeight,
    thumbTop,
    isScrollable,
    handleThumbMouseDown,
    handleKeyDown,
    scrollContent,
  } = useScrollBehaviour(page);

  // Remove unused variable 'id' from destructured props
  const {
    starting_date,
    finished_date,
    timespan,
    hours_per_day,
    image2,
    image3,
    title,
  } = props;
  const reasonArr: ReasonItem[] = JSON.parse(props.reason);
  const learnedArr: LearnedItem[] = JSON.parse(props.learned_things);
  const featuresArr: FeatureItem[] = JSON.parse(props.key_features);
  const notesArr: NoteItem[] = JSON.parse(props.notes);

  // Normalize pages into a predictable data structure (no switch)
  type SectionItem = Record<string, string>;
  const sections: { title: string; items: SectionItem[] }[] = [
    { title: "Reason for Project", items: reasonArr as SectionItem[] },
    { title: "Learned:", items: learnedArr as SectionItem[] },
    { title: "Key-features", items: featuresArr as SectionItem[] },
    { title: "Notes", items: notesArr as SectionItem[] },
  ];

  // Inline helper: render date with styled hyphen separators
  const renderStyledDate = (date: string): JSX.Element => (
    <>
      {date.split(/(-)/).map((part, i) =>
        part === "-" ? (
          <span key={i} className="date-sep">
            -
          </span>
        ) : (
          <span className={"date" + i} key={i}>
            {part}
          </span>
        )
      )}
    </>
  );

  // Render current section using the data structure
  const renderCurrentPage = (): JSX.Element | null => {
    const section = sections[page];
    if (!section) return null;

    return (
      <div className="details-container">
        <h5 className="details-h5">{section.title}</h5>
        <div className="list-content-wrapper">
          <ul
            className="list-content"
            ref={contentRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {section.items.map((item, index) => (
              <li key={index}>
                <strong>{Object.keys(item)[0]}:</strong>
                <span>{item[Object.keys(item)[0]]}</span>
              </li>
            ))}
          </ul>
          {/** Always render the custom scrollbar; dim/disable when not scrollable */}
          <div
            className={`custom-scrollbar${!isScrollable ? " disabled" : ""}`}
          >
            <button
              className="scrollbar-button up"
              onClick={() => scrollContent(-GRID_REM)}
              disabled={!isScrollable}
              aria-disabled={!isScrollable}
            ></button>
            <div className="scrollbar-track" ref={trackRef}>
              <div
                ref={thumbRef}
                className={`scrollbar-thumb${!isScrollable ? " disabled" : ""}`}
                style={{ height: `${thumbHeight}%`, top: `${thumbTop}px` }}
                onMouseDown={isScrollable ? handleThumbMouseDown : undefined}
                aria-disabled={!isScrollable}
              >
                <div className="pen-thumb-visual">
                  <div className="pen-eraser"></div>
                  <div className="pen-ferrule"></div>
                  <div className="pen-body"></div>
                  <div className="pen-tip"></div>
                </div>
              </div>
            </div>
            <button
              className="scrollbar-button down"
              onClick={() => scrollContent(GRID_REM)}
              disabled={!isScrollable}
              aria-disabled={!isScrollable}
            ></button>
          </div>
        </div>
      </div>
    );
  };

  // Added back page change handler that uses setPage
  const handlePageChange = (newPage: number) => setPage(newPage);

  // Close on Escape key for discoverability with [ESC] hint
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.closeDetails();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  // Compute navigation labels: show target page name when enabled, current page when disabled
  const prevLabel = page === 0 ? pageNames[page] : pageNames[page - 1];
  const nextLabel =
    page === totalPages - 1 ? pageNames[page] : pageNames[page + 1];

  return (
    <div id={`${props.id}`} className="project-details-wrapper">
      {/* AI-AGENT: Project metadata, navigation, details */}
      <div className="project-details-container">
        <div className="details-container2">
          <h5 className="details-h5">Zeit Investment</h5>
          <div className="details-container2-content">
            <div className="time-investment-content">
              <p>
                <span>Started:</span>
                <span className="date-span">
                  {renderStyledDate(starting_date)}
                </span>
              </p>
              <p>
                <span>Ended:</span>
                <span className="date-span">
                  {renderStyledDate(finished_date)}
                </span>
              </p>
              <p>
                <span>Days:</span>
                <span>{timespan}</span>
              </p>
              <p>
                <span>Hours per day:</span>
                <span>{hours_per_day}</span>
              </p>
              <p>
                <span>Hours invested:</span>
                <span>{hours_per_day * timespan}</span>
              </p>
            </div>
            <div className="image-div">
              <LazyImage src={getImageUrl(image2 ?? "")} alt={title} />
              <LazyImage src={getImageUrl(image3 ?? "")} alt={title} />
            </div>
          </div>
        </div>
        {renderCurrentPage()}
        {/* AI-LOGICAL-REGION: Navigation */}
        <div className="details-bottom-container">
          <div className="details-navigation">
            <button
              className="nav-zone prev"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              aria-label={prevLabel}
            >
              <FontAwesomeIcon
                className="chevron"
                icon={faChevronLeft}
                aria-hidden="true"
              />
              <span className="label">{prevLabel}</span>
            </button>

            <button
              className="nav-zone next"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
              aria-label={nextLabel}
            >
              <span className="label">{nextLabel}</span>
              <FontAwesomeIcon
                className="chevron"
                icon={faChevronRight}
                aria-hidden="true"
              />
            </button>
          </div>
          <button className="close-strip" onClick={props.closeDetails}>
            <FontAwesomeIcon
              className="xmark"
              icon={faXmark}
              aria-hidden="true"
            />
            <span className="label">Close details</span>
            <span className="keycap" aria-hidden="true">
              ESC
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// AI-NAVIGATION: EXPORT=ProjectDetails
export default ProjectDetails;
// AI-AGENT END OF FILE
