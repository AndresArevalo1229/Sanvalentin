import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadHeartShape } from "@tsparticles/shape-heart";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { SectionMenuItem } from "../data/content";
import IconGlyph, { type GlyphName } from "./ui/IconGlyph";

type SectionCarouselProps = {
  sectionMenu: SectionMenuItem[];
  sectionIndex: number;
  activeSection: SectionMenuItem["id"];
  activeIndex: number;
  carouselAnimating: boolean;
  carouselMotion: "next" | "prev" | null;
  onShift: (direction: number) => void;
  onOpenSection: (id: SectionMenuItem["id"]) => void;
};

const sectionCardVibes: Record<
  SectionMenuItem["id"],
  { themeLabel: string; stickers: GlyphName[]; previewIcons: GlyphName[] }
> = {
  letter: {
    themeLabel: "Carta kawaii",
    stickers: ["cat", "letter", "spark"],
    previewIcons: ["ribbon", "flower", "paw"]
  },
  timeline: {
    themeLabel: "Museo de recuerdos",
    stickers: ["clock", "palette", "brush"],
    previewIcons: ["frame", "ribbon", "spark"]
  },
  music: {
    themeLabel: "Modo estudio",
    stickers: ["headphones", "note", "cat"],
    previewIcons: ["note", "spark", "ribbon"]
  },
  gallery: {
    themeLabel: "Color y bocetos",
    stickers: ["palette", "brush", "chibi"],
    previewIcons: ["flower", "spark", "camera"]
  },
  puzzle: {
    themeLabel: "Reto tierno",
    stickers: ["puzzle", "paw", "spark"],
    previewIcons: ["lens", "ribbon", "frame"]
  }
};

export default function SectionCarousel({
  sectionMenu,
  sectionIndex,
  activeSection,
  activeIndex,
  carouselAnimating,
  carouselMotion,
  onShift,
  onOpenSection
}: SectionCarouselProps) {
  const [particlesReady, setParticlesReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setParticlesReady(false);
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 980px)").matches) {
      setParticlesReady(false);
      return;
    }

    let mounted = true;

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadHeartShape(engine);
    }).then(() => {
      if (mounted) {
        setParticlesReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [prefersReducedMotion]);

  const particlesOptions = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      detectRetina: false,
      fpsLimit: 30,
      background: { color: "transparent" },
      particles: {
        number: { value: 18, density: { enable: true, width: 900, height: 300 } },
        color: { value: ["#ea8db0", "#f5b6ce", "#d9477e", "#f7cfdd"] },
        shape: { type: ["heart", "circle"] },
        opacity: {
          value: { min: 0.2, max: 0.52 },
          animation: { enable: true, speed: 0.24, sync: false }
        },
        size: {
          value: { min: 3, max: 10 },
          animation: { enable: true, speed: 0.55, sync: false }
        },
        move: {
          enable: true,
          speed: { min: 0.08, max: 0.24 },
          direction: "none",
          random: true,
          outModes: { default: "out" }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: { enable: true }
        },
        modes: {
          repulse: { distance: 70, duration: 0.6 }
        }
      }
    }),
    []
  );

  return (
    <div className="section-carousel" id="secciones" aria-label="Secciones principales">
      {particlesReady && (
        <Particles
          id="section-carousel-hearts"
          className="section-carousel-particles"
          options={particlesOptions}
          aria-hidden="true"
        />
      )}
      <div className="section-carousel-head">
        <div className="section-carousel-head-text">
          <span className="section-carousel-stamp">Edicion San Valentin</span>
          <h2 className="section-carousel-title">Explora por secciones</h2>
          <p>Desliza a la derecha para ver cada parte de nuestra historia.</p>
          <div className="section-carousel-divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-mark" />
            <span className="divider-line" />
          </div>
        </div>
        <div className="section-carousel-actions">
          <button
            className="carousel-arrow"
            type="button"
            onClick={() => onShift(-1)}
            aria-label="Sección anterior"
            disabled={carouselAnimating}
          >
            ‹
          </button>
          <button
            className="carousel-arrow"
            type="button"
            onClick={() => onShift(1)}
            aria-label="Siguiente sección"
            disabled={carouselAnimating}
          >
            ›
          </button>
        </div>
      </div>

      <div className={`section-card-track ${carouselMotion ? "is-shifting" : ""}`} data-motion={carouselMotion ?? ""}>
        <div
          className={`section-card-row ${carouselMotion ? "is-shifting" : ""}`}
          data-motion={carouselMotion ?? ""}
          style={{ transform: `translateX(-${sectionIndex * 100}%)` }}
        >
          {sectionMenu.map((item) => {
            const isLetterCard = item.id === "letter";
            const vibe = sectionCardVibes[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={`section-card section-card-${item.id} ${activeSection === item.id ? "active" : ""}`}
                data-section={item.id}
                style={{ "--card-accent": item.accent } as CSSProperties}
                onClick={() => onOpenSection(item.id)}
                aria-label={`Abrir ${item.label}`}
                aria-current={activeSection === item.id ? "true" : undefined}
              >
                {isLetterCard && (
                  <>
                    <span className="section-card-wax-ribbon" aria-hidden="true" />
                    <span className="section-card-wax-seal" aria-hidden="true">
                      A + A
                    </span>
                  </>
                )}
                <div className="section-card-main">
                  <div className="section-card-icon" aria-hidden="true">
                    <IconGlyph name={item.icon} className="section-card-icon-glyph" />
                  </div>
                  <div className="section-card-text">
                    <span className="section-card-eyebrow">{item.hint}</span>
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                    <span className="section-card-theme">{vibe.themeLabel}</span>
                    <div className="section-card-stickers" aria-hidden="true">
                      {vibe.stickers.map((sticker, index) => (
                        <span
                          key={`${item.id}-sticker-${sticker}`}
                          style={{ "--sticker-delay": `${index * 0.2}s` } as CSSProperties}
                        >
                          <IconGlyph name={sticker} />
                        </span>
                      ))}
                    </div>
                    {isLetterCard && <span className="section-card-love-tag">Especial San Valentin</span>}
                    <div className="section-card-cta">
                      <span>Abrir sección</span>
                      <span aria-hidden="true">›</span>
                    </div>
                  </div>
                </div>
                <div className={`section-card-preview ${isLetterCard ? "is-letter" : ""}`}>
                  <img
                    src={item.preview}
                    alt={`Vista previa de ${item.label}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {isLetterCard && (
                    <>
                      <span className="section-card-preview-orb h1" aria-hidden="true" />
                      <span className="section-card-preview-orb h2" aria-hidden="true" />
                      <span className="section-card-preview-orb h3" aria-hidden="true" />
                      <span className="section-card-preview-ribbon" aria-hidden="true" />
                      <span className="section-card-preview-note">Carta de amor</span>
                    </>
                  )}
                  {!isLetterCard && (
                    <div className={`section-card-preview-icons section-card-preview-icons-${item.id}`} aria-hidden="true">
                      {vibe.previewIcons.map((icon, index) => (
                        <span
                          key={`${item.id}-preview-icon-${icon}`}
                          style={{ "--sticker-delay": `${index * 0.22}s` } as CSSProperties}
                        >
                          <IconGlyph name={icon} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section-indicator" aria-live="polite">
        <span>{activeIndex + 1}</span>
        <span>/</span>
        <span>{sectionMenu.length}</span>
      </div>
    </div>
  );
}
