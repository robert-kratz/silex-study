import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateWertabgrenzung,
  type WertabgrenzungParams,
} from "./generate";
import { solveWertabgrenzung, type WertabgrenzungSolution } from "./solve";
import { checkWertabgrenzung, type WertabgrenzungAnswer } from "./check";
import {
  WertabgrenzungComponent,
  WertabgrenzungSolutionView,
} from "./Component";
import { buildWertabgrenzungPrompt } from "./prompt";
import { validateWertabgrenzungInput } from "./validate";

export const wertabgrenzungTask: TaskDefinition<
  WertabgrenzungParams,
  WertabgrenzungSolution,
  WertabgrenzungAnswer
> = {
  kind: "wertabgrenzung",
  tutorium: "Tutorium 1 · Aufgabe 1.2",
  title: "Wertabgrenzung – Kategorisierung",
  description:
    "Ordne 6 Geschäftsvorfälle den Kategorien Einzahlung, Auszahlung, Ertrag, Aufwand, Erlös, Kosten zu.",
  schemaVersion: 1,
  generate: generateWertabgrenzung,
  solve: solveWertabgrenzung,
  check: checkWertabgrenzung,
  Component: WertabgrenzungComponent,
  renderSolution: (params, solution) => (
    <WertabgrenzungSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildWertabgrenzungPrompt,
  validateRawInput: validateWertabgrenzungInput,
};
