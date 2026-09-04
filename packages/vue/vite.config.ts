import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      outDirs: "dist",
      include: ["src"],
      exclude: ["src/**/*.stories.ts", "src/**/*.test.ts"],
      copyDtsFiles: true,
    }),
    vue(),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: "Fitin",
      fileName: (format) => `fitin.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
