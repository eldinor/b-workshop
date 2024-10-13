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
  Texture,
  NodeMaterial,
  Camera,
  AnimationGroup,
  AssetContainer,
  SSRRenderingPipeline,
  Matrix,
  TonemapPostProcess,
  TonemappingOperator,
  ConvolutionPostProcess,
  LensRenderingPipeline,
} from "@babylonjs/core/";
import "@babylonjs/loaders";
// import { HtmlMesh, HtmlMeshRenderer } from "babylon-htmlmesh";
import { Ground } from "./ground";

import {
  ISingleModelsOptions,
  singleMeshesList,
  complexMeshesList,
} from "./singleMeshesList";
import { WORKSHOP } from "./workshop";

import { moveCamera } from "@/moveCamera";
import { Node } from "@babylonjs/core/node";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D";
import * as BABYLON_GUI from "@babylonjs/gui";
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

import { NiceLoader } from "./niceloader";
import { wEffects } from "./effects";
import { wSpeech } from "./speech";
import { resolve } from "path";

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
  private _fpsCameraActive: boolean;
  private alreadyImproved: boolean;
  private speechMode: boolean = false;

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine
  ) {
    this._setCamera(scene);
    this._prepareFPSCamera();
    this._setAudio();
    this._setLight(scene);
    this.loadComponents();
    this._setPipeLine();
  }

  _setCamera(scene: Scene): void {
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    document.body.style.backgroundImage = "img/cover1.png";
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

  _prepareFPSCamera() {
    const camera = new UniversalCamera(
      "FirstViewCamera",
      new Vector3(-4, 2, 0),
      this.scene
    );
    camera.setTarget(Vector3.Zero());
  }

  _reverseCamera() {
    const easingFunction = new CubicEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    const camera = this.scene.getCameraByName("camera") as ArcRotateCamera;
    this.scene.activeCamera = camera;
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

        document.getElementById("info")!.style.display = "none";
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
    //  pointLight2.diffuse = new Color3(200 / 255, 200 / 255, 90 / 255);
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
    spotlight3.direction.z = -0.05;
    //
    this.spotLightArray.push(spotlight3);
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
    pipeline.samples = 8;
    // pipeline.imageProcessingEnabled = true
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType = 1;

    this.scene.imageProcessingConfiguration.exposure =
      WORKSHOP.EXPOSURE.mainExposure;

    //
    //  pipeline.sharpenEnabled = true;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);
    //

    //
    //
    const aniSwitch = await loadAnimatedSwitch(
      "kit/switch1-opt.glb",
      this.scene
    );
    //console.log(aniSwitch);
    aniSwitch.meshes[0].name = "Light_Switch";
    aniSwitch.meshes[1].name = "Light_Switch";
    this.pickArray.push(aniSwitch.meshes[1] as Mesh);
    aniSwitch.meshes[1].metadata = {
      animated: true,
      action: "switchLight",
      longName: "Light Switch",
    };
    //

    //
    //
    for (const item of complexMeshesList) {
      await this.loadComplexModels(
        item.url,
        item.name,
        item.scalingFactor,
        item.position,
        item.options,
        item.pickableMeshname,
        item.metadata
      );
    }
    //
    console.log("Complex loaded");
    document.getElementById("info")!.innerHTML =
      "Big models loaded, continue...";
    //
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

    console.log("Single loaded");
    document.getElementById("info")!.innerHTML = "Small models loaded";
    //
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
    top.style.left = "370px";
    top.style.color = "yellow";
    // top.innerHTML = "Press R to view closer";
    document.body.appendChild(top);
    top.style.display = "none";
    //
    const tmpArr = [];
    new NiceLoader(this.scene, tmpArr, {
      container: "top",
      showExportAll: true,
      maxLights: 8,
    });
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
      if (!item.metadata?.doNotPick) {
        this.pickArray.push(this.scene.getMeshByName(item.name) as Mesh);
      }
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
      if (item.metadata?.merge) {
        console.log("MERGE");
        const root = this.scene.getMeshByName(item.name) as Mesh;
        console.log(root.getChildMeshes());
        const merged = Mesh.MergeMeshes(
          root.getChildMeshes(),
          true,
          undefined,
          undefined,
          true,
          true
        );
        root.dispose();
        merged!.name = item.name;
        // merged!.position = item.position;
        merged!.metadata = item.metadata;
        this.pickArray.push(merged as Mesh);
      }
    }

    console.log(gl);

    gl.addIncludedOnlyMesh(this.scene.getMeshByName("plane1")! as Mesh);
    gl.addIncludedOnlyMesh(this.scene.getMeshByName("plane6")! as Mesh);
    gl.addIncludedOnlyMesh(this.scene.getMeshByName("metaldoor")! as Mesh);

    //
    this.roomPicker = new GPUPicker();
    this.roomPicker.setPickingList(this.pickArray);
    //  console.log(this.roomPicker);
    console.log(this.pickArray);
    //
    //
    const itemHeader = document.getElementById("itemHeader");
    const itemAside = document.getElementById("itemAside");
    const itemImage = document.getElementById("itemImage") as HTMLImageElement;
    this.scene.onPointerObservable.add(() => {
      this.roomPicker
        .pickAsync(this.scene.pointerX, this.scene.pointerY)
        .then((pickingInfo) => {
          if (pickingInfo) {
            //   console.log(pickingInfo.mesh.name);
            if (
              this.scene.activeCamera!.name == "camera" ||
              this.scene.activeCamera!.name == "FirstViewCamera"
            ) {
              this.isPickedGood = true;
              this.meshPicked = pickingInfo.mesh;
              //
              if (pickingInfo.mesh.metadata.longName !== undefined) {
                itemHeader!.innerHTML = pickingInfo.mesh.metadata.longName;
              } else {
                itemHeader!.innerHTML = pickingInfo.mesh.name;
              }

              //
              if (
                pickingInfo.mesh.metadata.mayBeImproved &&
                !this.alreadyImproved
              ) {
                itemAside!.style.display = "initial";
                itemAside!.innerHTML = "Press I to improve cloth quality";
              }

              if (this.alreadyImproved) {
                itemAside!.style.display = "none";
              }
              //

              let imgSrc = "img/" + pickingInfo.mesh.name + ".png";
              if (pickingInfo.mesh.parent) {
                imgSrc = "img/" + pickingInfo.mesh.parent.name + ".png";
                if (pickingInfo.mesh.parent!.parent !== null) {
                  console.log("MANY PARENTS");
                  imgSrc =
                    "img/" + pickingInfo.mesh.parent.parent.name + ".png";
                }
              }

              const imgOK = imageExists(imgSrc);

              imgOK.then((res) => {
                //   console.log(res);
                if (res) {
                  // itemImage.style.visibility = "initial";
                  itemImage!.src = imgSrc;
                } else {
                  itemImage!.src = "img/no-photo.png";
                  // itemImage.style.visibility = "hidden";
                }
              });

              /*
              itemImage!.src =
                "https://babylonpress.org/wp-content/uploads/2020/12/logo-babylonpress-GB-s.png";
              //
*/
              //
              document.getElementById("top_container")!.style.display =
                "initial";
              //
              /*
              top.innerHTML =
                pickingInfo.mesh.name + "<br>Press R to view closer";
              //  console.log(pickingInfo.mesh.metadata.action);

              */
              if (pickingInfo.mesh.metadata.action !== undefined) {
                switch (pickingInfo.mesh.metadata.action) {
                  case "switchLight":
                    //  top.innerHTML += "<br>Press E to switch light";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch light";
                    break;
                  case "Turn_Radio":
                    //  top.innerHTML += "<br>Press E to switch radio";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch radio";
                    break;
                  case "Turn_Morse":
                    //  top.innerHTML += "<br>Press E to switch radio";
                    itemAside!.style.display = "initial";
                    itemAside!.innerHTML = "Press E to switch radio";
                    break;
                  default:
                    itemAside!.style.display = "none";
                }
              } else {
                itemAside!.style.display = "none";
              }
              //
            }
          } else {
            this.isPickedGood = false;
            //   top.innerHTML = "";
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
    let tKeyCounter = 0;
    let yKeyCounter = 0;
    let lKeyCounter = 0;
    let jKeyCounter = 0;
    document.addEventListener("keyup", (event) => {
      const keyName = event.key;
      if (keyName === "1" || keyName === "!") {
        OneKeyCounter++;
        if (OneKeyCounter % 2 == 0) {
          this.scene.activeCamera!.detachControl();
          //

          this.scene.activeCamera = this.scene.getCameraByName("camera");
          this._fpsCameraActive = false;
          this.scene.activeCamera!.attachControl(this.canvas);
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
            /*
            document.getElementById("top")!.innerHTML =
              this.meshPicked.name + "<br> Press R to close";
              */
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
                .start(false, 1, 60, 120);
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
      if (keyName === "t" || keyName === "T") {
        tKeyCounter++;
        if (tKeyCounter % 2 == 0) {
          const mat = this.scene.getMaterialByName("wall") as PBRMaterial;
          changeTex(mat, exposedBrick);
        } else {
          const mat = this.scene.getMaterialByName("wall") as PBRMaterial;
          changeTex(mat, greyWood);
        }
      }
      //
      if (keyName === "y" || keyName === "Y") {
        yKeyCounter++;
        if (yKeyCounter % 2 == 0) {
          const mat = this.scene.getMaterialByName("floor") as PBRMaterial;
          changeTex(mat, checkerTiles, 10);
        } else {
          const mat = this.scene.getMaterialByName("floor") as PBRMaterial;
          changeTex(mat, oldTiles, 5);
        }
      }
      //
      if (keyName === "i" || keyName === "I") {
        changeAva("kit/ava2-opt.glb", this.scene);
        this.alreadyImproved = true;
        itemAside!.style.display = "none";
      }
      //
      if (keyName === "l" || keyName === "L") {
        lKeyCounter++;
        console.log(lKeyCounter);
        if (lKeyCounter % 2 == 0) {
          document.getElementById("top")!.style.display = "none";
        } else {
          document.getElementById("top")!.style.display = "inline-block";
        }
      }
      //
      if (keyName === "k" || keyName === "K") {
        this._reverseCamera();
      }
      //
      //
      if (keyName === "h" || keyName === "H") {
        document.getElementById("info")!.style.display = "inline-block";
        document.getElementById("info")!.innerHTML = WORKSHOP.INFO.afterLoading;
        setTimeout(() => {
          document.getElementById("info")!.style.display = "none";
        }, 3000);
      }
      //
      if (keyName === "p" || keyName === "P") {
        document.getElementById("info")!.style.display = "inline-block";
        document.getElementById("info")!.innerHTML =
          "<h3>Scene Statistics</h3>";
        //

        //
        let statsString =
          "<p>Meshes: " + this.scene.meshes.length.toString() + "</p>";
        //
        statsString +=
          "<p>Materials: " + this.scene.materials.length.toString() + "</p>";
        statsString +=
          "<p>Textures: " + this.scene.textures.length.toString() + "</p>";
        statsString +=
          "<p>Animations: " +
          this.scene.animationGroups.length.toString() +
          "</p>";

        statsString += "<p>Lights: " + this.scene.lights.length.toString();
        ("</p>");
        //@ts-ignore
        statsString +=
          "<p>Heap Used: " +
          //@ts-ignore
          (!performance.memory
            ? "unavailabe"
            : //@ts-ignore
              (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed() +
              " Mb");

        //
        document.getElementById("info")!.innerHTML += statsString;
        //
        setTimeout(() => {
          document.getElementById("info")!.style.display = "none";
        }, 4000);
      }
      //
      if (keyName === "m" || keyName === "M") {
        //  const wef = new wEffects(this.scene, this.camera);
        //    console.log(wef);
        //
        const lensEffect = new LensRenderingPipeline(
          "lensEffects",
          {
            edge_blur: 0,
            chromatic_aberration: 0.2,
            distortion: 1.0,
            // etc.
          },
          this.scene,
          1.0,
          [this.scene.activeCamera!]
        );
        let lecnt = 0;
        this.scene.onBeforeRenderObservable.add(() => {
          lensEffect.edgeDistortion = 1 + Math.sin(lecnt);
          lecnt += 0.01;
        });

        //    wef.convoluteEffect();
        //
        /*
        const pp = wef.bwEffect();

        wef.showMesh(this.scene.getMeshByName("military_radio") as Mesh);
        wef.showMesh(this.scene.getMeshByName("Dish") as Mesh);
        wef.showMesh(this.scene.getMeshByName("old_radio") as Mesh);
        wef.showMesh(this.scene.getMeshByName("plastic_bucket") as Mesh);
        wef.showMesh(this.scene.getMeshByName("propan_small") as Mesh);
      
        let promise = new Promise((resolve) => {
          console.log("PROMISE START");
          setTimeout(() => {
            console.log("RESOLVED");
            resolve;
          }, 1000);
        });

        let allMeshes = this.scene.meshes;

        let cnt = 500;

        for (const mesh of allMeshes) {
          setTimeout(() => {
            wef.showMesh(mesh as Mesh);
          }, cnt);
          cnt = cnt + 100;
        }
*/
        //
      }
      //
      if (keyName === "j" || keyName === "J") {
        console.log("JJJJJ");
        jKeyCounter++;

        if (jKeyCounter % 2 == 0) {
          this.speechMode = false;
          document.getElementById("info")!.style.display = "block";
          document.getElementById("info")!.innerHTML =
            "<h3>Voice Mode Off</h3>";
          setTimeout(() => {
            document.getElementById("info")!.style.display = "none";
          }, 1000);
        } else {
          this.speechMode = true;
          document.getElementById("info")!.style.display = "block";
          document.getElementById("info")!.innerHTML = "<h3>Voice Mode On</h3>";
          setTimeout(() => {
            document.getElementById("info")!.style.display = "none";
          }, 2000);
        }
      }
      //
    }); // end event
    //
    // retargetAnimations(this.scene);
    //
    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });
    //
    //

    //
    //
    //
    setTimeout(() => {
      document.getElementById("info")!.innerHTML =
        "Everything should be loaded";
    }, 200);
    setTimeout(() => {
      document.getElementById("info")!.style.top = "50%";
      document.getElementById("info")!.innerHTML = WORKSHOP.INFO.afterLoading;
    }, 500);
    ////
    /* // for Atomic fridge
    const cylinder = MeshBuilder.CreateCylinder("cylinder", {
      diameterTop: 0.2,
      height: 3,
    });
    cylinder.position = new Vector3(-9.15, 0.6, -1.14);
    const mat = new PBRMaterial("mat");
    mat.roughness = 0.5;
    mat.emissiveColor = Color3.Red();
    mat.wireframe = true;
    cylinder.material = mat;

    gl.addIncludedOnlyMesh(cylinder);
    */
    //
    createCorridor(this.scene);
    //

    const res10 = await SceneLoader.ImportMeshAsync(
      "",
      "kit/simple_short_crate-opt.glb"
    );

    const small_box = res10.meshes[1] as Mesh;
    small_box.setParent(null);
    res10.meshes[0].dispose();
    small_box.scaling.scaleInPlace(0.1);

    small_box.name = "small_box";

    small_box.position = new Vector3(-0.2, 0.09, -4.7);
    small_box.rotate(Vector3.Up(), Tools.ToRadians(-15), Space.WORLD);

    const smbi = small_box.createInstance("smbi");
    smbi.position.y = 0.28;
    smbi.rotate(Vector3.Up(), Tools.ToRadians(35), Space.WORLD);
    const smbi2 = small_box.createInstance("smbi2");
    smbi2.position.y = 0.47;
    smbi2.rotate(Vector3.Up(), Tools.ToRadians(0), Space.WORLD);
    //
    const smbi3 = small_box.createInstance("smbi3");
    smbi3.position.y = 0.66;
    smbi2.rotate(Vector3.Up(), Tools.ToRadians(20), Space.WORLD);
    //
    const ceiling_lamp = this.scene.getMeshByName("ceiling_lamp") as Mesh;

    const c_lamp1 = ceiling_lamp.createInstance("c_lamp1");
    c_lamp1.position.x = -2;
    c_lamp1.position.z = 4;

    const c_lamp2 = ceiling_lamp.createInstance("c_lamp2");
    c_lamp2.position.x = -8;

    //
    //

    //
    // changeAva("kit/ava2-opt.glb", this.scene);
    //

    const loadingScreen = document.getElementById("loading-screen");

    loadingScreen!.classList.add("fade-out");
    loadingScreen!.addEventListener("transitionend", onTransitionEnd);
    //
    // this.engine.loadingScreen.hideLoadingUI();

    function onTransitionEnd(event) {
      event.target.remove();
    }
    //

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
    pickableMeshname?: string | Array<string>,
    metadata?: {
      animated?: boolean;
      action?: string;
      sound?: boolean;
      longName?: string;
    }
  ) {
    const res = await SceneLoader.ImportMeshAsync("", url);
    const root = res.meshes[0];
    root.name = name;
    root.scaling.scaleInPlace(scalingFactor);
    root.getChildMeshes().forEach((m) => {
      m.isPickable = true;
      m.metadata = metadata;
    });
    root.position = position;
    //
    if (pickableMeshname !== undefined) {
      const pickableMesh = res.meshes.find((m) => m.name === pickableMeshname);

      this.pickArray.push(pickableMesh as Mesh);
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
      if (
        this.scene.imageProcessingConfiguration.exposure >
        WORKSHOP.EXPOSURE.exposureThreshold
      ) {
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
    this.scene.imageProcessingConfiguration.exposure =
      WORKSHOP.EXPOSURE.mainExposure;
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

        //

        const camera = new ArcRotateCamera(
          "viewCamera",
          -Math.PI,
          1.1,
          4,
          Vector3.Zero()
        );
        camera.minZ = 0.1;

        camera.layerMask = 0x20000000;

        this.scene.clearColor = new Color4(0, 0, 0, 0);
        this.scene.imageProcessingConfiguration.exposure =
          WORKSHOP.EXPOSURE.viewerExposure;
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
        //

        if (this.speechMode) {
          camera.framingBehavior!.onTargetFramingAnimationEndObservable.addOnce(
            async () => {
              //
              const synth = window.speechSynthesis;
              console.log(synth.getVoices());

              const vp = await new Promise((resolve) => {
                let voices = synth.getVoices();
                if (voices.length) {
                  resolve(voices);
                  return;
                }
                synth.onvoiceschanged = () => {
                  voices = synth.getVoices();
                  if (voices.length) resolve(voices);
                };
              });
              console.log(synth.getVoices());

              //
              setTimeout(() => {
                let utterance = new SpeechSynthesisUtterance(
                  meshToZoom.metadata.longName
                );
                console.log(utterance);
                utterance.lang = "en-US";
                speechSynthesis.speak(utterance);
              }, 400);
              if (meshToZoom.metadata.moreVoice) {
                setTimeout(() => {
                  let utterance = new SpeechSynthesisUtterance(
                    meshToZoom.metadata.moreVoice
                  );
                  console.log(utterance);

                  speechSynthesis.speak(utterance);
                }, 1400);
              }
            }
          );
        }
        //
        /*
// Screenshot for image thumbnails
        camera.framingBehavior!.onTargetFramingAnimationEndObservable.addOnce(
          () => {
            Tools.CreateScreenshotUsingRenderTarget(
              this.engine,
              this.scene.activeCamera!,
              { precision: 0.5 }
            );
          }
        );
// End screenshot
*/
        if (!meshToZoom.parent) {
          const instancedMesh = meshToZoom.clone(meshToZoom.name + "_inst");
          instancedMesh.layerMask = 0x20000000;
          instancedMesh.position = Vector3.Zero();
          instancedMesh.normalizeToUnitCube();
          //   instancedMesh.rotationQuaternion = null;
          console.log(meshToZoom.metadata);
          this.instaMesh = instancedMesh;

          //

          //

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
              //
              console.log(m.name);
            }
          });
          instancedRoot!.position = new Vector3(0, 0, 0);
          instancedRoot!.normalizeToUnitCube();

          this.instaMesh = instancedRoot as Mesh;

          //   camera.framingBehavior!.autoCorrectCameraLimitsAndSensibility = true;
          //    camera.framingBehavior!.positionScale = 1;

          camera.framingBehavior!.zoomOnMeshHierarchy(
            instancedRoot as Mesh,
            undefined,
            () => {
              /*
              Tools.CreateScreenshotUsingRenderTarget(
                this.engine,
                this.scene.activeCamera!,
                { precision: 0.5 }
              );
              */
            }
          );

          //    camera.setTarget(instancedRoot as Mesh);
        }
      }
    );
  }
  //
  restoreCamera() {
    this.scene.environmentIntensity = 0.4;
    this.scene.activeCamera!.detachControl();

    if (this._fpsCameraActive) {
      this.scene.activeCamera = this.scene.getCameraByName("FirstViewCamera");
    } else {
      this.scene.activeCamera = this.scene.getCameraByName("camera");
    }

    this.scene.activeCamera!.attachControl();
    if (this.instaMesh !== undefined) {
      this.instaMesh.dispose();
    }
    console.log(this.roomPicker);
    // document.getElementById("top")!.innerHTML = "";
    if (this.scene.getCameraByName("viewCamera") !== undefined) {
      this.scene.getCameraByName("viewCamera")!.dispose();
    }

    setTimeout(() => {
      this.pickArray.forEach((m) => {
        m.disableEdgesRendering();
      });
    }, 700);
  }
  //

  _setFPSCamera() {
    let camera;
    if (!this.scene.getCameraByName("FirstViewCamera")) {
      camera = new UniversalCamera(
        "FirstViewCamera",
        new Vector3(-4, 2, 0),
        this.scene
      );
      camera.setTarget(Vector3.Zero());
    } else {
      camera = this.scene.getCameraByName("FirstViewCamera");
    }

    this._fpsCameraActive = true;

    this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
      "workshop_pipeline",
      camera
    );

    camera.ellipsoid = new Vector3(0.5, 1, 0.5);
    camera.speed = 0.2;

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
    // this.engine.enterPointerlock();
    camera.attachControl(canvas, true);
    this.scene.activeCamera = camera;

    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });

    //
    /*
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const pointerImage = new BABYLON_GUI.Image("pointer", "img/dot.png");
    pointerImage.width = "10px";
    pointerImage.height = "10px";
    pointerImage.isVisible = true;
    advancedTexture.addControl(pointerImage);

    console.log(this.scene.pointerX, this.scene.pointerY);
    this.scene.pointerX = this.canvas.width / 2;
    this.scene.pointerY = this.canvas.height / 2;
    console.log(this.scene.pointerX, this.scene.pointerY);

  //  this.engine.enterFullscreen(true);
*/
    //  this.canvas.requestPointerLock();
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
  ag.stop();
  ag.start(false, 1, 50, 60);

  res.addAllToScene();

  return res;
}

