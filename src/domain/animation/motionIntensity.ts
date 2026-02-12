export type MotionIntensity = "soft" | "normal" | "intense";

export const MOTION_INTENSITY_OPTIONS: Array<{ value: MotionIntensity; label: string }> = [
  { value: "soft", label: "Suave" },
  { value: "normal", label: "Normal" },
  { value: "intense", label: "Intenso" }
];

export const MOTION_INTENSITY_STORAGE_KEY = "san-valentin-motion-intensity";
