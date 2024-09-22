import { PBRMaterial, Texture } from "@babylonjs/core";

interface ITexData {
  folder: string;
  albedo: string;
  metallic: string;
  bump: string;
  ao: string;
  detail?: string;
}

export const exposedBrick = {
  folder: "exposed-brick-wall/",
  albedo: "exposed-brick-wall_base_1k.jpg",
  metallic: "exposed-brick-wall_rough_1k.jpg",
  bump: "exposed-brick-wall_normal_1k.jpg",
  ao: "exposed-brick-wall_orm_1k.jpg",
};

export const checkerTiles = {
  folder: "checkered-marble-flooring/",
  albedo: "checkered-marble-flooring_base_1k.jpg",
  metallic: "checkered-marble-flooring_rough_1k.jpg",
  bump: "checkered-marble-flooring_normal_1k.jpg",
  ao: "checkered-marble-flooring_orm_1k.jpg",
};

export const brownCement = {
  folder: "brown-cement-concrete/",
  albedo: "brown-cement-concrete_base_1k.jpg",
  metallic: "brown-cement-concrete_rough_1k.jpg",
  bump: "brown-cement-concrete_normal_1k.jpg",
  ao: "brown-cement-concrete_orm_1k.jpg",
};

export const oldStone = {
  folder: "old-stone-wall/",
  albedo: "old-stone-wall_base_1k.jpg",
  metallic: "old-stone-wall_rough_1k.jpg",
  bump: "old-stone-wall_normal_1k.jpg",
  ao: "old-stone-wall_orm_1k.jpg",
  detail: "old-stone-wall_det_1k.jpg",
};

export const cobbleStone = {
  folder: "cobblestone-floor/",
  albedo: "cobblestone-floor_base_1k.jpg",
  metallic: "cobblestone-floor_rough_1k.jpg",
  bump: "cobblestone-floor_normal_1k.jpg",
  ao: "cobblestone-floor_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};
export const diamondMetal = {
  folder: "DiamondPlate008C_2K-JPG/",
  albedo: "DiamondPlate008C_2K-JPG_Color.jpg",
  metallic: "DiamondPlate008C_2K-JPG_Roughness.jpg",
  bump: "DiamondPlate008C_2K-JPG_NormalDX.jpg",
  ao: "DiamondPlate008C_2K-JPG_AmbientOcclusion.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export const greyWood = {
  folder: "grey-wood-plank/",
  albedo: "grey-wood-plank_base_1k.jpg",
  metallic: "grey-wood-plank_rough_1k.jpg",
  bump: "grey-wood-plank_normal_1k.jpg",
  ao: "grey-wood-plank_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export const whiteLeather = {
  folder: "white-leather/",
  albedo: "white-leather_base_1k.jpg",
  metallic: "white-leather_rough_1k.jpg",
  bump: "white-leather_normal_1k.jpg",
  ao: "white-leather_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export const oldStone2 = {
  folder: "old-stone/",
  albedo: "old-stone_base_1k.jpg",
  metallic: "old-stone_rough_1k.jpg",
  bump: "old-stone_normal_1k.jpg",
  ao: "old-stone_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export const darkConcrete = {
  folder: "dark-grey-concrete/",
  albedo: "dark-grey-concrete_base_1k.jpg",
  metallic: "dark-grey-concrete_rough_1k.jpg",
  bump: "dark-grey-concrete_normal_1k.jpg",
  ao: "dark-grey-concrete_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export const oldTiles = {
  folder: "old-tiles/",
  albedo: "old-tiles_base_1k.jpg",
  metallic: "old-tiles_rough_1k.jpg",
  bump: "old-tiles_normal_1k.jpg",
  ao: "old-tiles_orm_1k.jpg",
  // detail: "old-stone-wall_det_1k.jpg",
};

export function createMaterial(
  folder: string,
  data: ITexData,
  name: string,
  tiles: number = 1
) {
  const material = new PBRMaterial(name);
  material.maxSimultaneousLights = 8;

  material.albedoTexture = new Texture(folder + data.folder + data.albedo);
  material.metallicTexture = new Texture(folder + data.folder + data.metallic);
  material.bumpTexture = new Texture(folder + data.folder + data.bump);
  material.ambientTexture = new Texture(folder + data.folder + data.ao);

  material.bumpTexture!.level = 1.7;

  material.iridescence.isEnabled = false;
  material.iridescence.intensity = 0.9;

  (material.albedoTexture as Texture).uScale = tiles;

  (material.albedoTexture as Texture).vScale = tiles;

  (material.metallicTexture as Texture).uScale = tiles;

  (material.metallicTexture as Texture).vScale = tiles;

  (material.bumpTexture as Texture).uScale = tiles;

  (material.bumpTexture as Texture).vScale = tiles;

  (material.ambientTexture as Texture).uScale = tiles;
  (material.ambientTexture as Texture).vScale = tiles;

  material.useParallax = false;
  material.useParallaxOcclusion = false;
  material.parallaxScaleBias = 0.2;

  //
  return material;
}
