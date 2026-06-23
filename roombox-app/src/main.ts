import { Engine } from "@babylonjs/core/Engines/engine";
import "@babylonjs/loaders/glTF";
import { createWorkshopScene } from "./scene/createWorkshopScene";
import "./styles.css";

const canvas = document.querySelector<HTMLCanvasElement>("#render-canvas");

if (!canvas) {
  throw new Error("Render canvas was not found.");
}

const engine = new Engine(canvas, true, {
  antialias: true,
  powerPreference: "high-performance",
  stencil: true,
});

const scene = await createWorkshopScene(engine, canvas);

engine.runRenderLoop(() => {
  scene.render();
});

const resize = (): void => engine.resize();
window.addEventListener("resize", resize);

window.addEventListener("beforeunload", () => {
  window.removeEventListener("resize", resize);
  scene.dispose();
  engine.dispose();
});
