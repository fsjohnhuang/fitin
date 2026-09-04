import { type InjectionKey } from "vue";
import type { Observable } from "rxjs";
import type { IResizeEvent } from "@fitin/core";

export const FitinCanvasKey: InjectionKey<
  Observable<IResizeEvent | undefined>
> = Symbol("fitin-canvas");

export const FitinContainerKey: InjectionKey<
  ("affect-self" | "affect-descendant")[]
> = Symbol("fitin-container");
