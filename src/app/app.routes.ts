import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "landing" },
  {
    path: "landing",
    loadComponent: () =>
      import("./features/landing/pages/landing-page/landing-page").then(
        (m) => m.LandingPage,
      ),
  },
  { path: "**", redirectTo: "landing" },
];
