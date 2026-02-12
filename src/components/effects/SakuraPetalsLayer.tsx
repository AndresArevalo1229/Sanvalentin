import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { asset } from "../../utils/assets";

type SakuraPetalsLayerProps = {
  className?: string;
  active?: boolean;
  density?: number;
  fit?: "parent" | "viewport";
};

type PetalParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  opacity: number;
  phase: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function spawnPetal(width: number, height: number, fromTop = true): PetalParticle {
  return {
    x: rand(-24, width + 24),
    y: fromTop ? rand(-height * 0.26, -20) : rand(-14, height + 20),
    vx: rand(-0.34, 0.34),
    vy: rand(0.72, 1.38),
    size: rand(14, 32),
    rot: rand(0, Math.PI * 2),
    vrot: rand(-0.018, 0.018),
    opacity: rand(0.62, 0.98),
    phase: rand(0, Math.PI * 2)
  };
}

export default function SakuraPetalsLayer({
  className = "",
  active = true,
  density = 36,
  fit = "viewport"
}: SakuraPetalsLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<PetalParticle[]>([]);
  const sizeRef = useRef({ width: 1, height: 1 });
  const lastTimeRef = useRef(0);
  const runningRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const petalImage = new Image();
    let petalLoaded = false;
    petalImage.onload = () => {
      petalLoaded = true;
    };
    petalImage.src = asset("fx/sakura-petal.svg");

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

      const densityFactor = width < 640 ? 0.66 : width < 980 ? 0.82 : 1;
      const count = clamp(Math.round(density * densityFactor), 18, 70);
      particlesRef.current = Array.from({ length: count }, () => spawnPetal(width, height, false));
    };

    const drawFallbackPetal = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.4);
      ctx.bezierCurveTo(size * 0.32, -size * 0.22, size * 0.26, size * 0.4, 0, size * 0.52);
      ctx.bezierCurveTo(-size * 0.26, size * 0.4, -size * 0.32, -size * 0.22, 0, -size * 0.4);
      ctx.closePath();
      ctx.fillStyle = "rgba(248, 170, 206, 0.94)";
      ctx.fill();
    };

    const renderFrame = (time: number) => {
      const { width, height } = sizeRef.current;
      if (width < 2 || height < 2) return;

      const prevTime = lastTimeRef.current || time;
      const dt = clamp((time - prevTime) / 16.67, 0.6, 2.4);
      lastTimeRef.current = time;
      const swayTime = time * 0.0014;

      ctx.clearRect(0, 0, width, height);

      for (let index = 0; index < particlesRef.current.length; index += 1) {
        const petal = particlesRef.current[index];
        const drift = Math.sin(swayTime + petal.phase) * 0.28;
        petal.x += (petal.vx + drift) * dt;
        petal.y += petal.vy * dt;
        petal.rot += petal.vrot * dt;

        if (petal.y - petal.size > height + 14 || petal.x < -70 || petal.x > width + 70) {
          particlesRef.current[index] = spawnPetal(width, height, true);
          continue;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rot);
        ctx.globalAlpha = petal.opacity;

        if (petalLoaded) {
          const drawWidth = petal.size;
          const drawHeight = petal.size * 1.22;
          ctx.drawImage(petalImage, -drawWidth * 0.5, -drawHeight * 0.5, drawWidth, drawHeight);
        } else {
          drawFallbackPetal(petal.size * 0.56);
        }

        ctx.restore();
      }
    };

    const tick = (time: number) => {
      if (!runningRef.current) return;
      renderFrame(time);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      runningRef.current = false;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const start = () => {
      if (runningRef.current || document.hidden) return;
      runningRef.current = true;
      lastTimeRef.current = 0;
      renderFrame(performance.now());
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const handleResume = () => {
      if (!active || document.hidden) {
        stop();
        return;
      }
      resize();
      start();
    };

    resize();
    start();

    const resizeObserver = fit === "parent" ? new ResizeObserver(() => {
      resize();
    }) : null;

    if (resizeObserver && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("focus", handleResume);
    window.addEventListener("pageshow", handleResume);
    document.addEventListener("visibilitychange", handleResume);

    return () => {
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("pageshow", handleResume);
      document.removeEventListener("visibilitychange", handleResume);
    };
  }, [active, density, fit, reducedMotion]);

  if (reducedMotion || !active) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
