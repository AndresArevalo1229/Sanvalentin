import type { CSSProperties } from "react";
import type { HeartSpec, IntroReelItem, StarSpec } from "../data/content";

type IntroProps = {
  hidden: boolean;
  ready: boolean;
  open: boolean;
  onOpen: () => void;
  coverPhoto: string;
  introReel: IntroReelItem[];
  heartSpecs: HeartSpec[];
  starSpecs: StarSpec[];
  herNick: string;
};

export default function Intro({
  hidden,
  ready,
  open,
  onOpen,
  coverPhoto,
  introReel,
  heartSpecs,
  starSpecs,
  herNick
}: IntroProps) {
  if (hidden) return null;

  return (
    <div className={`intro ${ready ? "ready" : ""} ${open ? "open" : ""}`}>
      <div
        className="intro-photo"
        style={{ "--cover-url": `url(${coverPhoto})` } as CSSProperties}
      >
        <div className="intro-hearts" aria-hidden="true">
          {heartSpecs.map((heart, index) => (
            <span
              key={`heart-${index}`}
              className="heart"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                "--size": `${heart.size}px`,
                "--delay": `${heart.delay}s`
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="intro-stars" aria-hidden="true">
          {starSpecs.map((star, index) => (
            <span
              key={`star-${index}`}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                "--size": `${star.size}px`,
                "--delay": `${star.delay}s`
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="shooting-stars" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <span
              key={`shooting-${index}`}
              className="shooting-star"
              style={{
                "--shoot-delay": `${0.8 + index * 1.1}s`,
                "--shoot-top": `${8 + (index * 8) % 60}%`,
                "--shoot-left": `${6 + (index % 4) * 22}%`
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="intro-reel">
          {introReel.map((item, index) => (
            <div
              key={item.src}
              className="reel-slide"
              style={{
                "--delay": `${0.9 + index * 3}s`,
                "--slide-url": `url(${item.src})`
              } as CSSProperties}
            >
              <img src={item.src} alt={item.title} />
              <div className="reel-caption">
                <span className="reel-title">{item.title}</span>
                <span className="reel-date">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="intro-vignette" />
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
      <div className="intro-card">
        <span className="eyebrow">Para mi {herNick}</span>
        <h1>Un regalo hecho con amor</h1>
        <p>Abre la cortina para descubrir nuestra historia.</p>
        <button className="button intro-button" onClick={onOpen}>
          <svg className="flower" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <circle className="petal p1" cx="32" cy="10" r="10" />
            <circle className="petal p2" cx="50" cy="18" r="10" />
            <circle className="petal p3" cx="54" cy="36" r="10" />
            <circle className="petal p4" cx="32" cy="54" r="10" />
            <circle className="petal p5" cx="10" cy="36" r="10" />
            <circle className="petal p6" cx="14" cy="18" r="10" />
            <circle className="flower-center" cx="32" cy="32" r="8" />
          </svg>
          Abrir la historia
        </button>
      </div>
    </div>
  );
}
