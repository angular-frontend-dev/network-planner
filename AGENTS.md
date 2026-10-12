# Network Planner — Project Instructions

## Project Overview

This is a portfolio project built with modern Angular.

The application is an interactive network-planning and graph-visualization tool. Users can create, edit, visualize, and analyze networks composed of towers/nodes positioned in a 2D space.

The project should demonstrate both strong frontend engineering and non-trivial algorithmic work.

The application is intended to be production-quality portfolio work rather than a tutorial or CRUD demo.

---

# Developer Background

The developer has extensive frontend development experience and is currently refreshing modern Angular.

The developer also has a strong background in:

- graph theory
- combinatorics
- algorithms
- probabilistic methods
- data structures
- complexity analysis

Do not over-explain basic programming concepts unless requested.

When introducing Angular features that differ significantly from older Angular versions, briefly explain the modern approach and why it is preferred.

---

# Angular Version and Style

Use modern Angular 22+ practices.

Prefer:

- standalone components
- Signals
- `computed()`
- `linkedSignal()` when appropriate
- `input()`
- `output()`
- `model()`
- `inject()`
- built-in template control flow
- `@if`
- `@for`
- `@switch`
- lazy-loaded routes
- strict TypeScript
- zoneless-compatible code
- OnPush-style reactive architecture
- Vitest for testing

Avoid introducing legacy Angular patterns unless compatibility requires them.

Do not introduce NgModules for new features.

Do not use `*ngIf` or `*ngFor` in newly written code when modern control-flow syntax is appropriate.

Prefer:

```html
@if (selectedNode()) {
<app-node-details [node]="selectedNode()" />
} @for (node of nodes(); track node.id) { ... }
```

instead of legacy structural directives.

---

# Application Architecture

Prefer feature-based organization.

Suggested high-level structure:

```text
src/
├── app/
│   ├── core/
│   │   ├── api/
│   │   ├── services/
│   │   └── configuration/
│   │
│   ├── shared/
│   │   ├── ui/
│   │   ├── models/
│   │   ├── directives/
│   │   └── utilities/
│   │
│   ├── features/
│   │   ├── network-planner/
│   │   │   ├── components/
│   │   │   ├── data-access/
│   │   │   ├── state/
│   │   │   └── models/
│   │   │
│   │   ├── scenarios/
│   │   └── dashboard/
│   │
│   └── app.routes.ts
│
├── graph-core/
│   ├── models/
│   ├── algorithms/
│   ├── graph.ts
│   ├── geometry.ts
│   ├── coverage.ts
│   └── coloring.ts
│
└── workers/
    └── graph.worker.ts
```

Do not create giant global folders containing every component or service in the application.

Keep feature-specific code close to the feature that owns it.

---

# Graph Algorithms

Graph algorithms must remain independent from Angular whenever possible.

Prefer pure TypeScript functions such as:

```typescript
export function buildGraph(
  towers: readonly Tower[],
  communicationRadius: number,
): Graph {
  // ...
}
```

or:

```typescript
export function greedyColoring(graph: Graph): ColoringResult {
  // ...
}
```

Avoid placing substantial graph algorithms directly inside:

- Angular components
- Angular services
- templates
- rendering code

The graph algorithm layer should ideally be reusable independently of Angular.

Prefer this dependency direction:

```text
graph-core
    ↓
Web Worker
    ↓
Angular state
    ↓
UI / renderer
```

Angular may call graph algorithms, but `graph-core` should not depend on Angular.

---

# Heavy Computation

Potentially expensive computation should not block the browser's main UI thread.

Examples include:

- graph generation
- recomputing large edge sets
- coloring algorithms
- coverage calculations
- optimization
- simulations
- large geometric searches

For sufficiently expensive work, prefer Web Workers.

Desired flow:

```text
Angular UI
    ↓
Web Worker
    ↓
graph-core algorithms
    ↓
result
    ↓
Angular Signals
    ↓
Canvas/WebGL renderer
```

Do not automatically move every computation into a worker.

Simple computations that are effectively instantaneous may remain on the main thread.

Use profiling and algorithmic complexity to decide.

---

# Visualization

The graph visualization should use Canvas or WebGL rather than thousands of Angular DOM components.

Angular should manage:

- application state
- controls
- forms
- sidebars
- menus
- configuration
- routing
- data flow

Canvas/WebGL should manage:

- nodes
- edges
- labels where appropriate
- zoom
- pan
- selection highlighting
- graphical overlays

