import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvTreppeOrder, type IlvTreppeOrderParams } from "./generate";
import { solveIlvTreppeOrder, type IlvTreppeOrderSolution } from "./solve";
import { checkIlvTreppeOrder, type IlvTreppeOrderAnswer } from "./check";
import { IlvTreppeOrderComponent, IlvTreppeOrderSolutionView } from "./Component";
import { buildIlvTreppeOrderPrompt } from "./prompt";
import { validateIlvTreppeOrderInput } from "./validate";

export const ilvTreppeOrderTask: TaskDefinition<
  IlvTreppeOrderParams,
  IlvTreppeOrderSolution,
  IlvTreppeOrderAnswer
> = {
  kind: "ilv-treppe-order",
  tutorium: "Tutorium 5 · Aufgabe 5.2",
  title: "ILV – Reihenfolge bei der Treppenumlage",
  description:
    "Bestimme aus einer Leistungsmatrix die optimale Treppen-Reihenfolge (Stelle mit den meisten Abgaben an andere Vorstellen zuerst).",
  schemaVersion: 1,
  generate: generateIlvTreppeOrder,
  solve: solveIlvTreppeOrder,
  check: checkIlvTreppeOrder,
  Component: IlvTreppeOrderComponent,
  renderSolution: (params, solution) => (
    <IlvTreppeOrderSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildIlvTreppeOrderPrompt,
  validateRawInput: validateIlvTreppeOrderInput,
};
