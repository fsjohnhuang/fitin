export type TransformType = { transformOrigin: string; transform: string };

export interface IResizeEvent {
  get designAspectRatio(): { width: number; height: number };
  get effectiveWidth(): number;
  get effectiveHeight(): number;
  get isMinWidthReached(): boolean;
  get isMinHeightReached(): boolean;
  get width(): number;
  get height(): number;
  get scaleX(): number;
  get scaleY(): number;
  get scaleXY(): number;
  get screenAspectRatio(): { width: number; height: number };
  get isSameAspectRatio(): boolean;
  /**
   * Only `getBoundingClientRect(): {width, height, x, y, top, right, bottom, left}` returns the visual dimensions in CSS pixels,
   * while offsetWidth and offsetHeight return layout dimensions which wouldn't be affect by transform.
   * @param transformOrigin
   * @returns
   */
  transformX(transformOrigin: "left" | "center" | "right"): TransformType;

  /**
   * Only `getBoundingClientRect(): {width, height, x, y, top, right, bottom, left}` returns the visual dimensions in CSS pixels,
   * while offsetWidth and offsetHeight return layout dimensions which wouldn't be affect by transform.
   * @param transformOrigin
   * @returns
   */
  transformY(transformOrigin: "top" | "center" | "bottom"): TransformType;

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
  ): TransformType;
}
