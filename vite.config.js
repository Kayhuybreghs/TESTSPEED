import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const p = (f) => fs.readFileSync(path.resolve(__dirname, f), "utf-8");

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          NAVBAR: p("src/partials/navbar.html"),
          FOOTER_CTA: p("src/partials/footer-cta.html"),
        },
      },
    }),
  ],
});
