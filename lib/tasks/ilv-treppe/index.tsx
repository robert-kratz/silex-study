import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvTreppe, type IlvTreppeParams } from "./generate";
import { solveIlvTreppe, type IlvTreppeSolution } from "./solve";
import { checkIlvTreppe, type IlvTreppeAnswer } from "./check";
import { IlvTreppeComponent, IlvTreppeSolutionView } from "./Component";
import { buildIlvTreppePrompt } from "./prompt";
import { validateIlvTreppeInput } from "./validate";

export const ilvTreppeTask: TaskDefinition<
  IlvTreppeParams,
  IlvTreppeSolution,
  IlvTreppeAnswer
> = {
  kind: "ilv-treppe",
  tutorium: "Tutorium 4 · Aufgabe 4.3",
  title: "ILV – Treppenumlage",
  description: "Stufenweise Verrechnung in einer Richtung (A → B → C).",
  schemaVersion: 1,
  generate: generateIlvTreppe,
  solve: solveIlvTreppe,
  check: checkIlvTreppe,
  Component: IlvTreppeComponent,
  renderSolution: (_params, solution) => (
    <IlvTreppeSolutionView solution={solution} />
  ),
  buildPrompt: buildIlvTreppePrompt,
  validateRawInput: validateIlvTreppeInput,
};
