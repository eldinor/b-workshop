import {
  Scene,
  PointLight,
  Vector3,
  Color3,
  SpotLight,
  DefaultRenderingPipeline,
  Color4,
  Vector2,
  BlurPostProcess,
} from "@babylonjs/core";
import { WORKSHOP } from "./workshop";

export function prepareLights(scene: Scene, spotLightArray: SpotLight[]): void {
  scene.createDefaultEnvironment({
    createGround: false,
    createSkybox: false,
  });
  scene.environmentIntensity = 0.4;
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
  spotLightArray.push(spotlight);
  //
  const spotlight2 = spotlight.clone("spotlight2") as SpotLight;
  spotlight2.position.z = 4;
  spotlight2.direction.x = -0.05;
  spotlight2.direction.z = -0.05;
  //
  spotLightArray.push(spotlight2);

  const spotlight3 = spotlight.clone("spotlight3") as SpotLight;
  spotlight3.position.x = -8;
  spotlight3.direction.z = -0.05;
  //
  spotLightArray.push(spotlight3);
  //
}
export function preparePipeLine(scene: Scene): DefaultRenderingPipeline {
  const pipeline = new DefaultRenderingPipeline(
    WORKSHOP.PIPELINE.name,
    false,
    scene,
    [scene.activeCamera!]
  );
  pipeline.fxaaEnabled = true;
  pipeline.samples = 8;
  // pipeline.imageProcessingEnabled = true
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = 1;

  scene.imageProcessingConfiguration.exposure = WORKSHOP.EXPOSURE.mainExposure;
  //  pipeline.sharpenEnabled = true;
  return pipeline;
}
