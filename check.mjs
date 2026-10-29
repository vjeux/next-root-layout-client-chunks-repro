// Prints the chunks of the root layout segment in `/`'s client reference manifest, and whether
// they contain the dashboard page's component (HEAVY_MARKER). Run after `next build`.
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
globalThis.__RSC_MANIFEST = undefined;
require(resolve(".next/server/app/page_client-reference-manifest.js"));
const manifest = Object.values(globalThis.__RSC_MANIFEST)[0];
const layoutKey = Object.keys(manifest.entryJSFiles).find((key) => key.endsWith("app/layout"));
let heavyBytes = 0;
for (const file of manifest.entryJSFiles[layoutKey]) {
  const path = join(".next", file.replace(/^\/?_next\//, ""));
  const code = existsSync(path) ? readFileSync(path, "utf8") : "";
  const heavy = code.includes("HEAVY_MARKER");
  if (heavy) heavyBytes += code.length;
  console.log(`${layoutKey}: ${file} (${code.length} B)${heavy ? " contains HEAVY_MARKER" : ""}`);
}
console.log(
  heavyBytes > 0
    ? `BUG: / loads the dashboard page's component in its root layout chunks (${heavyBytes} B).`
    : "OK: / does not load the dashboard page's component.",
);
