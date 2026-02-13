const runtimeUnicodeForm = (): "NFC" | "NFD" => {
  if (typeof navigator === "undefined") {
    return "NFC";
  }
  return /windows/i.test(navigator.userAgent) ? "NFC" : "NFD";
};

const normalizedAssetPath = (path: string): string =>
  encodeURI(path.replace(/^\/+/, "").normalize(runtimeUnicodeForm()));

const assetBaseUrl =
  import.meta.env.PROD
    ? new URL(/* @vite-ignore */ "../", import.meta.url).href
    : new URL(import.meta.env.BASE_URL || "/", window.location.origin).href;

export const asset = (path: string): string => new URL(normalizedAssetPath(path), assetBaseUrl).href;
