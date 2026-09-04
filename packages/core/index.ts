import { Fitin, getDevicePixelRatio } from "./src";
import { canvasToBlobUrl, drawShapes } from "./helper";
declare global {
  interface Window {
    Fitin: typeof Fitin;
    drawShapes: typeof drawShapes;
    canvasToBlobUrl: typeof canvasToBlobUrl;
    getDevicePixelRatio: typeof getDevicePixelRatio;
  }
}

window.Fitin = Fitin;
window.drawShapes = drawShapes;
window.canvasToBlobUrl = canvasToBlobUrl;
window.getDevicePixelRatio = getDevicePixelRatio;
