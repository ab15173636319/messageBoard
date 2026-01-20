const ASPECTRATIO = [
  "1:1",
  "4:3",
  "16:9",
  "21:9",
  "9:16",
  "3:4",
  "9:21",
] as const;

export type aspectRatio = (typeof ASPECTRATIO)[number];
