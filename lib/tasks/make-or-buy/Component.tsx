"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { MakeOrBuyParams, MakeOrBuySolution } from "./generate";
import { checkMakeOrBuy, type MakeOrBuyAnswer } from "./check";
import { buildMakeOrBuyPrompt } from "./prompt";
import { validateMakeOrBuyInput } from "./validate";

const BLANK = { Keigen: "", Kfremd: "", entscheidung: "" } as const;

export function MakeOrBuyComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<MakeOrBuyParams, MakeOrBuySolution>) {
  const [raw, setRaw] = React.useState<Record<string, string>>({ ...BLANK });
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateMakeOrBuyInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: MakeOrBuyAnswer = {
      Keigen: parseLocaleNumber(raw.Keigen),
      Kfremd: parseLocaleNumber(raw.Kfremd),
      entscheidung: raw.entscheidung as "eigen" | "fremd",
    };
    setCheckResult(checkMakeOrBuy(solution, ans));
  };

  const onReset = () => {
    setRaw({ ...BLANK });
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[k];
        return n;
      });
    }
  };

  const entscheidungStatus = checkResult?.fields.entscheidung;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="make-or-buy"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Make-or-Buy: relevante Kosten und Entscheidung."
      buildPromptText={() => buildMakeOrBuyPrompt(params)}
      problem={
        <div className="space-y-2">
          <p>Bedarf: <strong>{fmt(params.menge)} Stück</strong>.</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Eigenfertigung: variable Stückkosten {eur(params.kVarEigen)} / Stück</li>
            <li>Eigenfertigung: abbaubare Fixkosten {eur(params.KfixAbbaubar)}</li>
            <li>Eigenfertigung: sunk Fixkosten {eur(params.KfixSunk)}</li>
            <li>Fremdbezug: Stückpreis {eur(params.pExtern)} / Stück</li>
          </ul>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Eigenfertigung vs. Fremdbezug: Vergleiche nur die entscheidungsrelevanten Kosten. Sunk Costs (nicht abbaubare Fixkosten) fallen in beiden Alternativen an und werden ausgeklammert."
          variables={[
            { sym: "x", desc: "Bedarfsmenge (Stück)" },
            { sym: "k_{\\text{var}}", desc: "Variable Stückkosten der Eigenfertigung (€/Stück)" },
            { sym: "K_{\\text{fix,abbaubar}}", desc: "Fixkosten der Eigenfertigung, die bei Fremdbezug entfallen (€)" },
            { sym: "p_{\\text{ext}}", desc: "Stückpreis bei Fremdbezug (€/Stück)" },
          ]}
          formulas={[
            { expr: "K_{\\text{eigen,relevant}} = k_{\\text{var}} \\cdot x + K_{\\text{fix,abbaubar}}", desc: "Relevante Kosten der Eigenfertigung: variable Kosten plus die nur bei Eigenfertigung anfallenden Fixkosten." },
            { expr: "K_{\\text{fremd,relevant}} = p_{\\text{ext}} \\cdot x", desc: "Relevante Kosten des Fremdbezugs: Bedarfsmenge mal Einkaufspreis." },
          ]}
          notes={<p>Entscheidungsregel: wähle die Alternative mit den geringeren relevanten Kosten.</p>}
        />
      }
      form={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow
              id="Keigen"
              label="Relevante Kosten Eigenfertigung (€)"
              value={raw.Keigen}
              onChange={setField("Keigen")}
              inputError={inputErrors.Keigen}
              checkStatus={checkResult?.fields.Keigen}
              format={eur}
            />
            <FieldRow
              id="Kfremd"
              label="Relevante Kosten Fremdbezug (€)"
              value={raw.Kfremd}
              onChange={setField("Kfremd")}
              inputError={inputErrors.Kfremd}
              checkStatus={checkResult?.fields.Kfremd}
              format={eur}
            />
          </div>
          <div className="space-y-2">
            <Label>Entscheidung</Label>
            <div className="flex gap-4">
              {(["eigen", "fremd"] as const).map((opt) => (
                <label
                  key={opt}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                    raw.entscheidung === opt && "border-primary bg-primary/5",
                  )}
                >
                  <input
                    type="radio"
                    name="entscheidung"
                    value={opt}
                    checked={raw.entscheidung === opt}
                    onChange={(e) => {
                      setRaw((s) => ({ ...s, entscheidung: e.target.value }));
                      if (inputErrors.entscheidung) {
                        setInputErrors((s) => {
                          const n = { ...s };
                          delete n.entscheidung;
                          return n;
                        });
                      }
                    }}
                  />
                  {opt === "eigen" ? "Eigenfertigung" : "Fremdbezug"}
                </label>
              ))}
            </div>
            {inputErrors.entscheidung && (
              <p className="text-xs text-destructive">{inputErrors.entscheidung}</p>
            )}
            {entscheidungStatus && !entscheidungStatus.ok && !inputErrors.entscheidung && (
              <p className="text-xs text-destructive">
                Korrekt wäre: {entscheidungStatus.expected === "eigen"
                  ? "Eigenfertigung"
                  : "Fremdbezug"}
              </p>
            )}
          </div>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<MakeOrBuySolutionView params={params} solution={solution} />}
    />
  );
}

export function MakeOrBuySolutionView({
  params,
  solution,
}: {
  params: MakeOrBuyParams;
  solution: MakeOrBuySolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <Formula expr={`K_{\\text{eigen}} = ${params.kVarEigen} \\cdot ${params.menge} + ${params.KfixAbbaubar} = ${solution.Keigen}`} />
      <Formula expr={`K_{\\text{fremd}} = ${params.pExtern} \\cdot ${params.menge} = ${solution.Kfremd}`} />
      <p>
        Entscheidung: <strong>{solution.entscheidung === "eigen" ? "Eigenfertigung" : "Fremdbezug"}</strong> (Kostenvorteil {eur(solution.vorteil)})
      </p>
    </div>
  );
}
