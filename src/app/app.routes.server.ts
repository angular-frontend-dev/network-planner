import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  {
    path: "",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "network-planning",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "network-planning/network-planner",
    renderMode: RenderMode.Client,
  },
  {
    path: "network-planning/performance",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "marketing/how-it-works",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "marketing/engineering",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "**",
    renderMode: RenderMode.Client,
  },
];
