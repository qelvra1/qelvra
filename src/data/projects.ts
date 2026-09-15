/* Centralized Selected Works catalog — powered by PROJECTS_CONFIG & DEMO_MODELS */

import { PROJECTS_CONFIG, type ProjectConfigItem } from "./projectsConfig";
import { DEMO_MODELS, type DemoModelKey } from "../config/demoModels";

export type Category = string;
export type FilterKey = "All" | Category;

export interface Project extends ProjectConfigItem {
  displayName: string;
  image: string;
  liveUrl: string;
  assetBaseDir: string;
}

export { PROJECTS_CONFIG, type ProjectConfigItem };

export const PROJECTS: Project[] = PROJECTS_CONFIG.map((item) => {
  const modelKey = item.folderName as DemoModelKey;
  const modelConfig = DEMO_MODELS[modelKey];
  return {
    ...item,
    displayName: item.title,
    image: modelConfig ? modelConfig.preview : `/demos/${item.folderName}/${item.folderName}.webp`,
    liveUrl: modelConfig ? modelConfig.entry : `/demos/${item.folderName}/index.html`,
    assetBaseDir: modelConfig ? modelConfig.assetsDir : `/demos/${item.folderName}/assets/`,
  };
});

export const FILTERS: FilterKey[] = [
  "All",
  ...Array.from(new Set(PROJECTS.map((p) => p.category))),
];

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p])
);

export const getProjectById = (id: string): Project | undefined =>
  PROJECT_BY_ID[id];