export async function imageExists(imgUrl: string) {
  if (!imgUrl) {
    return false;
  }
  return new Promise((res) => {
    const image = new Image();
    image.onload = () => res(true);
    image.onerror = () => res(false);
    image.src = imgUrl;
  });
}

export function changeTex(mat, data, tiles?) {
  (mat.albedoTexture as Texture).updateURL(
    "texture/" + data.folder + data.albedo
  );
  (mat.bumpTexture as Texture).updateURL("texture/" + data.folder + data.bump);
  (mat.metallicTexture as Texture).updateURL(
    "texture/" + data.folder + data.metallic
  );
  (mat.ambientTexture as Texture).updateURL("texture/" + data.folder + data.ao);
  if (tiles !== undefined) {
    mat.textures.forEach((t) => {
      t.vScale = tiles;
      t.uScale = tiles;
    });
  }
}

export async function changeAva(url: string, scene: Scene) {
  const res = await loadAssetContainerAsync(url, scene);
  const root = res.meshes[0];
  console.log(res.textures);

  const mat = scene.getMeshByName("Wolf3D_Avatar")!.material as PBRMaterial;
  mat.albedoTexture!.dispose();
  mat.albedoTexture = res.textures.find((t) =>
    t.name.includes("Base")
  ) as Texture;
  mat.bumpTexture!.dispose();
  mat.bumpTexture = res.textures.find((t) =>
    t.name.includes("Normal")
  ) as Texture;
  mat.metallicTexture!.dispose();
  mat.metallicTexture = res.textures.find((t) =>
    t.name.includes("Rough")
  ) as Texture;
}

