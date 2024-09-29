import {
  Animation,
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
  PointerDragBehavior,
  ActionManager,
  ExecuteCodeAction,
  MeshBuilder,
  CubicEase,
  EasingFunction,
  loadAssetContainerAsync,
  Sound,
} from "@babylonjs/core/";
import "@babylonjs/loaders";
// import { HtmlMesh, HtmlMeshRenderer } from "babylon-htmlmesh";
import { Ground } from "./ground";

import {
  ISingleModelsOptions,
  singleMeshesList,
  complexMeshesList,
} from "./singleMeshesList";

import { moveCamera } from "@/moveCamera";
import { Node } from "@babylonjs/core/node";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";

export default class MainScene {
  private camera: ArcRotateCamera;
  private isPickedGood: boolean = false;
  private meshPicked: AbstractMesh;
  private roomPicker: GPUPicker;
  public pickArray: Array<Mesh> = [];
  private instaMesh: Mesh | TransformNode;
  private spotLightState: boolean;
  private spotLightArray: Array<SpotLight> = [];
  private radioSound: Sound;
  private morseSound: Sound;
  private radioSoundState: boolean = false;
  private morseSoundState: boolean = false;
  private lightSwitchSound: Sound;

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine
  ) {
    this._setCamera(scene);
    this._setAudio();
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

  _setAudio() {
    console.log(Engine.audioEngine);

    this.radioSound = new Sound(
      "gunshot",
      "sound/fromsponsors_plus.mp3",
      this.scene,
      () => {
        // Sound has been downloaded & decoded

        if (!Engine.audioEngine!.unlocked) {
          Engine.audioEngine!.unlock();
        }
      },
      {
        spatialSound: true,
        loop: true,
        maxDistance: 11,
        // distanceModel: "linea",
        //  rolloffFactor: 0.5,
      }
    );
    this.morseSound = new Sound(
      "morse",
      "sound/morse.mp3",
      this.scene,
      () => {
        // Sound has been downloaded & decoded

        if (!Engine.audioEngine!.unlocked) {
          Engine.audioEngine!.unlock();
        }
      },
      {
        spatialSound: true,
        loop: true,
        maxDistance: 11,
        //  distanceModel: "exponential",
      }
    );
    //
    this.lightSwitchSound = new Sound(
      "lightSwitch",
      "sound/218115__mastersdisaster__switch-on-livingroom.wav",
      this.scene,
      () => {
        // Sound has been downloaded & decoded

        if (!Engine.audioEngine!.unlocked) {
          Engine.audioEngine!.unlock();
        }
      }
    );
    //

    // Unlock audio on first user interaction.
    window.addEventListener(
      "click",
      () => {
        if (!Engine.audioEngine!.unlocked) {
          Engine.audioEngine!.unlock();
          console.log(Engine.audioEngine);
        }
      },
      { once: true }
    );
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
    this.spotLightArray.push(spotlight);
    //
    const spotlight2 = spotlight.clone("spotlight2") as SpotLight;
    spotlight2.position.z = 4;
    spotlight2.direction.x = -0.05;
    spotlight2.direction.z = -0.05;
    //
    this.spotLightArray.push(spotlight2);

    const spotlight3 = spotlight.clone("spotlight3") as SpotLight;
    spotlight3.position.x = -8;
    spotlight3.position.y = 2.5;
    spotlight3.direction.x = -0.05;
    spotlight3.direction.z = -0.05;
    //
    this.spotLightArray.push(spotlight2);
    //
    this.spotLightState = true;
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
    this.scene.imageProcessingConfiguration.toneMappingType = 1;

    this.scene.imageProcessingConfiguration.exposure = 0.9;

    //
    //  pipeline.sharpenEnabled = true;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);
    //

    // Autoplay started!

    //
    //
    const aniSwitch = await loadAnimatedSwitch(
      "kit/switch1-opt.glb",
      this.scene
    );
    //console.log(aniSwitch);
    aniSwitch.meshes[1].name = "Light_Switch";
    this.pickArray.push(aniSwitch.meshes[1] as Mesh);
    aniSwitch.meshes[1].metadata = { animated: true, action: "switchLight" };
    //
    /*
    const airconditioner = await SceneLoader.ImportMeshAsync(
      "",
      "kit/industrial_air_conditioner-opt.glb"
    );
    airconditioner.meshes[0].position = new Vector3(-0.1, 2, -2);
    airconditioner.meshes[0].rotationQuaternion = null;
    airconditioner.meshes[0].rotation.y = Math.PI / 2;
    console.log(airconditioner.meshes);
    airconditioner.meshes[2].name = "Air_Fan";
    // airconditioner.meshes[2].metadata = { animated: true, action: "switchAir" };
    this.pickArray.push(airconditioner.meshes[1] as Mesh);
    this.pickArray.push(airconditioner.meshes[2] as Mesh);

    console.log(this.pickArray);
    */
    //
    //
    for (const item of complexMeshesList) {
      await this.loadComplexModels(
        item.url,
        item.name,
        item.scalingFactor,
        item.position,
        item.options,
        item.pickableMeshname
      );
    }
    //

    for (const item of singleMeshesList) {
      await this.loadModels(
        item.url,
        item.name,
        item.scalingFactor,
        item.position,
        item.options,
        item.metadata
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
        if (item.glowLevel) {
          (
            this.scene.getMeshByName(item.name)!.material as PBRMaterial
          ).emissiveIntensity = item.glowLevel;
        }
      }
      this.pickArray.push(this.scene.getMeshByName(item.name) as Mesh);
    }

    for (const item of complexMeshesList) {
      if (item.glow) {
        if (item.glowMeshName !== undefined) {
          gl.addIncludedOnlyMesh(
            this.scene.getMeshByName(item.glowMeshName) as Mesh
          );
          if (item.glowLevel !== undefined) {
            (
              this.scene.getMeshByName(item.glowMeshName)!
                .material as PBRMaterial
            ).emissiveIntensity = item.glowLevel;
          }
        }
      }
    }

    console.log(gl);
    //
    this.roomPicker = new GPUPicker();
    this.roomPicker.setPickingList(this.pickArray);
    console.log(this.roomPicker);
    console.log(this.pickArray);
    //
    //
    const itemHeader = document.getElementById("itemHeader");
    const itemAside = document.getElementById("itemAside");

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
              //
              itemHeader!.innerHTML = pickingInfo.mesh.name;

              //
              //
              document.getElementById("top_container")!.style.display =
                "initial";
              //
              top.innerHTML =
                pickingInfo.mesh.name + "<br>Press R to view closer";
              //  console.log(pickingInfo.mesh.metadata.action);
              if (pickingInfo.mesh.metadata.action !== undefined) {
                switch (pickingInfo.mesh.metadata.action) {
                  case "switchLight":
                    top.innerHTML += "<br>Press E to switch light";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch light";
                    break;
                  case "Turn_Radio":
                    top.innerHTML += "<br>Press E to switch radio";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch radio";
                    break;
                  case "Turn_Morse":
                    top.innerHTML += "<br>Press E to switch radio";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch radio";
                    break;
                }
              }
            }
          } else {
            this.isPickedGood = false;
            top.innerHTML = "";
            itemAside!.style.display = "none";
            document.getElementById("top_container")!.style.display = "none";
          }
        });
    });
    //
    // this._setFPSCamera();
    //
    //

    let OneKeyCounter = 0;
    let rKeyCounter = 0;
    let TwoKeyCounter = 0;
    let eKeyCounter = 0;
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
      if (keyName === "2" || keyName === "@") {
        TwoKeyCounter++;
        console.log("TwoKeyCounter", TwoKeyCounter);

        moveCamera(
          this.camera,
          3.9,
          1.06,
          1.486,
          new Vector3(-0.72, 0.87, -2.23),
          120
        );
      }
      //
      if (keyName === "3" || keyName === "#") {
        moveCamera(
          this.camera,
          1.33,
          1.45,
          4.1,
          new Vector3(-3.09, 0.77, 0.67),
          120
        );
      }
      //
      if (keyName === "e" || keyName === "E") {
        eKeyCounter++;
        console.log("eKeyCounter", eKeyCounter);
        if (this.isPickedGood) {
          if (this.meshPicked.name === "Light_Switch") {
            if (this.spotLightState) {
              //
              this.scene
                .getAnimationGroupByName("switchLight")!
                .start(false, -1, 0, 60);
              this.scene
                .getAnimationGroupByName("switchLight")!
                .onAnimationEndObservable.addOnce(() => {
                  this.spotLightArray.forEach((item) => {
                    item.intensity = 0.1;
                  });
                  this.spotLightState = false;
                  (
                    this.scene.getMeshByName("ceiling_lamp")!
                      .material as PBRMaterial
                  ).emissiveIntensity = 0;
                  this.lightSwitchSound.play();
                });
              //
            } else {
              this.scene
                .getAnimationGroupByName("switchLight")!
                .start(false, 1, 0, 60);

              this.scene
                .getAnimationGroupByName("switchLight")!
                .onAnimationEndObservable.addOnce(() => {
                  this.spotLightArray.forEach((item) => {
                    item.intensity = 70;
                  });
                  this.spotLightState = true;
                  (
                    this.scene.getMeshByName("ceiling_lamp")!
                      .material as PBRMaterial
                  ).emissiveIntensity = 1;
                  this.lightSwitchSound.play();
                });
            }
          }
          //
          if (this.meshPicked.name === "old_radio") {
            console.log("OLD");
            //

            if (!this.radioSoundState) {
              (this.meshPicked.material as PBRMaterial).emissiveIntensity = 1;
              this.radioSound.setPosition(this.meshPicked.position);
              this.radioSound.play();
              this.radioSoundState = true;
            } else {
              let gLevel = singleMeshesList.find((m) => m.name === "old_radio");
              if (gLevel !== undefined) {
                (this.meshPicked.material as PBRMaterial).emissiveIntensity =
                  singleMeshesList.find((m) => m.name === "old_radio")
                    ?.glowLevel as number;
              }
              this.radioSound.stop();
              this.radioSoundState = false;
            }
          }
          //
          if (this.meshPicked.name === "military_radio") {
            if (!this.morseSoundState) {
              (this.meshPicked.material as PBRMaterial).emissiveIntensity = 2;
              this.morseSound.setPosition(this.meshPicked.position);
              this.morseSound.play();
              this.morseSoundState = true;
            } else {
              let gLevel = singleMeshesList.find(
                (m) => m.name === "military_radio"
              );
              if (gLevel !== undefined) {
                (this.meshPicked.material as PBRMaterial).emissiveIntensity =
                  singleMeshesList.find((m) => m.name === "military_radio")
                    ?.glowLevel as number;
              }

              this.morseSound.stop();
              this.morseSoundState = false;
            }
          }
        }
      }
      //
    }); // end event
    //
    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });
    //   (this.scene.activeCamera as ArcRotateCamera)!.checkCollisions = true;
    //

    //
    /*
    //  moveCamera(this.camera, 1.5, 1.2, 5, new Vector3(-3, 0.6, 0.7));
    setTimeout(() => {
      moveCamera(
        this.camera,
        3.9,
        1.06,
        1.486,
        new Vector3(-0.72, 0.87, -2.23),
        240
      );
    }, 1000);
*/

    //

    //
    /*
    const onPointerMove = (_evt) => {
      const pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
        (mesh) => {
          return mesh.name !== "picnic";
        },
        false,
        this.camera
      );

      if (pickInfo.hit) {
        if (this.scene.getMeshByName("picnic") !== null) {
          console.log(pickInfo.pickedPoint);
          const mmm = this.scene.getMeshByName("picnic");
          mmm!.position = pickInfo.pickedPoint as any;
        }
      }
    };
*/
    //
    //
    /*
    const pointerDragBehavior = new PointerDragBehavior({});
    pointerDragBehavior.useObjectOrientationForDragging = true;
    pointerDragBehavior.onDragStartObservable.add((_event) => {
      console.log("dragStart");
    });

    const actionManager = new ActionManager(this.scene);
    actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (event) => {
        event.meshUnderPointer!.removeBehavior(pointerDragBehavior);
        event.meshUnderPointer!.addBehavior(pointerDragBehavior);
      })
    );

    this.scene.getMeshByName("battery")!.actionManager = actionManager;
    this.scene.getMeshByName("picnic")!.actionManager = actionManager;
    this.scene.getMeshByName("himik")!.actionManager = actionManager;


    // this.scene.getMeshByName("crowbar")!.actionManager = actionManager;
    */
    //

    //
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
    options?: ISingleModelsOptions,
    metadata?: {}
  ) {
    const res = await SceneLoader.ImportMeshAsync("", url);
    const singlemesh = res.meshes[1] as Mesh;
    singlemesh.setParent(null);
    res.meshes[0].dispose();
    singlemesh.name = name;
    singlemesh.scaling.scaleInPlace(scalingFactor);
    singlemesh.position = position;
    if (metadata !== undefined) {
      singlemesh.metadata = metadata;
    }
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
  async loadComplexModels(
    url: string,
    name: string,
    scalingFactor: number,
    position: Vector3,
    options?: ISingleModelsOptions,
    pickableMeshname?: string
  ) {
    const res = await SceneLoader.ImportMeshAsync("", url);
    const root = res.meshes[0];
    root.name = name;
    root.scaling.scaleInPlace(scalingFactor);
    root.getChildMeshes().forEach((m) => {
      m.isPickable = true;
    });
    root.position = position;
    //
    if (pickableMeshname !== undefined) {
      const pickableMesh = res.meshes.find((m) => m.name === pickableMeshname);
      this.pickArray.push(pickableMesh);
    }
    //
    if (options?.rotateX) {
      root.rotate(
        Vector3.Right(),
        Tools.ToRadians(options.rotateX),
        Space.WORLD
      );
    }
    if (options?.rotateY) {
      root.rotate(Vector3.Up(), Tools.ToRadians(options.rotateY), Space.WORLD);
    }
    if (options?.rotateZ) {
      root.rotate(
        Vector3.Forward(),
        Tools.ToRadians(options.rotateZ),
        Space.WORLD
      );
    }
  }
  //
  makeBlur() {
    if (this.meshPicked.metadata.action !== "switchLight") {
      this.meshPicked.enableEdgesRendering();
      this.meshPicked.edgesWidth = 1.0;
      this.meshPicked.edgesColor = new Color4(0, 0.8, 1, 1);
    }
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
    ) as ArcRotateCamera;
*/
    this.scene.activeCamera!.detachControl();

    Tools.CreateScreenshotUsingRenderTarget(
      this.engine,
      this.scene.activeCamera!,
      { precision: 1.0 },
      (data) => {
        document.body.style.backgroundImage = "url(" + data + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";

        this.scene.environmentIntensity = 0.9;
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
        this.scene.imageProcessingConfiguration.exposure = 1;

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

        if (meshToZoom.parent == null) {
          const instancedMesh = meshToZoom.clone(meshToZoom.name + "_inst");
          instancedMesh.layerMask = 0x20000000;
          instancedMesh.position = Vector3.Zero();
          instancedMesh.normalizeToUnitCube();

          this.instaMesh = instancedMesh;

          camera.setTarget(instancedMesh);
        } else {
          const root = meshToZoom.parent as Mesh;
          console.log(root);
          const instancedRoot = root.instantiateHierarchy(undefined, {
            doNotInstantiate: true,
          });
          console.log(instancedRoot);
          instancedRoot!.getChildMeshes().forEach((m) => {
            m.layerMask = 0x20000000;
            if (m.animations) {
              console.log(m.name);
            }
          });
          instancedRoot!.position = Vector3.Zero();
          instancedRoot!.normalizeToUnitCube();

          this.instaMesh = instancedRoot as Mesh;
        }
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

    this.scene.getCameraByName("camClone2")!.dispose();

    setTimeout(() => {
      this.pickArray.forEach((m) => {
        m.disableEdgesRendering();
      });
    }, 700);
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

export async function loadAnimatedSwitch(url: string, scene: Scene) {
  const res = await loadAssetContainerAsync(url, scene);
  const root = res.meshes[0];
  root.scaling.scaleInPlace(2);
  root.position = new Vector3(-2, 1, -5);
  // (res.meshes[1] as Mesh).bakeCurrentTransformIntoVertices();
  console.log(res);
  const ag = res.animationGroups[0];
  ag.name = "switchLight";
  ag.loopAnimation = false;
  ag.goToFrame(60);
  ag.pause();
  res.addAllToScene();

  setTimeout(() => {
    ag.play();
  }, 1000);
  setTimeout(() => {
    ag.start(false, 1, 0, 60);
  }, 4000);

  return res;
}
