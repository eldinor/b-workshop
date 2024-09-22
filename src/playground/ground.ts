import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders";
import {
  checkerTiles,
  cobbleStone,
  createMaterial,
  darkConcrete,
  diamondMetal,
  exposedBrick,
  greyWood,
  oldStone,
  oldTiles,
  whiteLeather,
} from "./walls";

export class Ground {
  constructor(private scene: BABYLON.Scene) {
    this._createGround();
    this._createWalls();
  }

  _createGround(): void {
    const { scene } = this;

    const mesh = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 20 },
      scene
    );
    mesh.material = createMaterial("texture/", checkerTiles, "floor", 10);
    mesh.isPickable = false;
    // new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
  }

  _createWalls() {
    const plane1 = BABYLON.MeshBuilder.CreatePlane("plane1", {
      width: 10,
      height: 10,
    });
    plane1.material = createMaterial("texture/", exposedBrick, "wall", 5);
    plane1.rotation.y = Math.PI / 2;
    plane1.position.x = 0;
    plane1.isPickable = false;

    //
    const plane2 = plane1.createInstance("plane2");

    plane2.rotation.y = 0;
    plane2.position.z = 5;

    const plane3 = plane1.createInstance("plane3");

    plane3.rotation.y = Math.PI;
    plane3.position.z = -5;
  }
}
