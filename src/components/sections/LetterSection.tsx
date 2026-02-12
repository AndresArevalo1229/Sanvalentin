import IconGlyph, { type GlyphName } from "../ui/IconGlyph";

type LetterSectionProps = {
  onOpen: () => void;
};

const letterVibeTags: Array<{ label: string; icon: GlyphName }> = [
  { label: "Gatos de castillo", icon: "cat" },
  { label: "Arte medieval", icon: "castle" },
  { label: "Princesa y pergamino", icon: "crown" },
  { label: "Baladas para dibujar", icon: "note" },
  { label: "Brillos dorados", icon: "spark" },
  { label: "San Valentin eterno", icon: "heart" }
];

const letterDoodles: GlyphName[] = [
  "moon",
  "spark",
  "cat",
  "flower",
  "ribbon",
  "heart",
  "crown"
];
const letterOrbitIcons: GlyphName[] = [
  "cat",
  "paw",
  "crown",
  "castle",
  "heart",
  "moon",
  "letter",
  "note"
];
const letterAccentIcons: GlyphName[] = ["spark", "heart", "flower", "spark", "paw"];
const letterCourtline: Array<{ label: string; icon: GlyphName }> = [
  { label: "Musica de torre", icon: "note" },
  { label: "Taller de arte", icon: "palette" },
  { label: "Gatitos nobles", icon: "cat" }
];

export default function LetterSection({ onOpen }: LetterSectionProps) {
  return (
    <section className="section detail-section letter-section" id="letter">
      <span className="letter-curtain letter-curtain-left" aria-hidden="true" />
      <span className="letter-curtain letter-curtain-right" aria-hidden="true" />
      <span className="letter-shimmer" aria-hidden="true" />
      <div className="section-head">
        <span className="letter-kicker">Edicion especial de San Valentin</span>
        <h2>La carta del castillo</h2>
        <p>Un rincon medieval con gatos, arte y una vibra de princesa para invitarte a nuestra historia.</p>
      </div>
      <div className="letter-vibes">
        {letterVibeTags.map((tag) => (
          <span key={tag.label}>
            <IconGlyph name={tag.icon} />
            {tag.label}
          </span>
        ))}
      </div>
      <div className="letter-royal-bar" aria-hidden="true">
        <span className="letter-royal-mark">
          <IconGlyph name="crown" />
        </span>
        <span>Salon real de gatitos y baladas romanticas</span>
        <span className="letter-royal-mark">
          <IconGlyph name="crown" />
        </span>
      </div>
      <button className="letter-launcher" type="button" onClick={onOpen} aria-label="Entrar a la carta">
        <span className="letter-launcher-glow" aria-hidden="true" />
        <span className="letter-launcher-orbit" aria-hidden="true">
          {letterOrbitIcons.map((icon, index) => (
            <span
              key={`orbit-${icon}-${index}`}
              className={`letter-orbit-item letter-orbit-item-${index + 1}`}
            >
              <IconGlyph name={icon} />
            </span>
          ))}
        </span>
        <span className="letter-launcher-envelope" aria-hidden="true">
          <span className="letter-launcher-back" />
          <span className="letter-launcher-fold" />
          <span className="letter-launcher-parchment">
            <span className="letter-parchment-title">Baile bajo la luna</span>
            <span className="letter-parchment-line" />
            <span className="letter-parchment-line" />
            <span className="letter-parchment-line short" />
          </span>
          <span className="letter-launcher-seal">
            <IconGlyph name="cat" />
            <small>A + A</small>
          </span>
        </span>
        <span className="letter-launcher-title">Abrir pergamino real</span>
        <span className="letter-launcher-caption">Tap para abrir la carta con sorpresa gatuna</span>
      </button>
      <div className="letter-courtline" aria-hidden="true">
        {letterCourtline.map((item) => (
          <span key={item.label}>
            <IconGlyph name={item.icon} />
            {item.label}
          </span>
        ))}
      </div>
      <p className="letter-note">
        Pista: al abrirla, la musica y los gatitos del reino prepararon un detalle solo para ti.
      </p>
      <div className="letter-accents" aria-hidden="true">
        {letterAccentIcons.map((icon, index) => (
          <span key={`accent-${icon}-${index}`} className={`letter-accent letter-accent-${index + 1}`}>
            <IconGlyph name={icon} />
          </span>
        ))}
      </div>
      <div className="letter-doodles" aria-hidden="true">
        {letterDoodles.map((doodle) => (
          <span key={doodle}>
            <IconGlyph name={doodle} />
          </span>
        ))}
      </div>
    </section>
  );
}
