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
} from "@babylonjs/core/";
import "@babylonjs/loaders";

import { Ground } from "./ground";

import {
  ISingleModels,
  ISingleModelsOptions,
  singleMeshesList,
} from "./singleMeshesList";

export default class MainScene {
  private camera: ArcRotateCamera;

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
    top.innerHTML = "top";
    document.body.appendChild(top);
    //
    const pickArray: Array<Mesh> = [];
    //
    const gl = new GlowLayer("gl");
    gl.intensity = 0.7;
    for (const item of singleMeshesList) {
      if (item.glow) {
        gl.addIncludedOnlyMesh(this.scene.getMeshByName(item.name) as Mesh);
      }
      pickArray.push(this.scene.getMeshByName(item.name) as Mesh);
    }
    //
    const picker = new GPUPicker();
    picker.setPickingList(pickArray);
    console.log(picker);
    //

    this.scene.onPointerObservable.add(() => {
      picker
        .pickAsync(this.scene.pointerX, this.scene.pointerY)
        .then((pickingInfo) => {
          if (pickingInfo) {
            //    console.log(pickingInfo);
            /*
            const distance = BABYLON.Vector3.Distance(
              this.scene.activeCamera!.position,
              pickingInfo.mesh.position
            );
            */
            //console.log(distance);
            //  console.log(pickingInfo.mesh.name);

            top.innerHTML = pickingInfo.mesh.name;
          } else {
            top.innerHTML = "";
          }
        });
    });
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
}
