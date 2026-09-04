import type { IResizeEvent } from "./IResizeEvent";
import type { FitinConfig } from "../FitinConfig";
import { FillResizeEvent } from "./FillResizeEvent";
import { ContainResizeEvent } from "./ContainResizeEvent";
import { CoverResizeEvent } from "./CoverResizeEvent";

export type { IResizeEvent } from "./IResizeEvent";

export function createResizeEvent(
  config: FitinConfig,
  width: number,
  height: number,
): IResizeEvent {
  switch (config.mode) {
    case "contain":
      return new ContainResizeEvent(config, width, height);
    case "cover":
      return new CoverResizeEvent(config, width, height);
    default:
      return new FillResizeEvent(config, width, height);
  }
}
