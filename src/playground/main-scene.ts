import {
  ArcRotateCamera,
  Scene,
  Engine,
  Tools,
  Vector3,
  HemisphericLight,
  DefaultRenderingPipeline,
  PointLight,
  Color3,
  SpotLight,
  SceneLoader,
  Mesh,
  Space,
  GlowLayer,
  AbstractMesh,
  GPUPicker,
  BlurPostProcess,
  Vector2,
  Color4,
  UniversalCamera,
  ReflectionProbe,
  PBRMaterial,
} from "@babylonjs/core/";
import { InstancedMesh } from "@babylonjs/core/Meshes/instancedMesh";
import "@babylonjs/loaders";
import { HtmlMesh, HtmlMeshRenderer } from "babylon-htmlmesh";
import { Ground } from "./ground";

import {
  ISingleModels,
  ISingleModelsOptions,
  singleMeshesList,
} from "./singleMeshesList";

export default class MainScene {
  private camera: ArcRotateCamera;
  private isPickedGood: boolean = false;
  private meshPicked: AbstractMesh;
  private roomPicker: GPUPicker;
  public pickArray: Array<Mesh> = [];
  private instaMesh: InstancedMesh | Mesh;

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    this.loadComponents();
    this._setPipeLine();
  }

  _setCamera(scene: Scene): void {
    this.scene.clearColor = new Color4(0, 0, 0, 0);

    this.camera = new ArcRotateCamera(
      "camera",
      Tools.ToRadians(190),
      Tools.ToRadians(70),
      8,
      Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(Vector3.Zero());
    //
    this.camera.minZ = 0.1;
    this.camera.wheelDeltaPercentage = 0.01;
    //
    //
  }

  _setLight(scene: Scene): void {
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
    this.scene.environmentIntensity = 0.4;
    //
    const pointLight1 = new PointLight(
      "pointLight1",
      new Vector3(-0.6, 1.65, 0.15)
    );
    pointLight1.intensity = 4;
    //
    const pointLight2 = pointLight1.clone("pointLight2") as PointLight;
    pointLight2.position.z = -1;
    //
    pointLight1.diffuse = new Color3(87 / 255, 167 / 255, 167 / 255);
    pointLight2.diffuse = new Color3(200 / 255, 200 / 255, 90 / 255);
    //
    const pointLight3 = pointLight1.clone("pointLight3") as SpotLight;
    pointLight3.position.z = -3;
    //
    const spotlight = new SpotLight(
      "spotlight",
      new Vector3(-2, 2.5, -4),
      new Vector3(0.05, -1, 0.05),
      3.9,
      2
    );
    spotlight.intensity = 70;
    spotlight.diffuse = new Color3(200 / 255, 200 / 255, 100 / 255);
    //
    const spotlight2 = spotlight.clone("spotlight2") as SpotLight;
    spotlight2.position.z = 4;
    spotlight2.direction.x = -0.05;
    spotlight2.direction.z = -0.05;
  }

  _setPipeLine(): void {
    const pipeline = new DefaultRenderingPipeline(
      "workshop_pipeline",
      false,
      this.scene,
      [this.scene.activeCamera!]
    );
    pipeline.fxaaEnabled = true;
    pipeline.samples = 4;
    // pipeline.imageProcessingEnabled = true
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType = 2;
    //
    pipeline.sharpenEnabled = true;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);
    //
    const res = await SceneLoader.ImportMeshAsync(
      "",
      "kit/old_work_bench-opt.glb"
    );

    res.meshes[0].scaling.scaleInPlace(1);
    res.meshes[0].position.x = -0.4;
    //

    for (const item of singleMeshesList) {
      await this.loadModels(
        item.url,
        item.name,
        item.scalingFactor,
        item.position,
        item.options
      );
    }

    this.scene.materials.forEach((m: any) => {
      m.maxSimultaneousLights = 8;
    });
    //
    //
    const top = document.createElement("div");
    top.style.width = "500px";
    top.style.height = "50px";
    top.style.zIndex = "1000";
    top.id = "top";
    top.style.position = "absolute";
    top.style.margin = "0 auto";
    top.style.top = "10px";
    top.style.right = "10px";
    top.style.color = "yellow";
    top.innerHTML = "Press R to view closer";
    document.body.appendChild(top);
    //

    //
    const gl = new GlowLayer("gl");
    gl.intensity = 0.7;
    for (const item of singleMeshesList) {
      if (item.glow) {
        gl.addIncludedOnlyMesh(this.scene.getMeshByName(item.name) as Mesh);
      }
      this.pickArray.push(this.scene.getMeshByName(item.name) as Mesh);
    }

    console.log(gl);
    //
    this.roomPicker = new GPUPicker();
    this.roomPicker.setPickingList(this.pickArray);
    console.log(this.roomPicker);
    console.log(this.pickArray);
    //
    //

    this.scene.onPointerObservable.add(() => {
      this.roomPicker
        .pickAsync(this.scene.pointerX, this.scene.pointerY)
        .then((pickingInfo) => {
          if (pickingInfo) {
            console.log(pickingInfo.mesh.name);
            if (
              this.scene.activeCamera!.name == "camera" ||
              this.scene.activeCamera!.name == "FirstViewCamera"
            ) {
              this.isPickedGood = true;
              this.meshPicked = pickingInfo.mesh;
              top.innerHTML =
                pickingInfo.mesh.name + "<br>Press R to view closer";
            }
          } else {
            this.isPickedGood = false;
            top.innerHTML = "";
          }
        });
    });
    //
    // this._setFPSCamera();
    //
    //

    let OneKeyCounter = 0;
    let rKeyCounter = 0;
    document.addEventListener("keyup", (event) => {
      const keyName = event.key;
      if (keyName === "1" || keyName === "!") {
        OneKeyCounter++;
        if (OneKeyCounter % 2 == 0) {
          this.scene.activeCamera!.detachControl();
          this.scene.activeCamera = this.scene.getCameraByName("camera");
          this.scene.activeCamera!.attachControl();
        } else {
          this.scene.activeCamera!.detachControl();
          this._setFPSCamera();
        }
      }
      if (keyName === "r" || keyName === "R") {
        rKeyCounter++;
        if (rKeyCounter % 2 == 0) {
          console.log("counter Reset");
          this.removeBlur();
          this.isPickedGood = false;
        } else {
          console.log("START");
          if (this.isPickedGood) {
            console.log("isPickedGood ", this.isPickedGood);
            console.log(this.meshPicked.name);
            this.makeBlur();
            document.getElementById("top")!.innerHTML =
              this.meshPicked.name + "<br> Press R to close";
          }
        }
      }
    }); // end event
    //
    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });

    (this.scene.activeCamera as ArcRotateCamera)!.checkCollisions = true;
    //

    /*
    const htmlMeshRenderer = new HtmlMeshRenderer(this.scene);

    // Shows how this can be used to include a website in your scene
    const siteUrl = "https://babylonpress.org/";
    //   const siteUrl = "https://traditionpress.ru/";
    const htmlMeshSite = new HtmlMesh(this.scene, "html-mesh-site");
    const iframeSite = document.createElement("iframe");
    iframeSite.src = siteUrl;
    iframeSite.width = "960px";
    iframeSite.height = "540px";
    htmlMeshSite.setContent(iframeSite, 1.92, 1.08);
    htmlMeshSite.position.x = -7;
    htmlMeshSite.position.y = 1.2;
    htmlMeshSite.position.z = 4.98;
    */
    //
    /*
    //
    setTimeout(() => {
      this.removeBlur();
    }, 7000);
    //
*/
    //
    //
  }

  async loadModels(
    url: string,
    name: string,
    scalingFactor: number,
    position: Vector3,
    options?: ISingleModelsOptions
  ) {
    const res = await SceneLoader.ImportMeshAsync("", url);
    const singlemesh = res.meshes[1] as Mesh;
    singlemesh.setParent(null);
    res.meshes[0].dispose();
    singlemesh.name = name;
    singlemesh.scaling.scaleInPlace(scalingFactor);
    singlemesh.position = position;
    if (options?.rotateX) {
      singlemesh.rotate(
        Vector3.Right(),
        Tools.ToRadians(options.rotateX),
        Space.WORLD
      );
    }
    if (options?.rotateY) {
      singlemesh.rotate(
        Vector3.Up(),
        Tools.ToRadians(options.rotateY),
        Space.WORLD
      );
    }
    if (options?.rotateZ) {
      singlemesh.rotate(
        Vector3.Forward(),
        Tools.ToRadians(options.rotateZ),
        Space.WORLD
      );
    }
  }
  //
  makeBlur() {
    let kernel = 1;

    const postProcess0 = new BlurPostProcess(
      "Horizontal_blur",
      new Vector2(1.0, 0),
      kernel,
      1,
      this.scene.activeCamera
    );

    const postProcess1 = new BlurPostProcess(
      "Vertical_blur",
      new Vector2(0, 1.0),
      kernel,
      1.0,
      this.scene.activeCamera
    );

    const observer = this.scene.onBeforeRenderObservable.add(() => {
      kernel += 0.5;
      postProcess0.kernel = kernel;
      postProcess1.kernel = kernel;
      if (this.scene.imageProcessingConfiguration.exposure > 0.3) {
        this.scene.imageProcessingConfiguration.exposure -= 0.01;
      }
      if (kernel >= 32) {
        observer.remove();
        this.blurEndCallback();
      }
    });

    //
  }
  //
  //
  blurEndCallback() {
    this.prepareCamera(this.meshPicked as Mesh);
  }
  //
  removeBlur() {
    if (this.scene.getPostProcessByName("Horizontal_blur")) {
      this.scene.getPostProcessByName("Horizontal_blur")!.dispose();
    }
    if (this.scene.getPostProcessByName("Vertical_blur")) {
      this.scene.getPostProcessByName("Vertical_blur")!.dispose();
    }
    this.scene.imageProcessingConfiguration.exposure = 0.8;
    this.restoreCamera();
    // this.roomPicker.setPickingList(this.pickArray);
  }
  //

  prepareCamera(meshToZoom: Mesh) {
    // Attach camera to canvas inputs
    /*
    const camera = this.scene.activeCamera!.clone(
      "camClone"
    ) as BABYLON.ArcRotateCamera;
*/
    this.scene.activeCamera!.detachControl();

    this.scene.environmentIntensity = 0.9;

    Tools.CreateScreenshotUsingRenderTarget(
      this.engine,
      this.scene.activeCamera!,
      { precision: 1.0 },
      (data) => {
        document.body.style.backgroundImage = "url(" + data + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";

        const camera = new ArcRotateCamera(
          "camClone2",
          -Math.PI,
          1.1,
          4,
          Vector3.Zero()
        );
        camera.minZ = 0.1;

        camera.layerMask = 0x20000000;

        this.scene.clearColor = new Color4(0, 0, 0, 0);
        this.scene.imageProcessingConfiguration.exposure = 0.8;

        this.scene.activeCamera = camera;
        camera.lowerRadiusLimit = 1.3;
        camera.useBouncingBehavior = true;

        camera.useAutoRotationBehavior = true;

        camera.pinchPrecision = 200 / camera.radius;
        camera.upperRadiusLimit = 5 * camera.radius;

        camera.wheelDeltaPercentage = 0.01;
        camera.pinchDeltaPercentage = 0.01;

        this.scene.activeCamera!.attachControl();
        //

        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
          "workshop_pipeline",
          camera
        );

        //
        //

        camera.useFramingBehavior = true;
        camera.framingBehavior!.framingTime = 800;

        const instancedMesh = meshToZoom.clone(meshToZoom.name + "inst");
        instancedMesh.layerMask = 0x20000000;
        instancedMesh.position = Vector3.Zero();
        instancedMesh.normalizeToUnitCube();

        this.instaMesh = instancedMesh;

        /*

    // Enable camera's behaviors
    camera.useFramingBehavior = true; 
    framingBehavior.framingTime = 0;
    framingBehavior.elevationReturnTime = -1;
       */

        camera.setTarget(instancedMesh);
      }
    );
  }
  //
  restoreCamera() {
    this.scene.environmentIntensity = 0.4;
    this.scene.activeCamera!.detachControl();

    this.scene.activeCamera = this.scene.getCameraByName("camera");
    this.scene.activeCamera!.attachControl();
    if (this.instaMesh !== undefined) {
      this.instaMesh.dispose();
    }
    console.log(this.roomPicker);
    document.getElementById("top")!.innerHTML = "";
  }
  //

  _setFPSCamera() {
    const camera = new UniversalCamera(
      "FirstViewCamera",
      new Vector3(-4, 2, 0),
      this.scene
    );
    camera.setTarget(Vector3.Zero());

    camera.ellipsoid = new Vector3(0.5, 1, 0.5);
    camera.speed = 0.3;

    this.scene.collisionsEnabled = true;
    this.scene.gravity.y = -0.08;

    camera.checkCollisions = true;
    camera.applyGravity = true;
    //Controls  WASD
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysLeft.push(65);
    camera.keysUpward.push(32);
    camera.minZ = 0.1;

    const canvas = this.scene.getEngine().getRenderingCanvas();
    //  this.scene.activeCamera?.detachControl();
    camera.attachControl(canvas, true);
    this.scene.activeCamera = camera;

    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });
  }
  //
}
