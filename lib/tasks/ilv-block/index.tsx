import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvBlock, type IlvBlockParams } from "./generate";
import { solveIlvBlock, type IlvBlockSolution } from "./solve";
import { checkIlvBlock, type IlvBlockAnswer } from "./check";
import { IlvBlockComponent, IlvBlockSolutionView } from "./Component";
import { buildIlvBlockPrompt } from "./prompt";
import { validateIlvBlockInput } from "./validate";

export const ilvBlockTask: TaskDefinition<
  IlvBlockParams,
  IlvBlockSolution,
  IlvBlockAnswer
> = {
  kind: "ilv-block",
  tutorium: "Tutorium 4 · Aufgabe 4.2",
  title: "ILV – Blockumlage",
  description: "Vorkostenstellen direkt auf Endstellen umlegen.",
  schemaVersion: 1,
  generate: generateIlvBlock,
  solve: solveIlvBlock,
  check: checkIlvBlock,
  Component: IlvBlockComponent,
  renderSolution: (params, solution) => (
    <IlvBlockSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildIlvBlockPrompt,
  validateRawInput: validateIlvBlockInput,
};
