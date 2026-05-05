import type { TaskDefinition } from "@/lib/tasks/types";
import { generateProzesskosten, type ProzesskostenParams } from "./generate";
import { solveProzesskosten, type ProzesskostenSolution } from "./solve";
import { checkProzesskosten, type ProzesskostenAnswer } from "./check";
import { ProzesskostenComponent, ProzesskostenSolutionView } from "./Component";
import { buildProzesskostenPrompt } from "./prompt";
import { validateProzesskostenInput } from "./validate";

export const prozesskostenTask: TaskDefinition<
  ProzesskostenParams,
  ProzesskostenSolution,
  ProzesskostenAnswer
> = {
  kind: "prozesskosten",
  tutorium: "Tutorium 7 · Aufgabe 7.4",
  title: "Prozesskostenrechnung",
  description:
    "Prozesskostensätze ermitteln und Aufträge nach Inanspruchnahme verrechnen.",
  schemaVersion: 1,
  generate: generateProzesskosten,
  solve: solveProzesskosten,
  check: checkProzesskosten,
  Component: ProzesskostenComponent,
  renderSolution: (params, solution) => (
    <ProzesskostenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildProzesskostenPrompt,
  validateRawInput: validateProzesskostenInput,
};
