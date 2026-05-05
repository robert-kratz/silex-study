import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvVergleich, type IlvVergleichParams } from "./generate";
import { solveIlvVergleich, type IlvVergleichSolution } from "./solve";
import { checkIlvVergleich, type IlvVergleichAnswer } from "./check";
import { IlvVergleichComponent, IlvVergleichSolutionView } from "./Component";
import { buildIlvVergleichPrompt } from "./prompt";
import { validateIlvVergleichInput } from "./validate";

export const ilvVergleichTask: TaskDefinition<
  IlvVergleichParams,
  IlvVergleichSolution,
  IlvVergleichAnswer
> = {
  kind: "ilv-vergleich",
  tutorium: "Tutorium 5 · Aufgabe 5.1",
  title: "ILV – Verfahrensvergleich",
  description:
    "Block-, Treppen- und Gleichungsverfahren auf identischer Datenbasis durchrechnen und das exakte Verfahren benennen.",
  schemaVersion: 1,
  generate: generateIlvVergleich,
  solve: solveIlvVergleich,
  check: checkIlvVergleich,
  Component: IlvVergleichComponent,
  renderSolution: (params, solution) => (
    <IlvVergleichSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildIlvVergleichPrompt,
  validateRawInput: validateIlvVergleichInput,
};
