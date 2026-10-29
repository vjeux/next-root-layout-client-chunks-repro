// Reports `/`'s first-load JS and whether the chunks of its root layout segment contain the
// dashboard page's component (HEAVY_MARKER). Run after `next build`.
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const require = createRequire(import.meta.url);
const read = (file) => {
  const path = join(".next", file.replace(/^\/?_next\//, ""));
  return existsSync(path) ? readFileSync(path) : Buffer.alloc(0);
};
const size = (files) => {
  const code = Buffer.concat(files.map(read));
  return `${code.length.toLocaleString("en-US")} B, gzip ${gzipSync(code).length.toLocaleString("en-US")} B`;
};

globalThis.__RSC_MANIFEST = undefined;
require(resolve(".next/server/app/page_client-reference-manifest.js"));
const manifest = Object.values(globalThis.__RSC_MANIFEST)[0];
const buildManifest = JSON.parse(readFileSync(".next/build-manifest.json", "utf8"));

// First-load JS of `/`: the root main files plus every segment's entry chunks.
const firstLoad = [
  ...new Set([
    ...(buildManifest.rootMainFiles ?? []),
    ...Object.values(manifest.entryJSFiles).flat(),
  ]),
].filter((file) => file.endsWith(".js"));
console.log(`/ first-load JS: ${firstLoad.length} files, ${size(firstLoad)}`);

const layoutKey = Object.keys(manifest.entryJSFiles).find((key) => key.endsWith("app/layout"));
const heavy = [];
for (const file of manifest.entryJSFiles[layoutKey]) {
  const contains = read(file).includes("HEAVY_MARKER");
  if (contains) heavy.push(file);
  console.log(`${layoutKey}: ${file} (${size([file])})${contains ? " contains HEAVY_MARKER" : ""}`);
}
console.log(
  heavy.length > 0
    ? `BUG: / loads the dashboard page's component in its root layout chunks (${size(heavy)}).`
    : "OK: / does not load the dashboard page's component.",
);
