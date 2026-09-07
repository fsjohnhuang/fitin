import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, esmExternalRequirePlugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    esmExternalRequirePlugin({
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/client",
        "rxjs",
        "@fitin/core",
      ],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: "Fitin",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    rolldownOptions: {
      output: {
        format: "umd",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react/jsx-dev-runtime": "jsxRuntime",
          "react-dom/client": "ReactDOMClient",
          rxjs: "rxjs",
          "@fitin/core": "FitinCore",
        },
      },
    },
  },
});
