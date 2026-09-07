import { DEMO_MODELS, getDemoModel, type DemoModelKey } from "./config/demoModels";

export { DEMO_MODELS, getDemoModel, type DemoModelKey };

export const IMAGE_EXTENSIONS = ["webp", "avif", "png", "jpg", "jpeg"] as const;
export type ImageExt = (typeof IMAGE_EXTENSIONS)[number];

const enc = (segment: string) => encodeURIComponent(segment);

export interface ModelPathMap {
  cardPreviewImage: string;
  modelEntryPoint: string;
  assetDirectoryBase: string;
}

/**
 * Reads from the single static DEMO_MODELS registry.
 */
export function getModelPathMap(modelName: string): ModelPathMap {
  const model = DEMO_MODELS[modelName as DemoModelKey];
  if (model) {
    return {
      cardPreviewImage: model.preview,
      modelEntryPoint: model.entry,
      assetDirectoryBase: model.assetsDir,
    };
  }
  return {
    cardPreviewImage: `/demos/${modelName}/${modelName}.webp`,
    modelEntryPoint: `/demos/${modelName}/index.html`,
    assetDirectoryBase: `/demos/${modelName}/assets/`,
  };
}

export function getCardPreviewUrl(modelName: string): string {
  return getModelPathMap(modelName).cardPreviewImage;
}

export function demoIndexUrl(folderName: string): string {
  return getModelPathMap(folderName).modelEntryPoint;
}

export function getAssetDirectoryBase(folderName: string): string {
  return getModelPathMap(folderName).assetDirectoryBase;
}

export function getAssetUrl(name: string): string {
  try {
    return new URL(`../assets/images/${name}.webp`, import.meta.url).href;
  } catch {
    return `/assets/images/${name}.webp`;
  }
}

export function getAssetPath(
  folder: string,
  name: string,
  defaultExt: ImageExt | string = "webp"
): string {
  return `/assets/${enc(folder)}/${enc(name)}.${defaultExt}`;
}

export function previewCandidates(folderName: string): string[] {
  const map = getModelPathMap(folderName);
  return [map.cardPreviewImage];
}

export function faviconPath(name: string): string {
  return `/assets/favicons/${enc(name)}`;
}
