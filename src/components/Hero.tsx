import type { SectionMenuItem } from "../data/content";

type HeroProps = {
  herNick: string;
  youNick: string;
  coverPhoto: string;
  onOpenSection: (id: SectionMenuItem["id"]) => void;
};

export default function Hero({ herNick, youNick, coverPhoto, onOpenSection }: HeroProps) {
  return (
    <section className="section hero" id="inicio">
      <div className="hero-content">
        <span className="eyebrow">Para mi {herNick}</span>
        <h1 className="hero-title">San Valentín contigo</h1>
        <p className="hero-subtitle">
          Una carta, un álbum y un rompecabezas con gatitos, arte y ternura, creados por {youNick},
          solo para ti.
        </p>
        <div className="hero-actions">
          <button className="button" type="button" onClick={() => onOpenSection("letter")}>
            Abrir la carta
          </button>
          <button className="button alt" type="button" onClick={() => onOpenSection("gallery")}>
            Ver galería
          </button>
          <button className="button ghost" type="button" onClick={() => onOpenSection("music")}>
            Escuchar música
          </button>
          <button className="button ghost" type="button" onClick={() => onOpenSection("puzzle")}>
            Ir al rompecabezas
          </button>
        </div>
        <div className="hero-tags">
          <span>Gatitos chibi</span>
          <span>Arte moderno</span>
          <span>Arte clásico</span>
          <span>Dibujo</span>
          <span>Rompecabezas</span>
        </div>
        <div className="signature">Con amor, {youNick}</div>
      </div>
      <div className="hero-photo">
        <div className="photo-frame">
          <img src={coverPhoto} alt="Nuestra foto" />
          <div className="photo-stamp">A + A</div>
        </div>
        <p className="photo-note">Eres mi lugar favorito.</p>
      </div>
    </section>
  );
}
