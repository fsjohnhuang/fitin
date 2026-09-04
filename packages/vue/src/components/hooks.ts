import { inject, provide, reactive, watchEffect } from "vue";
import type { IResizeEvent } from "@fitin/core";
import { FitinCanvasKey, FitinContainerKey } from "./keys";
import { logE, logW } from "./logging";
import type { Observable } from "rxjs";

export function provideFitinContainer(
  value: "affect-self" | "affect-descendant",
) {
  const paths = inject(FitinContainerKey) || [];
  paths.push(value);
  provide(FitinContainerKey, paths);
}

export function useFitin(
  resizeHandler?: (event: undefined | IResizeEvent) => void,
): undefined | Observable<undefined | IResizeEvent> {
  const resizeObservable = inject(FitinCanvasKey);
  if (resizeObservable) {
    const paths = inject(FitinContainerKey) || [];
    if (paths.find((path) => path === "affect-descendant")) {
      logW("There's an ancestor fitin-container resizing all descendants");
    }

    watchEffect((onCleanup) => {
      const subscription = resizeObservable.subscribe(resizeHandler);
      onCleanup(() => subscription.unsubscribe());
    });
  } else {
    logE("A fitin-container must be used within a fitin-canvas context");
  }

  return resizeObservable;
}

export function useFitinState() {
  const state = reactive<{
    scaleX: number;
    scaleY: number;
    scaleXY: number;
    effectiveWidth: undefined | number;
    effectiveHeight: undefined | number;
  }>({
    scaleX: 1,
    scaleY: 1,
    scaleXY: 1,
    effectiveWidth: undefined,
    effectiveHeight: undefined,
  });
  useFitin((event) => {
    if (event) {
      state.scaleX = event.scaleX;
      state.scaleY = event.scaleY;
      state.scaleXY = event.scaleXY;
      state.effectiveWidth = event.effectiveWidth;
      state.effectiveHeight = event.effectiveHeight;
    }
  });

  return state;
}
