"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { HochTiefParams, HochTiefSolution } from "./generate";
import { checkHochTief, type HochTiefAnswer } from "./check";
import { buildHochTiefPrompt } from "./prompt";
import { validateHochTiefInput } from "./validate";

type Field = keyof HochTiefAnswer;
const BLANK: Record<Field, string> = { kVar: "", Kfix: "", Kneu: "" };

export function HochTiefComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<HochTiefParams, HochTiefSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateHochTiefInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: HochTiefAnswer = {
      kVar: parseLocaleNumber(raw.kVar),
      Kfix: parseLocaleNumber(raw.Kfix),
      Kneu: parseLocaleNumber(raw.Kneu),
    };
    setCheckResult(checkHochTief(solution, ans));
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

  const xMin = Math.min(...params.periods.map((q) => q.x));
  const xMax = Math.max(...params.periods.map((q) => q.x));

  return (
    <TaskShell
      courseId={courseId}
      taskKind="hoch-tief"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Hoch-Tief: höchster und niedrigster Beschäftigungspunkt."
      buildPromptText={() => buildHochTiefPrompt(params)}
      problem={
        <div className="space-y-2">
          <p>Beobachtete Perioden:</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periode</TableHead>
                <TableHead className="text-right">x (Stück)</TableHead>
                <TableHead className="text-right">K (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.periods.map((q, i) => {
                const isHi = q.x === xMax;
                const isLo = q.x === xMin;
                return (
                  <TableRow key={i} className={isHi || isLo ? "bg-muted/40" : ""}>
                    <TableCell>
                      {i + 1}
                      {isHi && <span className="ml-1 text-xs text-primary">(Hoch)</span>}
                      {isLo && <span className="ml-1 text-xs text-primary">(Tief)</span>}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{fmt(q.x)}</TableCell>
                    <TableCell className="text-right tabular-nums">{eur(q.K)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <p className="text-sm">
            Prognose für x_neu = <strong>{fmt(params.xNeu)}</strong> Stück.
          </p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Hoch-/Tiefpunktverfahren: Aus der höchsten und niedrigsten beobachteten Beschaftigungsmenge wird eine lineare Kostenfunktion geschätzt und für Prognosen genutzt."
          variables={[
            { sym: "x_{hoch}, x_{tief}", desc: "Höchste / niedrigste beobachtete Menge (Stück)" },
            { sym: "K_{hoch}, K_{tief}", desc: "Zugehörige Gesamtkosten (€)" },
            { sym: "k_{var}", desc: "Variable Stückkosten = Steigung der Kostengerade (€/Stück)" },
            { sym: "K_{fix}", desc: "Fixkosten = y-Achsenabschnitt (€)" },
            { sym: "x_{neu}", desc: "Prognosemenge (Stück)" },
          ]}
          formulas={[
            { expr: "k_{var} = \\dfrac{K_{hoch} - K_{tief}}{x_{hoch} - x_{tief}}", desc: "Steigung aus zwei Punkten: Kostendifferenz pro Mengendifferenz." },
            { expr: "K_{fix} = K_{tief} - k_{var}\\cdot x_{tief}", desc: "Fixkostenbestimmung durch Einsetzen eines Datenpunktes (alternativ Hochpunkt)." },
            { expr: "K(x_{neu}) = K_{fix} + k_{var}\\cdot x_{neu}", desc: "Prognose: Kostenfunktion mit gefundener Steigung und Achsenabschnitt auswerten." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldRow
            id="kVar"
            label="k_var (€/Stück)"
            value={raw.kVar}
            onChange={setField("kVar")}
            inputError={inputErrors.kVar}
            checkStatus={checkResult?.fields.kVar}
            format={eur}
          />
          <FieldRow
            id="Kfix"
            label="K_fix (€)"
            value={raw.Kfix}
            onChange={setField("Kfix")}
            inputError={inputErrors.Kfix}
            checkStatus={checkResult?.fields.Kfix}
            format={eur}
          />
          <FieldRow
            id="Kneu"
            label={`K(x = ${fmt(params.xNeu)}) (€)`}
            value={raw.Kneu}
            onChange={setField("Kneu")}
            inputError={inputErrors.Kneu}
            checkStatus={checkResult?.fields.Kneu}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<HochTiefSolutionView params={params} solution={solution} />}
    />
  );
}

export function HochTiefSolutionView({
  params,
  solution,
}: {
  params: HochTiefParams;
  solution: HochTiefSolution;
}) {
  const lo = params.periods.reduce((a, b) => (a.x < b.x ? a : b));
  const hi = params.periods.reduce((a, b) => (a.x > b.x ? a : b));
  return (
    <div className="space-y-3 text-sm">
      <Formula
        expr={`k_{var} = \\dfrac{${hi.K} - ${lo.K}}{${hi.x} - ${lo.x}} = ${solution.kVar}`}
      />
      <Formula
        expr={`K_{fix} = ${lo.K} - ${solution.kVar}\\cdot ${lo.x} = ${solution.Kfix}`}
      />
      <Formula
        expr={`K(${params.xNeu}) = ${solution.Kfix} + ${solution.kVar}\\cdot ${params.xNeu} = ${solution.Kneu}`}
      />
    </div>
  );
}
