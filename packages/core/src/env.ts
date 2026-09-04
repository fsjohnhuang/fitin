import { computeAspectRatio } from "./utils";

export type Dimensions = { width: number; height: number };

export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

export function getViewportSize(): Dimensions {
  return {
    width: document.documentElement.clientWidth || document.body.clientWidth,
    height: document.documentElement.clientHeight || document.body.clientHeight,
  };
}

export function getPhysicalViewportSize(): Dimensions {
  const dpr = getDevicePixelRatio();
  const entries = Object.entries(getViewportSize()) as [
    keyof Dimensions,
    number,
  ][];

  return entries.reduce(
    (dimensions, [key, value]) => {
      dimensions[key] = dpr * value;

      return dimensions;
    },
    { width: 0, height: 0 },
  );
}

export function getPhysicalAspectRatio(): Dimensions {
  let { width, height } = window.screen;
  return computeAspectRatio(width, height);
}
