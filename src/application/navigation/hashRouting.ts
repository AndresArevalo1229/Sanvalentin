import {
  getRouteHash,
  getRoutePath,
  isSectionRouteId,
  sectionRouteIds,
  sectionRoutePath,
  type SectionRouteId,
  type TopRouteId
} from "../../domain/navigation/routes";

export type ParsedRoute =
  | {
      type: "inicio" | "secciones";
    }
  | {
      type: "section";
      sectionId: SectionRouteId;
    }
  | null;

const normalizePathname = (pathname: string): string => {
  const lowerPath = pathname.trim().toLowerCase();
  if (!lowerPath) return "/";
  const trimmedPath = lowerPath.replace(/\/+$/, "");
  return trimmedPath || "/";
};

const resolveSectionFromPath = (pathname: string): SectionRouteId | null => {
  for (const sectionId of sectionRouteIds) {
    if (sectionRoutePath[sectionId] === pathname) return sectionId;
  }

  if (pathname.startsWith("/seccion/")) {
    const candidate = pathname.slice("/seccion/".length);
    if (isSectionRouteId(candidate)) return candidate;
  }

  if (pathname.startsWith("/section/")) {
    const candidate = pathname.slice("/section/".length);
    if (isSectionRouteId(candidate)) return candidate;
  }

  if (pathname.startsWith("/")) {
    const candidate = pathname.slice(1);
    if (isSectionRouteId(candidate)) return candidate;
  }

  return null;
};

export const parsePathRoute = (pathname: string): ParsedRoute => {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/" || normalizedPathname === "/inicio") {
    return { type: "inicio" };
  }

  if (normalizedPathname === "/secciones") {
    return { type: "secciones" };
  }

  const sectionId = resolveSectionFromPath(normalizedPathname);
  if (!sectionId) return null;

  return {
    type: "section",
    sectionId
  };
};

export const parseHashRoute = (rawHash: string): ParsedRoute => {
  const hash = rawHash.replace(/^#/, "").trim().toLowerCase();

  if (!hash || hash === "inicio") {
    return { type: "inicio" };
  }

  if (hash === "secciones") {
    return { type: "secciones" };
  }

  if (isSectionRouteId(hash)) {
    return {
      type: "section",
      sectionId: hash
    };
  }

  if (hash.startsWith("seccion/")) {
    const candidate = hash.slice("seccion/".length);
    if (isSectionRouteId(candidate)) {
      return {
        type: "section",
        sectionId: candidate
      };
    }
  }

  return null;
};

export const parseLocationRoute = (pathname: string, hash: string): ParsedRoute => {
  return parsePathRoute(pathname) ?? parseHashRoute(hash);
};

export const getRouteLocation = (routeId: TopRouteId) => {
  return {
    pathname: getRoutePath(routeId),
    hash: getRouteHash(routeId)
  };
};