Avoid architectures such as:

```html
<app-node @for="..."></app-node>
```

for very large networks.

Rendering thousands of graph elements as Angular components is not the intended design.

---

# Network Model

A tower/node should conceptually contain data such as:

```typescript
export interface Tower {
  id: string;
  x: number;
  y: number;
  radius: number;
}
```

Additional fields can be introduced when required, for example:

```typescript
weight?: number;
label?: string;
status?: TowerStatus;
metadata?: Record<string, unknown>;
```

Do not add fields merely because they might be useful someday.

Keep domain models minimal and intentional.

---

# Graph Construction

Two towers may be adjacent according to a geometric relationship, such as distance.

For example:

```typescript
distance(u, v) <= communicationRadius;
```

or another network-specific rule.

Keep geometry and graph topology separate when practical.

For example:

```text
Tower positions
      ↓
geometric calculation
      ↓
adjacency relation
      ↓
Graph
```

This separation makes it easier to replace the graph-generation rule later.

---

# Angular State

Prefer Signals for local and application UI state.

Example:

```typescript
readonly towers = signal<Tower[]>([]);
readonly selectedTowerId = signal<string | null>(null);
readonly communicationRadius = signal(100);

readonly selectedTower = computed(() =>
  this.towers().find(
    tower => tower.id === this.selectedTowerId()
  ) ?? null
);
```

Prefer derived state with `computed()` rather than manually synchronizing multiple pieces of state.

Avoid `effect()` when `computed()` can express the relationship.

Use `effect()` primarily for genuine side effects.

Examples:

- persistence
- logging
- interaction with non-Angular APIs
- imperative renderer synchronization

---

# RxJS

RxJS remains appropriate for asynchronous streams and event composition.

Do not replace every Observable with a Signal.

A useful guideline is:

```text
UI/application state
        → Signals

complex asynchronous streams
        → RxJS

HTTP/server interaction
        → HttpClient / resource APIs / RxJS as appropriate
```

Use interoperability utilities when converting between Signals and Observables is useful.

---

# Forms

Prefer modern Angular forms.

Use Signal Forms when they fit the application and Angular version being used.

Reactive Forms remain acceptable, particularly when they provide a clearer or more mature implementation.

Important forms may include:

- network configuration
- tower creation/editing
- simulation parameters
- optimization configuration
- scenario settings

Always include appropriate validation.

---

# Main Network Planner UI

The central page should conceptually contain:

```text
NetworkPlannerPage
│
├── PlannerToolbar
│
├── GraphViewport
│
├── PlannerSidebar
│
├── NodeInspector
│
└── Statistics / Results
```

Possible interactions include:

- add tower
- remove tower
- drag tower
- select tower
- edit position
- edit radius
- zoom
- pan
- generate random network
- clear network
- run algorithm
- display algorithm result
- display graph statistics
- reset simulation

Do not implement features solely to make the application larger.

Prefer a smaller number of polished, meaningful features.

---

# Performance

Performance is an important part of this portfolio.

Pay attention to:

- unnecessary Angular rendering
- excessive signal updates
- memory allocation
- graph complexity
- Canvas redraw frequency
- large edge sets
- UI responsiveness
- Web Worker communication overhead

Prefer `requestAnimationFrame()` for visual updates when appropriate.

Do not recompute the entire graph unnecessarily after every tiny UI interaction if an incremental solution is simple and clearly beneficial.

However, avoid premature optimization.

Measure before introducing major complexity.

---

# Large Graphs

The application should be designed with relatively large graphs in mind.

Potential targets may include:

- thousands of nodes
- tens of thousands of nodes where feasible
- large edge sets

Actual limits depend heavily on:

- graph density
- algorithm complexity
- rendering strategy
- browser memory
- WebGL/Canvas approach

Do not promise arbitrary graph sizes without profiling.

When performance becomes problematic, identify whether the bottleneck is:

```text
graph construction
algorithm
data transfer
Angular state
Canvas rendering
WebGL rendering
memory
```

before optimizing.

---

# TypeScript

Use strict TypeScript.

Prefer:

```typescript
readonly
unknown
discriminated unions
explicit domain types
pure functions
```

when appropriate.

Avoid unnecessary:

```typescript
any;
```

Do not introduce excessive abstraction or complex generic types merely to appear sophisticated.

Code should remain readable.

---

# CSS and Layout

Use responsive design.

