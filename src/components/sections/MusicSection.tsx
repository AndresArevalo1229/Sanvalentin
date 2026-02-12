import type { CSSProperties, ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MotionIntensity } from "../../domain/animation/motionIntensity";
import type { Track } from "../../data/content";
import { formatTime } from "../../utils/time";
import IconGlyph, { type GlyphName } from "../ui/IconGlyph";

type PlaylistTrack = Track & {
  id: string;
  cover: string;
  accentClass: string;
};

export type MusicSectionProps = {
  currentTrack?: PlaylistTrack;
  playlist: PlaylistTrack[];
  currentIndex: number;
  musicOn: boolean;
  audioLevels?: number[];
  beat?: number;
  motionIntensity: MotionIntensity;
  volume: number;
  safeTime: number;
  safeDuration: number;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  onRemix: () => void;
  onSelectTrack: (index: number) => void;
  onSeek: (event: ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (value: number) => void;
};

const musicMoodTags: Array<{ label: string; icon: GlyphName }> = [
  { label: "Romance", icon: "headphones" },
  { label: "Cat", icon: "cat" },
  { label: "Arte", icon: "palette" },
  { label: "Clasico", icon: "crown" },
  { label: "Dream", icon: "spark" }
];

const nowLineTags: Array<{ label: string; icon: GlyphName }> = [
  { label: "Suave", icon: "moon" },
  { label: "Dibujo", icon: "brush" },
  { label: "Brillo", icon: "spark" }
];

const playerTags: Array<{ label: string; icon: GlyphName }> = [
  { label: "Calm", icon: "moon" },
  { label: "Retro", icon: "frame" },
  { label: "Cats", icon: "paw" }
];

const accentPaletteByClass: Record<string, { a: string; b: string; c: string; overlay: string }> = {
  "accent-rose": {
    a: "rgba(255, 233, 243, 0.78)",
    b: "rgba(255, 214, 230, 0.88)",
    c: "rgba(255, 202, 223, 0.74)",
    overlay: "rgba(255, 182, 212, 0.26)"
  },
  "accent-wine": {
    a: "rgba(255, 222, 233, 0.82)",
    b: "rgba(237, 185, 209, 0.86)",
    c: "rgba(194, 125, 163, 0.72)",
    overlay: "rgba(168, 63, 114, 0.24)"
  },
  "accent-gold": {
    a: "rgba(255, 242, 213, 0.78)",
    b: "rgba(255, 225, 178, 0.84)",
    c: "rgba(247, 203, 140, 0.72)",
    overlay: "rgba(238, 176, 91, 0.24)"
  },
  "accent-berry": {
    a: "rgba(255, 222, 233, 0.8)",
    b: "rgba(251, 189, 214, 0.88)",
    c: "rgba(231, 139, 180, 0.74)",
    overlay: "rgba(219, 87, 143, 0.24)"
  },
  "accent-ink": {
    a: "rgba(233, 224, 236, 0.76)",
    b: "rgba(205, 188, 214, 0.82)",
    c: "rgba(182, 159, 194, 0.72)",
    overlay: "rgba(108, 82, 122, 0.24)"
  },
  "accent-blush": {
    a: "rgba(255, 230, 241, 0.8)",
    b: "rgba(244, 198, 220, 0.86)",
    c: "rgba(228, 167, 198, 0.74)",
    overlay: "rgba(206, 118, 164, 0.24)"
  }
};

const motionByIntensity: Record<MotionIntensity, { distance: number; duration: number; stagger: number }> = {
  soft: { distance: 8, duration: 0.35, stagger: 0.045 },
  normal: { distance: 16, duration: 0.5, stagger: 0.08 },
  intense: { distance: 26, duration: 0.65, stagger: 0.12 }
};

const revealEase = "easeOut" as const;

export default function MusicSection({
  currentTrack,
  playlist,
  currentIndex,
  musicOn,
  audioLevels,
  beat,
  motionIntensity,
  volume,
  safeTime,
  safeDuration,
  onPrev,
  onNext,
  onToggle,
  onRemix,
  onSelectTrack,
  onSeek,
  onVolumeChange
}: MusicSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visualOnly, setVisualOnly] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [needleKick, setNeedleKick] = useState(false);
  const needleKickTimerRef = useRef<number | null>(null);
  const shouldAnimate = !prefersReducedMotion;
  const dynamicPalette = useMemo(() => {
    if (!currentTrack) return accentPaletteByClass["accent-rose"];
    return accentPaletteByClass[currentTrack.accentClass] ?? accentPaletteByClass["accent-rose"];
  }, [currentTrack]);
  const reactiveLevels = useMemo(() => {
    if (!audioLevels || !audioLevels.length) return null;
    return Array.from({ length: 5 }, (_, index) => {
      const sourceLevel = audioLevels[index] ?? audioLevels[audioLevels.length - 1] ?? 0;
      const clamped = Math.min(1, Math.max(0, sourceLevel));
      return prefersReducedMotion ? 0.1 + clamped * 0.28 : clamped;
    });
  }, [audioLevels, prefersReducedMotion]);
  const safeBeat = Math.min(1, Math.max(0, beat ?? 0));
  const beatStrength = prefersReducedMotion ? safeBeat * 0.32 : safeBeat;
  const sectionDynamicStyle = useMemo(
    () =>
      ({
        ["--music-dyn-a" as string]: dynamicPalette.a,
        ["--music-dyn-b" as string]: dynamicPalette.b,
        ["--music-dyn-c" as string]: dynamicPalette.c,
        ["--music-dyn-overlay" as string]: dynamicPalette.overlay,
        ["--music-beat" as string]: String(beatStrength)
      }) as CSSProperties,
    [dynamicPalette, beatStrength]
  );
  const playerCover = currentTrack?.cover ?? playlist[currentIndex]?.cover ?? playlist[0]?.cover ?? "";
  const motionConfig = motionByIntensity[motionIntensity];
  const motionInitial = shouldAnimate ? "hidden" : "show";
  const motionInView = shouldAnimate ? "show" : undefined;
  const queueTracks = useMemo(
    () =>
      playlist
        .map((track, index) => ({ track, index }))
        .filter(({ index }) => index !== currentIndex),
    [playlist, currentIndex]
  );
  const queueMiniTrack = queueTracks[0];
  const playNeedle = { rotate: 26, y: 2 };
  const restNeedle = { rotate: -35, y: -12 };
  const needleAnimation = shouldAnimate
    ? musicOn
      ? needleKick
        ? {
            rotate: [playNeedle.rotate, playNeedle.rotate + 0.9, playNeedle.rotate - 0.6, playNeedle.rotate],
            y: [playNeedle.y, playNeedle.y + 0.35, playNeedle.y - 0.25, playNeedle.y]
          }
        : playNeedle
      : restNeedle
    : musicOn
      ? playNeedle
      : restNeedle;
  const needleTransition = shouldAnimate
    ? musicOn
      ? needleKick
        ? {
            duration: 0.9,
            ease: "easeInOut" as const
          }
        : {
            duration: 0.55,
            ease: revealEase
          }
      : {
          duration: 0.6,
          ease: revealEase
        }
    : {
        duration: 0.01,
        ease: revealEase
      };

  const handleSelectTrack = useCallback(
    (index: number) => {
      onSelectTrack(index);
      if (typeof document === "undefined") return;
      const playerPanel = document.querySelector<HTMLElement>("#music .music-panel");
      if (!playerPanel) return;
      playerPanel.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    },
    [onSelectTrack, prefersReducedMotion]
  );

  useEffect(() => {
    if (needleKickTimerRef.current !== null) {
      window.clearTimeout(needleKickTimerRef.current);
      needleKickTimerRef.current = null;
    }
    if (!musicOn || prefersReducedMotion) {
      setNeedleKick(false);
      return;
    }
    setNeedleKick(true);
    needleKickTimerRef.current = window.setTimeout(() => {
      setNeedleKick(false);
      needleKickTimerRef.current = null;
    }, 920);
    return () => {
      if (needleKickTimerRef.current !== null) {
        window.clearTimeout(needleKickTimerRef.current);
        needleKickTimerRef.current = null;
      }
    };
  }, [musicOn, currentIndex, prefersReducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0, y: motionConfig.distance },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionConfig.duration,
        ease: revealEase,
        staggerChildren: motionConfig.stagger,
        delayChildren: motionConfig.stagger * 0.45
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: Math.max(8, motionConfig.distance * 0.7), scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: motionConfig.duration * 0.92,
        ease: revealEase
      }
    }
  };

  const trackVariants = {
    hidden: { opacity: 0, y: motionConfig.distance, scale: 0.975 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: motionConfig.duration * 0.88,
        delay: Math.min(index * motionConfig.stagger * 0.32, 0.42),
        ease: revealEase
      }
    })
  };

  return (
    <section
      className={`section detail-section music-section ${visualOnly ? "visual-only" : ""}`}
      id="music"
      style={sectionDynamicStyle}
    >
      <span className="music-shimmer" aria-hidden="true" />

      <div className="music-sticky-head">
        <motion.div
          className="section-head"
          variants={itemVariants}
          initial={motionInitial}
          whileInView={motionInView}
          viewport={{ amount: 0.35, once: false }}
        >
          <div className="music-head-tools">
            <span className="music-kicker">Edicion visual de San Valentin</span>
            <button
              type="button"
              className={`music-view-toggle ${visualOnly ? "active" : ""}`}
              onClick={() => setVisualOnly((prev) => !prev)}
              aria-pressed={visualOnly}
            >
              <Sparkles size={14} strokeWidth={1.8} />
              {visualOnly ? "Ver texto" : "Solo visual"}
            </button>
          </div>
          <h2>Nuestra musica</h2>
          <p>Una seccion decorada para escuchar, dibujar y disfrutar juntos.</p>
        </motion.div>

        <motion.div
          className="music-headline-tags"
          aria-hidden="true"
          variants={containerVariants}
          initial={motionInitial}
          whileInView={motionInView}
          viewport={{ amount: 0.25, once: false }}
        >
          {musicMoodTags.map((tag) => (
            <motion.span key={tag.label} variants={itemVariants}>
              <IconGlyph name={tag.icon} />
              {tag.label}
            </motion.span>
          ))}
        </motion.div>

        <div className="music-queue-tools">
          {queueMiniTrack && (
            <span className="music-queue-mini" aria-hidden="true">
              <img src={queueMiniTrack.track.cover} alt="" loading="lazy" decoding="async" />
            </span>
          )}
          <button
            type="button"
            className={`music-queue-btn ${queueOpen ? "active" : ""}`}
            onClick={() => setQueueOpen((prev) => !prev)}
            aria-expanded={queueOpen}
          >
            {queueOpen ? "Ocultar cola" : `Ver cola (${queueTracks.length})`}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {queueOpen && (
            <motion.div
              className="music-queue-strip"
              initial={shouldAnimate ? { opacity: 0, y: -8 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldAnimate ? { opacity: 0, y: -8 } : { opacity: 0 }}
              transition={{ duration: shouldAnimate ? 0.28 : 0.01, ease: revealEase }}
            >
              {queueTracks.map(({ track, index }) => (
                <button
                  key={`queue-${track.id}`}
                  type="button"
                  className="music-queue-item"
                  onClick={() => handleSelectTrack(index)}
                >
                  <img src={track.cover} alt="" loading="lazy" decoding="async" />
                  <span>{track.title}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="music-panel"
        variants={containerVariants}
        initial={motionInitial}
        whileInView={motionInView}
        viewport={{ amount: 0.28, once: false }}
      >
        {currentTrack && (
          <motion.div className={`now-card ${currentTrack.accentClass} ${musicOn ? "is-playing" : ""}`} variants={itemVariants}>
            <div className="now-cover">
              <img src={currentTrack.cover} alt={`Portada de ${currentTrack.title}`} decoding="async" />
              <span className="now-cover-badge" aria-hidden="true">
                <IconGlyph name="heart" />
                <small>A + A</small>
              </span>
            </div>
            <div className="now-details">
              <div className="now-courtline" aria-hidden="true">
                {nowLineTags.map((item) => (
                  <span key={item.label}>
                    <IconGlyph name={item.icon} />
                    {item.label}
                  </span>
                ))}
              </div>
              <span className="now-label">Sonando ahora</span>
              {musicOn && (
                <span className="now-live" aria-hidden="true">
                  <span className="now-live-dot" />
                  <span>En vivo</span>
                  <span className={`now-live-eq ${reactiveLevels ? "reactive" : ""}`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={`now-eq-${index}`}
                        style={
                          reactiveLevels
                            ? {
                                height: `${6 + reactiveLevels[index] * 16}px`,
                                opacity: 0.35 + reactiveLevels[index] * 0.65
                              }
                            : undefined
                        }
                      />
                    ))}
                  </span>
                </span>
              )}
              <h3>{currentTrack.title}</h3>
              <p>{currentTrack.note}</p>
              <div className="now-tags">
                {currentTrack.tags.map((tag) => (
                  <span key={`${currentTrack.id}-tag-${tag}`}>{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div className="player-controls" variants={itemVariants}>
          <div className="player-vinyl-dock" aria-hidden="true">
            <div className="player-vinyl-stage">
              <motion.span
                className="player-vinyl-needle"
                animate={needleAnimation}
                transition={needleTransition}
              />
              <div className="player-vinyl-window">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={currentTrack?.id ?? `player-vinyl-${currentIndex}`}
                    className="player-vinyl-disc-shell"
                    initial={shouldAnimate ? { opacity: 0, x: 26 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldAnimate ? { opacity: 0, x: -26 } : { opacity: 0 }}
                    transition={{
                      duration: shouldAnimate ? motionConfig.duration * 0.96 : 0.15,
                      ease: revealEase
                    }}
                  >
                    <motion.div
                      className={`player-vinyl-disc ${musicOn && shouldAnimate ? "is-playing" : ""}`}
                    >
                      <img src={playerCover} alt="" className="player-vinyl-art" loading="lazy" decoding="async" />
                      <span className="player-vinyl-label">
                        <img src={playerCover} alt="" loading="lazy" decoding="async" />
                      </span>
                      <span className="player-vinyl-center" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="player-actions">
            <button
              className="player-btn secondary"
              onClick={onPrev}
              type="button"
              aria-label="Canción anterior"
            >
              ‹
            </button>
            <button className="player-btn play" onClick={onToggle} type="button" aria-pressed={musicOn}>
              {musicOn ? "❚❚" : "▶"}
            </button>
            <button
              className="player-btn secondary"
              onClick={onNext}
              type="button"
              aria-label="Siguiente canción"
            >
              ›
            </button>
            <button className="player-pill" onClick={onRemix} type="button">
              Mezclar
            </button>
          </div>
          <div className="player-rituals" aria-hidden="true">
            {playerTags.map((ritual) => (
              <span key={ritual.label}>
                <IconGlyph name={ritual.icon} />
                {ritual.label}
              </span>
            ))}
          </div>
          <div className="player-progress">
            <span>{formatTime(safeTime)}</span>
            <input
              type="range"
              min="0"
              max={safeDuration || 0}
              step="1"
              value={Math.min(safeTime, safeDuration || 0)}
              onChange={onSeek}
            />
            <span>{formatTime(safeDuration)}</span>
          </div>
          <div className="player-volume">
            <span>Volumen</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
            />
          </div>
          <div className="player-caption">
            {musicOn ? "Modo artistico activo." : "Toca play o elige una cancion para seguir."}
          </div>
        </motion.div>
      </motion.div>

      <div className="music-grid">
        {playlist.map((track, index) => {
          const isCurrent = index === currentIndex;
          const isPlaying = isCurrent && musicOn;
          const isCurrentPaused = isCurrent && !musicOn;
          return (
            <motion.article
              key={track.id}
                className={`track-card ${track.accentClass} ${isCurrent ? "active" : ""} ${isPlaying ? "playing" : ""} ${isCurrentPaused ? "current-paused" : ""}`}
              variants={trackVariants}
              custom={index}
              initial={motionInitial}
              whileInView={motionInView}
              viewport={{ amount: 0.22, once: false }}
            >
              <div className="track-cover">
                <img src={track.cover} alt={track.title} loading="lazy" decoding="async" />
                {isCurrent && (
                  <div className={`track-live ${isPlaying ? "is-playing" : "is-paused"}`} aria-hidden="true">
                    <span className="track-live-dot" />
                    {isPlaying && <span className="track-live-text">Sonando</span>}
                    <span className={`track-eq ${reactiveLevels ? "reactive" : ""}`}>
                      {Array.from({ length: 5 }, (_, barIndex) => (
                        <i
                          key={`${track.id}-eq-${barIndex}`}
                          style={
                            reactiveLevels
                              ? {
                                  height: `${6 + reactiveLevels[barIndex] * 16}px`,
                                  opacity: 0.35 + reactiveLevels[barIndex] * 0.65
                                }
                              : undefined
                          }
                        />
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <div className="track-meta">
                <h3>{track.title}</h3>
                <p>{track.note}</p>
              </div>
              <div className="track-tags">
                {track.tags.map((tag) => (
                  <span key={`${track.id}-${tag}`}>{tag}</span>
                ))}
              </div>
              <button
                className={`button track-action ${isPlaying ? "is-playing" : ""}`}
                onClick={() => handleSelectTrack(index)}
                type="button"
              >
                <span className="track-action-label track-action-play">Reproducir</span>
                <span className="track-action-label track-action-live">Sonando ♪</span>
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
