import type { IResizeEvent, TransformType } from "./IResizeEvent";
import { getPhysicalAspectRatio } from "../env";
import { MemoizeMachine } from "./MemoizeMachine";
import type { FitinConfig } from "../FitinConfig";

type ConfigType = Pick<
  FitinConfig,
  | "designWidth"
  | "designHeight"
  | "minDesignWidth"
  | "minDesignHeight"
  | "computeScaleXY"
>;

export abstract class AbsResizeEvent implements IResizeEvent {
  #width: number;
  #height: number;
  #config: ConfigType;

  protected machine: MemoizeMachine = MemoizeMachine.getInstance();

  abstract get effectiveWidth(): number;
  abstract get effectiveHeight(): number;

  constructor(width: number, height: number, config: ConfigType) {
    this.#width = width;
    this.#height = height;
    this.#config = config;
  }

  get designAspectRatio(): { width: number; height: number } {
    return this.machine.computeDesignAspectRatio(
      this.#config.designWidth,
      this.#config.designHeight,
    );
  }

  /**
   * is the minimum limit triggered
   */
  get isMinWidthReached(): boolean {
    return this.machine.computeIsMinWidthReached(
      this.#config.minDesignWidth,
      this.width,
    );
  }

  /**
   * is the minimum limit triggered
   */
  get isMinHeightReached(): boolean {
    return this.machine.computeIsMinHeightReached(
      this.#config.minDesignHeight,
      this.height,
    );
  }

  /**
   * physical width of container
   */
  get width(): number {
    return this.#width;
  }

  /**
   * physical height of container
   */
  get height(): number {
    return this.#height;
  }

  get screenAspectRatio(): ReturnType<typeof getPhysicalAspectRatio> {
    return getPhysicalAspectRatio();
  }

  get isSameAspectRatio(): boolean {
    const designAspectRatio = this.designAspectRatio;
    const screenAspectRatio = this.screenAspectRatio;

    return (
      designAspectRatio.width === screenAspectRatio.width &&
      designAspectRatio.height === screenAspectRatio.height
    );
  }

  /**
   * horizontal scaling
   */
  get scaleX(): number {
    return this.machine.computeScaleX(
      this.effectiveWidth,
      this.#config.designWidth,
    );
  }

  /**
   * vertical scaling
   */
  get scaleY(): number {
    return this.machine.computeScaleY(
      this.effectiveHeight,
      this.#config.designHeight,
    );
  }

  /**
   * comprehensive scaling
   */
  get scaleXY(): number {
    return this.#config.computeScaleXY(
      this.#config.designWidth,
      this.#config.designHeight,
      this.scaleX,
      this.scaleY,
    );
  }

  /**
   * Only `getBoundingClientRect(): {width, height, x, y, top, right, bottom, left}` returns the visual dimensions in CSS pixels,
   * while offsetWidth and offsetHeight return layout dimensions which wouldn't be affect by transform.
   * @param transformOrigin
   * @returns
   */
  transformX(transformOrigin: "left" | "center" | "right"): TransformType {
    return {
      transform: `scaleX(${this.scaleX})`,
      transformOrigin: transformOrigin,
    } as unknown as TransformType;
  }

  /**
   * Only `getBoundingClientRect(): {width, height, x, y, top, right, bottom, left}` returns the visual dimensions in CSS pixels,
   * while offsetWidth and offsetHeight return layout dimensions which wouldn't be affect by transform.
   * @param transformOrigin
   * @returns
   */
  transformY(transformOrigin: "top" | "center" | "bottom"): TransformType {
    return {
      transform: `scaleY(${this.scaleY})`,
      transformOrigin: transformOrigin,
    } as unknown as TransformType;
  }

  /**
   * Only `getBoundingClientRect(): {width, height, x, y, top, right, bottom, left}` returns the visual dimensions in CSS pixels,
   * while offsetWidth and offsetHeight return layout dimensions which wouldn't be affect by transform.
   * @param transformOriginX
   * @param transformOriginY
   * @returns
   */
  transformXY(
    transformOriginX: "left" | "center" | "right",
    transformOriginY: "top" | "center" | "bottom",
  ): TransformType {
    return {
      transform: `scale(${this.scaleX}, ${this.scaleY})`,
      transformOrigin: `${transformOriginX} ${transformOriginY}`,
    } as unknown as TransformType;
  }
}
