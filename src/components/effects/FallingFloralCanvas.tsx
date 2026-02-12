import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type FloralKind = "petal" | "flower" | "heart";

type FloralParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  opacity: number;
  phase: number;
  kind: FloralKind;
  colorA: string;
  colorB: string;
};

type FallingFloralCanvasProps = {
  density?: number;
  className?: string;
  active?: boolean;
  fit?: "parent" | "viewport";
};

type SpawnOptions = {
  fromTop?: boolean;
};

type FloralPalette = {
  petal: string;
  flower: string;
  center: string;
  heart: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function spawnParticle(
  width: number,
  height: number,
  palette: FloralPalette[],
  options: SpawnOptions = {}
): FloralParticle {
  const fromTop = options.fromTop ?? true;
  const branchZones: [number, number][] = [
    [0.02, 0.29],
    [0.2, 0.46],
    [0.4, 0.63],
    [0.58, 0.82],
    [0.76, 0.98]
  ];
  const zone = branchZones[Math.floor(rand(0, branchZones.length))];
  const x = Math.random() < 0.92 ? rand(width * zone[0], width * zone[1]) : rand(-20, width + 20);
  const y = fromTop ? rand(-height * 0.18, -14) : rand(-8, height + 24);
  const roll = Math.random();
  const kind: FloralKind = roll < 0.3 ? "petal" : roll < 0.88 ? "flower" : "heart";
  const colors = palette[Math.floor(rand(0, palette.length))];
  const size = kind === "flower" ? rand(12, 22) : kind === "heart" ? rand(9, 16) : rand(12, 20);

  return {
    x,
    y,
    vx: rand(-0.38, 0.44),
    vy: rand(0.58, 0.98),
    size,
    rot: rand(-1.1, 1.1),
    vrot: rand(-0.016, 0.016),
    opacity: rand(0.3, 0.78),
    phase: rand(0, Math.PI * 2),
    kind,
    colorA: kind === "heart" ? colors.heart : kind === "flower" ? colors.flower : colors.petal,
    colorB: colors.center
  };
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: FloralParticle,
  heartPath: Path2D
) {
  const { x, y, rot, opacity, size, colorA, colorB, kind } = particle;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(size, size);
  ctx.globalAlpha = opacity;

  if (kind === "heart") {
    ctx.fillStyle = colorA;
    ctx.fill(heartPath);
    ctx.restore();
    return;
  }

  if (kind === "petal") {
    ctx.fillStyle = colorA;
    ctx.beginPath();
    ctx.moveTo(0, 0.04);
    ctx.bezierCurveTo(0.42, 0.24, 0.34, 0.82, 0, 1.04);
    ctx.bezierCurveTo(-0.34, 0.82, -0.42, 0.24, 0, 0.04);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 246, 252, 0.42)";
    ctx.ellipse(0.08, 0.34, 0.1, 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  for (let index = 0; index < 6; index += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * index) / 6);
    ctx.fillStyle = colorA;
    ctx.beginPath();
    ctx.ellipse(0, 0.52, 0.33, 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (let index = 0; index < 6; index += 1) {
    ctx.save();
    ctx.rotate(((Math.PI * 2 * index) / 6) + 0.52);
    ctx.fillStyle = "rgba(255, 232, 243, 0.52)";
    ctx.beginPath();
    ctx.ellipse(0, 0.34, 0.2, 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.fillStyle = colorB;
  ctx.arc(0, 0.06, 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 250, 224, 0.76)";
  ctx.arc(0.02, 0.06, 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function FallingFloralCanvas({
  density = 44,
  className = "",
  active = true,
  fit = "parent"
}: FallingFloralCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const delayedResizeRef = useRef<number | null>(null);
  const scrollIdleRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const particlesRef = useRef<FloralParticle[]>([]);
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

    const palette: FloralPalette[] = [
      {
        petal: "rgba(255, 206, 227, 0.82)",
        flower: "rgba(255, 176, 213, 0.76)",
        center: "rgba(255, 239, 202, 0.86)",
        heart: "rgba(223, 76, 138, 0.82)"
      },
      {
        petal: "rgba(255, 229, 236, 0.78)",
        flower: "rgba(255, 198, 222, 0.72)",
        center: "rgba(255, 246, 218, 0.82)",
        heart: "rgba(233, 118, 167, 0.74)"
      },
      {
        petal: "rgba(249, 179, 209, 0.78)",
        flower: "rgba(236, 149, 189, 0.7)",
        center: "rgba(255, 235, 189, 0.82)",
        heart: "rgba(201, 56, 118, 0.82)"
      }
    ];

    const heartPath = new Path2D();
    heartPath.moveTo(0, 0.22);
    heartPath.bezierCurveTo(0, -0.04, -0.5, -0.04, -0.5, 0.22);
    heartPath.bezierCurveTo(-0.5, 0.6, 0, 0.8, 0, 1);
    heartPath.bezierCurveTo(0, 0.8, 0.5, 0.6, 0.5, 0.22);
    heartPath.bezierCurveTo(0.5, -0.04, 0, -0.04, 0, 0.22);
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
      const dpr = clamp(window.devicePixelRatio || 1, 1, 1.9);
      const { width, height } = getCanvasBounds();
      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const densityFactor = width < 640 ? 0.58 : width < 980 ? 0.76 : 1;
      const targetCount = clamp(Math.round(density * densityFactor), 16, 56);
      particlesRef.current = Array.from({ length: targetCount }, () =>
        spawnParticle(width, height, palette, { fromTop: false })
      );
    };

    const renderFrame = (time: number) => {
      const { width, height } = sizeRef.current;
      if (width < 2 || height < 2) return;
      const prevTime = lastTimeRef.current || time;
      const dt = clamp((time - prevTime) / 16.67, 0.6, 2.2);
      lastTimeRef.current = time;
      const drawStride = isScrollingRef.current ? 2 : 1;
      const wobbleTime = time * 0.0014;

      ctx.clearRect(0, 0, width, height);

      for (let index = 0; index < particlesRef.current.length; index += 1) {
        const particle = particlesRef.current[index];
        const wobble = Math.sin(wobbleTime + particle.phase) * 0.2;
        particle.x += (particle.vx + wobble) * dt;
        particle.y += particle.vy * dt;
        particle.rot += particle.vrot * dt;

        if (particle.y - particle.size > height + 12 || particle.x < -60 || particle.x > width + 60) {
          particlesRef.current[index] = spawnParticle(width, height, palette, { fromTop: true });
          continue;
        }

        if (index % drawStride === 0) {
          drawParticle(ctx, particle, heartPath);
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
