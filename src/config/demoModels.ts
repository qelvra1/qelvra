/**
 * Centralized Static Model Registry
 *
 * Single source of truth for all demo models.
 * Every path is root-absolute and points directly into public/demos/<modelName>/
 */

export const SUPPORTED_ASSET_EXTENSIONS = [
  "webp", "png", "jpg", "jpeg", "gif", "svg", "avif", "ico", "bmp", "tiff",
  "js", "mjs", "css", "json", "xml",
  "woff", "woff2", "ttf", "otf", "eot",
  "mp4", "webm", "mp3", "wav",
  "glb", "gltf", "bin", "wasm"
] as const;

export const PREVIEW_EXTENSIONS = [
  "webp", "png", "jpg", "jpeg", "avif", "gif", "svg"
] as const;

export interface DemoModelEntry {
  readonly preview: string;
  readonly entry: string;
  readonly assetsDir: string;
}

export const DEMO_MODELS = {
  "oak-blade": {
    preview: "/demos/oak-blade/oak-blade.webp",
    entry: "/demos/oak-blade/index.html",
    assetsDir: "/demos/oak-blade/assets/",
  },
  velocity: {
    preview: "/demos/velocity/velocity.webp",
    entry: "/demos/velocity/index.html",
    assetsDir: "/demos/velocity/assets/",
  },
  cripsyland: {
    preview: "/demos/cripsyland/cripsyland.webp",
    entry: "/demos/cripsyland/index.html",
    assetsDir: "/demos/cripsyland/assets/",
  },
  medicare: {
    preview: "/demos/medicare/medicare.webp",
    entry: "/demos/medicare/index.html",
    assetsDir: "/demos/medicare/assets/",
  },
  "peak-performannce": {
    preview: "/demos/peak-performannce/peak-performannce.webp",
    entry: "/demos/peak-performannce/index.html",
    assetsDir: "/demos/peak-performannce/assets/",
  },
  "lumiere-haven": {
    preview: "/demos/lumiere-haven/lumiere-haven.webp",
    entry: "/demos/lumiere-haven/index.html",
    assetsDir: "/demos/lumiere-haven/assets/",
  },
  archetype: {
    preview: "/demos/archetype/archetype.webp",
    entry: "/demos/archetype/index.html",
    assetsDir: "/demos/archetype/assets/",
  },
  aurelia: {
    preview: "/demos/aurelia/aurelia.webp",
    entry: "/demos/aurelia/index.html",
    assetsDir: "/demos/aurelia/assets/",
  },
  nexora: {
    preview: "/demos/nexora/nexora.webp",
    entry: "/demos/nexora/index.html",
    assetsDir: "/demos/nexora/assets/",
  },
} as const;

export type DemoModelKey = keyof typeof DEMO_MODELS;

/**
 * Safe helper to fetch a model's registered configuration from DEMO_MODELS.
 */
export function getDemoModel(modelName: string): DemoModelEntry | undefined {
  return DEMO_MODELS[modelName as DemoModelKey];
}
