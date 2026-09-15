import { useSyncExternalStore } from "react";
import { PROJECTS, type Project } from "./projects";

/**
 * Granular reactive store for the catalog.
 *
 * Components subscribe via useProjects() and only re-render when the
 * snapshot identity changes. External real-time feeds (SSE / WebSocket)
 * should push through batchUpdate() so any number of item mutations
 * commit as ONE notification — never a full list re-render per event.
 *
 * Example (drop-in later):
 *   const es = new EventSource("/api/projects/stream");
 *   es.onmessage = (e) =>
 *     projectsStore.batchUpdate((prev) => applyEvent(prev, JSON.parse(e.data)));
 */
type Listener = () => void;

let snapshot: Project[] = PROJECTS;
const listeners = new Set<Listener>();

export const projectsStore = {
  get: () => snapshot,
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Commit any number of mutations as a single notification. */
  batchUpdate(updater: (prev: Project[]) => Project[]) {
    const next = updater(snapshot);
    if (next === snapshot) return;
    snapshot = next;
    listeners.forEach((l) => l());
  },
};

export function useProjects(): Project[] {
  return useSyncExternalStore(projectsStore.subscribe, projectsStore.get);
}