Prefer:

- CSS Grid for major page layout
- Flexbox for local component alignment
- modern responsive CSS
- semantic HTML

Example:

```text
Desktop:

┌─────────────────────────────────────┐
│ Toolbar                             │
├───────────────────────┬─────────────┤
│                       │             │
│ Graph Viewport        │ Sidebar     │
│                       │             │
│                       │             │
└───────────────────────┴─────────────┘
```

Mobile may transform this into:

```text
┌─────────────────┐
│ Toolbar         │
├─────────────────┤
│                 │
│ Graph           │
│                 │
├─────────────────┤
│ Bottom panel /  │
│ drawer          │
└─────────────────┘
```

Do not assume desktop-only usage.

---

# Accessibility

Treat accessibility as part of production-quality frontend work.

Use:

- semantic HTML
- keyboard-accessible controls
- appropriate labels
- focus states
- ARIA only when necessary
- sufficient UI feedback

Canvas interactions should have accessible alternatives where reasonably possible.

---

# Testing

Use Vitest for Angular unit testing where supported by the project setup.

Prioritize tests for:

- graph algorithms
- graph construction
- geometry
- state transformations
- validation
- API services
- critical component behavior

Graph algorithms should be especially easy to test because they should be pure TypeScript.

Example:

```typescript
describe("greedyColoring", () => {
  it("produces a proper coloring", () => {
    const graph = createTestGraph();

    const result = greedyColoring(graph);

    expect(isProperColoring(graph, result)).toBe(true);
  });
});
```

Do not chase arbitrary coverage percentages.

Test behavior that could realistically break.

---

# Backend

The first version of the project may be frontend-only.

Do not introduce a backend unless the requested task actually requires one.

Possible future backend:

```text
Angular
    ↓
ASP.NET Core
    ↓
EF Core
    ↓
PostgreSQL
```

Possible backend responsibilities:

- authentication
- saved scenarios
- persistence
- shared simulations
- simulation history
- expensive server-side computation
- user accounts

Do not move interactive graph computation to the server without a reason.

Client-side computation is preferred when it improves responsiveness and the workload is reasonable for the browser.

---

# Future ASP.NET Integration

When a backend is eventually introduced:

- keep frontend and backend domain boundaries clear
- use typed API models
- avoid leaking database models directly into Angular
- keep expensive backend computation asynchronous
- design APIs around application operations rather than raw database tables

The frontend should continue to work with a clear application/domain model.

---

# Portfolio Quality

This project should demonstrate:

1. modern Angular knowledge
2. strong TypeScript
3. application architecture
4. performance awareness
5. Canvas/WebGL rendering
6. Web Workers
7. graph algorithms
8. responsive UI
9. testing
10. thoughtful engineering trade-offs

Avoid adding technologies only to increase the technology list.

Every important dependency should have a clear purpose.

---

# Coding Style

Prefer:

- small focused components
- pure functions
- explicit domain models
- understandable names
- low coupling
- clear dependency direction
- testable code

Avoid:

- god components
- huge services
- unnecessary inheritance
- premature design patterns
- excessive abstractions
- deeply nested RxJS pipelines when a simpler approach exists
- state duplication

---

# When Generating Code

Before making significant architectural changes:

1. inspect the existing project structure
2. understand the current implementation
3. preserve established conventions unless there is a strong reason to change them
4. explain major architectural changes briefly
5. prefer incremental changes over unnecessary rewrites

Do not replace working code simply because another style is possible.

---

# When Helping the Developer Learn

This project is also being used to refresh modern Angular knowledge.

When introducing an important modern Angular feature for the first time, briefly explain:

- what it does
- why it is being used
- how it differs from older Angular patterns

Keep these explanations concise.

Do not turn ordinary implementation tasks into beginner-level tutorials.

---

# Decision Priorities

When several approaches are possible, prioritize in this order:

1. correctness
2. maintainability
3. clear architecture
4. responsiveness
5. performance
6. simplicity
7. cleverness

Prefer boring, understandable code over unnecessarily sophisticated code.

For graph algorithms specifically, algorithmic complexity should also be considered carefully.

---

# Project Philosophy

The project should combine:

```text
strong frontend engineering
          +
graph algorithms
          +
interactive visualization
          +
performance-conscious design
```

The goal is not simply to demonstrate Angular syntax.

The final application should feel like a genuine technical tool built by someone who understands both software engineering and graph algorithms.
