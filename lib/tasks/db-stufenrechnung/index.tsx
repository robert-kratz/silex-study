import type { TaskDefinition } from "@/lib/tasks/types";
import { generateDbStufen, type DbStufenParams } from "./generate";
import { solveDbStufen, type DbStufenSolution } from "./solve";
import { checkDbStufen, type DbStufenAnswer } from "./check";
import { DbStufenComponent, DbStufenSolutionView } from "./Component";
import { buildDbStufenPrompt } from "./prompt";
import { validateDbStufenInput } from "./validate";

export const dbStufenrechnungTask: TaskDefinition<
  DbStufenParams,
  DbStufenSolution,
  DbStufenAnswer
> = {
  kind: "db-stufenrechnung",
  tutorium: "Tutorium 9 · Aufgabe 9.1",
  title: "Mehrstufige Deckungsbeitragsrechnung",
  description:
    "Stufenweiser Abzug fixer Kostenblöcke (Produkt → Produktgruppe → Sparte → Unternehmen) und Sortimentsentscheidung.",
  schemaVersion: 1,
  generate: generateDbStufen,
  solve: solveDbStufen,
  check: checkDbStufen,
  Component: DbStufenComponent,
  renderSolution: (params, solution) => (
    <DbStufenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildDbStufenPrompt,
  validateRawInput: validateDbStufenInput,
};
