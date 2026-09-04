import { memoize, computeAspectRatio } from "../utils";

export class MemoizeMachine {
  static #instance: undefined | MemoizeMachine;

  computeDesignAspectRatio = memoize(
    (designWidth: number, designHeight: number) =>
      computeAspectRatio(designWidth, designHeight),
  );

  computeEffectiveWidth = memoize((minDesignWidth: number, width: number) =>
    minDesignWidth ? Math.max(minDesignWidth, width) : width,
  );

  computeEffectiveHeight = memoize((minDesignHeight: number, height: number) =>
    minDesignHeight ? Math.max(minDesignHeight, height) : height,
  );

  computeIsMinWidthReached = memoize((minDesignWidth: number, width: number) =>
    minDesignWidth ? width < minDesignWidth : false,
  );

  computeIsMinHeightReached = memoize(
    (minDesignHeight: number, height: number) =>
      minDesignHeight ? height < minDesignHeight : false,
  );

  computeScaleX = memoize(
    (effectiveWidth: number, designWidth: number) =>
      effectiveWidth / designWidth,
  );

  computeScaleY = memoize(
    (effectiveHeight: number, designHeight: number) =>
      effectiveHeight / designHeight,
  );

  private constructor() {}

  static getInstance() {
    if (!MemoizeMachine.#instance) {
      MemoizeMachine.#instance = new MemoizeMachine();
    }
    return MemoizeMachine.#instance;
  }
}
