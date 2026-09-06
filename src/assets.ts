/**
 * Universal Asset Mapping Resolver
 *
 * All public assets resolve under the single `/assets/` directory (or `./assets/` for subfolder deployment).
 * Absolute root-relative references start with `/assets/` (e.g. `/assets/logos/logo.png`, `/assets/images/bg.jpg`).
 * No references to `/public/` exist in path strings.
 */

export const IMAGE_EXTENSIONS = ["avif", "webp", "png", "jpg", "jpeg"] as const;
export type ImageExt = (typeof IMAGE_EXTENSIONS)[number];

const enc = (segment: string) => encodeURIComponent(segment);

/**
 * Generic path builder for assets stored in /assets/<folder>/<name>.<ext>
 * E.g., getAssetPath("logos", "qelvra-logo", "png") => "/assets/logos/qelvra-logo.png"
 */
export function getAssetPath(
  folder: string,
  name: string,
  defaultExt: ImageExt | string = "jpg"
): string {
  return `/assets/${enc(folder)}/${enc(name)}.${defaultExt}`;
}

/**
 * Demo entry point for standalone subfolder builds: ./assets/demos/<folderName>/index.html
 */
export function demoIndexUrl(folderName: string): string {
  return `./assets/demos/${enc(folderName)}/index.html`;
}

/**
 * Preview candidates probing across extensions (.avif -> .webp -> .png -> .jpg -> .jpeg)
 * Targets local assets inside model folders: ./assets/demos/<folderName>/<folderName>.<ext>
 */
export function previewCandidates(
  folderName: string,
  displayName?: string
): string[] {
  const dir = enc(folderName);
  const file = displayName ? enc(displayName) : dir;
  return [
    ...IMAGE_EXTENSIONS.map((ext) => `./assets/demos/${dir}/${dir}.${ext}`),
    ...IMAGE_EXTENSIONS.map((ext) => `./assets/demos/${dir}/${file}.${ext}`),
    ...IMAGE_EXTENSIONS.map((ext) => `/assets/demos/${dir}/${dir}.${ext}`),
  ];
}

/**
 * Favicon and manifest path helper: /assets/favicons/<name>
 */
export function faviconPath(name: string): string {
  return `/assets/favicons/${enc(name)}`;
}
