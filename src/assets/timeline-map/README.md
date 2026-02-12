# Timeline MiniMap Assets

Esta carpeta ya esta conectada al minijuego de la seccion de timeline.

## Archivos que puedes reemplazar

- `backgrounds/manor-interior-map.svg`
  - Fondo completo del minimapa interior de la mansion.
  - Recomendado: relacion horizontal (16:11 aprox).

- `doors/door-closed.svg`
  - Puerta cerrada (cuartos bloqueados).

- `doors/door-reached.svg`
  - Puerta alcanzada (cuartos ya visitados).

- `doors/door-active.svg`
  - Puerta activa (cuarto actual).

- `prince/prince-idle.svg`
  - Sprite quieto del principe.

- `prince/prince-walk-a.svg`
- `prince/prince-walk-b.svg`
  - Dos frames para animacion de caminata.

## Reglas para reemplazar

1. Conserva exactamente los mismos nombres y rutas.
2. Usa fondo transparente en puertas y principe.
3. Mantener `viewBox` ayuda a que escalen bien.
4. Puedes usar SVG o PNG, pero SVG se ve mejor en alta resolucion.

## Donde se usa

- `src/assets/timeline-map/index.ts`
- `src/components/sections/TimelineSection.tsx`
