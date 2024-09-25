import {
  Animation,
  ArcRotateCamera,
  Vector3,
  CubicEase,
  EasingFunction,
} from "@babylonjs/core";

export function moveCamera(
  camera: ArcRotateCamera,
  alpha: number,
  beta: number,
  radius: number,
  target: Vector3,
  totalFrame: number
) {
  //console.log(camera.alpha);
  // camera.alpha = camera.alpha + (camera.alpha % Tools.ToRadians(360));
  //console.log(camera.alpha);

  const framePerSecond = 60;

  camera.checkCollisions = false;
  const ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  //
  Animation.CreateAndStartAnimation(
    "cam_alpha",
    camera,
    "alpha",
    framePerSecond,
    totalFrame,
    camera.alpha,
    alpha,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );
  Animation.CreateAndStartAnimation(
    "cam_beta",
    camera,
    "beta",
    framePerSecond,
    totalFrame,
    camera.beta,
    beta,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );
  Animation.CreateAndStartAnimation(
    "cam_target",
    camera,
    "target",
    framePerSecond,
    totalFrame,
    camera.target,
    //  this.scene.getMeshByName("military_radio")!.position,
    target,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );
  Animation.CreateAndStartAnimation(
    "cam_radius",
    camera,
    "radius",
    framePerSecond,
    totalFrame,
    camera.radius,
    radius,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );
  setTimeout(() => {
    camera.checkCollisions = true;
  }, (totalFrame / framePerSecond) * 1000 + 100);
}
