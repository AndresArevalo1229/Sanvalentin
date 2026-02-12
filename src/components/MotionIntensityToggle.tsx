import {
  MOTION_INTENSITY_OPTIONS,
  type MotionIntensity
} from "../domain/animation/motionIntensity";

type MotionIntensityToggleProps = {
  value: MotionIntensity;
  onChange: (value: MotionIntensity) => void;
};

export default function MotionIntensityToggle({ value, onChange }: MotionIntensityToggleProps) {
  return (
    <div className="motion-intensity-toggle" role="group" aria-label="Intensidad de animaciones">
      <span className="motion-intensity-label">Animacion</span>
      <div className="motion-intensity-options">
        {MOTION_INTENSITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`motion-intensity-btn ${value === option.value ? "active" : ""}`}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
