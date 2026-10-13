import { Component } from "@angular/core";
import { StepCardComponent } from "./components/step-card/step-card.component";
import { AlgorithmCardComponent } from "./components/algorithm-card/algorithm-card.component";
import { WhyCardComponent } from "./components/why-card/why-card.component";
import {
  EdgeAttributes,
  NodeAttributes,
  SignalGraph,
} from "../../components/graph-view/graph-view.component.types";
import Graph from "graphology";

interface StepCard {
  stepNumber: number;
  title: string;
  description: string;
  imgUrl?: string;
  graph?: SignalGraph;
  content: string;
}

interface AlgorithmCard {
  stepNumber: number;
  title: string;
  description: string;
  graph: SignalGraph;
}

interface WhyCard {
  title: string;
  description: string;
  points: string[];
}

const NEUTRAL = "#3F4250";

const PURPLE = "#6C63FF";
const CYAN = "#31C6D4";
const ORANGE = "#F3B23F";

@Component({
  imports: [StepCardComponent, AlgorithmCardComponent, WhyCardComponent],
  selector: "app-how-it-works",
  styleUrl: "./how-it-works.page.scss",
  templateUrl: "./how-it-works.page.html",
})
export class HowItWorksPage {
  readonly graphModel = this.createStepGraph(false);
  readonly graphColored = this.createStepGraph(true);
  private graphHalfColored = this.createHalfColoredGraph();
  private graphHalfOneNodeColored = this.graphHalfColored
    .copy()
    .setNodeAttribute("d", "color", ORANGE);

  readonly stepCards: StepCard[] = [
    {
      stepNumber: 1,
      title: "Real world",
      description: "Transmitters are placed across a geographic area.",
      imgUrl: "images/network-planning/tower-scheme.webp",
      content:
        "Each transmitter has a physical position and a configurable interference radius.",
    },
    {
      stepNumber: 2,
      title: "Interference model",
      description: "Nearby transmitters may interfere with each other.",
      imgUrl: "images/network-planning/interference-model.webp",
      content:
        "Two transmitters are considered adjacent when the distance between them is smaller than the configured interference radius.",
    },
    {
      stepNumber: 3,
      title: "Graph model",
      description: "The physical network becomes a graph.",
      graph: this.graphModel,
      content:
        "Every transmitter becomes a vertex, and every interference relationship becomes an edge.",
    },
    {
      stepNumber: 4,
      title: "Graph coloring",
      description: "Frequencies are represented as colors.",
      graph: this.graphColored,
      content:
        "Adjacent vertices must receive different colors, ensuring that interfering transmitters do not share the same frequency.",
    },
  ];

  readonly algorithmCards: AlgorithmCard[] = [
    {
      stepNumber: 1,
      title: "Pick a vertex",
      graph: this.graphHalfColored,
      description:
        "Select the uncolored vertex with the highest saturation degree.",
    },
    {
      stepNumber: 2,
      title: "Assign a frequency",
      graph: this.graphHalfOneNodeColored,
      description:
        "Choose the smallest available frequency not already used by one of its neighbors.",
    },
    {
      stepNumber: 3,
      title: "Update saturation",
      graph: this.graphHalfOneNodeColored,
      description:
        "Update the saturation degree of the affected neighboring vertices.",
    },
    {
      stepNumber: 4,
      title: "Repeat",
      graph: this.graphColored,
      description:
        "Continue until every transmitter has been assigned a valid frequency.",
    },
  ];

  readonly whyCard: WhyCard = {
    title: "Why DSATUR?",
    description: "A practical fit for the planner.",
    points: [
      "Produces good colorings with reasonable runtime.",
      "Works well with sparse graphs such as wireless networks.",
      "Simple enough to explain and visualize interactively.",
    ],
  };

  private createStepGraph(colored = false): SignalGraph {
    const graph = new Graph<NodeAttributes, EdgeAttributes>();

    const edgeStyle: EdgeAttributes = {
      color: "#CBD1DC",
      size: 1.5,
    };

    graph.addNode("a", {
      x: -5.2,
      y: 2.4,
      size: 9,
      color: colored ? PURPLE : NEUTRAL,
    });

    graph.addNode("b", {
      x: -2.8,
      y: 1.1,
      size: 9,
      color: colored ? CYAN : NEUTRAL,
    });

    graph.addNode("c", {
      x: -0.6,
      y: 2.9,
      size: 9,
      color: colored ? PURPLE : NEUTRAL,
    });

    graph.addNode("d", {
      x: 1.9,
      y: 0.8,
      size: 9,
      color: colored ? ORANGE : NEUTRAL,
    });

    graph.addNode("e", {
      x: 4.6,
      y: 1.9,
      size: 9,
      color: colored ? CYAN : NEUTRAL,
    });

    graph.addNode("f", {
      x: -3.9,
      y: -1.8,
      size: 9,
      color: colored ? ORANGE : NEUTRAL,
    });

    graph.addNode("g", {
      x: -1.2,
      y: -0.7,
      size: 9,
      color: colored ? PURPLE : NEUTRAL,
    });

    graph.addNode("h", {
      x: 1.1,
      y: -2.4,
      size: 9,
      color: colored ? CYAN : NEUTRAL,
    });

    graph.addNode("i", {
      x: 4.1,
      y: -1.2,
      size: 9,
      color: colored ? PURPLE : NEUTRAL,
    });

    graph.addEdge("a", "b", edgeStyle);
    graph.addEdge("b", "c", edgeStyle);
    graph.addEdge("c", "d", edgeStyle);
    graph.addEdge("d", "e", edgeStyle);

    graph.addEdge("a", "f", edgeStyle);
    graph.addEdge("b", "g", edgeStyle);
    graph.addEdge("d", "h", edgeStyle);
    graph.addEdge("e", "i", edgeStyle);

    graph.addEdge("f", "g", edgeStyle);
    graph.addEdge("g", "h", edgeStyle);
    graph.addEdge("h", "i", edgeStyle);

    graph.addEdge("b", "f", edgeStyle);
    graph.addEdge("c", "g", edgeStyle);
    graph.addEdge("d", "g", edgeStyle);
    graph.addEdge("d", "i", edgeStyle);

    return graph;
  }

  private createHalfColoredGraph(): SignalGraph {
    const graph = this.createStepGraph(true);

    graph.setNodeAttribute("d", "color", NEUTRAL);
    graph.setNodeAttribute("e", "color", NEUTRAL);
    graph.setNodeAttribute("h", "color", NEUTRAL);
    graph.setNodeAttribute("i", "color", NEUTRAL);

    return graph;
  }
}
