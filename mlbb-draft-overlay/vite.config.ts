import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev-only: proxy /mlbb-api/* to mlbb.rone.dev to bypass CORS.
      // The browser talks to same-origin localhost; Vite forwards server-side.
      "/mlbb-api": {
        target: "https://mlbb.rone.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mlbb-api/, "/api"),
      },
    },
  },
});
