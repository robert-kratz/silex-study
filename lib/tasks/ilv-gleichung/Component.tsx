"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { IlvGleichungParams } from "./generate";
import type { IlvGleichungSolution } from "./solve";
import { checkIlvGleichung, type IlvGleichungAnswer } from "./check";
import { buildIlvGleichungPrompt } from "./prompt";
import { validateIlvGleichungInput } from "./validate";

type Field = keyof IlvGleichungAnswer;
const BLANK: Record<Field, string> = { k1: "", k2: "", E1: "", E2: "" };

export function IlvGleichungComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvGleichungParams, IlvGleichungSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateIlvGleichungInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: IlvGleichungAnswer = {
      k1: parseLocaleNumber(raw.k1),
      k2: parseLocaleNumber(raw.k2),
      E1: parseLocaleNumber(raw.E1),
      E2: parseLocaleNumber(raw.E2),
    };
    setCheckResult(checkIlvGleichung(solution, ans));
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
      taskKind="ilv-gleichung"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Gleichungsverfahren"
      description="Wechselseitige Vorkostenstellen über LGS exakt verrechnen."
      buildPromptText={() => buildIlvGleichungPrompt(params)}
      problem={
        <ul className="space-y-1 text-sm">
          <li>Primärkosten: PK(V1) = <strong>{eur(params.PK[0])}</strong>, PK(V2) = <strong>{eur(params.PK[1])}</strong>.</li>
          <li>Gesamtleistung: x₁ = <strong>{fmt(params.x[0])}</strong>, x₂ = <strong>{fmt(params.x[1])}</strong>.</li>
          <li>V1 → V2: {fmt(params.x12)}; V2 → V1: {fmt(params.x21)}.</li>
          <li>V1 → E1: {fmt(params.v1End[0])}, V1 → E2: {fmt(params.v1End[1])}.</li>
          <li>V2 → E1: {fmt(params.v2End[0])}, V2 → E2: {fmt(params.v2End[1])}.</li>
        </ul>
      }
      learnHelp={
        <>
          <Formula expr="x_1\,k_1 = PK_1 + x_{21}\,k_2" />
          <Formula expr="x_2\,k_2 = PK_2 + x_{12}\,k_1" />
          <p className="text-sm">2×2-LGS mit Cramer oder Einsetzen lösen.</p>
        </>
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow id="k1" label="k_1 (€/Einheit)" value={raw.k1}
            onChange={setField("k1")} inputError={inputErrors.k1}
            checkStatus={checkResult?.fields.k1} format={eur} />
          <FieldRow id="k2" label="k_2 (€/Einheit)" value={raw.k2}
            onChange={setField("k2")} inputError={inputErrors.k2}
            checkStatus={checkResult?.fields.k2} format={eur} />
          <FieldRow id="E1" label="Belastung E1 (€)" value={raw.E1}
            onChange={setField("E1")} inputError={inputErrors.E1}
            checkStatus={checkResult?.fields.E1} format={eur} />
          <FieldRow id="E2" label="Belastung E2 (€)" value={raw.E2}
            onChange={setField("E2")} inputError={inputErrors.E2}
            checkStatus={checkResult?.fields.E2} format={eur} />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<IlvGleichungSolutionView params={params} solution={solution} />}
    />
  );
}

export function IlvGleichungSolutionView({
  params,
  solution,
}: {
  params: IlvGleichungParams;
  solution: IlvGleichungSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>Aufgestelltes LGS:</p>
      <Formula expr={`${params.x[0]}\\,k_1 - ${params.x21}\\,k_2 = ${params.PK[0]}`} />
      <Formula expr={`-${params.x12}\\,k_1 + ${params.x[1]}\\,k_2 = ${params.PK[1]}`} />
      <Formula expr={`k_1 = ${solution.k1},\\quad k_2 = ${solution.k2}`} />
      <Formula expr={`E_1 = ${solution.E1},\\quad E_2 = ${solution.E2}`} />
    </div>
  );
}
