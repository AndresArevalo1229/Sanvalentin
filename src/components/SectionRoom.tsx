import type { ReactNode } from "react";
import type { SectionMenuItem } from "../data/content";
import FallingHeartsCanvas from "./effects/FallingHeartsCanvas";
import SakuraPetalsLayer from "./effects/SakuraPetalsLayer";

type SectionRoomProps = {
  open: SectionMenuItem["id"] | null;
  activeMeta: SectionMenuItem;
  roomAnimating: boolean;
  roomMotion: "next" | "prev" | null;
  onShift: (direction: number) => void;
  onClose: () => void;
  children: ReactNode;
};

export default function SectionRoom({
  open,
  activeMeta,
  roomAnimating,
  roomMotion,
  onShift,
  onClose,
  children
}: SectionRoomProps) {
  const isOpen = Boolean(open);

  return (
    <section
      className={`section-room ${isOpen ? "is-open" : ""}`}
      data-section={activeMeta.id}
      aria-hidden={!isOpen}
      aria-live="polite"
      role="dialog"
      aria-modal="true"
    >
      {isOpen && activeMeta.id === "music" && (
        <>
          <FallingHeartsCanvas
            className="section-room-music-fx"
            density={64}
            active={isOpen}
            fit="viewport"
          />
          <SakuraPetalsLayer
            className="section-room-music-sakura"
            density={28}
            active={isOpen}
          />
          <span className="section-room-music-branches" aria-hidden="true">
            <span className="section-room-music-branch branch-left">
              <svg viewBox="0 0 560 200" role="presentation" focusable="false">
                <path className="music-branch-main" d="M10 20 C126 28 246 34 356 72 C430 96 500 130 552 178" />
                <path className="music-branch-twig" d="M154 38 C182 60 196 84 204 118" />
                <path className="music-branch-twig" d="M254 46 C286 68 306 90 318 126" />
                <path className="music-branch-twig" d="M332 64 C358 84 382 108 396 136" />
                <circle className="music-branch-bloom-a" cx="96" cy="34" r="9" />
                <circle className="music-branch-bloom-b" cx="116" cy="42" r="8" />
                <circle className="music-branch-bloom-a" cx="170" cy="54" r="9" />
                <circle className="music-branch-bloom-b" cx="194" cy="66" r="8" />
                <circle className="music-branch-bloom-a" cx="256" cy="66" r="9" />
                <circle className="music-branch-bloom-b" cx="280" cy="80" r="8" />
                <circle className="music-branch-bloom-a" cx="340" cy="92" r="9" />
                <circle className="music-branch-bloom-b" cx="364" cy="108" r="8" />
                <path className="music-branch-heart" d="M138 28c5-8 16-3 16 6 0 9-16 17-16 17s-16-8-16-17c0-9 11-14 16-6Z" />
                <path className="music-branch-heart" d="M294 56c4-6 13-2 13 5 0 8-13 15-13 15s-13-7-13-15c0-7 9-11 13-5Z" />
                <circle className="music-branch-drop delay-a" cx="206" cy="128" r="5.4" />
                <circle className="music-branch-drop delay-c" cx="326" cy="146" r="4.8" />
              </svg>
            </span>
            <span className="section-room-music-branch branch-mid">
              <svg viewBox="0 0 390 210" role="presentation" focusable="false">
                <path className="music-branch-main" d="M18 12 C118 30 176 62 228 112 C262 142 306 170 370 196" />
                <path className="music-branch-twig" d="M98 34 C112 58 118 84 116 118" />
                <path className="music-branch-twig" d="M156 66 C172 88 184 112 186 144" />
                <path className="music-branch-twig" d="M216 106 C228 126 242 148 250 176" />
                <circle className="music-branch-bloom-a" cx="58" cy="26" r="8" />
                <circle className="music-branch-bloom-b" cx="78" cy="34" r="7" />
                <circle className="music-branch-bloom-a" cx="120" cy="54" r="8" />
                <circle className="music-branch-bloom-b" cx="142" cy="70" r="7" />
                <circle className="music-branch-bloom-a" cx="192" cy="100" r="8" />
                <circle className="music-branch-bloom-b" cx="214" cy="118" r="7" />
                <path className="music-branch-heart" d="M96 22c4-6 12-2 12 4 0 7-12 13-12 13s-12-6-12-13c0-6 8-10 12-4Z" />
                <circle className="music-branch-drop delay-b" cx="124" cy="126" r="5.2" />
                <circle className="music-branch-drop delay-d" cx="206" cy="154" r="4.6" />
              </svg>
            </span>
            <span className="section-room-music-branch branch-right">
              <svg viewBox="0 0 540 210" role="presentation" focusable="false">
                <path className="music-branch-main" d="M14 30 C110 42 208 48 294 86 C350 112 428 150 526 192" />
                <path className="music-branch-twig" d="M120 50 C136 74 146 100 146 132" />
                <path className="music-branch-twig" d="M224 66 C246 88 258 116 264 148" />
                <path className="music-branch-twig" d="M314 100 C334 120 350 148 356 182" />
                <circle className="music-branch-bloom-a" cx="72" cy="40" r="9" />
                <circle className="music-branch-bloom-b" cx="98" cy="48" r="8" />
                <circle className="music-branch-bloom-a" cx="176" cy="64" r="9" />
                <circle className="music-branch-bloom-b" cx="202" cy="76" r="8" />
                <circle className="music-branch-bloom-a" cx="282" cy="104" r="9" />
                <circle className="music-branch-bloom-b" cx="306" cy="120" r="8" />
                <circle className="music-branch-bloom-a" cx="392" cy="150" r="9" />
                <circle className="music-branch-bloom-b" cx="418" cy="166" r="8" />
                <path className="music-branch-heart" d="M136 42c5-7 14-3 14 5 0 8-14 15-14 15s-14-7-14-15c0-8 9-12 14-5Z" />
                <circle className="music-branch-drop delay-a" cx="266" cy="160" r="5.2" />
                <circle className="music-branch-drop delay-c" cx="388" cy="188" r="4.6" />
              </svg>
            </span>
            <span className="section-room-music-branch branch-top-center">
              <svg viewBox="0 0 500 220" role="presentation" focusable="false">
                <path className="music-branch-main" d="M24 20 C124 30 206 46 278 82 C340 114 394 154 470 210" />
                <path className="music-branch-twig" d="M146 44 C158 72 162 96 160 130" />
                <path className="music-branch-twig" d="M214 58 C226 82 236 110 238 142" />
                <path className="music-branch-twig" d="M288 90 C302 114 318 144 324 176" />
                <circle className="music-branch-bloom-a" cx="86" cy="34" r="8.4" />
                <circle className="music-branch-bloom-b" cx="104" cy="42" r="7.2" />
                <circle className="music-branch-bloom-c" cx="174" cy="56" r="8" />
                <circle className="music-branch-bloom-a" cx="248" cy="84" r="8.4" />
                <circle className="music-branch-bloom-b" cx="266" cy="96" r="7.2" />
                <circle className="music-branch-bloom-c" cx="346" cy="138" r="8.2" />
                <path className="music-branch-heart" d="M204 44c4-6 12-2 12 5 0 7-12 13-12 13s-12-6-12-13c0-7 8-11 12-5Z" />
                <circle className="music-branch-drop delay-b" cx="164" cy="142" r="4.8" />
                <circle className="music-branch-drop delay-d" cx="238" cy="168" r="4.4" />
                <circle className="music-branch-drop delay-a" cx="324" cy="198" r="4.8" />
              </svg>
            </span>
            <span className="section-room-music-branch branch-cascade-right">
              <svg viewBox="0 0 280 260" role="presentation" focusable="false">
                <path className="music-branch-main" d="M12 18 C92 34 164 68 220 124 C238 142 254 164 268 196" />
                <path className="music-branch-twig" d="M102 60 C112 90 112 124 104 164" />
                <path className="music-branch-twig" d="M146 84 C154 112 154 144 146 178" />
                <path className="music-branch-twig" d="M196 122 C202 146 202 170 198 200" />
                <circle className="music-branch-bloom-a" cx="60" cy="38" r="8.4" />
                <circle className="music-branch-bloom-b" cx="84" cy="48" r="7.4" />
                <circle className="music-branch-bloom-c" cx="126" cy="70" r="8.2" />
                <circle className="music-branch-bloom-a" cx="172" cy="98" r="8.6" />
                <circle className="music-branch-bloom-b" cx="194" cy="118" r="7.2" />
                <circle className="music-branch-bloom-c" cx="230" cy="150" r="7.8" />
                <path className="music-branch-heart" d="M122 56c4-6 12-2 12 5 0 7-12 13-12 13s-12-6-12-13c0-7 8-11 12-5Z" />
                <circle className="music-branch-drop delay-a" cx="106" cy="178" r="5.2" />
                <circle className="music-branch-drop delay-c" cx="150" cy="194" r="4.8" />
                <circle className="music-branch-drop delay-b" cx="198" cy="214" r="4.6" />
              </svg>
            </span>
          </span>
          <span className="section-room-music-bokeh" aria-hidden="true" />
        </>
      )}
      <div className="section-room-stage">
        <div className="section-room-header">
          <div>
            <span className="section-room-eyebrow">Explora nuestra historia</span>
            <h2 className="section-room-title">{activeMeta.label}</h2>
            <p className="section-room-subtitle">{activeMeta.hint}</p>
          </div>
          <div className="section-room-actions">
            <button
              className="carousel-arrow"
              type="button"
              onClick={() => onShift(-1)}
              aria-label="Sección anterior"
              disabled={roomAnimating}
            >
              ‹
            </button>
            <button
              className="carousel-arrow"
              type="button"
              onClick={() => onShift(1)}
              aria-label="Siguiente sección"
              disabled={roomAnimating}
            >
              ›
            </button>
            <button className="button ghost section-room-close" type="button" onClick={onClose}>
              Volver
            </button>
          </div>
        </div>
        <div className={`section-room-body ${roomMotion ? "is-switching" : ""}`} data-motion={roomMotion ?? ""}>
          <div className={`section-room-panel section-room-panel-${activeMeta.id}`} key={open ?? "closed"}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
