// vite.config.js
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { createHtmlPlugin } from "file:///home/project/node_modules/vite-plugin-html/dist/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///home/project/vite.config.js";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var p = (f) => fs.readFileSync(path.resolve(__dirname, f), "utf-8");
var vite_config_default = defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          NAVBAR: p("src/partials/navbar.html"),
          FOOTER_CTA: p("src/partials/footer-cta.html")
        }
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XG5pbXBvcnQgZnMgZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XG5cbmNvbnN0IHAgPSAoZikgPT4gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGYpLCBcInV0Zi04XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgICBpbmplY3Q6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIE5BVkJBUjogcChcInNyYy9wYXJ0aWFscy9uYXZiYXIuaHRtbFwiKSxcbiAgICAgICAgICBGT09URVJfQ1RBOiBwKFwic3JjL3BhcnRpYWxzL2Zvb3Rlci1jdGEuaHRtbFwiKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBSm9HLElBQU0sMkNBQTJDO0FBTW5MLElBQU0sWUFBWSxLQUFLLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBRTdELElBQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLEtBQUssUUFBUSxXQUFXLENBQUMsR0FBRyxPQUFPO0FBRXBFLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGlCQUFpQjtBQUFBLE1BQ2YsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFVBQ0osUUFBUSxFQUFFLDBCQUEwQjtBQUFBLFVBQ3BDLFlBQVksRUFBRSw4QkFBOEI7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
