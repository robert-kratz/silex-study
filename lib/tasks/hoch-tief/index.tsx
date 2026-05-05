import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateHochTief,
  type HochTiefParams,
  type HochTiefSolution,
} from "./generate";
import { solveHochTief } from "./solve";
import { checkHochTief, type HochTiefAnswer } from "./check";
import { HochTiefComponent, HochTiefSolutionView } from "./Component";
import { buildHochTiefPrompt } from "./prompt";
import { validateHochTiefInput } from "./validate";

export const hochTiefTask: TaskDefinition<
  HochTiefParams,
  HochTiefSolution,
  HochTiefAnswer
> = {
  kind: "hoch-tief",
  tutorium: "Tutorium 2 · Aufgabe 2.3",
  title: "Hoch-Tief-Methode",
  description:
    "Aus Periodendaten K_fix und k_var ableiten und für eine neue Auslastung prognostizieren.",
  schemaVersion: 1,
  generate: generateHochTief,
  solve: solveHochTief,
  check: checkHochTief,
  Component: HochTiefComponent,
  renderSolution: (params, solution) => (
    <HochTiefSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildHochTiefPrompt,
  validateRawInput: validateHochTiefInput,
};
