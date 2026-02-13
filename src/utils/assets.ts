const normalizedAssetPath = (path: string): string => encodeURI(path.replace(/^\/+/, ""));

const assetBaseUrl =
  import.meta.env.PROD
    ? new URL(/* @vite-ignore */ "../", import.meta.url).href
    : new URL(import.meta.env.BASE_URL || "/", window.location.origin).href;

export const asset = (path: string): string => new URL(normalizedAssetPath(path), assetBaseUrl).href;