export function retargetAnimations(scene: Scene) {
  const baseURL = "https://raw.githubusercontent.com/eldinor/ForBJS/master/";

  let res = SceneLoader.LoadAssetContainerAsync("kit/", "ava1.glb", scene);

  let ani = SceneLoader.LoadAssetContainerAsync(baseURL, "all-anim.glb", scene);

  ani.then((container) => {
    console.log(container);

    res.then((res) => {
      let avag = applyAnimationGroups(container.animationGroups, res);

      res.addAllToScene();
      console.log(res);
      console.log(avag);
      avag[0].play();
      avag[0].loopAnimation = true;
    });

    //
  });

  let animationGroups: AnimationGroup[];

  const applyAnimationGroups = (
    ags: AnimationGroup[],
    avatarContainer: AssetContainer
  ) => {
    const avatarAGs: AnimationGroup[] = [];

    const avatarRoot = avatarContainer.meshes[0];

    if (!avatarRoot) {
      return [];
    }

    const modelTransformNodes = avatarRoot.getChildTransformNodes();

    ags.forEach((ag) => {
      const modelAnimationGroup = ag.clone(ag.name, (oldTarget) => {
        return modelTransformNodes.find((node) => node.name === oldTarget.name);
      });

      avatarAGs.push(modelAnimationGroup);
    });

    if (ags === animationGroups) {
      // clearup existing animation groups
      animationGroups.forEach((ag) => {
        ag.dispose();
      });
      animationGroups = [];
    }

    return avatarAGs;
  };
}

