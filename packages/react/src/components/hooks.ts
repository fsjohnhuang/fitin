import { createContext } from "react";
import type { Observable } from "rxjs";
import type { IResizeEvent } from "@fitin/core";

export const CanvasContext = createContext<Observable<undefined | IResizeEvent >>(undefined);