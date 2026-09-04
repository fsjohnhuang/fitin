/**
 * const fitin = new Fitin(options: {
 *  designWidth: number,
 *  designHeight: number,
 *  mode: "fill" | "contain" | "cover",
 *  minWidth: number,
 *  minHeight: number,
 * });
 *
 * const subscription = fitin.subscribe(div, ({width, height, scaleX, scaleY, scaleXY}) => {
 *   el.style.width = `${width * scaleX}px`
 *   el.style.height = `${height * scaleY}px`
 *   el.style.fontSize = `${14 * scaleXY}px`
 * });
 *
 * subscription.unsubscribe();
 */

import { ResizeObserver as Polyfill } from "@juggle/resize-observer";
import type { FitinConfig } from "./FitinConfig";
import type { Optional } from "./types";
import { type IResizeEvent, createResizeEvent } from "./event";
import { getDevicePixelRatio, getPhysicalViewportSize } from "./env";
import { assign, memoize, throttle } from "./utils";

const ResizeObserver = window.ResizeObserver || Polyfill;

export type ResizeHandler = (event: IResizeEvent) => void;

export type Subscription = {
  unsubscribe: VoidFunction;
};

export type FitinOptions = Optional<
  FitinConfig,
  "mode" | "minDesignWidth" | "minDesignHeight" | "wait" | "computeScaleXY"
>;

const defaultComputeScaleXY = memoize(
  (designWidth: number, designHeight: number, scaleX: number, scaleY: number) =>
    (designWidth / (designWidth + designHeight)) * scaleX +
    (designHeight / (designWidth + designHeight)) * scaleY,
);

export class Fitin {
  #config: FitinConfig;
  #windowResizeHandler?: ResizeHandler | null;
  #elementResizeHandlers: Map<Element, ResizeHandler>;
  #observer?: ResizeObserver | null;
  #unsubscribes: VoidFunction[] = [];

  #doSubscribeWindow: VoidFunction;

  constructor(options: FitinOptions) {
    const config: Optional<FitinConfig, "computeScaleXY"> = assign(
      {
        mode: "fill",
        minDesignWidth: Math.floor(options.designWidth / 2),
        minDesignHeight: Math.floor(options.designHeight / 2),
        wait: 300,
      },
      options,
    );
    config.computeScaleXY = config.computeScaleXY
      ? memoize(config.computeScaleXY)
      : defaultComputeScaleXY;
    this.#config = config as FitinConfig;

    this.#elementResizeHandlers = new Map();

    /**
     * Since `this` refers to the window object when resize event of window object fires, accessing `this.#windowResizeHandler` from the `#doSubscribeWindow` is denied.
     * And there's a rule saying that **private methods are not writable**, as a result, we should initialize a context binding version during contruction.
     */
    this.#doSubscribeWindow = (() => {
      if (this.#windowResizeHandler) {
        const { width, height } = getPhysicalViewportSize();
        this.#windowResizeHandler(this.#computeResizeEvent(width, height));
      }
    }).bind(this);
  }

  #computeResizeEvent(width: number, height: number) {
    return createResizeEvent(this.#config, width, height);
  }

  #subscribeWindow(handler: ResizeHandler, wait?: number) {
    this.#windowResizeHandler = throttle(handler, wait || this.#config.wait);

    window.removeEventListener("resize", this.#doSubscribeWindow);
    window.addEventListener("resize", this.#doSubscribeWindow);
    // the initial event needs to be triggered manually
    this.#doSubscribeWindow();
  }

  #subscribeElement(container: Element, handler: ResizeHandler, wait?: number) {
    if (!this.#observer) {
      this.#observer = new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
          const handler = this.#elementResizeHandlers.get(entry.target);
          if (handler) {
            const dpr = getDevicePixelRatio();
            const { width, height } = entry.contentRect;
            handler(this.#computeResizeEvent(width * dpr, height * dpr));
          } else {
            observer.unobserve(entry.target);
          }
        }
      });
    }
    if (!this.#elementResizeHandlers.has(container)) {
      // the initial event will be be triggered automatically
      this.#observer.observe(container);
    }
    this.#elementResizeHandlers.set(
      container,
      throttle(handler, wait || this.#config.wait),
    );
  }

  subscribe(handler: ResizeHandler, wait?: number): Subscription;
  subscribe(
    container: HTMLElement,
    handler: ResizeHandler,
    wait?: number,
  ): Subscription;
  subscribe(param0: any, param1: any, param2?: any): Subscription {
    let unsubscribe = () => void 0;

    if (param0 instanceof HTMLElement) {
      this.#subscribeElement(param0, param1, param2);
      unsubscribe = () => {
        this.#elementResizeHandlers.delete(param0);
        if (this.#elementResizeHandlers.size === 0 && this.#observer) {
          this.#observer.disconnect();
          this.#observer = null;
        }
      };
    } else {
      this.#subscribeWindow(param0, param1);
      unsubscribe = () => {
        window.removeEventListener("resize", this.#doSubscribeWindow);
        this.#windowResizeHandler = null;
      };
    }

    this.#unsubscribes.push(unsubscribe);
    return { unsubscribe };
  }

  dispose() {
    for (const unsubscribe of this.#unsubscribes) {
      unsubscribe();
    }
  }
}
