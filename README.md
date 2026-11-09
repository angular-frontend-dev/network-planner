# Signal — Wireless Network Planner

**Signal** is an interactive application for exploring **graph colouring** in a wireless-network planning scenario. It models transmitters as vertices, creates interference edges between nearby transmitters, and uses the **DSATUR heuristic** to assign frequencies (colours) so that interfering transmitters receive different frequencies.

The project combines algorithm design, graph visualisation, frontend performance engineering, automated testing, and deployment.

> **Live demo:** https://white-island-0dc0d1e10.2.azurestaticapps.net/network-planning
>
> **Source code:** https://github.com/angular-frontend-dev/network-planner

## Features

### Network Planner

- Generate networks of transmitters with configurable parameters, including an interference radius.
- Build an interference graph from transmitter positions using a spatial grid to limit unnecessary distance checks.
- Allocate frequencies using DSATUR graph colouring.
- Explore the resulting graph in an interactive **Sigma.js / WebGL** visualisation.

### Colouring Algorithms

Signal includes two DSATUR implementations:

- **Scan DSATUR (naive):** Selects the next vertex by scanning the uncoloured vertices.
- **Heap DSATUR:** Uses a heap-based selection strategy.

Both apply the DSATUR heuristic, prioritising vertices based on the diversity of colours already assigned to their neighbours.

DSATUR is a heuristic and does **not** guarantee a minimum colouring for every graph.

### Performance Exploration

The Performance page makes it possible to compare graph-colouring implementations and explore how graph size and density affect execution time.

Results depend on the generated graph, hardware, browser, and runtime conditions.

## Performance Considerations

Signal is designed to explore graph algorithms interactively. However, performance depends significantly on graph size and density.

Two aspects deserve particular attention: **graph rendering in the Network Planner** and **algorithm execution on the Performance page**.

### 1. Rendering Dense Graphs — Network Planner

The Network Planner uses **Sigma.js with WebGL** to render graphs efficiently. Nevertheless, dense graphs can introduce significant rendering overhead.

For a simple undirected graph with `n` vertices, the maximum number of edges is:

    |E| = n(n - 1) / 2

Consequently, the number of edges may grow quadratically with the number of vertices.

Although Signal uses a **spatial grid** to avoid unnecessary distance calculations during graph construction, this optimisation cannot eliminate the cost of creating and rendering edges that actually exist.

**Recommendations:**

- Start with smaller networks and increase the number of transmitters gradually.
- Reduce the interference radius to generate sparser graphs.
- Avoid generating extremely dense graphs, which may cause reduced frame rates, visual clutter, or browser unresponsiveness.

### 2. Algorithm Execution — Performance Page

Signal implements two variants of the DSATUR graph-colouring heuristic:

- **Scan DSATUR (naive):** Repeatedly scans uncoloured vertices to select the next vertex.
- **Heap DSATUR:** Uses a priority queue to optimise vertex selection.

The naive implementation can become computationally expensive for large graphs because vertex selection repeatedly examines the remaining candidates.

The number of vertices affects the cost of repeated selection, while graph density also influences the amount of adjacency information the algorithms must process.

For sufficiently large or dense inputs, execution may take considerable time, potentially making the browser temporarily unresponsive.

**Recommendations:**

- Begin comparisons with small or moderately sized graphs.
- Increase graph size and density progressively to observe performance differences.
- Avoid extremely large or dense inputs when testing Scan DSATUR.
- Compare the implementations using equivalent input graphs for meaningful performance measurements.

### 3. Understanding the Trade-offs

These limitations are part of the project's educational purpose.

Signal demonstrates that algorithmic complexity, graph representation, spatial indexing, and rendering technology all influence application performance.

**A faster graph-colouring algorithm does not necessarily mean faster visualisation.** Algorithm execution and graphical rendering are separate costs, and optimising one does not automatically improve the other.

## Technology

| Area                        | Tools                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Frontend                    | Angular, TypeScript, Angular Signals, Form Signals                                   |
| Rendering                   | Angular SSR tooling (`@angular/ssr`), SSG (prerendering), CSR, incremental hydration |
| Graph model                 | Graphology                                                                           |
| Interactive graph rendering | Sigma.js (WebGL)                                                                     |
| Data visualisation          | Chart.js                                                                             |
| Unit tests                  | Angular test runner                                                                  |
| End-to-end tests            | Playwright                                                                           |
| CI/CD                       | GitHub Actions                                                                       |
| Hosting                     | Azure Static Web Apps                                                                |

## Architecture and Rendering

Signal uses **modern Angular's server-side rendering (SSR) infrastructure** (`@angular/ssr`) to support a **hybrid rendering strategy**.

In production, the project uses **Static Site Generation (SSG)** for content-oriented routes and **Client-Side Rendering (CSR)** for the interactive Network Planner.

