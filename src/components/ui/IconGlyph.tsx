import type { SVGProps } from "react";

export type GlyphName =
  | "letter"
  | "timeline"
  | "music"
  | "gallery"
  | "puzzle"
  | "cat"
  | "paw"
  | "spark"
  | "clock"
  | "palette"
  | "brush"
  | "note"
  | "headphones"
  | "frame"
  | "camera"
  | "lens"
  | "chibi"
  | "flower"
  | "ribbon"
  | "crown"
  | "castle"
  | "moon"
  | "heart";

type IconGlyphProps = {
  name: GlyphName;
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "viewBox">;

export default function IconGlyph({ name, className = "", title, ...props }: IconGlyphProps) {
  const decorative = !title;

  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon-glyph icon-glyph-${name} ${className}`.trim()}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? "true" : undefined}
      {...(title ? { "aria-label": title } : {})}
      {...props}
    >
      {name === "letter" && (
        <g {...common}>
          <rect x="3.5" y="6" width="17" height="12" rx="2.2" />
          <path d="m4.8 7.4 7.2 5.4 7.2-5.4" />
        </g>
      )}
      {name === "timeline" && (
        <g {...common}>
          <path d="M7 4.5v3m10-3v3M5 9h14M6.2 7h11.6a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
          <path d="m8.5 13.5 2.2 2.2 4.8-4.8" />
        </g>
      )}
      {name === "music" && (
        <g {...common}>
          <path d="M10 6v10.5a2.5 2.5 0 1 1-1.7-2.4V8.2L17 6v8.3a2.5 2.5 0 1 1-1.7-2.4V7.1L10 8.5" />
        </g>
      )}
      {name === "gallery" && (
        <g {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2.2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m6.8 17 3.2-3.3 2.4 2.3 3.1-3.1 2.7 4.1" />
        </g>
      )}
      {name === "puzzle" && (
        <g {...common}>
          <path d="M10 4h3.2c.6 0 1 .4 1 1v1.1a1.8 1.8 0 1 0 2.6 1.6V7.1h1.2c.6 0 1 .4 1 1V11h-1.1a1.8 1.8 0 1 0 0 2.6H19v3.3c0 .6-.4 1-1 1h-3v-1a1.8 1.8 0 1 0-2.6 0v1h-3.3c-.6 0-1-.4-1-1V14h1a1.8 1.8 0 1 0 0-2.6h-1V5c0-.6.4-1 1-1Z" />
        </g>
      )}
      {name === "cat" && (
        <g {...common}>
          <path d="m6 8 2.6-3 2.1 2.2M18 8l-2.6-3-2.1 2.2" />
          <path d="M6 9.2a6 6 0 0 1 12 0v3.1a6 6 0 0 1-12 0Z" />
          <circle cx="9.7" cy="12.2" r=".8" fill="currentColor" stroke="none" />
          <circle cx="14.3" cy="12.2" r=".8" fill="currentColor" stroke="none" />
          <path d="M10.7 14.5c.8.8 1.8.8 2.6 0M6.8 12.8h-2m2 1.8h-2m19-1.8h-2m2 1.8h-2" />
        </g>
      )}
      {name === "paw" && (
        <g {...common}>
          <ellipse cx="12" cy="14.8" rx="4.2" ry="3" />
          <circle cx="7.2" cy="9.4" r="1.4" />
          <circle cx="10.3" cy="7.8" r="1.4" />
          <circle cx="13.7" cy="7.8" r="1.4" />
          <circle cx="16.8" cy="9.4" r="1.4" />
        </g>
      )}
      {name === "spark" && (
        <g {...common}>
          <path d="m12 4.5 1.7 4 4 1.7-4 1.7-1.7 4-1.7-4-4-1.7 4-1.7Zm6 8.5.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Zm-12 2 .8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8Z" />
        </g>
      )}
      {name === "clock" && (
        <g {...common}>
          <circle cx="12" cy="12" r="7.8" />
          <path d="M12 8.3v4.2l3 1.8" />
        </g>
      )}
      {name === "palette" && (
        <g {...common}>
          <path d="M12 4.2a7.8 7.8 0 1 0 0 15.6h1.3a2 2 0 0 0 0-4H12a1.7 1.7 0 1 1 0-3.4h4.1a3.7 3.7 0 0 0 0-7.4H12Z" />
          <circle cx="8.3" cy="9.2" r=".8" fill="currentColor" stroke="none" />
          <circle cx="11.1" cy="7.9" r=".8" fill="currentColor" stroke="none" />
          <circle cx="14.2" cy="8" r=".8" fill="currentColor" stroke="none" />
        </g>
      )}
      {name === "brush" && (
        <g {...common}>
          <path d="m14.5 5.5 4 4-7.8 7.8-4.6 1.1 1.1-4.6Z" />
          <path d="M7 18.4c-.6 1.4-2 1.8-3 1.8 1.2-.9 1.6-2.1 1.6-3.1" />
        </g>
      )}
      {name === "note" && (
        <g {...common}>
          <path d="M9.5 6.3v9a2.3 2.3 0 1 1-1.4-2.1V8.2l7-1.8v8a2.3 2.3 0 1 1-1.4-2.1V7.5Z" />
        </g>
      )}
      {name === "headphones" && (
        <g {...common}>
          <path d="M4.6 12a7.4 7.4 0 0 1 14.8 0v4.2a1.8 1.8 0 0 1-1.8 1.8h-.7a1 1 0 0 1-1-1v-4.2a1 1 0 0 1 1-1h2.5M4.6 11.8H7a1 1 0 0 1 1 1V17a1 1 0 0 1-1 1h-.7a1.8 1.8 0 0 1-1.8-1.8Z" />
        </g>
      )}
      {name === "frame" && (
        <g {...common}>
          <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="1.5" />
          <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1" />
        </g>
      )}
      {name === "camera" && (
        <g {...common}>
          <path d="M6.2 8.3h2.2l1.1-1.8h5l1.1 1.8h2.2c1 0 1.8.8 1.8 1.8v6.1c0 1-.8 1.8-1.8 1.8H6.2c-1 0-1.8-.8-1.8-1.8V10c0-1 .8-1.8 1.8-1.8Z" />
          <circle cx="12" cy="13.2" r="2.8" />
        </g>
      )}
      {name === "lens" && (
        <g {...common}>
          <circle cx="10.5" cy="10.5" r="5.4" />
          <path d="m14.5 14.5 4 4" />
        </g>
      )}
      {name === "chibi" && (
        <g {...common}>
          <circle cx="12" cy="11.8" r="6.2" />
          <circle cx="9.5" cy="10.8" r=".7" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="10.8" r=".7" fill="currentColor" stroke="none" />
          <path d="M9.8 13.5c1.2 1 3.2 1 4.4 0M6.7 6.8l1.6-1.6M17.3 6.8l-1.6-1.6" />
        </g>
      )}
      {name === "flower" && (
        <g {...common}>
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="8.1" r="2.1" />
          <circle cx="15.9" cy="12" r="2.1" />
          <circle cx="12" cy="15.9" r="2.1" />
          <circle cx="8.1" cy="12" r="2.1" />
        </g>
      )}
      {name === "ribbon" && (
        <g {...common}>
          <path d="M6 7h12M6 12h12M6 17h8" />
          <circle cx="17.2" cy="17.2" r="2.4" />
          <path d="m16.2 18.4.5 2 .5-2m1.2 0 .5 2 .5-2" />
        </g>
      )}
      {name === "crown" && (
        <g {...common}>
          <path d="M4.8 17.8h14.4l1-7.8-4.4 3-3.8-5-3.8 5-4.4-3Z" />
          <path d="M4.5 18.5h15" />
          <circle cx="12" cy="6.8" r=".9" fill="currentColor" stroke="none" />
        </g>
      )}
      {name === "castle" && (
        <g {...common}>
          <path d="M5 19V9h3V5h3v4h2V5h3v4h3v10Z" />
          <path d="M10 19v-4h4v4" />
          <path d="M5 9h14" />
        </g>
      )}
      {name === "moon" && (
        <g {...common}>
          <path d="M16.8 4.8a7.6 7.6 0 1 0 2.4 14.8 8 8 0 1 1-2.4-14.8Z" />
          <path d="m6.9 5.9.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8ZM18.6 9.4l.6 1.2 1.2.6-1.2.6-.6 1.2-.6-1.2-1.2-.6 1.2-.6Z" />
        </g>
      )}
      {name === "heart" && (
        <g {...common}>
          <path d="M12 20s-7-4.8-7-8.8a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 4-7 8.8-7 8.8Z" />
        </g>
      )}
    </svg>
  );
}
