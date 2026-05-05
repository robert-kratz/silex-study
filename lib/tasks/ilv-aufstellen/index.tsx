import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvAufstellen, type IlvAufstellenParams } from "./generate";
import { solveIlvAufstellen, type IlvAufstellenSolution } from "./solve";
import { checkIlvAufstellen, type IlvAufstellenAnswer } from "./check";
import { IlvAufstellenComponent, IlvAufstellenSolutionView } from "./Component";
import { buildIlvAufstellenPrompt } from "./prompt";
import { validateIlvAufstellenInput } from "./validate";

export const ilvAufstellenTask: TaskDefinition<
  IlvAufstellenParams,
  IlvAufstellenSolution,
  IlvAufstellenAnswer
> = {
  kind: "ilv-aufstellen",
  tutorium: "Tutorium 6 · Aufgabe 6.2",
  title: "ILV – Großes Gleichungssystem aufstellen",
  description:
    "Pro Vorkostenstelle die Bausteine der rechten Seite identifizieren und das LGS lösen.",
  schemaVersion: 1,
  generate: generateIlvAufstellen,
  solve: solveIlvAufstellen,
  check: checkIlvAufstellen,
  Component: IlvAufstellenComponent,
  renderSolution: (params, solution) => (
    <IlvAufstellenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildIlvAufstellenPrompt,
  validateRawInput: validateIlvAufstellenInput,
};
