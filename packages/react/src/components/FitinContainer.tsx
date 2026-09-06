import { useRef, type CSSProperties, type ReactNode } from "react";

type FitinContainerProps = {
  designWidth: number;
  designHeight: number;
  transformOriginX?: "left" | "center" | "right";
  transformOriginY?: "top" | "center" | "bottom";
  style?: CSSProperties;
  class?: string;
  children?: ReactNode;
};

export default function FitinContainer(props: FitinContainerProps) {
    const fitinStyle = useRef<CSSProperties>({});

    return (
    <section
        role="fitin-container"
        data-scope="affectScope"
        style={{...props.style, ...fitinStyle.current}}
        className={props.class}
    >
        {props.children}
    </section>
    )
}
