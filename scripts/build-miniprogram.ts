import { writeFile } from "node:fs/promises";
import { type LibraryOptions, build } from "vite";
import viteConfig from "../vite.config.js";

async function buildCjs() {
  await build({
    ...viteConfig,
    build: {
      ...viteConfig.build,
      target: ["es2018"],
      lib: {
        ...(viteConfig.build?.lib as LibraryOptions),
        entry: {
          index: "./src/full/index.ts",
        },
        formats: ["cjs"],
      },
      outDir: "dist/miniprogram",
      rollupOptions: {
        ...viteConfig.build?.rollupOptions,
        output: {
          ...viteConfig.build?.rollupOptions?.output,
          manualChunks: {},
        },
      },
    },
    configFile: false,
  });
  await writeFile(
    "dist/miniprogram/package.json",
    `${JSON.stringify({ type: "commonjs" }, undefined, 2)}\n`,
  );
}

buildCjs();
