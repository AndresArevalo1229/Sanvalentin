import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

type LetterRoomProps = {
  open: boolean;
  herNick: string;
  message: string;
  letterPhoto: string;
  letterPhotoCaption: string;
  onBackToStart: () => void;
};

type CatBurstKind = "catA" | "catB" | "catC" | "paw";

type CatBurstItem = {
  id: number;
  kind: CatBurstKind;
};

function CatBurstIcon({ kind }: { kind: CatBurstKind }) {
  if (kind === "catA") {
    return (
      <svg viewBox="0 0 96 96" role="presentation" focusable="false">
        <polygon className="k-cat-base" points="26,28 10,12 30,18" />
        <polygon className="k-cat-base" points="70,28 66,18 86,12" />
        <circle className="k-cat-base" cx="48" cy="56" r="26" />
        <circle className="k-cat-inner" cx="48" cy="63" r="18" />
        <circle className="k-cat-eye" cx="39" cy="53" r="3.4" />
        <circle className="k-cat-eye" cx="57" cy="53" r="3.4" />
        <ellipse className="k-cat-cheek" cx="32" cy="60" rx="5.2" ry="3.6" />
        <ellipse className="k-cat-cheek" cx="64" cy="60" rx="5.2" ry="3.6" />
        <path className="k-cat-line" d="M44 63c2 3 6 3 8 0" />
      </svg>
    );
  }

  if (kind === "catB") {
    return (
      <svg viewBox="0 0 96 96" role="presentation" focusable="false">
        <polygon className="k-cat-base-alt" points="24,26 8,10 30,17" />
        <polygon className="k-cat-base-alt" points="72,26 66,16 88,10" />
        <circle className="k-cat-base-alt" cx="48" cy="56" r="26" />
        <ellipse className="k-cat-inner" cx="48" cy="62" rx="18" ry="14" />
        <path className="k-cat-line" d="M36 53c2-2 4-2 6 0" />
        <circle className="k-cat-eye" cx="58" cy="53" r="3.4" />
        <ellipse className="k-cat-cheek" cx="32" cy="61" rx="4.8" ry="3.3" />
        <ellipse className="k-cat-cheek" cx="64" cy="61" rx="4.8" ry="3.3" />
        <path className="k-cat-line" d="M44 64c2 2 6 2 8 0" />
        <path className="k-cat-accent" d="M58 36l4 4 6-6 2 2-8 8-6-6z" />
      </svg>
    );
  }

  if (kind === "catC") {
    return (
      <svg viewBox="0 0 96 96" role="presentation" focusable="false">
        <polygon className="k-cat-base" points="26,27 10,12 30,18" />
        <polygon className="k-cat-base" points="70,27 66,18 86,12" />
        <circle className="k-cat-base" cx="48" cy="56" r="26" />
        <ellipse className="k-cat-inner" cx="48" cy="63" rx="18" ry="15" />
        <circle className="k-cat-eye" cx="39" cy="53" r="3.2" />
        <circle className="k-cat-eye" cx="57" cy="53" r="3.2" />
        <ellipse className="k-cat-cheek" cx="34" cy="61" rx="5.1" ry="3.4" />
        <ellipse className="k-cat-cheek" cx="62" cy="61" rx="5.1" ry="3.4" />
        <path className="k-cat-line" d="M45 63c1 1 1 3 0 4" />
        <path className="k-cat-line" d="M51 63c-1 1-1 3 0 4" />
        <path className="k-cat-accent" d="M30 36l4 2 3-4 2 1-4 6-6-3z" />
      </svg>
    );
  }

  if (kind === "paw") {
    return (
      <svg viewBox="0 0 96 96" role="presentation" focusable="false">
        <ellipse className="k-cat-base" cx="48" cy="62" rx="23" ry="16" />
        <circle className="k-cat-base" cx="29" cy="38" r="8" />
        <circle className="k-cat-base" cx="45" cy="31" r="8" />
        <circle className="k-cat-base" cx="61" cy="31" r="8" />
        <circle className="k-cat-base" cx="77" cy="38" r="8" />
      </svg>
    );
  }
}

