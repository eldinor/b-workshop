import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export const ROOMBOX = {
  width: 10,
  depth: 10,
  height: 4,
  wallThickness: 0.18,
  floorThickness: 0.2,
  origin: new Vector3(-5, 0, 0),
} as const;

export const WORKBENCH_POSITION = new Vector3(-0.4, 0, 0);
export const WORKBENCH_LIGHT_TARGET = new Vector3(-0.4, 0.9, 0);
