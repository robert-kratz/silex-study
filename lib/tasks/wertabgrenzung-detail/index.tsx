import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateWertabgrenzungDetail,
  type WertabgrenzungDetailParams,
} from "./generate";
import {
  solveWertabgrenzungDetail,
  type WertabgrenzungDetailSolution,
} from "./solve";
import {
  checkWertabgrenzungDetail,
  type WertabgrenzungDetailAnswer,
} from "./check";
import {
  WertabgrenzungDetailComponent,
  WertabgrenzungDetailSolutionView,
} from "./Component";
import { buildWertabgrenzungDetailPrompt } from "./prompt";
import { validateWertabgrenzungDetailInput } from "./validate";

export const wertabgrenzungDetailTask: TaskDefinition<
  WertabgrenzungDetailParams,
  WertabgrenzungDetailSolution,
  WertabgrenzungDetailAnswer
> = {
  kind: "wertabgrenzung-detail",
  tutorium: "Tutorium 2 · Aufgabe 2.1",
  title: "Wertabgrenzung – Beträge je Kategorie",
  description:
    "Erweiterte Wertabgrenzung mit Anders- und Zusatzkosten (kalk. AfA, kalk. Zinsen, …).",
  schemaVersion: 1,
  generate: generateWertabgrenzungDetail,
  solve: solveWertabgrenzungDetail,
  check: checkWertabgrenzungDetail,
  Component: WertabgrenzungDetailComponent,
  renderSolution: (params, solution) => (
    <WertabgrenzungDetailSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildWertabgrenzungDetailPrompt,
  validateRawInput: validateWertabgrenzungDetailInput,
};