export default function LetterRoom({
  open,
  herNick,
  message,
  letterPhoto,
  letterPhotoCaption,
  onBackToStart
}: LetterRoomProps) {
  const [isEnvelopeOpen, setEnvelopeOpen] = useState(false);
  const [openedAtLabel, setOpenedAtLabel] = useState("");
  const catBurstItems = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        kind: index % 5 === 0 ? "paw" : (["catA", "catB", "catC"] as const)[index % 3]
      })) as CatBurstItem[],
    []
  );
  const catStormItems = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        kind: (["catA", "catB", "catC"] as const)[index % 3]
      })) as CatBurstItem[],
    []
  );

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const pocketRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const noteRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const catBurstRef = useRef<HTMLDivElement | null>(null);
  const catStormRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const paragraphs = useMemo(
    () =>
      message
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [message]
  );

  const openedAtFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("es-MX", {
        dateStyle: "long",
        timeStyle: "short"
      }),
    []
  );

  useGSAP(
    () => {
      if (
        !flapRef.current ||
        !bodyRef.current ||
        !pocketRef.current ||
        !sheetRef.current ||
        !paperRef.current ||
        !noteRef.current ||
        !glowRef.current ||
        !sealRef.current
      ) {
        return;
      }

      gsap.set(flapRef.current, {
        rotateX: 0,
        y: 0,
        autoAlpha: 1,
        transformOrigin: "50% 0%",
        transformPerspective: 1400
      });
      gsap.set([bodyRef.current, pocketRef.current], {
        y: 0,
        autoAlpha: 1
      });
      gsap.set(sheetRef.current, {
        xPercent: -50,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "50% 90%"
      });
      gsap.set(paperRef.current, {
        y: 0,
        scale: 1,
        autoAlpha: 1
      });
      gsap.set(noteRef.current, {
        xPercent: -50,
        y: 238,
        scale: 0.84,
        autoAlpha: 0,
        transformOrigin: "50% 70%"
      });
      gsap.set(glowRef.current, {
        scale: 1,
        autoAlpha: 0.48
      });
      gsap.set(sealRef.current, {
        scale: 1,
        autoAlpha: 1
      });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      tl.to(flapRef.current, {
        rotateX: -178,
        y: -4,
        duration: 0.62,
        ease: "power3.inOut"
      })
        .to(
          sheetRef.current,
          {
            y: -188,
            duration: 0.86,
            ease: "power2.out"
          },
          "-=0.22"
        )
        .to(
          glowRef.current,
          {
            scale: 1.1,
            autoAlpha: 0.62,
            duration: 0.56
          },
          "<"
        )
        .to(
          sheetRef.current,
          {
            y: -206,
            duration: 0.2
          },
          "-=0.14"
        )
        .to(
          [bodyRef.current, pocketRef.current, flapRef.current],
          {
            autoAlpha: 0.16,
            duration: 0.3
          },
          "-=0.18"
        )
        .to(
          sealRef.current,
          {
            autoAlpha: 0.04,
            scale: 0.68,
            duration: 0.28
          },
          "<"
        )
        .to(
          sheetRef.current,
          {
            autoAlpha: 0,
            duration: 0.18
          },
          "-=0.08"
        )
        .to(
          noteRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.64,
            ease: "back.out(1.14)"
          },
          "-=0.06"
        );

      timelineRef.current = tl;
    },
    { scope: scopeRef }
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    timeline.pause(0);
    timeline.eventCallback("onReverseComplete", null);
    setEnvelopeOpen(false);
    setOpenedAtLabel("");

    if (catBurstRef.current) {
      const cats = catBurstRef.current.querySelectorAll<HTMLElement>(".cat-fall");
      gsap.killTweensOf(cats);
      gsap.set(cats, { autoAlpha: 0 });
    }
    if (catStormRef.current) {
      const cats = catStormRef.current.querySelectorAll<HTMLElement>(".cat-storm-item");
      gsap.killTweensOf(cats);
      gsap.set(cats, { autoAlpha: 0 });
    }
  }, [open]);

  const playCatRain = () => {
    const burst = catBurstRef.current;
    if (!burst) return;

    const cats = burst.querySelectorAll<HTMLElement>(".cat-fall");
    if (!cats.length) return;

    gsap.killTweensOf(cats);
    gsap.set(cats, { autoAlpha: 0 });

    const burstWidth = burst.clientWidth || 760;
    const laneHalfRange = Math.min(burstWidth * 0.34, 300);
    const laneJitter = Math.max(18, burstWidth * 0.04);
    const maxIndex = Math.max(cats.length - 1, 1);

    cats.forEach((cat, index) => {
      const lane = index / maxIndex - 0.5;
      const startX = lane * 2 * laneHalfRange + (-laneJitter + Math.random() * laneJitter * 2);
      const endX = startX * 0.45 + (-74 + Math.random() * 148);
      const dropY = 260 + Math.random() * 280;
      const delay = index * 0.04;
      const duration = 1.55 + Math.random() * 0.88;
      const fadeOutLead = 0.26 + Math.random() * 0.16;

      gsap
        .timeline({ delay })
        .set(cat, {
          x: startX,
          y: -60 - Math.random() * 120,
          rotation: -38 + Math.random() * 76,
          scale: 0.72 + Math.random() * 0.54,
          autoAlpha: 0
        })
        .to(cat, { autoAlpha: 1, duration: 0.1, ease: "power1.out" })
        .to(
          cat,
          {
            x: endX,
            y: dropY,
            rotation: -240 + Math.random() * 480,
            duration,
            ease: "power1.in"
          },
          "<"
        )
        .to(cat, { autoAlpha: 0, duration: 0.24, ease: "power1.out" }, `>-${fadeOutLead}`);
    });
  };

  const playCatStorm = () => {
    const storm = catStormRef.current;
    if (!storm) return;

    const cats = storm.querySelectorAll<HTMLElement>(".cat-storm-item");
    if (!cats.length) return;

    gsap.killTweensOf(cats);
    gsap.set(cats, { autoAlpha: 0 });

    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
    const maxIndex = Math.max(cats.length - 1, 1);

    cats.forEach((cat, index) => {
      const lane = index / maxIndex - 0.5;
      const laneDistance = Math.abs(lane);
      const delay = laneDistance * 0.3 + (index % 2) * 0.02;
      const duration = 2.3 + Math.random() * 1.1;
      const startLeft = gsap.utils.clamp(12, 88, 50 + lane * 56 + (-3 + Math.random() * 6));
      const drift = lane * 120 + (-54 + Math.random() * 108);
      const endY = viewportHeight + 240;

      gsap
        .timeline({ delay })
        .set(cat, {
          left: `${startLeft}%`,
          y: -220 - Math.random() * 180,
          rotation: -24 + Math.random() * 48,
          scale: 0.76 + Math.random() * 0.56,
          autoAlpha: 0
        })
        .to(cat, { autoAlpha: 0.94, duration: 0.14, ease: "power1.out" })
        .to(
          cat,
          {
            y: endY,
            x: drift,
            rotation: -320 + Math.random() * 640,
            duration,
            ease: "power1.in"
          },
          "<"
        )
        .to(cat, { autoAlpha: 0, duration: 0.28, ease: "power1.out" }, ">-0.34");
    });
  };

  const openEnvelope = () => {
    const timeline = timelineRef.current;
    if (!timeline || timeline.isActive() || isEnvelopeOpen) return;

    setOpenedAtLabel(openedAtFormatter.format(new Date()));
    setEnvelopeOpen(true);
    playCatRain();
    playCatStorm();
    timeline.play(0);
  };

  const closeEnvelope = () => {
    const timeline = timelineRef.current;
    if (!timeline || timeline.isActive() || !isEnvelopeOpen) return;

    if (catBurstRef.current) {
      const cats = catBurstRef.current.querySelectorAll<HTMLElement>(".cat-fall");
      gsap.killTweensOf(cats);
      gsap.set(cats, { autoAlpha: 0 });
    }
    if (catStormRef.current) {
      const cats = catStormRef.current.querySelectorAll<HTMLElement>(".cat-storm-item");
      gsap.killTweensOf(cats);
      gsap.set(cats, { autoAlpha: 0 });
    }

    timeline.eventCallback("onReverseComplete", () => {
      setEnvelopeOpen(false);
      timeline.eventCallback("onReverseComplete", null);
    });
    timeline.reverse();
  };

  const handleEnvelopeToggle = () => {
    if (isEnvelopeOpen) {
      closeEnvelope();
      return;
    }
    openEnvelope();
  };

  return (
    <section className={`letter-room ${open ? "is-open" : ""}`} aria-hidden={!open} aria-live="polite">
      <div ref={catStormRef} className="cat-storm" aria-hidden="true">
        {catStormItems.map((item) => (
          <span key={`cat-storm-${item.id}`} className={`cat-storm-item is-${item.kind}`}>
            <CatBurstIcon kind={item.kind} />
          </span>
        ))}
      </div>
      <div className="letter-room-stage" ref={scopeRef}>
        <div className="letter-room-header">
          <span className="letter-room-eyebrow">Para mi {herNick}</span>
          <h2 className="letter-room-title">
            {isEnvelopeOpen ? "Tu carta esta abierta" : "Toca la carta para abrirla"}
          </h2>
          <p className="letter-room-description">
            {isEnvelopeOpen && openedAtLabel
              ? `Carta abierta el ${openedAtLabel}`
              : "Primero abre el sello, luego aparece tu carta completa."}
          </p>
        </div>

        <div className="letter-room-shell">
          <div className={`letter-room-canvas ${isEnvelopeOpen ? "is-open" : ""}`}>
            <div ref={catBurstRef} className="cat-burst" aria-hidden="true">
              {catBurstItems.map((item) => (
                <span key={`cat-fall-${item.id}`} className={`cat-fall is-${item.kind}`}>
                  <CatBurstIcon kind={item.kind} />
                </span>
              ))}
            </div>
            <div
              className={`love-envelope ${isEnvelopeOpen ? "is-open" : ""}`}
              onClick={handleEnvelopeToggle}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleEnvelopeToggle();
                }
              }}
              aria-label={isEnvelopeOpen ? "Cerrar carta" : "Abrir carta"}
            >
              <div ref={glowRef} className="love-envelope-glow" />
              <div className="love-envelope-ears" aria-hidden="true">
                <span className="cat-ear cat-ear-left" />
                <span className="cat-ear cat-ear-right" />
              </div>
              <div ref={bodyRef} className="love-envelope-body" />

              <div ref={sheetRef} className="love-envelope-letter">
                <div ref={paperRef} className="love-envelope-paper" />
              </div>

              <div ref={pocketRef} className="love-envelope-pocket" />
              <div ref={flapRef} className="love-envelope-flap" />
              <div ref={sealRef} className="love-envelope-seal">
                A + A
              </div>
              <div className="love-envelope-whiskers" aria-hidden="true">
                <div className="cat-whiskers cat-whiskers-left">
                  <span className="cat-whisker-line" />
                  <span className="cat-whisker-line" />
                  <span className="cat-whisker-line" />
                </div>
                <div className="cat-whiskers cat-whiskers-right">
                  <span className="cat-whisker-line" />
                  <span className="cat-whisker-line" />
                  <span className="cat-whisker-line" />
                </div>
              </div>
              <div className="love-envelope-paws" aria-hidden="true">
                <span className="cat-paw paw-left" />
                <span className="cat-paw paw-right" />
              </div>
            </div>

            <article ref={noteRef} className={`love-note love-note-panel ${isEnvelopeOpen ? "is-open" : ""}`}>
              <div className="love-note-ornaments" aria-hidden="true">
                <div className="love-note-garland">
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                  <span className="love-heart-charm" />
                </div>
                <span className="love-note-corner corner-tl" />
                <span className="love-note-corner corner-tr" />
                <span className="love-note-corner corner-bl" />
                <span className="love-note-corner corner-br" />
                <span className="love-note-sparkle sparkle-1" />
                <span className="love-note-sparkle sparkle-2" />
                <span className="love-note-sparkle sparkle-3" />
                <span className="love-note-sparkle sparkle-4" />
              </div>

              <div className="love-note-content">
                <div className="room-letter-head">
                  <span>Para mi {herNick}</span>
                  <h3>Tu carta completa</h3>
                </div>
                <div className="room-letter-body">
                  <div className="room-letter-text">
                    {paragraphs.map((line, index) => (
                      <p key={`room-line-${index}`}>{line}</p>
                    ))}
                  </div>
                  <div className="room-letter-photo">
                    <img src={letterPhoto} alt="Foto especial" />
                    <span>{letterPhotoCaption}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {!isEnvelopeOpen && <p className="room-tap-hint">Toca el sello para abrirla</p>}

          <div className={`letter-room-actions ${isEnvelopeOpen ? "" : "is-idle"}`}>
            {isEnvelopeOpen && (
              <button type="button" className="button letter-room-save" onClick={closeEnvelope}>
                Cerrar carta
              </button>
            )}
            <button type="button" className="button ghost letter-room-close" onClick={onBackToStart}>
              Volver al inicio
            </button>
            {isEnvelopeOpen && <p className="letter-room-save-note">Al cerrar vuelve a quedar sellada.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
