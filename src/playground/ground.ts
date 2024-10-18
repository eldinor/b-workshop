import { Scene, MeshBuilder, Tools, Vector3 } from "@babylonjs/core/";
import "@babylonjs/loaders";

import {
  brownCement,
  checkerTiles,
  cobbleStone,
  createMaterial,
  darkConcrete,
  diamondMetal,
  exposedBrick,
  greyWood,
  oldStone,
  oldStone2,
  oldTiles,
  whiteLeather,
} from "./walls";

export class Ground {
  constructor(private scene: Scene) {
    this._createGround();
    this._createWalls();
  }

  _createGround(): void {
    const { scene } = this;

    const mesh = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 20 },
      scene
    );
    mesh.material = createMaterial("texture/", checkerTiles, "floor", 10);
    mesh.isPickable = false;
    mesh.position.x -= 8;
    mesh.position.z = 0.35;
    // new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)

    const ceilingPlane = mesh.createInstance("ceilingPlane");
    ceilingPlane.position.y = 4;
    ceilingPlane.rotation.x = Tools.ToRadians(180);
  }

  _createWalls() {
    const plane1 = MeshBuilder.CreatePlane("plane1", {
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
    plane2.position.x = -5;

    const plane3 = plane1.createInstance("plane3");

    plane3.rotation.y = Math.PI;
    plane3.position.z = -5;
    plane3.position.x = -5;

    const plane4 = plane1.createInstance("plane4");

    plane4.rotation.y = -Math.PI / 2;

    plane4.position.x = -10;
    plane4.position.z = 5.6;
    //
    const plane5 = plane1.createInstance("plane5");

    plane5.rotation.y = -Math.PI / 2;

    plane5.position.x = -10;
    plane5.position.z = -5.6;

    const plane6 = plane1.clone("plane6");

    plane6.rotation.y = -Math.PI / 2;

    plane6.position.x = -10.01;
    plane6.position.y = 3.98;

    plane6.material = createMaterial("texture/", brownCement, "plane6", 1);
    plane6.scaling = new Vector3(0.3, 0.3, 0.3);

    /*
    const plane5 = plane1.createInstance("plane5");

    plane5.rotation.y = -Math.PI / 2;

    plane5.position.x = -8;
    plane5.position.z = -7;

    const plane6 = plane1.createInstance("plane6");

    plane6.rotation.y = -Math.PI;

    plane6.position.x = -13;
    plane6.position.z = -2;

    const plane7 = plane1.createInstance("plane7");

    plane7.rotation.y = 0;

    plane7.position.x = -13;
    plane7.position.z = 2;
    */
  }
}
