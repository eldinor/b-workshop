import {
  ArcRotateCamera,
  BlackAndWhitePostProcess,
  Camera,
  ConvolutionPostProcess,
  Engine,
  Mesh,
  Scene,
  UniversalCamera,
} from "@babylonjs/core";

export class wEffects {
  scene: Scene;
  camera: ArcRotateCamera;
  cameraArc: ArcRotateCamera;

  // cameraFree: UniversalCamera
  constructor(scene: Scene, camera: ArcRotateCamera) {
    this.scene = scene;
    this.camera = camera;
    this.log();
    if (camera instanceof ArcRotateCamera) {
      this.createArcRotateCamera(camera);
    }
    if (camera instanceof UniversalCamera) {
      console.log("UNIVERSAL CAMERA");
    }
    //
    /*
    this.scene.meshes.forEach((m) => {
      m.renderingGroupId = 3;
    });
    */
    //
  }
  //
  log() {
    console.log("wEffects");
  }

  createArcRotateCamera(camera: ArcRotateCamera) {
    this.cameraArc = camera.clone("wCamera") as ArcRotateCamera;
    this.cameraArc.layerMask = 0x40000000;

    this.scene.activeCameras!.push(camera, this.cameraArc);
    this.scene.activeCamera = camera;

    const observer = this.scene.onBeforeRenderObservable.add(() => {
      this.cameraArc.alpha = this.camera.alpha;
      this.cameraArc.beta = this.camera.beta;
      this.cameraArc.radius = this.camera.radius;
      this.cameraArc.target = this.camera.target;

      //   const curFrame = this.scene.getEngine().frameId;
    });
  }
  showMesh(mesh: Mesh) {
    mesh.layerMask = 0x40000000;
    //  mesh.renderingGroupId = 1;
  }
  bwEffect() {
    const postProcess = new BlackAndWhitePostProcess(
      "bwEffect",
      1.0,
      this.camera
    );
    return [postProcess];
  }
  convoluteEffect() {
    const postprocess = new ConvolutionPostProcess(
      "Sepia",
      ConvolutionPostProcess.EmbossKernel,
      1.0,
      this.camera
    );
  }
}
