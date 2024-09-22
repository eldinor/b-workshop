import { Vector3 } from "@babylonjs/core";

export interface ISingleModels {
  url: string;
  name: string;
  scalingFactor: number;
  position: Vector3;
  options?: ISingleModelsOptions;
  glow?: boolean;
  glowLevel?: number;
}

export interface ISingleModelsOptions {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

export const singleMeshesList: Array<ISingleModels> = [
  {
    url: "kit/lockers-opt.glb",
    name: "lockers",
    scalingFactor: 1,
    position: new Vector3(-0.2, 0.2, 4.73),
    options: { rotateY: -90 },
  },
  {
    url: "kit/vintage_milk_can_-_01-opt.glb",
    name: "old_can",
    scalingFactor: 0.1,
    position: new Vector3(-0.64, 0, -4.71),
  },
  {
    url: "kit/simple_propane_tank_2-opt.glb",
    name: "propan_small",
    scalingFactor: 0.1,
    position: new Vector3(-0.3, 0.28, 3),
  },
  {
    url: "kit/broom_wood_-_5mb-opt.glb",
    name: "broom",
    scalingFactor: 0.007,
    position: new Vector3(-0.345, 0.25, 2),
    options: { rotateZ: -15 },
  },
  {
    url: "kit/lamp-opt.glb",
    name: "ceiling_lamp",
    scalingFactor: 1,
    position: new Vector3(-2, 4, -4),
    glow: true,
  },
  {
    url: "kit/wooden_chair-opt.glb",
    name: "wooden_chair",
    scalingFactor: 1,
    position: new Vector3(-1.19, 0, -2.84),
    options: { rotateY: 60 },
  },
  {
    url: "kit/workbench-opt.glb",
    name: "workbench_empty",
    scalingFactor: 1,
    position: new Vector3(-0.75, 0, -4),
    options: { rotateY: -90 },
  },
  {
    url: "kit/trash_can-opt.glb",
    name: "trash_can",
    scalingFactor: 0.001,
    position: new Vector3(-0.2, 0.1, -1.55),
  },
  {
    url: "kit/jerrycan-opt.glb",
    name: "jerrycan",
    scalingFactor: 1,
    position: new Vector3(-1.1, 0.25, -4.75),
    options: { rotateY: 120 },
  },
  {
    url: "kit/capsule-opt.glb",
    name: "capsule",
    scalingFactor: 0.01,
    position: new Vector3(-0.45, 0.85, -3.8),
    options: { rotateY: -70 },
    glow: true,
  },
  {
    url: "kit/first_aid_kit-opt.glb",
    name: "firstaid",
    scalingFactor: 1,
    position: new Vector3(-0.2, 0.76, -4.65),
    options: { rotateY: -160 },
  },
  {
    url: "kit/pipeshelf_opt.glb",
    name: "pipeshelf",
    scalingFactor: 0.1,
    position: new Vector3(-0.15, 1.7, 3.4),
  },
  {
    url: "kit/table-opt.glb",
    name: "small_worktable",
    scalingFactor: 1,
    position: new Vector3(-4.15, 0.5, -4.6),
    options: { rotateY: -90 },
  },
  {
    url: "kit/azot-opt.glb",
    name: "azot",
    scalingFactor: 0.2,
    position: new Vector3(-0.2, 1.075, 3.96),
    options: { rotateY: -115 },
  },
  {
    url: "kit/military_radio-v2-opt.glb",
    name: "military_radio",
    scalingFactor: 1,
    position: new Vector3(-0.5, 1.09, -5.6),
    glow: true,
  },
  {
    url: "kit/metal_garbage_bin-opt.glb",
    name: "metal_garbage_bin",
    scalingFactor: 0.5,
    position: new Vector3(-0.25, 0, 1.5),
  },
  {
    url: "kit/industrial_electrical_box02-_10mb-opt.glb",
    name: "electrical_box_big",
    scalingFactor: 1,
    position: new Vector3(-4.6, 1.7, 4.9),
    options: { rotateY: 180 },
    glow: true,
  },
  {
    url: "kit/industrial_electrical_box-11mb-opt.glb",
    name: "electrical_box_small",
    scalingFactor: 0.5,
    position: new Vector3(-4.6, 1.9, -4.9),
    glow: true,
  },
  {
    url: "kit/old_leather_armchair-opt.glb",
    name: "leather_armchair",
    scalingFactor: 0.01,
    position: new Vector3(-1.4, 0, 4.25),
    options: { rotateY: 210 },
  },
  {
    url: "kit/anomaly_detector-opt.glb",
    name: "anomaly_detector",
    scalingFactor: 0.05,
    position: new Vector3(-0.45, 0.88, -3.4),
    options: { rotateY: 60 },
  },
  {
    url: "kit/himik-o-v1.glb",
    name: "himik",
    scalingFactor: 0.5,
    position: new Vector3(-0.37, 0.38, -0.45),
    options: { rotateX: 0, rotateY: 20, rotateZ: -90 },
  },
  {
    url: "kit/battery_fallout-opt.glb",
    name: "battery",
    scalingFactor: 1,
    position: new Vector3(-0.14, 1.89, 3.1),
  },
  {
    url: "kit/wooden_table_4_opt.glb",
    name: "wooden_table_4",
    scalingFactor: 1,
    position: new Vector3(-3.3, 0.47, 4.35),
    options: { rotateX: 0, rotateY: -90, rotateZ: 0 },
  },
];
