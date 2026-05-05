import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateBreakEven,
  type BreakEvenParams,
  type BreakEvenSolution,
} from "./generate";
import { solveBreakEven } from "./solve";
import { checkBreakEven, type BreakEvenAnswer } from "./check";
import { BreakEvenComponent, BreakEvenSolutionView } from "./Component";
import { buildBreakEvenPrompt } from "./prompt";
import { validateBreakEvenInput } from "./validate";

export const breakEvenTask: TaskDefinition<
  BreakEvenParams,
  BreakEvenSolution,
  BreakEvenAnswer
> = {
  kind: "break-even",
  tutorium: "Tutorium 10 · Aufgabe 10.1",
  title: "Einprodukt-Break-Even mit Zielgewinn",
  description:
    "Berechne Stückdeckungsbeitrag, Break-Even-Menge, Break-Even-Umsatz und Zielgewinn-Menge für ein Einproduktunternehmen.",
  schemaVersion: 1,
  generate: generateBreakEven,
  solve: solveBreakEven,
  check: checkBreakEven,
  Component: BreakEvenComponent,
  renderSolution: (params, solution) => (
    <BreakEvenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildBreakEvenPrompt,
  validateRawInput: validateBreakEvenInput,
};
