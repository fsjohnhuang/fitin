import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: "Fitin",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["vue", "rxjs", "@fitin/core"],
      output: {
        globals: {
          vue: "Vue",
          rxjs: "rxjs",
          "@fitin/core": "FitinCore",
        },
      },
    },
  },
});