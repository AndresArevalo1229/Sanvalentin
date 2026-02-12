import type { CSSProperties } from "react";
import type { GalleryPhoto } from "../../data/content";
import IconGlyph, { type GlyphName } from "../ui/IconGlyph";

type GallerySectionProps = {
  gallery: GalleryPhoto[];
};

const galleryStickers: GlyphName[] = ["cat", "palette", "spark", "chibi", "flower"];
const galleryVibes = ["Gatitos", "Arte", "Chibi", "Dibujo", "Amor"];
const galleryRibbonItems: Array<{ label: string; icon: GlyphName }> = [
  { label: "Gatitos", icon: "paw" },
  { label: "Moderno + clásico", icon: "frame" },
  { label: "Dibujo", icon: "brush" },
  { label: "Chibi", icon: "chibi" }
];

export default function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section className="section detail-section gallery-section" id="gallery">
      <div className="section-head">
        <h2>Galería</h2>
        <p>Un álbum de nuestros recuerdos con vibra artística y detalles tiernos.</p>
      </div>
      <div className="gallery-ribbon" aria-hidden="true">
        {galleryRibbonItems.map((item) => (
          <span key={item.label}>
            <IconGlyph name={item.icon} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="gallery">
        {gallery.map((photo, index) => (
          <figure
            key={`photo-${index}`}
            className={`polaroid polaroid-${index % 5}`}
            style={{ "--polaroid-delay": `${index * 0.08}s` } as CSSProperties}
          >
            <span className="polaroid-pin" aria-hidden="true">
              <IconGlyph name={galleryStickers[index % galleryStickers.length]} />
            </span>
            <img src={photo.src} alt={photo.caption} loading="lazy" decoding="async" />
            <figcaption>
              <span aria-hidden="true">{galleryVibes[index % galleryVibes.length]}</span>
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
