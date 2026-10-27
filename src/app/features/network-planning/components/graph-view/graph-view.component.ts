import {
  afterRenderEffect,
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import { layerBorder } from "@sigma/node-border";
import {
  NetworkEdgeAttributes,
  Network,
  NetworkNodeAttributes,
} from "../../models/network/network.model";
import type { Miliseconds } from "../../../../shared/types/time.type";
import { Sigma } from "sigma";

export interface GraphViewOptions {
  enableNodeDrag: boolean;
  enableCameraZooming: boolean;
  enableCameraPanning: boolean;
  enableToolBar: boolean;
}

const DEFAULT_GRAPH_VIEW_OPTIONS: GraphViewOptions = {
  enableNodeDrag: true,
  enableCameraZooming: true,
  enableCameraPanning: true,
  enableToolBar: true,
};

type NetworkRenderer = Sigma<NetworkNodeAttributes, NetworkEdgeAttributes>;

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrl: "./graph-view.component.scss",
})
export class GraphViewComponent implements OnInit {
  graph = input.required<Network>();
  options = input<Partial<GraphViewOptions>>({});
  backgroundImage = input<string>("/images/network-planning/planner-map.png");

  readonly initializationTime = output<number>();

  resolvedOptions!: GraphViewOptions;

  private readonly container =
    viewChild.required<ElementRef<HTMLDivElement>>("container");

  private renderer?: NetworkRenderer;

  constructor() {
    this.initializeSigma();
  }

  ngOnInit(): void {
    this.resolvedOptions = {
      ...DEFAULT_GRAPH_VIEW_OPTIONS,
      ...this.options(),
    };
  }

  private initializeSigma(): void {
    afterRenderEffect((onCleanup) => {
      let disposed = false;
      let destroyRenderer: (() => void) | undefined;

      const graph = this.graph();
      const container = this.container().nativeElement;
      const backgroundImage = this.backgroundImage();

      const options = this.resolvedOptions;

      onCleanup(() => {
        disposed = true;
        destroyRenderer?.();
        this.renderer = undefined;
      });

      void import("./graph-view-renderer.client")
        .then(({ createGraphRenderer }) => {
          if (disposed) return;

          const result = createGraphRenderer({
            graph,
            container,
            options,
            backgroundImage,
          });

          this.renderer = result.renderer;
          destroyRenderer = result.destroy;

          this.initializationTime.emit(result.initializationTime);
        })
        .catch((error: unknown) => {
          if (!disposed) {
            console.error("Failed to initialize Sigma:", error);
          }
        });
    });
  }

  zoomIn(): void {
    this.renderer?.getCamera().zoomIn({
      factor: 1.5,
      duration: 200,
    });
  }

  zoomOut(): void {
    this.renderer?.getCamera().zoomOut({
      factor: 1.5,
      duration: 200,
    });
  }

  resetCamera(): void {
    this.renderer?.getCamera().reset({
      duration: 300,
    });
  }
}
