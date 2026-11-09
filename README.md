# Signal — Wireless Network Planner

**Signal** is an interactive application for exploring **graph colouring** in a wireless-network planning scenario. It models transmitters as vertices, creates interference edges between nearby transmitters, and uses the **DSATUR heuristic** to assign frequencies (colours) so that interfering transmitters receive different frequencies.

The project combines algorithm design, graph visualisation, frontend performance engineering, automated testing, and deployment.

> **Live demo:** Add the Azure Static Web Apps URL here.
>
> **Source code:** https://github.com/angular-frontend-dev/network-planner

## Features

### Network Planner

- Generate networks of transmitters with configurable parameters, including an interference radius.
- Build an interference graph from transmitter positions using a spatial grid to limit unnecessary distance checks.
- Allocate frequencies using DSATUR graph colouring.
- Explore the resulting graph in an interactive **Sigma.js / WebGL** visualisation.

### Colouring algorithms

Signal includes two DSATUR implementations:

- **Scan DSATUR:** Selects the next vertex by scanning the uncoloured vertices.
- **Heap DSATUR:** Uses a heap-based selection strategy.

Both apply the DSATUR heuristic, prioritising vertices based on the diversity of colours already assigned to their neighbours. The application provides a practical setting for examining algorithmic trade-offs; DSATUR is a heuristic and does **not** guarantee a minimum colouring for every graph.

### Performance exploration

The Performance page makes it possible to compare graph-colouring implementations and explore how graph size and density affect execution time. Results depend on the generated graph, hardware, browser, and runtime conditions.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | Angular, TypeScript, Angular Signals |
| Graph model | Graphology |
| Interactive graph rendering | Sigma.js (WebGL) |
| Data visualisation | Chart.js |
| Unit tests | Angular test runner / Vitest |
| End-to-end tests | Playwright |
| CI/CD | GitHub Actions |
| Hosting | Azure Static Web Apps |

## Architecture and rendering

The project separates graph algorithms and network-generation logic from the UI that presents their results.

- **Marketing and informational pages** are prerendered as static pages.
- **Network Planner** uses browser-side rendering for its interactive WebGL graph.
- **Lazy loading and incremental hydration** help avoid paying the cost of interactive components before they are needed.
- **Spatial indexing** avoids checking every possible pair of transmitters when building interference edges in typical spatial distributions.

Static graph imagery is used in places where a live renderer would add unnecessary main-thread and WebGL overhead.

## Run locally

### Requirements

- Node.js **22.22.3 or later**, compatible with the version requirements in `package.json`
- npm

```bash
npm ci
npm start
```

Then open the local URL reported by Angular CLI (typically `http://localhost:4200`).

To produce a production build:

```bash
npm run build
```

The static browser build is generated under `dist/network-planner/browser`.

## Tests

Run Angular unit tests:

```bash
npm test -- --watch=false
```

Install the Playwright browsers (first run):

```bash
npx playwright install --with-deps
```

Run E2E tests sequentially:

```bash
npm run e2e -- --workers=1
```

Other useful commands include `npm run e2e:ui` and `npm run e2e:report`.

## CI/CD

GitHub Actions coordinates the pipeline using three workflows in `.github/workflows/`:

1. **`ci-cd.yml`** orchestrates the process on pushes to `main` and relevant pull-request events.
2. **`playwright.yml`** performs automated checks, including unit tests, an application build, and Playwright E2E tests.
3. **`azure-static-web-apps-white-island-0dc0d1e10.yml`** builds and deploys the application to Azure Static Web Apps.

**Azure deployment depends on successful tests.** Closing a pull request can independently trigger cleanup of its Azure preview environment.

## Scope and limitations

Signal is an **educational and experimental planner**, not a production-grade radio-frequency engineering tool. The interference model is based on spatial proximity, rather than propagation modelling, terrain, obstacles, or regulatory frequency constraints.

It is primarily intended for **sparse to moderately dense networks**. Large or very dense networks can increase graph-construction time, memory usage, algorithm execution time, and visual clutter. Browser performance also varies across devices.

## Project goals

Signal was developed to demonstrate how graph algorithms can support an understandable real-world problem, while exploring modern Angular architecture, rendering performance, testing practices, and reliable frontend deployment.
