import { Routes } from "@angular/router";
import { MarketingLayout } from "./features/network-planning/layouts/marketing/marketing.layout";
import { NetworkPlannerLayout } from "./features/network-planning/layouts/network-planner/network-planner.layout";
import { HomePage } from "./features/network-planning/pages/home/home.page";

export const routes: Routes = [
  { path: "", redirectTo: "/network-planning", pathMatch: "full" },
  {
    path: "marketing",
    component: MarketingLayout,
    children: [
      {
        path: "how-it-works",
        loadComponent: () =>
          import("./features/network-planning/pages/how-it-works/how-it-works.page").then(
            (m) => m.HowItWorksPage,
          ),
      },
      {
        path: "engineering",
        loadComponent: () =>
          import("./features/network-planning/pages/engineering/engineering.page").then(
            (m) => m.EngineeringPage,
          ),
      },
    ],
  },

  {
    path: "network-planning",
    component: NetworkPlannerLayout,
    children: [
      {
        path: "",
        component: HomePage,
      },
      {
        path: "network-planner",
        loadComponent: () =>
          import("./features/network-planning/pages/network-planner/network-planner.page").then(
            (m) => m.NetworkPlannerPage,
          ),
      },
      {
        path: "performance",
        loadComponent: () =>
          import("./features/network-planning/pages/performance/performance.page").then(
            (m) => m.PerformancePage,
          ),
      },
    ],
  },
];
