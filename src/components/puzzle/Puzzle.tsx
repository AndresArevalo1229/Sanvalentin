import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { buildTiles, isSolved, shuffleTiles } from "../../utils/collections";
import IconGlyph, { type GlyphName } from "../ui/IconGlyph";

type PuzzleProps = {
  className?: string;
  images: string[];
  secretMessage: string;
};

const puzzleVibes: Array<{ label: string; icon: GlyphName }> = [
  { label: "Reto visual", icon: "puzzle" },
  { label: "Gatitos", icon: "paw" },
  { label: "Arte moderno", icon: "palette" },
  { label: "Chibi", icon: "chibi" }
];

export default function Puzzle({ className = "section", images, secretMessage }: PuzzleProps) {
  const [gridSize, setGridSize] = useState(20);
  const [puzzleImage, setPuzzleImage] = useState(images[0] ?? "");
  const [tiles, setTiles] = useState<number[]>(() => shuffleTiles(buildTiles(gridSize)));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [zoom, setZoom] = useState(1);

  const piecePercent = useMemo(() => 100 / (gridSize - 1), [gridSize]);

  const resetPuzzle = () => {
    setTiles(shuffleTiles(buildTiles(gridSize)));
    setSelectedIndex(null);
    setSolved(false);
  };

  const revealPuzzle = () => {
    setTiles(buildTiles(gridSize));
    setSelectedIndex(null);
    setSolved(true);
  };

  const handleTileClick = (index: number) => {
    if (solved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const next = [...tiles];
    [next[selectedIndex], next[index]] = [next[index], next[selectedIndex]];

    setTiles(next);
    setSelectedIndex(null);

    if (isSolved(next)) {
      setSolved(true);
    }
  };

  const handleSizeChange = (value: number) => {
    const nextSize = Number(value);
    setGridSize(nextSize);
    setTiles(shuffleTiles(buildTiles(nextSize)));
    setSelectedIndex(null);
    setSolved(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPuzzleImage(event.target.value);
    setTiles(shuffleTiles(buildTiles(gridSize)));
    setSelectedIndex(null);
    setSolved(false);
  };

  return (
    <section className={`${className} puzzle-section`} id="puzzle">
      <div className="section-head">
        <h2>Rompecabezas</h2>
        <p>Arma cada pieza para descubrir una sorpresa final con todo nuestro estilo.</p>
      </div>
      <div className="puzzle-vibes" aria-hidden="true">
        {puzzleVibes.map((vibe) => (
          <span key={vibe.label}>
            <IconGlyph name={vibe.icon} />
            {vibe.label}
          </span>
        ))}
      </div>
      <div className="puzzle-wrap">
        <div className="puzzle-panel">
          <div
            className="puzzle-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              transform: `scale(${zoom})`
            }}
          >
            {tiles.map((tileId, index) => {
              const row = Math.floor(tileId / gridSize);
              const col = tileId % gridSize;
              const style = {
                backgroundImage: `url(${puzzleImage})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `${col * piecePercent}% ${row * piecePercent}%`
              };

              return (
                <div
                  key={`tile-${index}`}
                  className={`tile ${selectedIndex === index ? "selected" : ""}`}
                  style={style}
                  onClick={() => handleTileClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleTileClick(index);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="puzzle-controls">
          <p>
            Instrucciones: toca una pieza y luego otra para intercambiarlas. Cuando todo quede en
            su lugar, aparecerá la sorpresa.
          </p>

          <div className="control-block">
            <label htmlFor="puzzle-image">Foto del rompecabezas</label>
            <select id="puzzle-image" value={puzzleImage} onChange={handleImageChange}>
              {images.map((src, index) => (
                <option key={src} value={src}>
                  Foto {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="control-block">
            <label htmlFor="puzzle-size">Tamaño: {gridSize} x {gridSize} ({gridSize * gridSize} piezas)</label>
            <input
              id="puzzle-size"
              type="range"
              min="6"
              max="32"
              value={gridSize}
              onChange={(event) => handleSizeChange(Number(event.target.value))}
            />
            <div className="control-hints">
              <button className="button alt" onClick={() => handleSizeChange(12)}>
                12 x 12
              </button>
              <button className="button alt" onClick={() => handleSizeChange(20)}>
                20 x 20
              </button>
              <button className="button" onClick={() => handleSizeChange(32)}>
                Modo 1000 piezas
              </button>
            </div>
          </div>

          <div className="control-block">
            <label htmlFor="puzzle-zoom">Zoom: {Math.round(zoom * 100)}%</label>
            <input
              id="puzzle-zoom"
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </div>

          <div className="controls">
            <button className="button" onClick={resetPuzzle}>Revolver</button>
            <button className="button alt" onClick={revealPuzzle}>Mostrar pista</button>
          </div>

          <div className="secret">
            {solved ? secretMessage : "Resuelve el rompecabezas para revelar el mensaje."}
          </div>
          <p className="note">Si el modo 1000 piezas se ve muy pequeño, baja a 20 x 20.</p>
        </div>
      </div>
    </section>
  );
}
