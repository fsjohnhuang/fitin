import { useRef, useState, type ReactNode } from "react";
import { Fitin, type Mode, type IResizeEvent } from "@fitin/core";

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
  const [setCenterStyle, centerStyle] = useState({});

  return (
    <section ref={canvasRef} role="fitin-canvas" style={{
        position: 'relative',
        ...centerStyle,
        overflow: 'hidden'
    }}>
        {props.children}
    </section>
  )
}