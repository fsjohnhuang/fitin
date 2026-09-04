import type { App, Plugin } from "vue";
import FitinCanvas from "./components/fitin-canvas.vue";
import FitinContainer from "./components/fitin-container.vue";
export { useFitin, useFitinState } from "./components/hooks";

export { FitinCanvas, FitinContainer };
export const plugin: Plugin = {
  install(app: App) {
    app.component("FitinCanvas", FitinCanvas);
    app.component("FitinContainer", FitinContainer);
  },
};
