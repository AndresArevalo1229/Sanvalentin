import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { TimelineItem } from "../../data/content";
import IconGlyph from "../ui/IconGlyph";
import { timelineMiniGameAssets } from "../../assets/timeline-map";

type TimelineSectionProps = {
  timeline: TimelineItem[];
};

type TimelineStage = "foyer" | "zooming" | "journey";
type InteriorRoutePoint = { x: number; y: number };
type JourneyRoomNode = {
  x: number;
  y: number;
  waypoint: InteriorRoutePoint;
};
type MiniDoorVariant = "closed" | "reached" | "active";

const MAX_STEPS = 10;
const ZOOM_DURATION_MS = 1720;

const timelineDraftTemplate: TimelineItem[] = [
  {
    date: "Dia 1 - Fecha por definir",
    title: "La invitacion del principe",
    text: "Aqui puedes contar como empezo este capitulo de su historia."
  },
  {
    date: "Dia 2 - Fecha por definir",
    title: "Primer paseo por el jardin",
    text: "Anota una escena bonita de su camino juntos."
  },
  {
    date: "Dia 3 - Fecha por definir",
    title: "Promesa en el salon principal",
    text: "Escribe una promesa o momento especial de ese dia."
  },
  {
    date: "Dia 4 - Fecha por definir",
    title: "Baile bajo las lamparas",
    text: "Describe la emocion y lo que hizo inolvidable esa noche."
  },
  {
    date: "Dia 5 - Fecha por definir",
    title: "Cartas entre torres",
    text: "Pon aqui un recuerdo romantico con detalles personales."
  },
  {
    date: "Dia 6 - Fecha por definir",
    title: "Risas en la escalinata",
    text: "Cuenta una anecdota corta que siempre quieran recordar."
  },
  {
    date: "Dia 7 - Fecha por definir",
    title: "Cena en la terraza",
    text: "Agrega una linea sobre lo que sintieron ese dia."
  },
  {
    date: "Dia 8 - Fecha por definir",
    title: "Nueva aventura del reino",
    text: "Escribe el evento que marcara esta etapa de su historia."
  },
  {
    date: "Dia 9 - Fecha por definir",
    title: "Juramento en la torre",
    text: "Describe por que este momento fue importante para ustedes."
  },
  {
    date: "Dia 10 - Fecha por definir",
    title: "Encuentro final con la princesa",
    text: "Cierra la linea del tiempo con un mensaje especial para ella."
  }
];

const timelineRibbon = ["Edicion Bridgerton", "Mansion europea", "Cronica de amor"];
const doorDustSpecs = Array.from({ length: 18 }, (_, index) => ({
  id: `dust-${index}`,
  x: 8 + ((index * 43) % 84),
  size: 4 + (index % 5),
  delay: index * 0.14,
  duration: 1.9 + (index % 4) * 0.42,
  drift: (index % 2 === 0 ? 1 : -1) * (14 + (index % 5) * 4),
  rise: 64 + (index % 4) * 20,
  alpha: 0.24 + (index % 4) * 0.11
}));
const manorStarSpecs = Array.from({ length: 14 }, (_, index) => ({
  id: `star-${index}`,
  x: 6 + ((index * 29) % 88),
  y: 6 + ((index * 17) % 30),
  size: 2 + (index % 3),
  delay: index * 0.22,
  duration: 2.1 + (index % 4) * 0.45
}));
const manorUpperWindowXs = [208, 278, 348, 416, 784, 852, 922, 992];
const manorLowerWindowXs = [186, 252, 320, 386, 814, 880, 948, 1014];
const manorColumnXs = [450, 498, 546, 644, 692, 740];
const manorBalusterXs = Array.from({ length: 26 }, (_, index) => 418 + index * 14);
const princeSpawnPoint: InteriorRoutePoint = { x: 11, y: 89 };
const princessRoutePoint: InteriorRoutePoint = { x: 50, y: 9 };
const interiorRoomNodesTemplate: JourneyRoomNode[] = [
  { x: 18, y: 83, waypoint: { x: 15, y: 86 } },
  { x: 38, y: 82, waypoint: { x: 28, y: 83 } },
  { x: 58, y: 80, waypoint: { x: 48, y: 81 } },
  { x: 76, y: 69, waypoint: { x: 67, y: 74 } },
  { x: 61, y: 62, waypoint: { x: 69, y: 66 } },
  { x: 40, y: 60, waypoint: { x: 51, y: 61 } },
  { x: 22, y: 48, waypoint: { x: 31, y: 53 } },
  { x: 40, y: 37, waypoint: { x: 31, y: 42 } },
  { x: 62, y: 34, waypoint: { x: 53, y: 36 } },
  { x: 50, y: 20, waypoint: { x: 56, y: 24 } }
];

