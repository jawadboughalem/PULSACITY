import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const entry = fileURLToPath(new URL("./src/index.ts", import.meta.url));
const outfile = fileURLToPath(new URL("../public/w.js", import.meta.url));

const MAX_GZIP_BYTES = 30 * 1024;
const SUPPORTED_BROWSERS = ["chrome111", "edge111", "firefox111", "safari16.4"];

const noDependencies = {
  name: "no-dependencies",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^[^./]/ }, (args) =>
      args.kind === "entry-point"
        ? undefined
        : { errors: [{ text: `The widget cannot depend on "${args.path}".` }] },
    );
  },
};

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: "iife",
  minify: true,
  platform: "browser",
  target: SUPPORTED_BROWSERS,
  legalComments: "none",
  plugins: [noDependencies],
  logLevel: "warning",
});

const gzipBytes = gzipSync(readFileSync(outfile)).length;
if (gzipBytes >= MAX_GZIP_BYTES) {
  console.error(`public/w.js is ${gzipBytes} bytes gzipped: the budget is ${MAX_GZIP_BYTES}.`);
  process.exit(1);
}
console.log(`public/w.js built: ${gzipBytes} bytes gzipped (budget ${MAX_GZIP_BYTES}).`);
