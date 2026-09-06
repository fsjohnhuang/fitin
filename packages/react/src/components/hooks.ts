import { createContext, useContext, useEffect, useState } from "react";
import type { Observable } from "rxjs";
import type { IResizeEvent } from "@fitin/core";
import { logE, logW } from "./logging";

export const CanvasContext = createContext<Observable<undefined | IResizeEvent > | undefined>(undefined);

const ContainerContext = createContext<string[]>([]);

export function useFitin(
  resizeHandler?: (event: undefined | IResizeEvent) => void,
): undefined | Observable<undefined | IResizeEvent> {
  const resizeObservable = useContext(CanvasContext);
  const paths = useContext(ContainerContext);
    
    useEffect(() => {
        if (resizeObservable) {
            if (paths.find((path) => path === "affect-descendant")) {
            logW("There's an ancestor FitinContainer resizing all descendants");
            }

            const subscription = resizeObservable.subscribe(resizeHandler);
            return () => subscription.unsubscribe();
        } else {
            logE("A FitinContainer must be used within a FitinCanvas context");
        }
    }, []);
  return resizeObservable;
}

export function useFitinState() {
  const [state, setState] = useState<{
    scaleX: number;
    scaleY: number;
    scaleXY: number;
    effectiveWidth: undefined | number;
    effectiveHeight: undefined | number;
  }>({
    scaleX: 1,
    scaleY: 1,
    scaleXY: 1,
    effectiveWidth: undefined,
    effectiveHeight: undefined,
  });
  useFitin((event) => {
    if (event) {
        setState({
            scaleX: event.scaleX,
            scaleY: event.scaleY,
            scaleXY: event.scaleXY,
            effectiveWidth: event.effectiveWidth,
            effectiveHeight: event.effectiveHeight,
        })
      
    }
  });

  return state;
}
