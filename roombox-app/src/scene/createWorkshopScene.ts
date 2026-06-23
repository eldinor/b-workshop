import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { Scene } from "@babylonjs/core/scene";
import { createRoombox } from "./createRoombox";
import { loadWorkshopModels } from "./loadWorkshopModels";
import {
  ROOMBOX,
  WORKBENCH_LIGHT_TARGET,
} from "./roomboxConfig";

export async function createWorkshopScene(
  engine: Engine,
  canvas: HTMLCanvasElement,
): Promise<Scene> {
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#171511ff");
  scene.ambientColor = Color3.FromHexString("#0d0e10");

  createRoombox(scene);
  await loadWorkshopModels(scene);
  createCamera(scene, canvas);
  createLighting(scene);

  return scene;
}

function createCamera(scene: Scene, canvas: HTMLCanvasElement): void {
  const camera = new ArcRotateCamera(
    "roombox-camera",
    degreesToRadians(190),
    degreesToRadians(70),
    8,
    Vector3.Zero(),
    scene,
  );
  camera.wheelDeltaPercentage = 0.01;
  camera.panningSensibility = 0;
  camera.minZ = 0.1;
  camera.attachControl(canvas, true);
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function createLighting(scene: Scene): void {
  const environment = new HemisphericLight(
    "low-environment-light",
    new Vector3(0, 1, -0.25),
    scene,
  );
  environment.intensity = 0.22;
  environment.diffuse = Color3.FromHexString("#d8d5cd");
  environment.groundColor = Color3.FromHexString("#15171a");

  const position = new Vector3(
    WORKBENCH_LIGHT_TARGET.x,
    ROOMBOX.height - 0.35,
    WORKBENCH_LIGHT_TARGET.z - 0.25,
  );
  const direction = WORKBENCH_LIGHT_TARGET.subtract(position).normalize();
  const workbenchLight = new SpotLight(
    "warm-workbench-spotlight",
    position,
    direction,
    Math.PI / 2.8,
    2,
    scene,
  );
  workbenchLight.diffuse = Color3.FromHexString("#ffd39a");
  workbenchLight.specular = Color3.FromHexString("#ffcf91");
  workbenchLight.intensity = 9;
}
