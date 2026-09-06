import { createContext, useContext, useEffect } from "react";
import type { Observable } from "rxjs";
import type { IResizeEvent } from "@fitin/core";
import { logE, logW } from "./logging";

export const CanvasContext = createContext<Observable<undefined | IResizeEvent >>(undefined);

const ContainerContext = createContext<string[]>([]);

export function useFitin(
  resizeHandler?: (event: undefined | IResizeEvent) => void,
): undefined | Observable<undefined | IResizeEvent> {
  const resizeObservable = useContext(CanvasContext);
  if (resizeObservable) {
    const paths = useContext(ContainerContext);
    if (paths.find((path) => path === "affect-descendant")) {
      logW("There's an ancestor FitinContainer resizing all descendants");
    }

    useEffect(() => {
      const subscription = resizeObservable.subscribe(resizeHandler);
      return () => subscription.unsubscribe();
    }, [])
  } else {
    logE("A FitinContainer must be used within a FitinCanvas context");
  }

  return resizeObservable;
}