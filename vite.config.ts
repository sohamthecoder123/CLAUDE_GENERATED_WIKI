import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/*
 * iGEM serves every team wiki from a sub-path: https://2026.igem.wiki/<team>/.
 * `base` must match that sub-path or every built asset URL 404s on the live wiki.
 * Keep it as "/" for local `npm run dev`, and set IGEM_BASE when building for iGEM:
 *   IGEM_BASE=/iisc-bengaluru/ npm run build
 */
export default defineConfig(({ mode }) => ({
  // loadEnv reads IGEM_BASE from the shell as well as from a .env file, and
  // avoids needing Node's types in a browser-facing project.
  base: loadEnv(mode, process.cwd(), "IGEM").IGEM_BASE || "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    // One chunk per page keeps the first paint small; the pages are large files.
    chunkSizeWarningLimit: 1200,
  },
}));
