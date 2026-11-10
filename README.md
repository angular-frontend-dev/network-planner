# Signal — Wireless Network Planner

**Signal** is an interactive application that explores **graph colouring** through a wireless-network planning scenario. It represents transmitters as vertices, connects nearby transmitters when they may interfere, and uses the **DSATUR heuristic** to allocate frequencies (colours) so that adjacent transmitters receive different frequencies.

The project brings together graph algorithms, interactive visualisation, frontend performance engineering, modern Angular architecture, automated testing, and continuous deployment.

> **Live demo:** https://white-island-0dc0d1e10.2.azurestaticapps.net/  
> **Source code:** https://github.com/angular-frontend-dev/network-planner

## Features

### Network Planner

- Generate networks with configurable transmitter counts and interference radius.
- Construct interference graphs from transmitter positions, using a spatial grid to reduce unnecessary distance checks.
- Allocate frequencies with DSATUR and inspect the resulting colouring.
- Explore the graph with an interactive **Sigma.js / WebGL** visualisation.
- Use the guided tutorial to learn the planning workflow.

### Graph-colouring algorithms

Signal includes two DSATUR implementations:

- **Scan DSATUR:** selects the next vertex by scanning uncoloured vertices.
- **Heap DSATUR:** uses a heap-based selection strategy.

Both prioritise vertices according to the diversity of colours already assigned to their neighbours. DSATUR is a heuristic: it produces a proper colouring, but **does not guarantee the minimum possible number of colours** for every graph.

### Performance exploration

The Performance page lets users compare the implementations and investigate the effect of network size and density on execution time. Benchmark results depend on graph structure, hardware, browser, and runtime conditions; they are not universal performance guarantees.

## Tech stack

| Area                        | Technology                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| Frontend                    | Angular 22, TypeScript, Angular Signals, Form Signals                                               |
| Workspace and architecture  | Nx 24, feature-oriented libraries, module-boundary rules                                            |
| Rendering                   | Angular SSR tooling, static prerendering (SSG), browser-side rendering (CSR), incremental hydration |
| Graph model and algorithms  | Graphology, custom spatial grid, Scan DSATUR, Heap DSATUR                                           |
| Interactive graph rendering | Sigma.js (WebGL)                                                                                    |
| Charts                      | Chart.js                                                                                            |
| Unit tests                  | Angular test runner / Vitest                                                                        |
| End-to-end tests            | Playwright                                                                                          |
| Automation                  | GitHub Actions                                                                                      |
| Hosting                     | Azure Static Web Apps                                                                               |

## Architecture

The application is organised into focused Nx libraries. Public entry points and dependency boundaries keep user-interface code, domain logic, data access, and reusable utilities from becoming unnecessarily coupled.

Key libraries under `src/app/libs/` include:

- **`planner`** — network-planning interface and interactions.
- **`performance`** — algorithm benchmarking and results.
- **`marketing`** — landing and informational pages.
- **`ui`** — reusable presentation components.
- **`util`** — reusable graph and algorithm utilities.
- **`data-access`** — shared data-access responsibilities.

These boundaries are enforced through Nx-aware lint rules. Algorithm and network-model logic are kept separate from Sigma's browser-specific rendering code.

### Rendering strategy

Signal uses Angular's server-rendering infrastructure (`@angular/ssr`) for a **hybrid build-time/browser rendering approach**:

- **SSG:** marketing and informational routes are prerendered to static HTML during the build.
- **CSR:** the interactive Network Planner renders in the browser because Sigma.js depends on WebGL and browser APIs.
- **Lazy loading:** route-level code is loaded on demand.
- **Incremental hydration:** eligible deferred UI content can hydrate progressively.
- **Browser-only imports:** Sigma rendering code is loaded dynamically to avoid executing browser-dependent code during prerendering.

**Deployment detail:** Although Angular's SSR tooling participates in the build, Azure Static Web Apps serves the generated static site. Signal does **not** require a request-time Angular SSR server.

### Performance considerations

- A spatial grid reduces unnecessary pairwise distance checks when generating interference edges.
- Graph rendering is isolated from graph generation and colouring.
- Static images replace live WebGL visualisations in areas where interactivity is not needed, avoiding extra renderer work on informational pages.
- The Network Planner remains interactive and client-rendered where WebGL provides value.

## Getting started

### Requirements

The project is configured and tested with:

- **Node.js 22.22.3**
- **npm 11.12.0**

For consistent dependency installation, use the Node/npm versions declared in `package.json` and the committed `package-lock.json`.

### Install and run

```bash
npm ci
npm start
```

Open the local URL reported by the development server (typically `http://localhost:4200`).

Create the production build with:

```bash
npm run build
```

The static browser output is generated at `dist/network-planner/browser`.

## Quality checks

Lint the Nx projects:

```bash
npm run lint:all
```

Run unit tests without watch mode:

```bash
npx nx test network-planner --watch=false
```

Install Playwright browser binaries (first use, or after a Playwright upgrade):

```bash
npx playwright install
```

Run the end-to-end suite sequentially:

```bash
npm run e2e
```

Additional commands include `npm run e2e:ui` and `npm run e2e:report`. On Linux CI, Playwright browser installation also includes system dependencies via `npx playwright install --with-deps`.

## CI/CD and deployment

GitHub Actions runs automated checks and deploys successful updates to **Azure Static Web Apps**. The pipeline uses reusable workflows and a shared dependency-setup action:

| File                                                                 | Responsibility                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `.github/workflows/ci-cd.yml`                                        | Orchestrates checks and deployment                            |
| `.github/workflows/lint.yml`                                         | Runs Nx/ESLint checks                                         |
| `.github/workflows/playwright.yml`                                   | Runs unit tests, production build, and Playwright E2E tests   |
| `.github/workflows/azure-static-web-apps-white-island-0dc0d1e10.yml` | Builds and deploys the static application to Azure            |
| `.github/actions/setup-deps/action.yml`                              | Sets up the shared Node/npm environment and performs `npm ci` |

**Pipeline behaviour:**

1. Pushes trigger lint and test workflows; pull requests targeting `main` also receive checks.
2. The deployment job runs only for pushes to `main` after the checks succeed.
3. Azure serves the generated browser build from `dist/network-planner/browser`.

The production deployment was validated after merging the CI/CD changes to `main`.

## Scope and limitations

Signal is an **educational and experimental planner**, not a production-ready radio-frequency engineering tool. Its interference model uses spatial proximity rather than propagation modelling, terrain, obstacles, or regulatory frequency constraints.

The application is primarily intended for **sparse to moderately dense networks**. Very large or dense graphs can increase construction time, memory usage, algorithm execution time, and visual clutter. Performance also varies by device and browser.

## Project goals

Signal demonstrates how graph algorithms can support an understandable real-world problem while showcasing practical software-engineering choices: modular architecture, appropriate rendering strategies, performance optimisation, automated testing, and reliable deployment.
