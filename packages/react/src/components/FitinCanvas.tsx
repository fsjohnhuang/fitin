import { useEffect, useMemo, useRef, useContext, type CSSProperties, type ReactNode } from "react";
import { BehaviorSubject } from "rxjs";
import { Fitin, type Mode, type IResizeEvent } from "@fitin/core";
import { CanvasContext } from "./hooks";
import { logE } from "./logging";

type FitinCanvasProps = {
  children: ReactNode;
  designWidth: number; // physical design width of container
  designHeight: number; // physical design height of container
  mode?: Mode;
  minDesignWidth?: number; // minimum physical design width of container
  minDesignHeight?: number; // minimum physical design height of container
  wait?: number; // in ms
  computeScaleXY?: (
    designWidth: number,
    designHeight: number,
    scaleX: number,
    scaleY: number,
  ) => number;
  viewport?: HTMLElement | "parent";
  center?: boolean;
}

export default function FitinCanvas(props: FitinCanvasProps) {
  const canvasRef = useRef<HTMLElement>(null);
  const canvasStyle = useMemo<CSSProperties>(() => props.center
    ? {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "hidden"
      }
    : {
        position: "relative",
        overflow: "hidden",
    }, [props.center]);

  const fitin = useRef<Fitin>(undefined);
  const subject = useRef(new BehaviorSubject<IResizeEvent | undefined>(undefined));
  const resizeObservable = useContext(CanvasContext);

  useEffect(() => {
    if (resizeObservable) {
        logE("Nested FitinCanvas is forbidden");
        return;
    }

    fitin.current = new Fitin(props);

    const handleResize = (event: IResizeEvent) => {
      if (event && canvasRef.current) {
        canvasRef.current.style.width = `${event.effectiveWidth}px`;
        canvasRef.current.style.height = `${event.effectiveHeight}px`;
      }
      subject.current.next(event);
    };

    const viewport =
        props.viewport === "parent"
        ? canvasRef.current?.parentElement
        : props.viewport;
    if (viewport) {
        fitin.current.subscribe(viewport, handleResize);
    } else {
        fitin.current.subscribe(handleResize);
    }

    return () => {
        fitin.current.dispose();
    }
  }, [props, resizeObservable]);

  return (
    <section ref={canvasRef} role="fitin-canvas" style={canvasStyle}>
        <CanvasContext.Provider value={subject.current.asObservable()}>
            {props.children}
        </CanvasContext.Provider>
    </section>
  )
}