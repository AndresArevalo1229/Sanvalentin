import type { GalleryPhoto, SectionMenuItem, TimelineItem } from "../../data/content";
import type { MotionIntensity } from "../../domain/animation/motionIntensity";
import GallerySection from "./GallerySection";
import LetterSection from "./LetterSection";
import MusicSection, { type MusicSectionProps } from "./MusicSection";
import TimelineSection from "./TimelineSection";
import Puzzle from "../puzzle/Puzzle";

type SectionContentProps = {
  sectionId: SectionMenuItem["id"] | null;
  timeline: TimelineItem[];
  timelineAudioLevels?: number[];
  timelineBeat?: number;
  timelineMusicOn?: boolean;
  timelineMotionIntensity?: MotionIntensity;
  gallery: GalleryPhoto[];
  puzzleImages: string[];
  secretMessage: string;
  onOpenLetter: () => void;
  musicProps: MusicSectionProps;
};

export default function SectionContent({
  sectionId,
  timeline,
  timelineAudioLevels,
  timelineBeat,
  timelineMusicOn,
  timelineMotionIntensity,
  gallery,
  puzzleImages,
  secretMessage,
  onOpenLetter,
  musicProps
}: SectionContentProps) {
  if (!sectionId) return null;

  switch (sectionId) {
    case "letter":
      return <LetterSection onOpen={onOpenLetter} />;
    case "timeline":
      return (
        <TimelineSection
          timeline={timeline}
          audioLevels={timelineAudioLevels}
          beat={timelineBeat}
          musicOn={timelineMusicOn}
          motionIntensity={timelineMotionIntensity}
        />
      );
    case "music":
      return <MusicSection {...musicProps} />;
    case "gallery":
      return <GallerySection gallery={gallery} />;
    case "puzzle":
      return (
        <Puzzle
          className="section detail-section"
          images={puzzleImages}
          secretMessage={secretMessage}
        />
      );
    default:
      return null;
  }
}
