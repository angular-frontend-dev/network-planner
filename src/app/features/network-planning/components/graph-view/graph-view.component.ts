import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import Graph from "graphology";
import Sigma from "sigma";
import {
  EdgeAttributes,
  NodeAttributes,
  SignalGraph,
  SignalGraphRenderer,
} from "./graph-view.component.types";

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrl: "./graph-view.component.scss",
})
export class GraphViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild("container", { static: true })
  container!: ElementRef<HTMLElement>;

  graph = input.required<SignalGraph>();

  private renderer?: SignalGraphRenderer;

  ngAfterViewInit() {
    this.renderer = new Sigma(this.graph(), this.container.nativeElement, {
      styles: {
        nodes: [
          {
            color: { attribute: "color" },
            size: { attribute: "size" },
          },
        ],

        edges: [
          {
            color: { attribute: "color" },
            size: { attribute: "size" },
          },
        ],
      },

      settings: {
        itemSizesReference: "screen",
        autoRescale: true,
        autoRescaleContent: "nodes",
        stagePadding: 4,

        renderLabels: false,

        enableCameraZooming: false,
        enableCameraPanning: false,
        enableCameraRotation: false,
        enableCameraMouseRotation: false,
      },
    });
  }

  ngOnDestroy() {
    this.renderer?.kill();
  }
}