export async function createCorridor(scene: Scene) {
  const corridorWall_1 = MeshBuilder.CreatePlane("corridorWall_1", {
    width: 10,
    height: 10,
  });
  corridorWall_1.material = createMaterial(
    "texture/",
    oldStone,
    "corridorWall_1",
    5
  );
  corridorWall_1.rotation.y = Math.PI;
  corridorWall_1.position.x = -15;
  corridorWall_1.position.z = -2.9;
  corridorWall_1.isPickable = false;

  const corridorWall_2 = corridorWall_1.createInstance("const corridorWall_2");
  corridorWall_2.rotation.y = 2 * Math.PI;
  corridorWall_2.position.z = 2.9;
  //
  const corridorLightGreen = new PointLight(
    "corridorLightGreen",
    new Vector3(-16, 2.9, 1)
  );
  corridorLightGreen.intensity = 4;
  corridorLightGreen.diffuse = Color3.Green();
  const door = scene.getMeshByName("bigdoor")!;
  (door.material as PBRMaterial).environmentIntensity = 0.5;
  corridorLightGreen.includedOnlyMeshes.push(door, corridorWall_1);

  const corridorLightWhite = new PointLight(
    "corridorLightWhite",
    new Vector3(-16, 2.95, -1.25)
  );
  corridorLightWhite.intensity = 4;
  corridorLightWhite.diffuse = Color3.White();

  // corridorLightGreen.excludedMeshes.push(scene)
  corridorLightWhite.includedOnlyMeshes.push(
    door,
    corridorWall_1,
    corridorWall_2
  );

  const block = scene.getMeshByName("concreteblock") as Mesh;
  const blockRear = block.createInstance("blockRear");
  blockRear.scaling.scaleInPlace(4);
  blockRear.position.x = -19.5;
  blockRear.position.y = 3.75;

  /*


  
    const block = this.scene.getMeshByName("ceiling_lamp") as Mesh;

    var matrix = Matrix.Translation(-2, 2, 0);

    var idx = block.thinInstanceAdd(matrix);
    var idx2 = block.thinInstanceAddSelf();

    var matrix2 = Matrix.Translation(-3, 1, 0);

    block.thinInstanceSetMatrixAt(idx2, matrix2);
  const block = scene.getMeshByName("concreteblock") as Mesh;
  console.log("block ", block);
  let matrix = Matrix.Translation(-2, 2, 0);

  var idx = block.thinInstanceAdd(matrix);
  var idx2 = block.thinInstanceAddSelf();
  let matrix2 = Matrix.Translation(2, 1, 0);

  block.thinInstanceSetMatrixAt(idx2, matrix2);
  */
  // block!.thinInstanceAdd(Matrix.Translation(2, 2, 2));
}
