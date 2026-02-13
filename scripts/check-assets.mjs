import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const contentPath = path.join("src", "data", "content.ts");
const source = fs.readFileSync(contentPath, "utf8");
const assetPattern = /asset\("([^"]+)"\)/g;

const normalizePath = (value) => value.replace(/\\/g, "/").replace(/^\/+/, "");

const readTrackedPublicPaths = () => {
  try {
    const raw = execSync("git ls-files -z -- public", {
      stdio: ["ignore", "pipe", "ignore"]
    }).toString("utf8");
    return raw
      .split("\0")
      .filter(Boolean)
      .map((entry) => normalizePath(entry))
      .filter((entry) => entry.startsWith("public/"))
      .map((entry) => entry.slice("public/".length));
  } catch {
    return null;
  }
};

const trackedPublicPaths = readTrackedPublicPaths();
const trackedPathSet = trackedPublicPaths ? new Set(trackedPublicPaths) : null;

const expectedAssetPaths = new Set(
  [...source.matchAll(assetPattern)].map((match) => normalizePath(match[1]))
);

const normalizationMismatch = [];
const notTrackedInGit = [];
const missing = [];

for (const relativeAssetPath of expectedAssetPaths) {
  const exactPath = path.join("public", relativeAssetPath);
  const nfcPath = path.join("public", relativeAssetPath.normalize("NFC"));
  const nfdPath = path.join("public", relativeAssetPath.normalize("NFD"));

  const existsOnDisk = fs.existsSync(exactPath) || fs.existsSync(nfcPath) || fs.existsSync(nfdPath);

  if (trackedPathSet) {
    if (trackedPathSet.has(relativeAssetPath)) {
      continue;
    }

    const nfcVariant = relativeAssetPath.normalize("NFC");
    const nfdVariant = relativeAssetPath.normalize("NFD");

    if (trackedPathSet.has(nfcVariant)) {
      normalizationMismatch.push({
        requested: relativeAssetPath,
        tracked: nfcVariant
      });
      continue;
    }

    if (trackedPathSet.has(nfdVariant)) {
      normalizationMismatch.push({
        requested: relativeAssetPath,
        tracked: nfdVariant
      });
      continue;
    }

    if (existsOnDisk) {
      notTrackedInGit.push(relativeAssetPath);
      continue;
    }

    missing.push(relativeAssetPath);
    continue;
  }

  if (!existsOnDisk) {
    missing.push(relativeAssetPath);
  }
}

if (normalizationMismatch.length > 0) {
  console.error("Unicode normalization mismatch in asset paths:");
  for (const item of normalizationMismatch) {
    console.error(`- requested: ${item.requested}`);
    console.error(`  tracked:   ${item.tracked}`);
  }
}

if (notTrackedInGit.length > 0) {
  console.error("Assets exist on disk but are not tracked in git:");
  for (const filePath of notTrackedInGit) {
    console.error(`- ${filePath}`);
  }
}

if (missing.length > 0) {
  console.error("Missing assets detected:");
  for (const filePath of missing) {
    console.error(`- ${filePath}`);
  }
}

if (normalizationMismatch.length > 0 || notTrackedInGit.length > 0 || missing.length > 0) {
  process.exit(1);
}

console.log("All asset() references from src/data/content.ts are valid and git-tracked.");
