import type { defineComponent } from "vue";
import type LazyImage from "./Image/lazyImage.vue";

export type AspectRatioOption =
  | "1:1"
  | "4:3"
  | "16:9"
  | "21:9"
  | "9:16"
  | "3:4"
  | "9:21";

export type ShapeOption = "circle" | "square" | "roundRect";

export type AspectRatio = AspectRatioOption;
export type Shape = ShapeOption;

export interface ILazyImage {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  delay?: number;
  timeout?: number;
  aspectRatio?: AspectRatio;
  shape?: Shape;
}
