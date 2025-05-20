import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   allowedHosts: ["*"],
  //   https: {
  //     key: fs.readFileSync("key.pem"),
  //     cert: fs.readFileSync("cert.pem"),
  //   },
  //   proxy: {
  //     "/api": {
  //       target: "https://localhost:8000",
  //       changeOrigin: true,
  //       secure: false, // Bypass SSL verification
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});
