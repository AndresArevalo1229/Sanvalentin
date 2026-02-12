import type { SectionMenuItem } from "../../data/content";

export type SectionRouteId = SectionMenuItem["id"];
export type TopRouteId = "inicio" | "secciones" | SectionRouteId;

export const sectionRouteIds: SectionRouteId[] = ["letter", "timeline", "music", "gallery", "puzzle"];

export const sectionRoutePath: Record<SectionRouteId, string> = {
  letter: "/letter",
  timeline: "/timeline",
  music: "/music",
  gallery: "/gallery",
  puzzle: "/puzzle"
};

export const sectionRouteHash: Record<SectionRouteId, string> = {
  letter: "#seccion/letter",
  timeline: "#seccion/timeline",
  music: "#seccion/music",
  gallery: "#seccion/gallery",
  puzzle: "#seccion/puzzle"
};

export const getRouteHash = (routeId: TopRouteId): string => {
  if (routeId === "inicio") return "#inicio";
  if (routeId === "secciones") return "#secciones";
  return sectionRouteHash[routeId];
};

export const getRoutePath = (routeId: TopRouteId): string => {
  if (routeId === "inicio") return "/";
  if (routeId === "secciones") return "/secciones";
  return sectionRoutePath[routeId];
};

export const isSectionRouteId = (value: string): value is SectionRouteId => {
  return sectionRouteIds.includes(value as SectionRouteId);
};
