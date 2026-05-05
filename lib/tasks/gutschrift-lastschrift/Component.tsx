"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { GutschriftLastschriftParams } from "./generate";
import type { GutschriftLastschriftSolution } from "./solve";
import {
  checkGutschriftLastschrift,
  type GutschriftLastschriftAnswer,
} from "./check";
import { buildGutschriftLastschriftPrompt } from "./prompt";
import { validateGutschriftLastschriftInput } from "./validate";

type Field = keyof GutschriftLastschriftAnswer;
const BLANK: Record<Field, string> = {
  G1: "", G2: "", L1: "", L2: "", S1: "", S2: "",
};

export function GutschriftLastschriftComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<GutschriftLastschriftParams, GutschriftLastschriftSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateGutschriftLastschriftInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: GutschriftLastschriftAnswer = {
      G1: parseLocaleNumber(raw.G1),
      G2: parseLocaleNumber(raw.G2),
      L1: parseLocaleNumber(raw.L1),
      L2: parseLocaleNumber(raw.L2),
      S1: parseLocaleNumber(raw.S1),
      S2: parseLocaleNumber(raw.S2),
    };
    setCheckResult(checkGutschriftLastschrift(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[k];
        return n;
      });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="gutschrift-lastschrift"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Gutschrift- und Lastschriftverfahren"
      description="Verrechnung zu festen Plan-Verrechnungspreisen mit Saldobildung."
      buildPromptText={() => buildGutschriftLastschriftPrompt(params)}
      problem={
        <ul className="space-y-1 text-sm">
          <li>vp(V1) = <strong>{eur(params.vp[0])}</strong>, vp(V2) = <strong>{eur(params.vp[1])}</strong>.</li>
          <li>PK(V1) = <strong>{eur(params.PK[0])}</strong>, PK(V2) = <strong>{eur(params.PK[1])}</strong>.</li>
          <li>Gesamtleistung x₁ = <strong>{fmt(params.x[0])}</strong>, x₂ = <strong>{fmt(params.x[1])}</strong>.</li>
          <li>V1 → V2: {fmt(params.x12)}; V2 → V1: {fmt(params.x21)}.</li>
        </ul>
      }
      learnHelp={
        <>
          <Formula expr="G_j = vp_j \cdot x_j" />
          <Formula expr="L_j = PK_j + \sum_{i\ne j} x_{ij}\,vp_i" />
          <Formula expr="S_j = L_j - G_j" />
        </>
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow id="G1" label="Gutschrift V1 (€)" value={raw.G1}
            onChange={setField("G1")} inputError={inputErrors.G1}
            checkStatus={checkResult?.fields.G1} format={eur} />
          <FieldRow id="G2" label="Gutschrift V2 (€)" value={raw.G2}
            onChange={setField("G2")} inputError={inputErrors.G2}
            checkStatus={checkResult?.fields.G2} format={eur} />
          <FieldRow id="L1" label="Lastschrift V1 (€)" value={raw.L1}
            onChange={setField("L1")} inputError={inputErrors.L1}
            checkStatus={checkResult?.fields.L1} format={eur} />
          <FieldRow id="L2" label="Lastschrift V2 (€)" value={raw.L2}
            onChange={setField("L2")} inputError={inputErrors.L2}
            checkStatus={checkResult?.fields.L2} format={eur} />
          <FieldRow id="S1" label="Saldo V1 (€)" value={raw.S1}
            onChange={setField("S1")} inputError={inputErrors.S1}
            checkStatus={checkResult?.fields.S1} format={eur} />
          <FieldRow id="S2" label="Saldo V2 (€)" value={raw.S2}
            onChange={setField("S2")} inputError={inputErrors.S2}
            checkStatus={checkResult?.fields.S2} format={eur} />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<GutschriftLastschriftSolutionView solution={solution} />}
    />
  );
}

export function GutschriftLastschriftSolutionView({
  solution,
}: {
  solution: GutschriftLastschriftSolution;
}) {
  return (
    <div className="space-y-1 text-sm">
      <p>G(V1) = <strong>{eur(solution.G[0])}</strong>, G(V2) = <strong>{eur(solution.G[1])}</strong></p>
      <p>L(V1) = <strong>{eur(solution.L[0])}</strong>, L(V2) = <strong>{eur(solution.L[1])}</strong></p>
      <p>
        S(V1) = <strong>{eur(solution.S[0])}</strong>{" "}
        ({solution.S[0] >= 0 ? "Unterdeckung" : "Überdeckung"}); S(V2) = <strong>{eur(solution.S[1])}</strong>{" "}
        ({solution.S[1] >= 0 ? "Unterdeckung" : "Überdeckung"}).
      </p>
    </div>
  );
}
