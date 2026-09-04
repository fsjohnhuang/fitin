<script setup lang="ts">
import { ref, watchEffect, computed, type CSSProperties } from "vue";
import type { IResizeEvent } from "@fitin/core";
import { provideFitinContainer, useFitin } from "./hooks";

type FitinContainerProps = {
  designWidth: number;
  designHeight: number;
  transformOriginX?: "left" | "center" | "right";
  transformOriginY?: "top" | "center" | "bottom";
  style?: CSSProperties;
  class?: string;
};

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<FitinContainerProps>();

const containerKey = computed(() =>
  props.transformOriginX || props.transformOriginY
    ? "affect-descendant"
    : "affect-self",
);

provideFitinContainer(containerKey.value);
const containerRef = ref<HTMLElement>();

function adjustContainer(
  container: HTMLElement,
  event: IResizeEvent,
  props: FitinContainerProps,
) {
  if (props.transformOriginX || props.transformOriginY) {
    container.style.position = "absolute";
    let transform: string;
    let transformOrigin: string;
    if (props.transformOriginX && props.transformOriginY) {
      const res = event.transformXY(
        props.transformOriginX,
        props.transformOriginY,
      );
      transform = res.transform;
      transformOrigin = res.transformOrigin;
    } else if (props.transformOriginX) {
      const res = event.transformX(props.transformOriginX);
      transform = res.transform;
      transformOrigin = res.transformOrigin;
    } else {
      const res = event.transformY(props.transformOriginY!);
      transform = res.transform;
      transformOrigin = res.transformOrigin;
    }

    container.style.width = `${props.designWidth}px`;
    container.style.height = `${props.designHeight}px`;
    container.style.transform = transform;
    container.style.transformOrigin = transformOrigin;
  } else {
    container.style.width = `${event.scaleX * props.designWidth}px`;
    container.style.height = `${event.scaleY * props.designHeight}px`;
  }
}

const resizeObservable = useFitin();
watchEffect((onCleanup) => {
  if (resizeObservable) {
    const subscription = resizeObservable.subscribe(
      (event: IResizeEvent | undefined) => {
        if (event && containerRef.value) {
          adjustContainer(containerRef.value, event, props);
        }
      },
    );
    onCleanup(() => subscription.unsubscribe());
  }
});
</script>

<template>
  <section
    :key="containerKey"
    role="fitin-container"
    :data-scope="containerKey"
    ref="containerRef"
    :style="props.style"
    :class="props.class"
  >
    <slot />
  </section>
</template>
