import { Routes } from "@angular/router";
import { MarketingLayout } from "./features/network-planning/layouts/marketing/marketing.layout";
import { NetworkPlannerLayout } from "./features/network-planning/layouts/network-planner/network-planner.layout";

export const routes: Routes = [
  { path: "", redirectTo: "/network-planner", pathMatch: "full" },
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
    path: "network-planner",
    component: NetworkPlannerLayout,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/network-planning/pages/home/home.page").then(
            (m) => m.HomePage,
          ),
      },
      {
        path: "network-planner",
        loadComponent: () =>
          import("./features/network-planning/pages/network-planner/network-planner.page").then(
            (m) => m.NetworkPlannerPage,
          ),
      },
    ],
  },
];
