import fs from "node:fs";
import path from "node:path";

const contentPath = path.join("src", "data", "content.ts");
const source = fs.readFileSync(contentPath, "utf8");
const assetPattern = /asset\("([^"]+)"\)/g;

const missing = [];
for (const match of source.matchAll(assetPattern)) {
  const relativeAssetPath = match[1];
  const publicPath = path.join("public", relativeAssetPath);
  if (!fs.existsSync(publicPath)) {
    missing.push(relativeAssetPath);
  }
}

if (missing.length > 0) {
  console.error("Missing assets detected:");
  for (const filePath of missing) {
    console.error(`- ${filePath}`);
  }
  process.exit(1);
}

console.log("All asset() references from src/data/content.ts exist in /public.");
