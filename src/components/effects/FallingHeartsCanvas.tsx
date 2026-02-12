import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type HeartParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  opacity: number;
  color: string;
};

type FallingHeartsCanvasProps = {
  density?: number;
  className?: string;
  active?: boolean;
  fit?: "parent" | "viewport";
};

type SpawnOptions = {
  fromTop?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function drawHeart(
  ctx: CanvasRenderingContext2D,
  particle: HeartParticle,
  heartPath: Path2D
) {
  const { x, y, size, rot, color, opacity } = particle;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(size, size);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fill(heartPath);

  ctx.restore();
}

function spawnParticle(
  width: number,
  height: number,
  colors: string[],
  options: SpawnOptions = {}
): HeartParticle {
  const fromTop = options.fromTop ?? true;
  const spawnFromLeftCorner = Math.random() < 0.34;
  const x = spawnFromLeftCorner ? rand(width * 0.06, width * 0.28) : rand(-24, width + 24);
  const y = fromTop ? rand(-height * 0.24, -18) : rand(-12, height + 26);
  const size = rand(16, 34);
  return {
    x,
    y,
    vx: rand(-0.56, 0.66),
    vy: rand(0.76, 1.26),
    size,
    rot: rand(-0.9, 0.9),
    vrot: rand(-0.01, 0.01),
    opacity: rand(0.5, 0.92),
    color: colors[Math.floor(rand(0, colors.length))]
  };
}

export default function FallingHeartsCanvas({
  density = 64,
  className = "",
  active = true,
  fit = "parent"
}: FallingHeartsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const delayedResizeRef = useRef<number | null>(null);
  const scrollIdleRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const heartsRef = useRef<HeartParticle[]>([]);
  const sizeRef = useRef({ width: 1, height: 1 });
  const runningRef = useRef(false);
  const isScrollingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255, 247, 252, 0.94)",
      "rgba(255, 183, 215, 0.9)",
      "rgba(221, 69, 128, 0.9)"
    ];
    const heartPath = new Path2D();
    heartPath.moveTo(0, 0.26);
    heartPath.bezierCurveTo(0, 0, -0.5, 0, -0.5, 0.26);
    heartPath.bezierCurveTo(-0.5, 0.62, 0, 0.78, 0, 1);
    heartPath.bezierCurveTo(0, 0.78, 0.5, 0.62, 0.5, 0.26);
    heartPath.bezierCurveTo(0.5, 0, 0, 0, 0, 0.26);
    heartPath.closePath();

    const getCanvasBounds = () => {
      if (fit === "viewport") {
        return {
          width: Math.max(Math.round(window.innerWidth), 1),
          height: Math.max(Math.round(window.innerHeight), 1)
        };
      }
      const host = canvas.parentElement;
      const rect = host?.getBoundingClientRect();
      const width = Math.max(Math.round(rect?.width ?? window.innerWidth), 1);
      const height = Math.max(Math.round(rect?.height ?? window.innerHeight), 1);
      return { width, height };
    };

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const { width, height } = getCanvasBounds();
      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const densityFactor = width < 640 ? 0.62 : width < 980 ? 0.78 : 1;
      const targetCount = clamp(Math.round(density * densityFactor), 24, 74);
      heartsRef.current = Array.from({ length: targetCount }, () =>
        spawnParticle(width, height, colors, { fromTop: false })
      );
    };

    const renderFrame = (time: number) => {
      const { width, height } = sizeRef.current;
      if (width < 2 || height < 2) return;
      const prevTime = lastTimeRef.current || time;
      const dt = clamp((time - prevTime) / 16.67, 0.6, 2.2);
      lastTimeRef.current = time;
      const drawStride = isScrollingRef.current ? 2 : 1;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < heartsRef.current.length; i += 1) {
        const particle = heartsRef.current[i];
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.rot += particle.vrot * dt;

        if (particle.y - particle.size > height + 12 || particle.x < -60 || particle.x > width + 60) {
          heartsRef.current[i] = spawnParticle(width, height, colors, { fromTop: true });
          continue;
        }

        if (i % drawStride === 0) {
          drawHeart(ctx, particle, heartPath);
        }
      }
    };

    const tick = (time: number) => {
      if (!runningRef.current) return;
      renderFrame(time);

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      runningRef.current = false;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      if (runningRef.current || document.hidden) return;
      runningRef.current = true;
      lastTimeRef.current = 0;
      renderFrame(performance.now());
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const handleResume = () => {
      if (!active || document.hidden) {
        stopLoop();
        return;
      }
      resize();
      startLoop();
    };
    const markScrolling = () => {
      isScrollingRef.current = true;
      if (scrollIdleRef.current !== null) {
        window.clearTimeout(scrollIdleRef.current);
      }
      scrollIdleRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        scrollIdleRef.current = null;
      }, 140);
    };

    resize();
    startLoop();
    window.requestAnimationFrame(resize);
    delayedResizeRef.current = window.setTimeout(() => {
      delayedResizeRef.current = null;
      resize();
    }, 180);

    const resizeObserver = fit === "parent" ? new ResizeObserver(() => {
      resize();
    }) : null;
    if (resizeObserver && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("focus", handleResume);
    window.addEventListener("pageshow", handleResume);
    window.addEventListener("wheel", markScrolling, { passive: true });
    window.addEventListener("touchmove", markScrolling, { passive: true });
    document.addEventListener("scroll", markScrolling, { capture: true, passive: true });
    document.addEventListener("visibilitychange", handleResume);

    return () => {
      stopLoop();
      if (delayedResizeRef.current !== null) {
        window.clearTimeout(delayedResizeRef.current);
        delayedResizeRef.current = null;
      }
      if (scrollIdleRef.current !== null) {
        window.clearTimeout(scrollIdleRef.current);
        scrollIdleRef.current = null;
      }
      isScrollingRef.current = false;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("pageshow", handleResume);
      window.removeEventListener("wheel", markScrolling);
      window.removeEventListener("touchmove", markScrolling);
      document.removeEventListener("scroll", markScrolling, true);
      document.removeEventListener("visibilitychange", handleResume);
    };
  }, [active, density, fit, reducedMotion]);

  if (reducedMotion || !active) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
