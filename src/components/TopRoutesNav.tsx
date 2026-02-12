import type { SectionMenuItem } from "../data/content";
import type { TopRouteId } from "../domain/navigation/routes";
import IconGlyph from "./ui/IconGlyph";

type BaseRoute = {
  id: Extract<TopRouteId, "inicio" | "secciones">;
  label: string;
  icon: "flower" | "ribbon";
};

type TopRoutesNavProps = {
  sectionMenu: SectionMenuItem[];
  activeRoute: TopRouteId;
  onNavigate: (routeId: TopRouteId) => void;
};

const baseRoutes: BaseRoute[] = [
  { id: "inicio", label: "Inicio", icon: "flower" },
  { id: "secciones", label: "Secciones", icon: "ribbon" }
];

export default function TopRoutesNav({ sectionMenu, activeRoute, onNavigate }: TopRoutesNavProps) {
  return (
    <nav className="top-routes" aria-label="Rutas de navegación">
      <div className="top-routes-shell">
        {baseRoutes.map((route) => (
          <button
            key={route.id}
            className={`top-route-btn ${activeRoute === route.id ? "active" : ""}`}
            type="button"
            onClick={() => onNavigate(route.id)}
          >
            <IconGlyph name={route.icon} />
            <span>{route.label}</span>
          </button>
        ))}
        {sectionMenu.map((section) => (
          <button
            key={section.id}
            className={`top-route-btn top-route-btn-section ${activeRoute === section.id ? "active" : ""}`}
            type="button"
            onClick={() => onNavigate(section.id)}
          >
            <IconGlyph name={section.icon} />
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
