import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateHgbHerstellkosten,
  type HgbHerstellkostenParams,
} from "./generate";
import {
  solveHgbHerstellkosten,
  type HgbHerstellkostenSolution,
} from "./solve";
import {
  checkHgbHerstellkosten,
  type HgbHerstellkostenAnswer,
} from "./check";
import {
  HgbHerstellkostenComponent,
  HgbHerstellkostenSolutionView,
} from "./Component";
import { buildHgbHerstellkostenPrompt } from "./prompt";
import { validateHgbHerstellkostenInput } from "./validate";

export const handelsrechtlicheHerstellkostenTask: TaskDefinition<
  HgbHerstellkostenParams,
  HgbHerstellkostenSolution,
  HgbHerstellkostenAnswer
> = {
  kind: "handelsrechtliche-herstellkosten",
  tutorium: "Tutorium 5 · Aufgabe 5.4",
  title: "Handelsrechtliche Herstellkosten (§ 255 HGB)",
  description:
    "Bestimme Wertuntergrenze und Wertobergrenze der Herstellkosten aus einem Mix von Pflicht-, Wahlrechts- und Verbotspositionen.",
  schemaVersion: 1,
  generate: generateHgbHerstellkosten,
  solve: solveHgbHerstellkosten,
  check: checkHgbHerstellkosten,
  Component: HgbHerstellkostenComponent,
  renderSolution: (params, solution) => (
    <HgbHerstellkostenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildHgbHerstellkostenPrompt,
  validateRawInput: validateHgbHerstellkostenInput,
};
