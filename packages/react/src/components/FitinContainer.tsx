import type { IResizeEvent } from "@fitin/core";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useFitin } from "./hooks";

type FitinContainerProps = {
  designWidth: number;
  designHeight: number;
  transformOriginX?: "left" | "center" | "right";
  transformOriginY?: "top" | "center" | "bottom";
  style?: CSSProperties;
  class?: string;
  children?: ReactNode;
};

function getFitinStyle(
  event: IResizeEvent,
  props: FitinContainerProps,
): CSSProperties {
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
    return {
      position: "absolute",
      width: props.designWidth,
      height: props.designHeight,
      transform: transform,
      transformOrigin: transformOrigin,
    };
  } else {
    return {
      width: event.scaleX * props.designWidth,
      height: event.scaleY * props.designHeight,
    };
  }
}

export default function FitinContainer(props: FitinContainerProps) {
  const [fitinStyle, setFitinStyle] = useState<CSSProperties>({});
  const affectScope = useMemo(
    () =>
      props.transformOriginX || props.transformOriginY
        ? "affect-descendant"
        : "affect-self",
    [props.transformOriginX, props.transformOriginY],
  );

  const resizeObservable = useFitin();
  useEffect(() => {
    if (resizeObservable) {
      const subscription = resizeObservable.subscribe(
        (event: IResizeEvent | undefined) => {
          if (event) {
            setFitinStyle(getFitinStyle(event, props));
          }
        },
      );
      return () => subscription.unsubscribe();
    }
  }, []);

  const style = useMemo(
    () => ({ ...props.style, ...fitinStyle }),
    [props.style, fitinStyle],
  );

  return (
    <section
      role="fitin-container"
      data-scope={affectScope}
      style={style}
      className={props.class}
    >
      {props.children}
    </section>
  );
}
