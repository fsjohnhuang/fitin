<script setup lang="ts">
import {
  computed,
  inject,
  provide,
  ref,
  watchEffect,
  type CSSProperties,
} from "vue";
import { BehaviorSubject } from "rxjs";
import { Fitin, type Mode, type IResizeEvent } from "@fitin/core";
import { FitinCanvasKey } from "./keys";
import { logE } from "./logging";

/**
 * Vue SFC does not support TypeScript advanced types(e.g., Omit, Pick and Partial).
 * However, these are exactly the types that `FitinOptions` depends on.
 * Solution: declare the type from scratch (i.e. rewrite it explicitly without relying on utility types).
 */
type FitinCanvasProps = {
  designWidth: number; // physical design width of container
  designHeight: number; // physical design height of container
  mode?: Mode;
  minDesignWidth?: number; // minimum physical design width of container
  minDesignHeight?: number; // minimum physical design height of container
  wait?: number; // in ms
  computeScaleXY?: (
    designWidth: number,
    designHeight: number,
    scaleX: number,
    scaleY: number,
  ) => number;
  viewport?: HTMLElement | "parent";
  center?: boolean;
};

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<FitinCanvasProps>();

const canvasRef = ref<HTMLElement>();

const centerStyle = computed<CSSProperties>(() =>
  props.center
    ? {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    : {},
);

let fitin: Fitin;
let subject = new BehaviorSubject<IResizeEvent | undefined>(undefined);
provide(FitinCanvasKey, subject.asObservable());
const resizeObservable = inject(FitinCanvasKey);

watchEffect((onCleanup) => {
  if (resizeObservable) {
    logE("Nested fitin-canvas is forbidden");
    return;
  }

  fitin = new Fitin(props);

  const handleResize = (event: IResizeEvent) => {
    if (event && canvasRef.value) {
      canvasRef.value.style.width = `${event.effectiveWidth}px`;
      canvasRef.value.style.height = `${event.effectiveHeight}px`;
    }
    subject.next(event);
  };

  const viewport =
    props.viewport === "parent"
      ? canvasRef.value?.parentElement
      : props.viewport;
  if (viewport) {
    fitin.subscribe(viewport, handleResize);
  } else {
    fitin.subscribe(handleResize);
  }

  onCleanup(() => {
    fitin.dispose();
  });
});
</script>

<template>
  <section
    ref="canvasRef"
    role="fitin-canvas"
    :style="[{ position: 'relative' }, centerStyle, { overflow: 'hidden' }]"
  >
    <slot />
  </section>
</template>
