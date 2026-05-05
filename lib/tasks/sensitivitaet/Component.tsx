"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { SensitivitaetParams } from "./generate";
import type { SensitivitaetSolution } from "./solve";
import { checkSensitivitaet, type SensitivitaetAnswer } from "./check";
import { buildSensitivitaetPrompt } from "./prompt";
import { validateSensitivitaetInput } from "./validate";

const BLANK = { S: "", deltaG: "", empfehlung: "" };
const EMPF_OPTIONS = [
  { value: "ja", label: "Ja – die Werbemaßnahme durchführen." },
  { value: "nein", label: "Nein – die Werbemaßnahme würde den Gewinn schmälern." },
];

const pct = (n: number): string => `${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export function SensitivitaetComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<SensitivitaetParams, SensitivitaetSolution>) {
  const [raw, setRaw] = React.useState(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateSensitivitaetInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: SensitivitaetAnswer = {
      S: parseLocaleNumber(raw.S),
      deltaG: parseLocaleNumber(raw.deltaG),
      empfehlung: raw.empfehlung,
    };
    setCheckResult(checkSensitivitaet(solution, ans));
  };

  const onReset = () => { setRaw(BLANK); setInputErrors({}); setCheckResult(null); };

  const setField = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
  };

  const empfStatus = checkResult?.fields.empfehlung;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="sensitivitaet"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Sensitivität & Sicherheitskoeffizient"
      description="Sicherheitskoeffizient und Gewinnwirkung einer Werbemaßnahme."
      buildPromptText={() => buildSensitivitaetPrompt(params)}
      problem={
        <div className="space-y-1 text-sm">
          <p>Preis <strong>{eur(params.p)}</strong>, k_var <strong>{eur(params.kv)}</strong>, K_f <strong>{eur(params.Kf)}</strong></p>
          <p>Erwarteter Absatz x_e = <strong>{fmt(params.xe)} Stück</strong></p>
          <p>Werbemaßnahme: ΔK_f = <strong>{eur(params.deltaKf)}</strong>, Δx = <strong>{fmt(params.deltaX)} Stück</strong></p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Sensitivitätsanalyse rund um den Break-Even: Wie weit liegt der erwartete Absatz über dem BE (Sicherheitskoeffizient) und wie wirkt sich eine Werbemaßnahme auf den Gewinn aus?"
          variables={[
            { sym: "p", desc: "Verkaufspreis pro Stück (€)" },
            { sym: "k_v", desc: "Variable Stückkosten (€)" },
            { sym: "d", desc: "Stückdeckungsbeitrag = p − k_v" },
            { sym: "K_f", desc: "Periodische Fixkosten (€)" },
            { sym: "x_b", desc: "Break-Even-Menge (Stück)" },
            { sym: "x_e", desc: "Erwartete Absatzmenge (Stück)" },
            { sym: "S", desc: "Sicherheitskoeffizient (in %)" },
            { sym: "\\Delta K_f", desc: "Zusätzliche Fixkosten der Werbemaßnahme (€)" },
            { sym: "\\Delta x", desc: "Durch die Werbung erwartete zusätzliche Absatzmenge" },
            { sym: "\\Delta G", desc: "Änderung des Gewinns durch die Maßnahme (€)" },
          ]}
          formulas={[
            { expr: "d = p - k_v,\\quad x_b = K_f / d", desc: "Stückdeckungsbeitrag und Break-Even-Menge als Ausgangsgrößen." },
            { expr: "S = \\dfrac{x_e - x_b}{x_e}\\cdot 100\\,\\%", desc: "Sicherheitskoeffizient: relative Pufferzone des erwarteten Absatzes über dem BE." },
            { expr: "\\Delta G = d\\cdot \\Delta x - \\Delta K_f", desc: "Gewinneffekt der Werbemaßnahme: zusätzlicher DB minus zusätzliche Fixkosten." },
          ]}
          notes={<p>Empfehlung: Maßnahme nur durchführen, wenn ΔG &gt; 0.</p>}
        />
      }
      form={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow id="S" label="Sicherheitskoeffizient (%)"
              value={raw.S} onChange={setField("S")}
              inputError={inputErrors.S} checkStatus={checkResult?.fields.S} format={pct} />
            <FieldRow id="deltaG" label="ΔG der Werbemaßnahme (€)"
              value={raw.deltaG} onChange={setField("deltaG")}
              inputError={inputErrors.deltaG} checkStatus={checkResult?.fields.deltaG} format={eur} />
          </div>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Empfehlung
            </legend>
            <div className="space-y-1.5">
              {EMPF_OPTIONS.map((u) => {
                const isCorrect = empfStatus && u.value === empfStatus.expected;
                const isWrongPick = empfStatus && !empfStatus.ok && raw.empfehlung === u.value;
                return (
                  <label key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.empfehlung === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}>
                    <input type="radio" className="mt-1" name="empfehlung" value={u.value}
                      checked={raw.empfehlung === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, empfehlung: u.value }));
                        if (inputErrors.empfehlung) setInputErrors((s) => { const n = { ...s }; delete n.empfehlung; return n; });
                      }} />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.empfehlung && <p className="text-xs text-destructive">{inputErrors.empfehlung}</p>}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<SensitivitaetSolutionView solution={solution} />}
    />
  );
}

export function SensitivitaetSolutionView({
  solution,
}: {
  solution: SensitivitaetSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <Formula expr={`d = ${solution.d}\\;\\text{€/Stück}`} />
      <Formula expr={`x_b = ${solution.xb}\\;\\text{Stück}`} />
      <Formula expr={`S = ${(solution.S * 100).toFixed(2)}\\,\\%`} />
      <Formula expr={`\\Delta G = ${solution.deltaG}\\;\\text{€}`} />
      <p>Empfehlung: <strong>{solution.empfehlung}</strong></p>
    </div>
  );
}
