import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Browsers still request `/favicon.ico`; serve the SVG so dev/preview don’t 404. */
function faviconIcoFromSvg(): Plugin {
  const svgPath = path.resolve(__dirname, "public/favicon.svg");

  const middleware: Parameters<
    import("vite").ViteDevServer["middlewares"]["use"]
  >[0] = (req, res, next) => {
    const url = req.url?.split("?")[0] ?? "";
    if (url !== "/favicon.ico") {
      next();
      return;
    }
    if (!fs.existsSync(svgPath)) {
      next();
      return;
    }
    res.setHeader("Content-Type", "image/svg+xml");
    res.end(fs.readFileSync(svgPath));
  };

  return {
    name: "favicon-ico-from-svg",
    configureServer(s) {
      s.middlewares.use(middleware);
    },
    configurePreviewServer(s) {
      s.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), faviconIcoFromSvg()],
});
