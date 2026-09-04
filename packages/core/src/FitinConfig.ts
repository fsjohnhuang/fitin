export type Mode = "fill" | "contain" | "cover";

export type FitinConfig = {
  designWidth: number; // physical design width of container
  designHeight: number; // physical design height of container
  mode: Mode;
  minDesignWidth: number; // minimum physical design width of container
  minDesignHeight: number; // minimum physical design height of container
  wait: number; // in ms
  computeScaleXY: (
    designWidth: number,
    designHeight: number,
    scaleX: number,
    scaleY: number,
  ) => number;
};
