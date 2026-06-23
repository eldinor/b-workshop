import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Space } from "@babylonjs/core/Maths/math.axis";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { WORKBENCH_POSITION } from "./roomboxConfig";

interface RotationOptions {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

interface ModelPlacement {
  url: string;
  name: string;
  scalingFactor: number;
  position: Vector3;
  options?: RotationOptions;
}

const complexModels: readonly ModelPlacement[] = [
  {
    url: "/assets/models/old_work_bench-opt.glb",
    name: "old_work_bench",
    scalingFactor: 1,
    position: WORKBENCH_POSITION,
  },
];

const singleModels: readonly ModelPlacement[] = [
  {
    url: "/assets/models/lockers-opt.glb",
    name: "lockers",
    scalingFactor: 1,
    position: new Vector3(-0.2, 0.2, 4.73),
    options: { rotateY: -90 },
  },
  {
    url: "/assets/models/vintage_milk_can_-_01-opt.glb",
    name: "old_can",
    scalingFactor: 0.1,
    position: new Vector3(-0.64, 0, -4.71),
  },
  {
    url: "/assets/models/simple_propane_tank_2-opt.glb",
    name: "propan_small",
    scalingFactor: 0.1,
    position: new Vector3(-0.3, 0.28, 3),
  },
  {
    url: "/assets/models/broom_wood_-_5mb-opt.glb",
    name: "broom",
    scalingFactor: 0.007,
    position: new Vector3(-0.345, 0.25, 2),
    options: { rotateZ: -15 },
  },
  {
    url: "/assets/models/wooden_chair-opt.glb",
    name: "wooden_chair",
    scalingFactor: 1,
    position: new Vector3(-1.19, 0, -2.84),
    options: { rotateY: 60 },
  },
  {
    url: "/assets/models/workbench-opt.glb",
    name: "workbench_empty",
    scalingFactor: 1,
    position: new Vector3(-0.75, 0, -4),
    options: { rotateY: -90 },
  },
  {
    url: "/assets/models/trash_can-opt.glb",
    name: "trash_can",
    scalingFactor: 0.001,
    position: new Vector3(-0.2, 0.1, -1.55),
  },
  {
    url: "/assets/models/jerrycan-opt.glb",
    name: "jerrycan",
    scalingFactor: 1,
    position: new Vector3(-1.1, 0.25, -4.75),
    options: { rotateY: 120 },
  },
  {
    url: "/assets/models/capsule-opt.glb",
    name: "capsule",
    scalingFactor: 0.01,
    position: new Vector3(-0.45, 0.85, -3.8),
    options: { rotateY: -70 },
  },
  {
    url: "/assets/models/first_aid_kit-opt.glb",
    name: "firstaid",
    scalingFactor: 1,
    position: new Vector3(-0.2, 0.76, -4.65),
    options: { rotateY: -160 },
  },
  {
    url: "/assets/models/pipeshelf_opt.glb",
    name: "pipeshelf",
    scalingFactor: 0.1,
    position: new Vector3(-0.15, 1.7, 3.4),
  },
  {
    url: "/assets/models/table-opt.glb",
    name: "small_worktable",
    scalingFactor: 1,
    position: new Vector3(-4.15, 0.5, -4.6),
    options: { rotateY: -90 },
  },
  {
    url: "/assets/models/azot-opt.glb",
    name: "azot",
    scalingFactor: 0.2,
    position: new Vector3(-0.2, 1.075, 3.96),
    options: { rotateY: -115 },
  },
  {
    url: "/assets/models/metal_garbage_bin-opt.glb",
    name: "metal_garbage_bin",
    scalingFactor: 0.5,
    position: new Vector3(-0.25, 0, 1.5),
  },
  {
    url: "/assets/models/old_leather_armchair-opt.glb",
    name: "leather_armchair",
    scalingFactor: 0.01,
    position: new Vector3(-2.4, 0, 4.25),
    options: { rotateY: 210 },
  },
  {
    url: "/assets/models/wooden_table_4_opt.glb",
    name: "wooden_table_4",
    scalingFactor: 1,
    position: new Vector3(-4.9, 0.47, 4.35),
    options: { rotateX: 0, rotateY: -90, rotateZ: 0 },
  },
  {
    url: "/assets/models/old_radio-opt.glb",
    name: "old_radio",
    scalingFactor: 0.02,
    position: new Vector3(-4.7, 1.16, 4),
    options: { rotateX: 0, rotateY: 180, rotateZ: 0 },
  },
  {
    url: "/assets/models/soviet_kettle-opt.glb",
    name: "old_kettle",
    scalingFactor: 0.3,
    position: new Vector3(-5.56, 0.95, 4.5),
    options: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  },
  {
    url: "/assets/models/fridge.glb",
    name: "fridge",
    scalingFactor: 1,
    position: new Vector3(-9.59, 0.075, -4.55),
    options: { rotateX: 0, rotateY: 180, rotateZ: 0 },
  },
];

export async function loadWorkshopModels(scene: Scene): Promise<void> {
  // Preserve the original load order while the migration is being validated.
  for (const model of complexModels) {
    await loadComplexModel(scene, model);
  }

  for (const model of singleModels) {
    await loadSingleModel(scene, model);
  }
}

async function loadSingleModel(
  scene: Scene,
  model: ModelPlacement,
): Promise<void> {
  const result = await ImportMeshAsync(model.url, scene);
  const singleMesh = result.meshes[1];
  const importedRoot = result.meshes[0];

  if (!singleMesh || !importedRoot) {
    throw new Error(`${model.name} does not match the expected single GLB shape.`);
  }

  // Keep this sequence aligned with the original loadModels implementation.
  singleMesh.setParent(null);
  importedRoot.dispose();
  singleMesh.name = model.name;
  singleMesh.scaling.scaleInPlace(model.scalingFactor);
  singleMesh.position = model.position;
  applyWorldRotation(singleMesh, model.options);
}

async function loadComplexModel(
  scene: Scene,
  model: ModelPlacement,
): Promise<void> {
  const result = await ImportMeshAsync(model.url, scene);
  const root = result.meshes[0];

  if (!root) {
    throw new Error(`${model.name} does not have an imported root node.`);
  }

  // Keep this sequence aligned with the original loadComplexModels implementation.
  root.name = model.name;
  root.scaling.scaleInPlace(model.scalingFactor);
  root.position = model.position;
  applyWorldRotation(root, model.options);
}

function applyWorldRotation(
  mesh: { rotate: (axis: Vector3, amount: number, space: Space) => unknown },
  options?: RotationOptions,
): void {
  if (options?.rotateX) {
    mesh.rotate(Vector3.Right(), toRadians(options.rotateX), Space.WORLD);
  }
  if (options?.rotateY) {
    mesh.rotate(Vector3.Up(), toRadians(options.rotateY), Space.WORLD);
  }
  if (options?.rotateZ) {
    mesh.rotate(Vector3.Forward(), toRadians(options.rotateZ), Space.WORLD);
  }
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