function ManorIllustration() {
  return (
    <svg
      className="timeline-manor-illustration"
      viewBox="0 0 1200 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="timeline-manor-facade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--timeline-manor-stone-a)" />
          <stop offset="54%" stopColor="var(--timeline-manor-stone-b)" />
          <stop offset="100%" stopColor="var(--timeline-manor-stone-c)" />
        </linearGradient>
        <linearGradient id="timeline-manor-roof-tiles" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--timeline-manor-roof-a)" />
          <stop offset="100%" stopColor="var(--timeline-manor-roof-b)" />
        </linearGradient>
        <linearGradient id="timeline-manor-trim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--timeline-manor-trim-a)" />
          <stop offset="100%" stopColor="var(--timeline-manor-trim-b)" />
        </linearGradient>
        <linearGradient id="timeline-manor-column-shade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.78)" />
          <stop offset="45%" stopColor="rgba(255, 250, 254, 0.64)" />
          <stop offset="100%" stopColor="rgba(170, 124, 146, 0.5)" />
        </linearGradient>
        <radialGradient id="timeline-manor-window-glow" cx="50%" cy="34%" r="70%">
          <stop offset="0%" stopColor="var(--timeline-manor-window-core)" />
          <stop offset="65%" stopColor="var(--timeline-manor-window-halo)" />
          <stop offset="100%" stopColor="rgba(255, 196, 154, 0.14)" />
        </radialGradient>
        <linearGradient id="timeline-manor-stair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(248, 220, 233, 0.84)" />
          <stop offset="100%" stopColor="rgba(183, 136, 158, 0.85)" />
        </linearGradient>
        <pattern id="timeline-manor-ashlar" width="24" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 13.5h24M0 0h24M0 7h24M12 0v7M0 7v7" stroke="rgba(126, 49, 78, 0.14)" strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect x="94" y="154" width="1012" height="362" rx="38" fill="url(#timeline-manor-facade)" stroke="rgba(118, 39, 69, 0.38)" strokeWidth="2" />
      <rect x="94" y="154" width="1012" height="362" rx="38" fill="url(#timeline-manor-ashlar)" opacity="0.55" />

      <path
        d="M164 156h872l-32-70H196Z"
        fill="url(#timeline-manor-roof-tiles)"
        stroke="rgba(113, 36, 63, 0.42)"
        strokeWidth="2"
      />
      <rect x="152" y="152" width="896" height="16" rx="8" fill="url(#timeline-manor-trim)" />
      <rect x="160" y="176" width="880" height="20" rx="8" fill="rgba(248, 226, 235, 0.86)" stroke="rgba(122, 44, 72, 0.3)" strokeWidth="1.6" />

      <rect x="100" y="250" width="180" height="268" rx="18" fill="url(#timeline-manor-facade)" stroke="rgba(114, 42, 70, 0.35)" strokeWidth="1.6" />
      <rect x="920" y="250" width="180" height="268" rx="18" fill="url(#timeline-manor-facade)" stroke="rgba(114, 42, 70, 0.35)" strokeWidth="1.6" />

      <path
        d="M372 252h456l-20-54-208-72-208 72Z"
        fill="rgba(242, 211, 226, 0.95)"
        stroke="rgba(119, 44, 72, 0.34)"
        strokeWidth="2"
      />
      <rect x="390" y="248" width="420" height="16" rx="8" fill="url(#timeline-manor-trim)" />

      <rect x="402" y="266" width="396" height="188" rx="16" fill="rgba(249, 232, 241, 0.64)" stroke="rgba(121, 49, 77, 0.24)" strokeWidth="1.4" />

      {manorColumnXs.map((x) => (
        <g key={`column-${x}`}>
          <rect x={x} y="284" width="26" height="226" rx="13" fill="url(#timeline-manor-column-shade)" stroke="rgba(121, 46, 73, 0.28)" strokeWidth="1.2" />
          <rect x={x - 4} y="274" width="34" height="10" rx="5" fill="rgba(239, 217, 227, 0.82)" />
          <rect x={x - 4} y="510" width="34" height="10" rx="5" fill="rgba(200, 157, 177, 0.76)" />
        </g>
      ))}

      <rect x="408" y="324" width="384" height="14" rx="7" fill="url(#timeline-manor-trim)" stroke="rgba(119, 58, 36, 0.34)" strokeWidth="1.2" />
      {manorBalusterXs.map((x) => (
        <rect key={`baluster-${x}`} x={x} y="338" width="5" height="20" rx="2.5" fill="rgba(174, 125, 151, 0.7)" />
      ))}

      <g className="timeline-manor-lantern-group lantern-left" style={{ ["--lantern-delay" as string]: "0.1s" } as CSSProperties}>
        <path className="timeline-manor-lantern-chain" d="M468 324v20" />
        <ellipse className="timeline-manor-lantern-halo" cx="468" cy="356" rx="22" ry="18" />
        <rect className="timeline-manor-lantern-frame" x="460" y="342" width="16" height="24" rx="7" />
        <rect className="timeline-manor-lantern-core" x="464" y="347" width="8" height="14" rx="4" />
      </g>
      <g className="timeline-manor-lantern-group lantern-right" style={{ ["--lantern-delay" as string]: "0.5s" } as CSSProperties}>
        <path className="timeline-manor-lantern-chain" d="M732 324v20" />
        <ellipse className="timeline-manor-lantern-halo" cx="732" cy="356" rx="22" ry="18" />
        <rect className="timeline-manor-lantern-frame" x="724" y="342" width="16" height="24" rx="7" />
        <rect className="timeline-manor-lantern-core" x="728" y="347" width="8" height="14" rx="4" />
      </g>

      <path d="M418 530h364l-42-88H460Z" fill="url(#timeline-manor-stair)" stroke="rgba(116, 43, 71, 0.24)" strokeWidth="1.2" />
      <path d="M392 530h416v22H392Z" fill="rgba(177, 132, 153, 0.74)" />

      {manorUpperWindowXs.map((x) => (
        <g
          key={`window-upper-${x}`}
          className="timeline-manor-window-set"
          style={{ ["--window-delay" as string]: `${0.2 + (x % 7) * 0.18}s` } as CSSProperties}
        >
          <rect
            className="timeline-manor-window-core"
            x={x}
            y="216"
            width="24"
            height="52"
            rx="12"
            fill="url(#timeline-manor-window-glow)"
            stroke="rgba(107, 38, 65, 0.34)"
            strokeWidth="1.2"
          />
          <rect className="timeline-manor-window-glint" x={x + 5} y="224" width="4.8" height="30" rx="2.4" />
          <rect className="timeline-manor-window-glint glint-soft" x={x + 11} y="228" width="2.7" height="26" rx="1.35" />
        </g>
      ))}
      {manorLowerWindowXs.map((x) => (
        <g
          key={`window-lower-${x}`}
          className="timeline-manor-window-set"
          style={{ ["--window-delay" as string]: `${0.5 + (x % 5) * 0.2}s` } as CSSProperties}
        >
          <rect
            className="timeline-manor-window-core"
            x={x}
            y="310"
            width="22"
            height="48"
            rx="11"
            fill="url(#timeline-manor-window-glow)"
            stroke="rgba(107, 38, 65, 0.3)"
            strokeWidth="1.1"
          />
          <rect className="timeline-manor-window-glint" x={x + 4} y="318" width="4.2" height="26" rx="2.1" />
          <rect className="timeline-manor-window-glint glint-soft" x={x + 10} y="322" width="2.5" height="22" rx="1.25" />
        </g>
      ))}

      <path
        d="M460 518V358c0-82 63-146 140-146s140 64 140 146v160Z"
        fill="rgba(245, 224, 235, 0.56)"
        stroke="rgba(118, 43, 70, 0.4)"
        strokeWidth="2"
      />
      <path d="M450 530h300l-14-18H464Z" fill="rgba(186, 141, 163, 0.72)" />
    </svg>
  );
}

