import type { FitinConfig } from "../FitinConfig";
import { AbsResizeEvent } from "./AbsResizeEvent";

export class CoverResizeEvent extends AbsResizeEvent {
  #config: FitinConfig;

  constructor(config: FitinConfig, width: number, height: number) {
    super(width, height, config);

    this.#config = config;
  }

  get effectiveWidth(): number {
    if (this.#config.designWidth < this.#config.designHeight) {
      return this.#config.minDesignWidth
        ? Math.max(this.#config.minDesignWidth, this.width)
        : this.width;
    } else {
      const effectiveHeight = this.effectiveHeight;
      return (
        (effectiveHeight * this.designAspectRatio.width) /
        this.designAspectRatio.height
      );
    }
  }

  get effectiveHeight(): number {
    if (this.#config.designWidth < this.#config.designHeight) {
      const effectiveWidth = this.effectiveWidth;
      return (
        (effectiveWidth * this.designAspectRatio.height) /
        this.designAspectRatio.width
      );
    } else {
      return this.#config.minDesignHeight
        ? Math.max(this.#config.minDesignHeight, this.height)
        : this.height;
    }
  }
}
