import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateGutschriftLastschrift,
  type GutschriftLastschriftParams,
} from "./generate";
import {
  solveGutschriftLastschrift,
  type GutschriftLastschriftSolution,
} from "./solve";
import {
  checkGutschriftLastschrift,
  type GutschriftLastschriftAnswer,
} from "./check";
import {
  GutschriftLastschriftComponent,
  GutschriftLastschriftSolutionView,
} from "./Component";
import { buildGutschriftLastschriftPrompt } from "./prompt";
import { validateGutschriftLastschriftInput } from "./validate";

export const gutschriftLastschriftTask: TaskDefinition<
  GutschriftLastschriftParams,
  GutschriftLastschriftSolution,
  GutschriftLastschriftAnswer
> = {
  kind: "gutschrift-lastschrift",
  tutorium: "Tutorium 4 · Aufgabe 4.5",
  title: "Gutschrift-/Lastschriftverfahren",
  description: "Innerbetriebliche Leistungen mit Plan-VP verrechnen.",
  schemaVersion: 1,
  generate: generateGutschriftLastschrift,
  solve: solveGutschriftLastschrift,
  check: checkGutschriftLastschrift,
  Component: GutschriftLastschriftComponent,
  renderSolution: (_params, solution) => (
    <GutschriftLastschriftSolutionView solution={solution} />
  ),
  buildPrompt: buildGutschriftLastschriftPrompt,
  validateRawInput: validateGutschriftLastschriftInput,
};