### Static Site Generation (SSG)

Marketing and informational pages are prerendered to HTML during the Angular build process.

This allows Azure Static Web Apps to serve prebuilt content without waiting for JavaScript to generate the initial page.

Benefits include:

- Faster initial content rendering.
- Reduced client-side rendering work.
- Improved accessibility of initial page content.
- No requirement for a continuously running rendering server.

### Client-Side Rendering (CSR)

The Network Planner is primarily client-rendered because its interactive graph relies on browser-specific APIs, including WebGL.

Graph rendering is isolated from the server-rendering process, and browser-dependent modules are loaded dynamically.

This separation prevents WebGL-dependent code from executing during prerendering.

### Lazy Loading and Incremental Hydration

Signal uses lazy-loaded routes and Angular's incremental hydration capabilities to reduce unnecessary initial JavaScript execution.

Selected deferred content can be hydrated when needed, improving perceived loading performance.

### Separation of Concerns

The application separates its main responsibilities:

- **Graph algorithms:** DSATUR implementations and graph-colouring logic.
- **Network generation:** Transmitter positioning and interference graph construction.
- **Spatial indexing:** Efficient identification of nearby transmitters.
- **Visualisation:** Interactive rendering using Sigma.js and WebGL.
- **User interface:** Angular components responsible for configuration, interaction, and presentation.

The graph-colouring algorithms remain independent of the visualisation layer, allowing them to be tested and evaluated separately.

### Frontend Performance Optimisations

The application incorporates several performance-oriented decisions:

- Spatial indexing to reduce unnecessary distance calculations during graph generation.
- WebGL rendering for interactive network visualisation.
- Static graph images for informational pages where continuous rendering is unnecessary.
- Lazy loading to reduce initial JavaScript execution.
- SSG and incremental hydration to improve initial rendering performance.

**SSR vs. SSG:** Although Signal uses Angular's SSR tooling to generate prerendered pages, Azure hosts the resulting static files. It does not run request-time Angular SSR.

This distinction matters because SSG generates HTML during the build process, while traditional SSR generates HTML in response to individual requests.

## Run Locally

### Requirements

- Node.js 22.22.3
- npm

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Then open the local URL reported by Angular CLI (typically `http://localhost:4200`).

To produce a production build:

```bash
npm run build
```

The static browser build is generated under:

```text
dist/network-planner/browser
```

## Tests

Signal includes automated unit and end-to-end tests.

### Unit Tests

Run Angular unit tests:

```bash
npx ng test network-planner --watch=false
```

Unit tests cover the core graph algorithms and network-related functionality.

### End-to-End Tests

Playwright is used to validate application behaviour and user interactions.

Install the Playwright browsers:

```bash
npx playwright install --with-deps
```

Run E2E tests sequentially:

```bash
npx playwright test --workers=1
```

Sequential execution is used to improve test stability in the CI environment.

## CI/CD

Signal uses **GitHub Actions** to automate testing, building, and deployment.

The pipeline is organised into three workflows inside `.github/workflows/`:

1. **`ci-cd.yml`** — Orchestrates the CI/CD process on pushes to `main` and relevant pull-request events.
2. **`playwright.yml`** — Executes unit tests, validates the Angular build, and runs Playwright E2E tests.
3. **`azure-static-web-apps-white-island-0dc0d1e10.yml`** — Builds and deploys the application to Azure Static Web Apps.

### Deployment Strategy

The pipeline follows a test-before-deployment strategy:

    Push / Pull Request
            |
            v
       Unit Tests
            |
            v
      Angular Build
            |
            v
     Playwright Tests
            |
            v
     Azure Deployment
     (only if tests pass)

Deployment depends on successful completion of the automated tests.

When a pull request is closed, Azure preview-environment cleanup can execute independently of the testing workflow.

### Hosting

Signal is hosted using **Azure Static Web Apps**.

The deployment serves prerendered HTML and static assets generated by Angular.

Azure also handles route navigation and server-side redirects through `staticwebapp.config.json`.

## Scope and Limitations

Signal is an **educational and experimental planner**, not a production-grade radio-frequency engineering tool.

The interference model is based on spatial proximity rather than detailed radio propagation modelling, terrain, obstacles, or regulatory frequency constraints.

It is primarily intended for experimenting with graph-colouring algorithms and understanding performance trade-offs.

For guidance on large networks, dense graphs, and computationally expensive scenarios, see the **Performance Considerations** section.

## Project Goals

Signal was developed to demonstrate how graph algorithms can support an understandable real-world problem while exploring:

- Algorithm design and analysis.
- Graph modelling and spatial indexing.
- Interactive data visualisation.
- Modern Angular architecture and rendering strategies.
- Frontend performance engineering.
- Automated testing.
- Reliable CI/CD and cloud deployment.
