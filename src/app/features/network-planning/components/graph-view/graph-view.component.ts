import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import Sigma from "sigma";
import { SignalGraph, SignalGraphRenderer } from "./graph-view.component.types";
import { layerBorder } from "@sigma/node-border";

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrl: "./graph-view.component.scss",
})
export class GraphViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild("container", { static: true })
  container!: ElementRef<HTMLElement>;

  graph = input.required<SignalGraph>();
  enableNodeDrag = input<boolean>(true);

  private renderer?: SignalGraphRenderer;

  ngAfterViewInit() {
    this.renderer = new Sigma(this.graph(), this.container.nativeElement, {
      primitives: {
        nodes: {
          variables: {
            borderColor: {
              type: "color",
              default: "#10151F",
            },

            outerBorderSize: {
              type: "number",
              default: 3,
            },

            innerBorderSize: {
              type: "number",
              default: 7,
            },
          },

          layers: [
            layerBorder({
              borders: [
                {
                  size: { attribute: "outerBorderSize" },
                  color: { attribute: "color" },
                  mode: "pixels",
                },
                {
                  size: { attribute: "innerBorderSize" },
                  color: { attribute: "borderColor" },
                  mode: "pixels",
                },
                {
                  size: 0,
                  color: { attribute: "color" },
                  fill: true,
                },
              ],
            }),
          ],
        },
      },

      styles: {
        nodes: [
          {
            x: { attribute: "x" },
            y: { attribute: "y" },
            opacity: { attribute: "opacity" },

            size: { attribute: "size" },
            color: { attribute: "color" },

            borderColor: { attribute: "borderColor" },
            outerBorderSize: { attribute: "outerBorderSize" },
            innerBorderSize: { attribute: "innerBorderSize" },
          },
        ],

        edges: [
          {
            color: { attribute: "color" },
            size: { attribute: "size" },
            opacity: { attribute: "opacity" },
          },
        ],
      },

      settings: {
        enableNodeDrag: this.enableNodeDrag(),
        autoRescale: "once",
        itemSizesReference: "screen",
        autoRescaleContent: "nodes",
        stagePadding: 4,

        renderLabels: false,

        enableCameraZooming: false,
        enableCameraPanning: false,
        enableCameraRotation: false,
        enableCameraMouseRotation: false,

        dragPositionToAttributes: (position, node) =>
          this.dragPositionToAttributes(position, node),
      },
    });
  }

  private dragPositionToAttributes(
    position: { x: number; y: number },
    node: string,
  ): Record<string, unknown> {
    const renderer = this.renderer!;

    const viewportPosition = renderer.graphToViewport(position);
    const { width, height } = renderer.getDimensions();

    const padding = 20;

    const clampedViewportPosition = {
      x: Math.max(padding, Math.min(width - padding, viewportPosition.x)),
      y: Math.max(padding, Math.min(height - padding, viewportPosition.y)),
    };

    const graphPosition = renderer.viewportToGraph(clampedViewportPosition);

    return {
      x: graphPosition.x,
      y: graphPosition.y,
    };
  }

  ngOnDestroy() {
    this.renderer?.kill();
  }
}
