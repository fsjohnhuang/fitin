import type { FitinConfig } from "../FitinConfig";
import { AbsResizeEvent } from "./AbsResizeEvent";

export class FillResizeEvent extends AbsResizeEvent {
  #config: FitinConfig;

  constructor(config: FitinConfig, width: number, height: number) {
    super(width, height, config);

    this.#config = config;
  }

  /**
   * effective physical width of container
   */
  get effectiveWidth(): number {
    return this.machine.computeEffectiveWidth(
      this.#config.minDesignWidth,
      this.width,
    );
  }

  /**
   * effective physical height of container
   */
  get effectiveHeight(): number {
    return this.machine.computeEffectiveHeight(
      this.#config.minDesignHeight,
      this.height,
    );
  }
}
