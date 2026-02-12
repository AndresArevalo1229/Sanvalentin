import manorInteriorMap from "./backgrounds/manor-interior-map.svg";
import doorClosed from "./doors/door-closed.svg";
import doorReached from "./doors/door-reached.svg";
import doorActive from "./doors/door-active.svg";
import princeIdle from "./prince/prince-idle.svg";
import princeWalkA from "./prince/prince-walk-a.svg";
import princeWalkB from "./prince/prince-walk-b.svg";

export const timelineMiniGameAssets = {
  manorInteriorMap,
  doors: {
    closed: doorClosed,
    reached: doorReached,
    active: doorActive
  },
  prince: {
    idle: princeIdle,
    walkA: princeWalkA,
    walkB: princeWalkB
  }
} as const;

export type TimelineMiniDoorVariant = keyof typeof timelineMiniGameAssets.doors;
