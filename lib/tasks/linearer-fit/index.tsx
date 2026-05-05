import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateLinearerFit,
  type LinearerFitParams,
  type LinearerFitSolution,
} from "./generate";
import { solveLinearerFit } from "./solve";
import { checkLinearerFit, type LinearerFitAnswer } from "./check";
import { LinearerFitComponent, LinearerFitSolutionView } from "./Component";
import { buildLinearerFitPrompt } from "./prompt";
import { validateLinearerFitInput } from "./validate";

export const linearerFitTask: TaskDefinition<
  LinearerFitParams,
  LinearerFitSolution,
  LinearerFitAnswer
> = {
  kind: "linearer-fit",
  tutorium: "Tutorium 2 · Aufgabe 2.2",
  title: "Lineare Kostenfunktion aus Punkt-Daten",
  description:
    "Aus Durchschnitts- und Grenzkosten an einem Auslastungspunkt die lineare Kostenfunktion rekonstruieren.",
  schemaVersion: 1,
  generate: generateLinearerFit,
  solve: solveLinearerFit,
  check: checkLinearerFit,
  Component: LinearerFitComponent,
  renderSolution: (params, solution) => (
    <LinearerFitSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildLinearerFitPrompt,
  validateRawInput: validateLinearerFitInput,
};
