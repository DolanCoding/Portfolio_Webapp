// AI-AGENT CONTEXT: FILE=ProjectCard | ROLE=Project_Display_Component | PURPOSE=Project_Summary_Card_Display
// AI-DEPENDENCY: ProjectDetails,types.Project,LazyImage
// AI-PERFORMANCE: MEMOIZED_COMPONENT,EXPENSIVE_RENDERS_OPTIMIZED,LAZY_IMAGES
import React, { useRef, useState, memo, useMemo } from "react";
import "./ProjectCard.css";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import LazyImage from "../../../../components/LazyImage/LazyImage";
import { getImageUrl } from "../../../../config";

// AI-LOGICAL-REGION: Card Rendering, Details, Animation

/**
 * @description AI-OPTIMIZED: Memoized project card component for performance
 * @param {ProjectCardComponentProps} props - Project data and event handlers
 * @returns {JSX.Element} Rendered project card with optimized re-rendering
 * @ai-performance This component is memoized to prevent unnecessary re-renders when parent state changes
 * @ai-usage Use for displaying project summaries in lists with stable props
 */
interface ProjectCardComponentProps {
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
}

const ProjectCard: React.FC<ProjectCardComponentProps> = memo((props) => {
  // AI-LOGICAL-REGION: Card Rendering, Details, Animation
  let {
    id,
    title,
    description,
    image,
    image2,
    image3,
    github_link,
    live_link,
    tags,
    starting_date,
    finished_date,
    timespan,
    hours_per_day,
    reason,
    learned_things,
    key_features,
    notes,
  } = props;
  console.log(props);
  const cardRef = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shimmeringTagIndexes, setShimmeringTagIndexes] = useState<number[]>(
    []
  );

  // AI-PERFORMANCE: MEMOIZED_EXPENSIVE_CALCULATION - Cache tag processing
  const processedTags = useMemo(() => {
    return props.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .sort((a, b) => a.length - b.length);
  }, [props.tags]);

  // Fix: cardRef.current and clickedCard null checks, type assertions for HTMLElement
  const handleMouseEnter = (index: number): void => {
    // Add the index to the array only if it's not already there
    setShimmeringTagIndexes((prevIndexes: Array<number>) => {
      if (!prevIndexes.includes(index)) {
        return [...prevIndexes, index];
      }
      return prevIndexes;
    });
  };

  const handleAnimationEnd = (index: number): void => {
    // Remove the index from the array once its animation is complete
    setShimmeringTagIndexes((prevIndexes) =>
      prevIndexes.filter((i) => i !== index)
    );
  };

  const openDetails = (): void => {
    if (!cardRef.current) return;
    const cardsList = cardRef.current.parentNode as HTMLElement | null;
    if (!cardsList) return;
    cardsList.style.overflow = "visible";
    const cards = Array.from(cardsList.children);
    const clickedCard = cardRef.current as HTMLElement | null;
    if (!clickedCard) return;
    const clickedIndex = cards.indexOf(clickedCard);

    // Move cards above up and fade out
    for (let i = 0; i < clickedIndex; i++) {
      const card = cards[i] as HTMLElement;
      const cardPosition = i;
      const percentage = 300 - cardPosition * 100;
      const additional = cardPosition * 2;
      const seconds = i * 0.25 + 0.25;

      card.style.transition = `transform 0.5s, opacity ${seconds}s`;
      card.style.transform = `translateY(calc(-${percentage}% - ${additional}vh - 0.9525rem))`;
      card.style.opacity = "0";
    }

    // Move clicked card to top
    const percentage = clickedIndex * 100;
    const additional = clickedIndex * 2;
    clickedCard.style.transition = "transform 0.5s";
    clickedCard.style.transform = `translateY(calc(-${percentage}% - ${additional}vh))`;

    // Move cards below down and fade out
    for (let i = clickedIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = "transform 0.5s, opacity 0.5s";
      card.style.transform = "translateY(100%)";
      card.style.opacity = "0";
    }

    // After the move animation, expand details and push cards below further down
    setTimeout(() => {
      if (!clickedCard) return;
      const details = clickedCard.querySelector(
        ".project-details-wrapper"
      ) as HTMLElement | null;
      if (!details) return;
      details.style.transition = "height 0.5s";
      details.style.height = "calc(300% + 2 * 0.9525rem)";

      // Move cards below further down as details expand
      for (let i = clickedIndex + 1; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        card.style.transition = "transform 0.5s";
        card.style.transform = "translateY(300%)";
        card.style.opacity = "0";
      }
    }, 500);
  };

  const closeDetails = (): void => {
    if (!cardRef.current) return;
    const cardsList = cardRef.current.parentNode as HTMLElement | null;
    if (!cardsList) return;
    const cards = Array.from(cardsList.children);
    const clickedCard = cardRef.current as HTMLElement | null;
    if (!clickedCard) return;
    const clickedIndex = cards.indexOf(clickedCard);

    const details = clickedCard.querySelector(
      ".project-details-wrapper"
    ) as HTMLElement | null;
    if (!details) return;
    details.style.transition = "height 0.5s";
    details.style.height = "100%";

    // After details collapse, move cards back
    setTimeout(() => {
      // Move cards above back down and fade in
      for (let i = 0; i < clickedIndex; i++) {
        const card = cards[i] as HTMLElement;
        const seconds = (clickedIndex - i) * 0.5;
        card.style.transition = `transform 0.5s, opacity ${seconds}s`;
        card.style.transform = "translateY(0)";
        card.style.opacity = "1";
      }

      // Move clicked card back to its original position
      clickedCard.style.transition = "transform 0.5s";
      clickedCard.style.transform = "translateY(0)";

      // Move cards below back up and fade in
      for (let i = clickedIndex + 1; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const seconds = i * 0.5;
        card.style.transition = `transform 0.5s, opacity ${seconds}s`;
        card.style.transform = "translateY(0)";
        card.style.opacity = "1";
      }

      // Restore overflow after animation
      setTimeout(() => {
        cardsList.style.overflow = "";
      }, 600);
    }, 500); // Wait for details to collapse
    setDetailsOpen(false); // Re-enable Details button
  };

  return (
    <>
      {/* AI-AGENT: Project card, details, animation */}
      <div
        ref={cardRef}
        key={id + " " + title}
        className="project-card position-outside"
        id={id + "-" + title}
      >
        <div className="project-card-overview" id={id}>
          <div className="project-card-text">
            <div className="project-card-title-description">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <div className="project-card-tags-links">
              <div className="project-card-tags">
                {processedTags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className={`project-tag ${
                      shimmeringTagIndexes.includes(index) ? "shimmer" : ""
                    }`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onAnimationEnd={() => handleAnimationEnd(index)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <button
                  onClick={openDetails}
                  className="project-button"
                  disabled={detailsOpen}
                >
                  Details
                </button>
                <a
                  className="project-button"
                  href={github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="project-button"
                  href={live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
          <div className="project-image-container">
            {/* AI-PERFORMANCE: LAZY_IMAGE_LOADING */}
            <LazyImage
              src={getImageUrl(image)}
              alt={`Screenshot of ${title}`}
              className="project-image"
            />
          </div>
        </div>
        {/* Image element */}

        <ProjectDetails
          key={id}
          id={id}
          title={title}
          description={description}
          image={image}
          image2={image2}
          image3={image3}
          github_link={github_link}
          live_link={live_link}
          tags={tags}
          starting_date={starting_date}
          finished_date={finished_date}
          timespan={timespan}
          hours_per_day={hours_per_day}
          reason={reason}
          learned_things={learned_things}
          key_features={key_features}
          notes={notes}
          closeDetails={closeDetails}
        />
      </div>
    </>
  );
});
// AI-NAVIGATION: EXPORT=ProjectCard
export default ProjectCard;
// AI-AGENT END OF FILE
