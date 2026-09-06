/* Centralized Selected Works catalog — powered by PROJECTS_CONFIG */

import { PROJECTS_CONFIG, type ProjectConfigItem } from "./projectsConfig";
import { demoIndexUrl } from "../assets";

export type Category = string;
export type FilterKey = "All" | Category;

export interface Project extends ProjectConfigItem {
  displayName: string;
  image: string;
  liveUrl: string;
}

export { PROJECTS_CONFIG, type ProjectConfigItem };

export const PROJECTS: Project[] = PROJECTS_CONFIG.map((item) => ({
  ...item,
  displayName: item.title,
  image: `./assets/demos/${encodeURIComponent(item.folderName)}/${encodeURIComponent(
    item.folderName
  )}.webp`,
  liveUrl: demoIndexUrl(item.folderName),
}));

export const FILTERS: FilterKey[] = [
  "All",
  ...Array.from(new Set(PROJECTS.map((p) => p.category))),
];

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p])
);

export const getProjectById = (id: string): Project | undefined =>
  PROJECT_BY_ID[id];
