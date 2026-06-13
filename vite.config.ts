import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/bootstrap",
  envDir: "../..",
  publicDir: "../../public",
  cacheDir: "../../node_modules/.vite",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  plugins: [
    devtools(),
    tanstackRouter({
      target: "react",
      routesDirectory: "../routes",
      generatedRouteTree: "./routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    viteReact(),
  ],
});
