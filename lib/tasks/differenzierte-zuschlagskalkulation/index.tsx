import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateDiffZuschlag,
  type DiffZuschlagsParams,
} from "./generate";
import {
  solveDiffZuschlag,
  type DiffZuschlagsSolution,
} from "./solve";
import {
  checkDiffZuschlag,
  type DiffZuschlagsAnswer,
} from "./check";
import {
  DiffZuschlagComponent,
  DiffZuschlagSolutionView,
} from "./Component";
import { buildDiffZuschlagPrompt } from "./prompt";
import { validateDiffZuschlagInput } from "./validate";

export const differenzierteZuschlagskalkulationTask: TaskDefinition<
  DiffZuschlagsParams,
  DiffZuschlagsSolution,
  DiffZuschlagsAnswer
> = {
  kind: "differenzierte-zuschlagskalkulation",
  tutorium: "Tutorium 5 · Aufgabe 5.3",
  title: "Differenzierte Zuschlagskalkulation",
  description:
    "Selbstkosten je Produkt aus Einzelkosten und differenzierten Gemeinkosten-Zuschlägen.",
  schemaVersion: 1,
  generate: generateDiffZuschlag,
  solve: solveDiffZuschlag,
  check: checkDiffZuschlag,
  Component: DiffZuschlagComponent,
  renderSolution: (_params, solution) => (
    <DiffZuschlagSolutionView solution={solution} />
  ),
  buildPrompt: buildDiffZuschlagPrompt,
  // validateRawInput muss eine reine Funktion sein – wir kapseln den
  // Closure pro Aufgabe in generateRuntime durch eine generische Variante:
  validateRawInput: (raw) => {
    // Wir haben hier keine params – aber alle Felder sind Zahlen, deshalb
    // genügt eine generische Prüfung über alle vorhandenen Keys.
    const errs: Record<string, string> = {};
    for (const k of Object.keys(raw)) {
      const cleaned = raw[k]
        .trim()
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      if (cleaned === "" || !Number.isFinite(Number(cleaned))) {
        errs[k] = "Bitte eine Zahl eingeben (z. B. 1.234,56).";
      }
    }
    return errs;
  },
};

export { validateDiffZuschlagInput };