function ManorCarriage() {
  return (
    <svg
      viewBox="0 0 174 96"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="timeline-carriage-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(88, 44, 35, 0.94)" />
          <stop offset="100%" stopColor="rgba(39, 18, 16, 0.96)" />
        </linearGradient>
        <linearGradient id="timeline-carriage-trim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(224, 174, 103, 0.9)" />
          <stop offset="100%" stopColor="rgba(160, 98, 54, 0.9)" />
        </linearGradient>
      </defs>

      <path d="M44 63h80a8 8 0 0 0 8-8V37a23 23 0 0 0-23-23H61a17 17 0 0 0-17 17Z" fill="url(#timeline-carriage-body)" stroke="rgba(118, 61, 44, 0.75)" strokeWidth="2" />
      <rect x="59" y="26" width="28" height="16" rx="6" fill="rgba(255, 221, 169, 0.32)" stroke="rgba(202, 147, 92, 0.46)" strokeWidth="1.4" />
      <rect x="90" y="26" width="26" height="16" rx="6" fill="rgba(255, 221, 169, 0.24)" stroke="rgba(202, 147, 92, 0.32)" strokeWidth="1.2" />
      <path d="M130 46h18m-18 8h18" stroke="url(#timeline-carriage-trim)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="62" cy="70" r="13" fill="rgba(68, 32, 25, 0.95)" stroke="rgba(152, 102, 57, 0.74)" strokeWidth="2.2" />
      <circle cx="62" cy="70" r="5" fill="rgba(229, 189, 119, 0.92)" />
      <circle cx="118" cy="70" r="13" fill="rgba(68, 32, 25, 0.95)" stroke="rgba(152, 102, 57, 0.74)" strokeWidth="2.2" />
      <circle cx="118" cy="70" r="5" fill="rgba(229, 189, 119, 0.92)" />
    </svg>
  );
}

