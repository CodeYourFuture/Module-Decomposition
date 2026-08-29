// Netlify build step: writes front-end/config.js from the BACKEND_URL build
// environment variable, so the deployed backend URL lives in Netlify's UI
// instead of being hardcoded in committed source.
//
// Run locally with no BACKEND_URL set and it writes an empty value, which is
// what local development wants (the backend serves the page itself).
import { writeFileSync } from "node:fs";

const raw = (process.env.BACKEND_URL || "").trim().replace(/\/+$/, "");

if (raw && !/^https?:\/\//.test(raw)) {
  console.error(`BACKEND_URL must start with http:// or https:// (got "${raw}")`);
  process.exit(1);
}

const out = new URL("../chat-app/front-end/config.js", import.meta.url);

writeFileSync(
  out,
  `// Generated at build time by scripts/inject-backend-url.mjs — do not edit.\n` +
    `window.BACKEND_URL = ${JSON.stringify(raw)};\n`
);

console.log(raw ? `BACKEND_URL set to ${raw}` : "BACKEND_URL empty (local/same-origin mode)");
