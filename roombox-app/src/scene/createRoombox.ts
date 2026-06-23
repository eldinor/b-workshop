import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import type { Scene } from "@babylonjs/core/scene";
import { ROOMBOX } from "./roomboxConfig";

export function createRoombox(scene: Scene): void {
  const shellMaterial = new PBRMaterial("shell-material", scene);
  shellMaterial.albedoColor = Color3.FromHexString("#4a4640");
  shellMaterial.metallic = 0;
  shellMaterial.roughness = 0.92;

  const floorMaterial = new PBRMaterial("floor-material", scene);
  floorMaterial.albedoColor = Color3.FromHexString("#292722");
  floorMaterial.metallic = 0;
  floorMaterial.roughness = 0.86;

  const floor = MeshBuilder.CreateBox(
    "roombox-floor",
    {
      width: ROOMBOX.width,
      depth: ROOMBOX.depth,
      height: ROOMBOX.floorThickness,
    },
    scene,
  );
  floor.position.copyFromFloats(
    ROOMBOX.origin.x,
    ROOMBOX.origin.y - ROOMBOX.floorThickness / 2,
    ROOMBOX.origin.z,
  );
  floor.material = floorMaterial;
  floor.isPickable = false;

  const workbenchWall = MeshBuilder.CreateBox(
    "roombox-workbench-wall",
    {
      width: ROOMBOX.wallThickness,
      depth: ROOMBOX.depth,
      height: ROOMBOX.height,
    },
    scene,
  );
  workbenchWall.position.copyFromFloats(
    ROOMBOX.origin.x + ROOMBOX.width / 2,
    ROOMBOX.origin.y + ROOMBOX.height / 2,
    ROOMBOX.origin.z,
  );
  workbenchWall.material = shellMaterial;
  workbenchWall.isPickable = false;

  for (const side of [-1, 1] as const) {
    const wall = MeshBuilder.CreateBox(
      side === -1 ? "roombox-near-wall" : "roombox-far-wall",
      {
        width: ROOMBOX.width,
        depth: ROOMBOX.wallThickness,
        height: ROOMBOX.height,
      },
      scene,
    );
    wall.position.copyFromFloats(
      ROOMBOX.origin.x,
      ROOMBOX.origin.y + ROOMBOX.height / 2,
      ROOMBOX.origin.z + side * ROOMBOX.depth / 2,
    );
    wall.material = shellMaterial;
    wall.isPickable = false;
  }
}
