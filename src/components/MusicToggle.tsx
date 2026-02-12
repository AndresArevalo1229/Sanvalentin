import type { Track } from "../data/content";

type MusicToggleProps = {
  musicOn: boolean;
  currentTrack?: Track;
  onToggle: () => void;
};

export default function MusicToggle({ musicOn, currentTrack, onToggle }: MusicToggleProps) {
  return (
    <button
      className="music-toggle"
      onClick={onToggle}
      type="button"
      aria-pressed={musicOn}
      title={currentTrack ? `Sonando: ${currentTrack.title}` : "Control de música"}
    >
      <span className={`music-indicator ${musicOn ? "on" : ""}`} aria-hidden="true" />
      {musicOn ? "Pausar música" : "Reproducir música"}
    </button>
  );
}
