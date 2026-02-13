import type { ChangeEvent, SyntheticEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import LetterRoom from "./components/LetterRoom";
import MotionIntensityToggle from "./components/MotionIntensityToggle";
import MusicToggle from "./components/MusicToggle";
import SectionCarousel from "./components/SectionCarousel";
import SectionRoom from "./components/SectionRoom";
import SectionContent from "./components/sections/SectionContent";
import type { SectionMenuItem, Track } from "./data/content";
import {
  animationVariant,
  data,
  heartSpecs,
  musicCovers,
  musicTracks,
  sectionMenu,
  starSpecs
} from "./data/content";
import type { MusicSectionProps } from "./components/sections/MusicSection";
import { shuffleList } from "./utils/collections";
import { getRouteLocation, parseLocationRoute } from "./application/navigation/hashRouting";
import {
  MOTION_INTENSITY_STORAGE_KEY,
  type MotionIntensity
} from "./domain/animation/motionIntensity";
import type { TopRouteId } from "./domain/navigation/routes";

type PlaylistTrack = Track & {
  id: string;
  cover: string;
  accentClass: string;
};

type SectionNavigationOptions = {
  syncRoute?: boolean;
  replaceRoute?: boolean;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [introOpen, setIntroOpen] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    Math.floor(Math.random() * musicTracks.length)
  );
  const [pendingPlay, setPendingPlay] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const [beat, setBeat] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frequencyBufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analysisFrameRef = useRef<number | null>(null);
  const publishAudioReactiveRef = useRef(false);
  const [sectionOpen, setSectionOpen] = useState<SectionMenuItem["id"] | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [activeTopRoute, setActiveTopRoute] = useState<TopRouteId>(() => {
    if (typeof window === "undefined") return "inicio";
    const parsed = parseLocationRoute(window.location.pathname, window.location.hash);
    if (!parsed) return "inicio";
    if (parsed.type === "section") return parsed.sectionId;
    return parsed.type;
  });
  const [carouselMotion, setCarouselMotion] = useState<"next" | "prev" | null>(null);
  const [carouselAnimating, setCarouselAnimating] = useState(false);
  const [roomMotion, setRoomMotion] = useState<"next" | "prev" | null>(null);
  const [roomAnimating, setRoomAnimating] = useState(false);
  const motionTimersRef = useRef<number[]>([]);
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensity>(() => {
    const isWindowsRuntime =
      typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("windows");
    const fallback = animationVariant === "suave" || isWindowsRuntime ? "soft" : "normal";
    if (typeof window === "undefined") return fallback;
    const stored = window.localStorage.getItem(MOTION_INTENSITY_STORAGE_KEY);
    if (stored === "soft" || stored === "normal" || stored === "intense") return stored;
    return fallback;
  });

  const trackList = useMemo<PlaylistTrack[]>(() => {
    const accents = [
      "accent-rose",
      "accent-wine",
      "accent-gold",
      "accent-berry",
      "accent-ink",
      "accent-blush"
    ];
    return musicTracks.map((track, index) => ({
      ...track,
      id: `track-${index}`,
      cover: musicCovers[index] ?? musicCovers[index % musicCovers.length],
      accentClass: accents[index % accents.length]
    }));
  }, []);

  const playlist = useMemo(() => shuffleList(trackList), [trackList, shuffleSeed]);
  const currentTrack = playlist[currentIndex] ?? playlist[0];
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeTime = Number.isFinite(currentTime) ? currentTime : 0;
  const activeSectionMeta = sectionMenu[sectionIndex] ?? sectionMenu[0]!;
  const activeSection = activeSectionMeta.id;
  const activeIndex = sectionIndex;

  useEffect(() => {
    document.body.classList.toggle("intro-lock", !introHidden);
    return () => document.body.classList.remove("intro-lock");
  }, [introHidden]);

  useEffect(() => {
    const classByIntensity: Record<MotionIntensity, string> = {
      soft: "motion-soft",
      normal: "motion-normal",
      intense: "motion-impact"
    };
    const motionClass = classByIntensity[motionIntensity];
    document.body.classList.remove("motion-soft", "motion-normal", "motion-impact");
    document.body.classList.add(motionClass);
    window.localStorage.setItem(MOTION_INTENSITY_STORAGE_KEY, motionIntensity);

    return () => {
      document.body.classList.remove("motion-soft", "motion-normal", "motion-impact");
    };
  }, [motionIntensity]);

  useEffect(() => {
    document.body.classList.toggle("modal-lock", Boolean(letterOpen || sectionOpen));
    return () => document.body.classList.remove("modal-lock");
  }, [letterOpen, sectionOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      motionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      motionTimersRef.current = [];
    };
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (analysisFrameRef.current !== null) {
      window.cancelAnimationFrame(analysisFrameRef.current);
      analysisFrameRef.current = null;
    }
  }, []);

  const updateAudioAnalysis = useCallback(() => {
    const analyser = analyserRef.current;
    const buffer = frequencyBufferRef.current;
    if (!analyser || !buffer) {
      analysisFrameRef.current = null;
      return;
    }

    analyser.getByteFrequencyData(buffer);
    const bucketCount = 5;
    const usableBins = Math.max(20, Math.floor(buffer.length * 0.68));
    const nextLevels = Array.from({ length: bucketCount }, (_, bucketIndex) => {
      const start = Math.floor((bucketIndex * usableBins) / bucketCount);
      const end = Math.max(start + 1, Math.floor(((bucketIndex + 1) * usableBins) / bucketCount));
      let sum = 0;
      for (let bin = start; bin < end; bin += 1) {
        sum += buffer[bin] ?? 0;
      }
      const average = sum / (end - start);
      return Math.min(1, Math.max(0, average / 255));
    });

    if (publishAudioReactiveRef.current) {
      setAudioLevels(nextLevels);
      setBeat(Math.max(...nextLevels));
    }
    analysisFrameRef.current = window.requestAnimationFrame(updateAudioAnalysis);
  }, []);

  const startAudioAnalysis = useCallback(() => {
    if (!publishAudioReactiveRef.current) return;
    if (analysisFrameRef.current !== null) return;
    updateAudioAnalysis();
  }, [updateAudioAnalysis]);

  useEffect(() => {
    const shouldPublish = sectionOpen === "music" || sectionOpen === "timeline";
    publishAudioReactiveRef.current = shouldPublish;

    if (!shouldPublish) {
      stopAudioAnalysis();
      setAudioLevels([0, 0, 0, 0, 0]);
      setBeat(0);
      return;
    }

    if (musicOn) {
      startAudioAnalysis();
    }
  }, [sectionOpen, musicOn, startAudioAnalysis, stopAudioAnalysis]);

  const ensureAudioGraph = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || typeof window === "undefined") return false;

    const audioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!audioContextConstructor) return false;

    if (!audioContextRef.current) {
      const context = new audioContextConstructor();
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;

      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);

      context.onstatechange = () => {
        if (context.state !== "suspended") return;
        const currentAudio = audioRef.current;
        if (!currentAudio || currentAudio.paused || currentAudio.ended) return;
        void context.resume().catch(() => {});
      };

      audioContextRef.current = context;
      analyserRef.current = analyser;
      mediaSourceRef.current = source;
      frequencyBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return true;
  }, []);

  const attemptResumePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused || audio.ended) return;

    void ensureAudioGraph()
      .then(() => audio.play())
      .then(() => {
        setMusicOn(true);
        startAudioAnalysis();
      })
      .catch(() => {});
  }, [ensureAudioGraph, startAudioAnalysis]);

  useEffect(() => {
    return () => {
      stopAudioAnalysis();
      const context = audioContextRef.current;
      if (context) {
        context.onstatechange = null;
        void context.close();
      }
      audioContextRef.current = null;
      analyserRef.current = null;
      mediaSourceRef.current = null;
      frequencyBufferRef.current = null;
    };
  }, [stopAudioAnalysis]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!pendingPlay) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    void ensureAudioGraph().catch(() => {});
    audio
      .play()
      .then(() => {
        setMusicOn(true);
        startAudioAnalysis();
      })
      .catch(() => {
        setMusicOn(false);
      });
    setPendingPlay(false);
  }, [pendingPlay, currentIndex, playlist, ensureAudioGraph, startAudioAnalysis]);

  useEffect(() => {
    const handleRestorePlayback = () => {
      if (document.visibilityState === "hidden") return;
      attemptResumePlayback();
    };

    document.addEventListener("visibilitychange", handleRestorePlayback);
    window.addEventListener("focus", handleRestorePlayback);
    window.addEventListener("pageshow", handleRestorePlayback);
    window.addEventListener("pointerdown", handleRestorePlayback, { passive: true });
    window.addEventListener("keydown", handleRestorePlayback);

    return () => {
      document.removeEventListener("visibilitychange", handleRestorePlayback);
      window.removeEventListener("focus", handleRestorePlayback);
      window.removeEventListener("pageshow", handleRestorePlayback);
      window.removeEventListener("pointerdown", handleRestorePlayback);
      window.removeEventListener("keydown", handleRestorePlayback);
    };
  }, [attemptResumePlayback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicOn) return;

    let lastTime = audio.currentTime;
    let stalledChecks = 0;
    const watchdog = window.setInterval(() => {
      const currentAudio = audioRef.current;
      if (!currentAudio || currentAudio.paused || currentAudio.ended) {
        stalledChecks = 0;
        return;
      }

      const currentPosition = currentAudio.currentTime;
      if (Math.abs(currentPosition - lastTime) > 0.05) {
        lastTime = currentPosition;
        stalledChecks = 0;
        return;
      }

      stalledChecks += 1;
      if (stalledChecks >= 3) {
        stalledChecks = 0;
        attemptResumePlayback();
      }
    }, 2000);

    return () => window.clearInterval(watchdog);
  }, [musicOn, currentIndex, attemptResumePlayback]);

  useEffect(() => {
    if (!playlist.length) return;
    if (currentIndex >= playlist.length) {
      setCurrentIndex(0);
    }
  }, [playlist, currentIndex]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex]);

  const scheduleMotion = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    motionTimersRef.current.push(timer);
  };

  const scrollToAnchor = useCallback((id: "inicio" | "secciones") => {
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  const navigateToRoute = useCallback(
    (routeId: TopRouteId, replace = false) => {
      const nextRoute = getRouteLocation(routeId);
      if (location.pathname === nextRoute.pathname && location.hash === nextRoute.hash) return;
      navigate(nextRoute, { replace });
    },
    [location.hash, location.pathname, navigate]
  );

  const handleCarouselShift = (direction: number) => {
    if (carouselAnimating) return;
    setCarouselAnimating(true);
    setCarouselMotion(direction > 0 ? "next" : "prev");
    scheduleMotion(() => {
      setSectionIndex((prev) => (prev + direction + sectionMenu.length) % sectionMenu.length);
    }, 160);
    scheduleMotion(() => {
      setCarouselAnimating(false);
      setCarouselMotion(null);
    }, 420);
  };

  const openSection = useCallback(
    (id: SectionMenuItem["id"], options: SectionNavigationOptions = {}) => {
      const index = sectionMenu.findIndex((item) => item.id === id);
      if (index === -1) return;
      setSectionIndex(index);
      setSectionOpen(id);
      setActiveTopRoute(id);
      if (options.syncRoute !== false) {
        navigateToRoute(id, options.replaceRoute);
      }
    },
    [navigateToRoute]
  );

  const closeSection = useCallback((options: SectionNavigationOptions = {}) => {
    setSectionOpen(null);
    setActiveTopRoute("secciones");
    if (options.syncRoute !== false) {
      navigateToRoute("secciones", options.replaceRoute);
    }
  }, [navigateToRoute]);

  useEffect(() => {
    if (!introHidden) return;

    const parsed = parseLocationRoute(location.pathname, location.hash);
    if (!parsed) return;

    if (parsed.type === "inicio") {
      setLetterOpen(false);
      closeSection({ syncRoute: false });
      setActiveTopRoute("inicio");
      scrollToAnchor("inicio");
      return;
    }

    if (parsed.type === "secciones") {
      setLetterOpen(false);
      closeSection({ syncRoute: false });
      setActiveTopRoute("secciones");
      scrollToAnchor("secciones");
      return;
    }

    setLetterOpen(false);
    if (parsed.type === "section") {
      openSection(parsed.sectionId, { syncRoute: false });
    }
  }, [introHidden, closeSection, openSection, scrollToAnchor, location.hash, location.pathname]);

  const shiftSection = (direction: number) => {
    if (roomAnimating) return;
    setRoomAnimating(true);
    setRoomMotion(direction > 0 ? "next" : "prev");
    scheduleMotion(() => {
      const nextIndex = (sectionIndex + direction + sectionMenu.length) % sectionMenu.length;
      const nextSectionId = sectionMenu[nextIndex].id;
      setSectionIndex(nextIndex);
      setSectionOpen(nextSectionId);
      setActiveTopRoute(nextSectionId);
      navigateToRoute(nextSectionId);
    }, 160);
    scheduleMotion(() => {
      setRoomAnimating(false);
      setRoomMotion(null);
    }, 420);
  };

  const requestPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    void ensureAudioGraph().catch(() => {});
    audio
      .play()
      .then(() => {
        setMusicOn(true);
        startAudioAnalysis();
      })
      .catch(() => {
        setMusicOn(false);
      });
  };

  const handleIntro = () => {
    setIntroOpen(true);
    const totalDurationMs = 11000;
    requestPlay();
    window.setTimeout(() => {
      setIntroHidden(true);
      setActiveTopRoute("inicio");
      navigateToRoute("inicio", true);
      scrollToAnchor("inicio");
    }, totalDurationMs);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void ensureAudioGraph().catch(() => {});
      audio
        .play()
        .then(() => {
          setMusicOn(true);
          startAudioAnalysis();
        })
        .catch(() => {
          setMusicOn(false);
        });
    } else {
      audio.pause();
      setMusicOn(false);
      setBeat(0);
      stopAudioAnalysis();
    }
  };

  const handleSelectTrack = (index: number) => {
    setCurrentIndex(index);
    setPendingPlay(true);
  };

  const handlePrev = () => {
    if (!playlist.length) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setPendingPlay(true);
  };

  const handleNext = () => {
    if (!playlist.length) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setPendingPlay(true);
  };

  const remixPlaylist = () => {
    setShuffleSeed((seed) => seed + 1);
    setCurrentIndex(0);
    setPendingPlay(true);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(event.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
    setDuration(event.currentTarget.duration || 0);
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const openLetterRoom = () => {
    setLetterOpen(true);
    setActiveTopRoute("letter");
    navigateToRoute("letter", true);
  };

  const closeLetterRoom = () => {
    setLetterOpen(false);
  };

  const backToStartFromLetter = () => {
    closeLetterRoom();
    closeSection({ syncRoute: false });
    setActiveTopRoute("inicio");
    navigateToRoute("inicio");
    scrollToAnchor("inicio");
  };

  const handleTopRouteNavigate = (routeId: TopRouteId) => {
    if (routeId === "inicio") {
      setLetterOpen(false);
      closeSection({ syncRoute: false });
      setActiveTopRoute("inicio");
      navigateToRoute("inicio");
      scrollToAnchor("inicio");
      return;
    }

    if (routeId === "secciones") {
      setLetterOpen(false);
      closeSection({ syncRoute: false });
      setActiveTopRoute("secciones");
      navigateToRoute("secciones");
      scrollToAnchor("secciones");
      return;
    }

    setLetterOpen(false);
    openSection(routeId);
  };

  const musicProps: MusicSectionProps = {
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
    onPrev: handlePrev,
    onNext: handleNext,
    onToggle: toggleMusic,
    onRemix: remixPlaylist,
    onSelectTrack: handleSelectTrack,
    onSeek: handleSeek,
    onVolumeChange: setVolume
  };

  return (
    <>
      <Intro
        hidden={introHidden}
        ready={introReady}
        open={introOpen}
        onOpen={handleIntro}
        coverPhoto={data.coverPhoto}
        introReel={data.introReel}
        heartSpecs={heartSpecs}
        starSpecs={starSpecs}
        herNick={data.herNick}
      />
      {introHidden && (
        <MotionIntensityToggle value={motionIntensity} onChange={setMotionIntensity} />
      )}

      <div
        className={`page ${introHidden ? "page-reveal" : "page-hidden"} ${
          letterOpen || sectionOpen ? "page-letter-hidden" : ""
        }`}
      >
        <audio
          ref={audioRef}
          src={currentTrack ? currentTrack.src : ""}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNext}
          onPlay={() => {
            setMusicOn(true);
            void ensureAudioGraph()
              .then(() => startAudioAnalysis())
              .catch(() => {});
          }}
          onPause={() => {
            setMusicOn(false);
            setBeat(0);
            stopAudioAnalysis();
          }}
          onWaiting={attemptResumePlayback}
          onStalled={attemptResumePlayback}
          onError={() => {
            setMusicOn(false);
            setBeat(0);
            stopAudioAnalysis();
            handleNext();
          }}
        />
        <MusicToggle musicOn={musicOn} currentTrack={currentTrack} onToggle={toggleMusic} />
        <Hero
          herNick={data.herNick}
          youNick={data.youNick}
          coverPhoto={data.coverPhoto}
          onOpenSection={openSection}
        />

        <SectionCarousel
          sectionMenu={sectionMenu}
          sectionIndex={sectionIndex}
          activeSection={activeSection}
          activeIndex={activeIndex}
          carouselAnimating={carouselAnimating}
          carouselMotion={carouselMotion}
          onShift={handleCarouselShift}
          onOpenSection={openSection}
        />

        <div className="footer">Hecho con amor por {data.youNick} para su {data.herNick}.</div>
      </div>

      <SectionRoom
        open={sectionOpen}
        activeMeta={activeSectionMeta}
        roomAnimating={roomAnimating}
        roomMotion={roomMotion}
        onShift={shiftSection}
        onClose={closeSection}
      >
        <SectionContent
          sectionId={sectionOpen}
          timeline={data.timeline}
          timelineAudioLevels={audioLevels}
          timelineBeat={beat}
          timelineMusicOn={musicOn}
          timelineMotionIntensity={motionIntensity}
          gallery={data.gallery}
          puzzleImages={data.puzzleImages}
          secretMessage={data.secretMessage}
          onOpenLetter={openLetterRoom}
          musicProps={musicProps}
        />
      </SectionRoom>

      <LetterRoom
        open={letterOpen}
        herNick={data.herNick}
        message={data.letterLines.join("\n")}
        letterPhoto={data.letterPhoto}
        letterPhotoCaption={data.letterPhotoCaption}
        onBackToStart={backToStartFromLetter}
      />
    </>
  );
}
