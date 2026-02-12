export const buildTiles = (size: number): number[] =>
  Array.from({ length: size * size }, (_, i) => i);

export const shuffleTiles = (tiles: number[]): number[] => {
  const copy = [...tiles];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const shuffleList = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const isSolved = (tiles: number[]): boolean =>
  tiles.every((value, index) => value === index);
