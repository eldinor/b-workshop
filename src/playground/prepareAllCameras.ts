import {
  Animation,
  ArcRotateCamera,
  Color4,
  CubicEase,
  EasingFunction,
  Scene,
  Tools,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import { WORKSHOP } from "./workshop";

export class prepareAllCameras {
  camera: ArcRotateCamera;
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this._setCamera(this.scene);
    this._prepareFPSCamera();
  }

  _setCamera(scene: Scene): void {
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    document.body.style.backgroundImage = "img/cover1.png";
    this.camera = new ArcRotateCamera(
      WORKSHOP.CAMERAS.mainCamera.name,
      Tools.ToRadians(190),
      Tools.ToRadians(70),
      8,
      Vector3.Zero(),
      scene
    );
    this.camera.attachControl(
      this.scene.getEngine().getRenderingCanvas(),
      true
    );
    this.camera.setTarget(Vector3.Zero());
    //
    this.camera.minZ = 0.1;
    this.camera.wheelDeltaPercentage = 0.01;
  }

  get mainCamera() {
    return this.camera;
  }
  //
  _prepareFPSCamera() {
    const camera = new UniversalCamera(
      WORKSHOP.CAMERAS.firstViewCamera.name,
      new Vector3(-7.44, 2.01, 0.15),
      this.scene
    );
    camera.setTarget(new Vector3(-3.1, 1.4, 0.15));
  }
  //
}

export function animateCamera(scene: Scene) {
  const easingFunction = new CubicEase();
  easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  const camera = scene.getCameraByName(
    WORKSHOP.CAMERAS.mainCamera.name
  ) as ArcRotateCamera;
  scene.activeCamera = camera;
  camera.alpha = camera.alpha % (2 * Math.PI);
  Animation.CreateAndStartAnimation(
    "reverse",
    camera,
    "target",
    60,
    120,
    camera.target,
    new Vector3(-9.35, 0.75, -2.32),
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    easingFunction
  );
  //  this.camera.setTarget(new Vector3(-9.346, 0.749, -2.316));
  Animation.CreateAndStartAnimation(
    "alpha",
    camera,
    "alpha",
    60,
    120,
    camera.alpha,
    0.495,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    easingFunction
  );

  // this.camera.rebuildAnglesAndRadius();
  //this.camera.alpha = 0.6;
  Animation.CreateAndStartAnimation(
    "beta",
    camera,
    "beta",
    60,
    120,
    camera.beta,
    1.44,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    easingFunction
  );

  //  this.camera.beta = 1.5;
  Animation.CreateAndStartAnimation(
    "radius",
    camera,
    "radius",
    60,
    120,
    camera.radius,
    5,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    easingFunction
  );
  // this.camera.radius = 5;
}
