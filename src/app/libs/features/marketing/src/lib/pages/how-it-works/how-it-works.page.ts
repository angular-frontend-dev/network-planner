import { Component } from "@angular/core";
import { StepCardComponent } from "./components/step-card/step-card.component";
import { AlgorithmCardComponent } from "./components/algorithm-card/algorithm-card.component";
import { WhyCardComponent } from "./components/why-card/why-card.component";

interface StepCard {
  stepNumber: number;
  title: string;
  description: string;
  imgUrl: string;
  content: string;
}

interface AlgorithmCard {
  stepNumber: number;
  title: string;
  description: string;
  imgUrl: string;
}

interface WhyCard {
  title: string;
  description: string;
  points: string[];
}

@Component({
  imports: [StepCardComponent, AlgorithmCardComponent, WhyCardComponent],
  selector: "app-how-it-works",
  styleUrl: "./how-it-works.page.scss",
  templateUrl: "./how-it-works.page.html",
})
export class HowItWorksPage {
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
      imgUrl: "images/network-planning/graph-model.png",
      content:
        "Every transmitter becomes a vertex, and every interference relationship becomes an edge.",
    },
    {
      stepNumber: 4,
      title: "Graph coloring",
      description: "Frequencies are represented as colors.",
      imgUrl: "images/network-planning/graph-colored.png",
      content:
        "Adjacent vertices must receive different colors, ensuring that interfering transmitters do not share the same frequency.",
    },
  ];

  readonly algorithmCards: AlgorithmCard[] = [
    {
      stepNumber: 1,
      title: "Pick a vertex",
      imgUrl: "images/network-planning/graph-half-colored.png",
      description:
        "Select the uncolored vertex with the highest saturation degree.",
    },
    {
      stepNumber: 2,
      title: "Assign a frequency",
      imgUrl: "images/network-planning/graph-half-colored-plus-one.png",
      description:
        "Choose the smallest available frequency not already used by one of its neighbors.",
    },
    {
      stepNumber: 3,
      title: "Update saturation",
      imgUrl: "images/network-planning/graph-half-colored-plus-one.png",
      description:
        "Update the saturation degree of the affected neighboring vertices.",
    },
    {
      stepNumber: 4,
      title: "Repeat",
      imgUrl: "images/network-planning/graph-fully-colored.png",
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
}
