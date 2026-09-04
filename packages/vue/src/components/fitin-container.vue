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

const affectScope = computed(() =>
  props.transformOriginX || props.transformOriginY
    ? "affect-descendant"
    : "affect-self",
);

provideFitinContainer(affectScope.value);

const fitinStyle = ref<CSSProperties>({});

function adjustContainer(event: IResizeEvent, props: FitinContainerProps) {
  if (props.transformOriginX || props.transformOriginY) {
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
    fitinStyle.value = {
      position: "absolute",
      width: `${props.designWidth}px`,
      height: `${props.designHeight}px`,
      transform: transform,
      transformOrigin: transformOrigin,
    };
  } else {
    fitinStyle.value = {
      width: `${event.scaleX * props.designWidth}px`,
      height: `${event.scaleY * props.designHeight}px`,
    };
  }
}

const resizeObservable = useFitin();
watchEffect((onCleanup) => {
  if (resizeObservable) {
    const subscription = resizeObservable.subscribe(
      (event: IResizeEvent | undefined) => {
        if (event) {
          adjustContainer(event, props);
        }
      },
    );
    onCleanup(() => subscription.unsubscribe());
  }
});
</script>

<template>
  <section
    role="fitin-container"
    :data-scope="affectScope"
    :style="[props.style, fitinStyle]"
    :class="props.class"
  >
    <slot />
  </section>
</template>
