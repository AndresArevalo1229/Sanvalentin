const getUserAgent = (): string =>
  typeof navigator === "undefined" ? "" : navigator.userAgent.toLowerCase();

export const isElectronRuntime = (): boolean => getUserAgent().includes("electron");

export const isWindowsRuntime = (): boolean => getUserAgent().includes("windows");

export const isWindowsElectronRuntime = (): boolean =>
  isWindowsRuntime() && isElectronRuntime();
