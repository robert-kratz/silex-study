import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateGewinnmaximierung,
  type GewinnmaximierungParams,
  type GewinnmaximierungSolution,
} from "./generate";
import { solveGewinnmaximierung } from "./solve";
import {
  checkGewinnmaximierung,
  type GewinnmaximierungAnswer,
} from "./check";
import {
  GewinnmaximierungComponent,
  GewinnmaximierungSolutionView,
} from "./Component";
import { buildGewinnmaximierungPrompt } from "./prompt";
import { validateGewinnmaximierungInput } from "./validate";

export const gewinnmaximierungTask: TaskDefinition<
  GewinnmaximierungParams,
  GewinnmaximierungSolution,
  GewinnmaximierungAnswer
> = {
  kind: "gewinnmaximierung",
  tutorium: "Tutorium 1 · Aufgabe 1.4",
  title: "Gewinnmaximierung mit Ableitungen",
  description:
    "Optimaler Inputeinsatz und maximaler Gewinn bei Wurzel-Produktionsfunktion.",
  schemaVersion: 1,
  generate: generateGewinnmaximierung,
  solve: solveGewinnmaximierung,
  check: checkGewinnmaximierung,
  Component: GewinnmaximierungComponent,
  renderSolution: (params, solution) => (
    <GewinnmaximierungSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildGewinnmaximierungPrompt,
  validateRawInput: validateGewinnmaximierungInput,
};