function MiniMapDoorGlyph({ variant }: { variant: MiniDoorVariant }) {
  const src = timelineMiniGameAssets.doors[variant];
  return (
    <img
      src={src}
      className="timeline-mini-door-asset"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  );
}

function PrinceSpriteGlyph({ moving, walkFrame }: { moving: boolean; walkFrame: 0 | 1 }) {
  const src = moving
    ? walkFrame === 0
      ? timelineMiniGameAssets.prince.walkA
      : timelineMiniGameAssets.prince.walkB
    : timelineMiniGameAssets.prince.idle;

  return (
    <img
      src={src}
      className="timeline-mini-prince-asset"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  );
}

function ManorMiniMapIllustration() {
  return (
    <img
      src={timelineMiniGameAssets.manorInteriorMap}
      className="timeline-mini-illustrated-map"
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
  );
}

function normalizeTimeline(timeline: TimelineItem[]): TimelineItem[] {
  const source = timeline.length > 0 ? timeline : timelineDraftTemplate;

  return Array.from({ length: MAX_STEPS }, (_, index) => {
    const fallback = timelineDraftTemplate[index];
    const item = source[index] ?? fallback ?? source[source.length - 1];
    const dayLabel = `Dia ${index + 1}`;

    return {
      date: item?.date?.trim() ? item.date : `${dayLabel} - Fecha por definir`,
      title: item?.title?.trim() ? item.title : `${dayLabel} - Momento importante`,
      text:
        item?.text?.trim() ??
        "Escribe aqui lo que paso en este dia para completar su historia juntos.",
      photo: item?.photo
    };
  });
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const timelineSteps = useMemo(() => normalizeTimeline(timeline), [timeline]);
  const stageRef = useRef<TimelineStage>("foyer");
  const transitionTimerRef = useRef<number | null>(null);
  const moveTimersRef = useRef<number[]>([]);

  const [stage, setStage] = useState<TimelineStage>("foyer");
  const [doorOpen, setDoorOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState<0 | 1>(0);
  const [princePosition, setPrincePosition] = useState<InteriorRoutePoint>(princeSpawnPoint);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);

  const totalSteps = timelineSteps.length;
  const interiorRooms = useMemo(() => {
    const fallback =
      interiorRoomNodesTemplate[interiorRoomNodesTemplate.length - 1] ?? {
        x: 50,
        y: 20,
        waypoint: { x: 50, y: 24 }
      };
    return Array.from({ length: totalSteps }, (_, index) => interiorRoomNodesTemplate[index] ?? fallback);
  }, [totalSteps]);
  const activeItem = activeStep >= 0 ? timelineSteps[activeStep] : null;
  const progress = (Math.max(activeStep + 1, 0) / totalSteps) * 100;
  const magicLevel = totalSteps > 1 ? Math.max(activeStep, 0) / (totalSteps - 1) : 0;
  const journeyComplete = journeyStarted && activeStep >= totalSteps - 1;
  const maxUnlockedStep = journeyStarted ? Math.min(activeStep + 1, totalSteps - 1) : -1;
  const progressLabel = journeyStarted
    ? `Cuarto ${Math.max(activeStep + 1, 1)} de ${totalSteps}`
    : `Recorrido 0 de ${totalSteps}`;

  const timelineMagicStyle = {
    ["--timeline-magic-level" as string]: `${magicLevel.toFixed(3)}`
  } as CSSProperties;

  const clearJourneyTimers = () => {
    moveTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    moveTimersRef.current = [];
  };

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      clearJourneyTimers();
    };
  }, []);

  useEffect(() => {
    if (!isFloorModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFloorModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFloorModalOpen]);

  useEffect(() => {
    if (!isMoving) {
      setWalkFrame(0);
      return;
    }

    const frameTimer = window.setInterval(() => {
      setWalkFrame((current) => (current === 0 ? 1 : 0));
    }, 180);

    return () => {
      window.clearInterval(frameTimer);
    };
  }, [isMoving]);

  const resetJourney = () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    clearJourneyTimers();
    setStage("foyer");
    setDoorOpen(false);
    setActiveStep(-1);
    setJourneyStarted(false);
    setIsMoving(false);
    setWalkFrame(0);
    setPrincePosition(princeSpawnPoint);
    setIsFloorModalOpen(false);
  };

  const completeZoomTransition = () => {
    if (stageRef.current !== "zooming") return;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    clearJourneyTimers();
    setStage("journey");
    setActiveStep(-1);
    setJourneyStarted(false);
    setIsMoving(false);
    setWalkFrame(0);
    setPrincePosition(princeSpawnPoint);
    setIsFloorModalOpen(false);
  };

  const enterJourney = () => {
    if (stage !== "foyer") return;

    setDoorOpen(true);

    if (prefersReducedMotion) {
      setStage("journey");
      setActiveStep(-1);
      setJourneyStarted(false);
      setIsMoving(false);
      setWalkFrame(0);
      setPrincePosition(princeSpawnPoint);
      setIsFloorModalOpen(false);
      return;
    }

    setStage("zooming");
    transitionTimerRef.current = window.setTimeout(() => {
      completeZoomTransition();
    }, ZOOM_DURATION_MS + 380);
  };

  const finishTravel = (targetIndex: number, openModal: boolean) => {
    setActiveStep(targetIndex);
    setIsMoving(false);
    if (openModal) {
      setIsFloorModalOpen(true);
    }
  };

  const travelToStep = (index: number, openModal = true) => {
    if (isMoving) return;

    const clampedStep = Math.max(0, Math.min(index, totalSteps - 1));
    if (!journeyStarted && clampedStep !== 0) return;

    if (journeyStarted && activeStep === clampedStep) {
      if (openModal) setIsFloorModalOpen(true);
      return;
    }

    const targetRoom = interiorRooms[clampedStep];
    if (!targetRoom) return;

    clearJourneyTimers();
    setJourneyStarted(true);
    setIsFloorModalOpen(false);
    setIsMoving(true);

    if (prefersReducedMotion) {
      setPrincePosition({ x: targetRoom.x, y: targetRoom.y });
      finishTravel(clampedStep, openModal);
      return;
    }

    const firstLegDuration = 640;
    const secondLegDuration = 620;

    setPrincePosition(targetRoom.waypoint);

    const firstLegTimer = window.setTimeout(() => {
      setPrincePosition({ x: targetRoom.x, y: targetRoom.y });
    }, firstLegDuration);

    const secondLegTimer = window.setTimeout(() => {
      finishTravel(clampedStep, openModal);
    }, firstLegDuration + secondLegDuration);

    moveTimersRef.current.push(firstLegTimer, secondLegTimer);
  };

  const moveStep = (delta: number, openModal = true) => {
    if (!journeyStarted) {
      if (delta > 0) {
        travelToStep(0, openModal);
      }
      return;
    }
    travelToStep(activeStep + delta, openModal);
  };

  return (
    <section
      className="timeline-section-reset timeline-bridgerton-section section detail-section"
      data-mood="gala"
      id="timeline"
      style={timelineMagicStyle}
    >
      <div className="section-head timeline-bridgerton-head">
        <span className="eyebrow">Historia estilo Bridgerton</span>
        <h2>Nuestra mansion del tiempo</h2>
        <p>
          Abrimos la gran puerta, entramos al minimapa interior y recorremos cuarto por cuarto
          hasta llegar a la torre final.
        </p>
      </div>

      <div className="timeline-bridgerton-ribbon" aria-hidden="true">
        {timelineRibbon.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="timeline-stage-shell">
        <AnimatePresence mode="wait" initial={false}>
          {stage !== "journey" ? (
            <motion.div
              key="foyer"
              className={`timeline-foyer-scene ${stage === "zooming" ? "is-zooming" : ""}`}
              initial={false}
              animate={
                stage === "zooming"
                  ? prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        scale: [1, 1.46, 2.9],
                        y: [0, 92, 292],
                        opacity: [1, 0.95, 0.04],
                        filter: ["blur(0px)", "blur(0.3px)", "blur(2px)"]
                      }
                  : { scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }
              }
              transition={{
                duration: prefersReducedMotion ? 0.01 : 1.65,
                ease: [0.16, 0.84, 0.29, 0.99],
                times: stage === "zooming" ? [0, 0.62, 1] : undefined
              }}
              onAnimationComplete={completeZoomTransition}
            >
              <div className="timeline-manor">
                <span className="timeline-manor-sky" aria-hidden="true" />
                <span className="timeline-manor-orb" aria-hidden="true" />
                <span className="timeline-manor-atmosphere" aria-hidden="true" />
                <span className="timeline-manor-stars" aria-hidden="true">
                  {manorStarSpecs.map((star) => (
                    <i
                      key={star.id}
                      style={
                        {
                          ["--star-x" as string]: `${star.x}%`,
                          ["--star-y" as string]: `${star.y}%`,
                          ["--star-size" as string]: `${star.size}px`,
                          ["--star-delay" as string]: `${star.delay}s`,
                          ["--star-duration" as string]: `${star.duration}s`
                        } as CSSProperties
                      }
                    />
                  ))}
                </span>
                <span className="timeline-manor-cloud cloud-a" aria-hidden="true" />
                <span className="timeline-manor-cloud cloud-b" aria-hidden="true" />
                <span className="timeline-manor-cloud cloud-c" aria-hidden="true" />
                <ManorIllustration />
                <span className="timeline-manor-fog fog-a" aria-hidden="true" />
                <span className="timeline-manor-fog fog-b" aria-hidden="true" />
                <span className="timeline-manor-carriage" aria-hidden="true">
                  <ManorCarriage />
                </span>

                <div className={`timeline-manor-door ${doorOpen ? "is-open" : ""}`} aria-hidden="true">
                  <span className="timeline-manor-door-leaf leaf-left" />
                  <span className="timeline-manor-door-leaf leaf-right" />
                  <span className="timeline-manor-door-rays" />
                  <span className="timeline-manor-door-light" />
                  <span className="timeline-manor-door-dust">
                    {doorDustSpecs.map((particle) => (
                      <i
                        key={particle.id}
                        style={
                          {
                            ["--dust-x" as string]: `${particle.x}%`,
                            ["--dust-size" as string]: `${particle.size}px`,
                            ["--dust-delay" as string]: `${particle.delay}s`,
                            ["--dust-duration" as string]: `${particle.duration}s`,
                            ["--dust-drift" as string]: `${particle.drift}px`,
                            ["--dust-rise" as string]: `${particle.rise}px`,
                            ["--dust-alpha" as string]: `${particle.alpha}`
                          } as CSSProperties
                        }
                      />
                    ))}
                  </span>
                </div>
              </div>

              <div className="timeline-foyer-copy">
                <h3>La puerta principal del palacio</h3>
                <p>Al abrir, hacemos zoom y entramos a los 10 cuartos de recuerdos.</p>
                <div className="timeline-foyer-actions">
                  <button
                    type="button"
                    className="button timeline-foyer-open"
                    onClick={enterJourney}
                    disabled={stage === "zooming"}
                  >
                    {stage === "zooming" ? "Entrando al palacio..." : "Abrir puertas y entrar"}
                  </button>
                </div>
              </div>

              {stage === "zooming" && !prefersReducedMotion && (
                <motion.span
                  className="timeline-door-zoom-overlay"
                  initial={{ opacity: 0.5, scale: 0.44 }}
                  animate={{ opacity: 0, scale: 3.3 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                  aria-hidden="true"
                />
              )}

              <span className={`timeline-cinematic-vignette ${stage === "zooming" ? "is-active" : ""}`} />
            </motion.div>
          ) : (
            <motion.div
              key="journey"
              className="timeline-journey-scene"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="timeline-journey-topbar">
                <div className="timeline-journey-progress">
                  <span className="timeline-progress-label">{progressLabel}</span>
                  <div
                    className="timeline-progress-track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={totalSteps}
                    aria-valuenow={Math.max(activeStep + 1, 0)}
                  >
                    <motion.span
                      className="timeline-progress-fill"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="timeline-journey-actions">
                  {!journeyStarted ? (
                    <button
                      type="button"
                      className="button"
                      onClick={() => travelToStep(0, true)}
                      disabled={isMoving}
                    >
                      Iniciar recorrido
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button ghost"
                      onClick={() => setIsFloorModalOpen(true)}
                      disabled={activeStep < 0 || isMoving}
                    >
                      Ver carta del cuarto
                    </button>
                  )}
                  <button
                    type="button"
                    className="button ghost"
                    onClick={resetJourney}
                    disabled={isMoving}
                  >
                    Volver a la mansion
                  </button>
                </div>
              </header>

              <div className="timeline-journey-layout">
                <div className="timeline-floors-board timeline-mini-board">
                  <div className="timeline-mini-map-shell">
                    <ManorMiniMapIllustration />

                    <div
                      className={`timeline-princess-top timeline-mini-princess ${journeyComplete ? "is-complete" : ""}`}
                      style={
                        {
                          ["--room-x" as string]: `${princessRoutePoint.x}%`,
                          ["--room-y" as string]: `${princessRoutePoint.y}%`
                        } as CSSProperties
                      }
                    >
                      <span className="timeline-princess-icon">
                        <IconGlyph name="crown" />
                      </span>
                      <div>
                        <p>Torre final</p>
                        <strong>Cuarto de la princesa</strong>
                      </div>
                    </div>

                    <div className="timeline-mini-rooms" role="list" aria-label="Mapa de habitaciones">
                      {timelineSteps.map((item, index) => {
                        const roomNode = interiorRooms[index];
                        const reached = journeyStarted && index <= activeStep;
                        const isActive = journeyStarted && index === activeStep;
                        const unlocked = journeyStarted && index <= maxUnlockedStep;
                        const doorVariant: MiniDoorVariant = isActive
                          ? "active"
                          : reached
                            ? "reached"
                            : "closed";
                        const label = reached ? item.date : "Cerrada";
                        return (
                          <button
                            key={`${item.date}-${index}`}
                            type="button"
                            className={`timeline-mini-room ${reached ? "is-reached" : ""} ${isActive ? "is-active" : ""} ${unlocked ? "is-unlocked" : "is-locked"}`}
                            onClick={() => travelToStep(index, true)}
                            aria-current={isActive ? "step" : undefined}
                            aria-label={`Habitacion ${index + 1}`}
                            disabled={!unlocked || isMoving}
                            style={
                              {
                                ["--room-x" as string]: `${roomNode?.x ?? 50}%`,
                                ["--room-y" as string]: `${roomNode?.y ?? 50}%`
                              } as CSSProperties
                            }
                          >
                            <span
                              className={`timeline-mini-room-door ${isActive && !isMoving ? "is-glowing" : ""}`}
                              aria-hidden="true"
                            >
                              <MiniMapDoorGlyph variant={doorVariant} />
                            </span>
                            <span className="timeline-mini-room-copy">
                              <strong>Cuarto {index + 1}</strong>
                              <small>{label}</small>
                            </span>
                          </button>
                        );
                      })}

                      <motion.span
                        className="timeline-prince-marker is-minimap"
                        initial={false}
                        animate={{
                          left: `${princePosition.x}%`,
                          top: `${princePosition.y}%`
                        }}
                        transition={{
                          duration: prefersReducedMotion ? 0.01 : 0.62,
                          ease: [0.18, 0.86, 0.24, 1]
                        }}
                        aria-hidden="true"
                      >
                        <PrinceSpriteGlyph moving={isMoving} walkFrame={walkFrame} />
                        <small>{isMoving ? "Caminando..." : "Principe"}</small>
                      </motion.span>
                    </div>
                  </div>

                  <div className="timeline-map-hint timeline-mini-status">
                    {!journeyStarted ? (
                      <p>
                        Pulsa <strong>Iniciar recorrido</strong> para que el principe camine al
                        primer cuarto.
                      </p>
                    ) : activeItem ? (
                      <p>
                        <strong>{activeItem.title}</strong> · {activeItem.date}
                      </p>
                    ) : (
                      <p>El principe va caminando por la mansion...</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="timeline-floor-controls">
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => moveStep(-1, true)}
                  disabled={!journeyStarted || activeStep <= 0 || isMoving}
                >
                  Habitacion anterior
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => moveStep(1, true)}
                  disabled={!journeyStarted || journeyComplete || isMoving}
                >
                  {journeyComplete ? "Torre alcanzada" : isMoving ? "Caminando..." : "Ir al siguiente cuarto"}
                </button>
              </div>

              {journeyComplete && (
                <motion.div
                  className="timeline-ending-note"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: "easeOut" }}
                >
                  <IconGlyph name="crown" />
                  <p>
                    Final feliz: el principe llego a la torre y encontro a su princesa. Puedes
                    reemplazar este texto por tu mensaje final.
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {isFloorModalOpen && activeItem && (
                  <motion.div
                    className="timeline-floor-modal-backdrop"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.22, ease: "easeOut" }}
                    onClick={() => setIsFloorModalOpen(false)}
                  >
                    <motion.div
                      className="timeline-floor-modal"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby={`timeline-floor-title-${activeStep}`}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, y: 20, scale: 0.97, filter: "blur(2px)" }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 12, scale: 0.97, filter: "blur(2px)" }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.24,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="timeline-floor-modal-header">
                        <span className={`timeline-story-day ${activeStep === 0 ? "is-nature-day" : ""}`}>
                          Carta · Dia {activeStep + 1}
                        </span>
                        <button
                          type="button"
                          className="timeline-floor-modal-close"
                          onClick={() => setIsFloorModalOpen(false)}
                        >
                          Cerrar
                        </button>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.article
                          key={`story-modal-${activeStep}`}
                          className={`timeline-story-card ${activeStep === 0 ? "is-nature-card" : ""}`}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                          transition={{ duration: prefersReducedMotion ? 0.01 : 0.22, ease: "easeOut" }}
                        >
                          <h3 id={`timeline-floor-title-${activeStep}`}>{activeItem?.title}</h3>
                          <p className="timeline-story-date">{activeItem?.date}</p>
                          {activeItem?.photo ? (
                            <figure className="timeline-story-photo">
                              <img
                                src={activeItem.photo}
                                alt={`Recuerdo del dia ${activeStep + 1}`}
                                loading="lazy"
                                decoding="async"
                              />
                            </figure>
                          ) : null}
                          <p>{activeItem?.text}</p>
                          <div className="timeline-content-tags" aria-hidden="true">
                            <span>
                              <IconGlyph name="castle" />
                              Mansion
                            </span>
                            <span>
                              <IconGlyph name="heart" />
                              Romance
                            </span>
                            <span>
                              <IconGlyph name="spark" />
                              Recuerdo
                            </span>
                          </div>
                        </motion.article>
                      </AnimatePresence>

                      <div className="timeline-floor-modal-nav">
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => setIsFloorModalOpen(false)}
                        >
                          Cerrar carta
                        </button>
                        <button
                          type="button"
                          className="button"
                          onClick={() => {
                            if (journeyComplete) {
                              setIsFloorModalOpen(false);
                              return;
                            }
                            moveStep(1, true);
                          }}
                          disabled={journeyComplete}
                        >
                          {journeyComplete ? "Final del recorrido" : "Cerrar y caminar al siguiente cuarto"}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
