import type { TaskDefinition } from "@/lib/tasks/types";
import { generateBabPrimaer, type BabPrimaerParams } from "./generate";
import { solveBabPrimaer, type BabPrimaerSolution } from "./solve";
import { checkBabPrimaer, type BabPrimaerAnswer } from "./check";
import { BabPrimaerComponent, BabPrimaerSolutionView } from "./Component";
import { buildBabPrimaerPrompt } from "./prompt";
import { validateBabPrimaerInput } from "./validate";

export const babPrimaerTask: TaskDefinition<
  BabPrimaerParams,
  BabPrimaerSolution,
  BabPrimaerAnswer
> = {
  kind: "bab-primaer",
  tutorium: "Tutorium 4 · Aufgabe 4.1",
  title: "BAB – Primärkostenverteilung",
  description: "Primäre Gemeinkosten über Schlüssel auf Kostenstellen umlegen.",
  schemaVersion: 1,
  generate: generateBabPrimaer,
  solve: solveBabPrimaer,
  check: checkBabPrimaer,
  Component: BabPrimaerComponent,
  renderSolution: (params, solution) => (
    <BabPrimaerSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildBabPrimaerPrompt,
  validateRawInput: validateBabPrimaerInput,
};
