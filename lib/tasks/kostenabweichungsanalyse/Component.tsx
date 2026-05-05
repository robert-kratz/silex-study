"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, pct, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { KostenabwParams } from "./generate";
import type { KostenabwSolution } from "./solve";
import { checkKostenabweichung, type KostenabwAnswer } from "./check";
import { buildKostenabweichungPrompt } from "./prompt";
import { validateKostenabweichungInput } from "./validate";

const BLANK = { art: "", diff: "", writeoff: "" };

const ART_OPTIONS = [
  { value: "ueberdeckung", label: "Kostenüberdeckung (verrechnet > Ist)" },
  { value: "unterdeckung", label: "Kostenunterdeckung (verrechnet < Ist)" },
];

const WRITEOFF_OPTIONS = [
  {
    value: "umsatzkosten",
    label: "Vollständige Verrechnung der Abweichung über die Umsatzkosten der Periode (kein Bestandsanpassung).",
  },
  {
    value: "lager-anteilig",
    label: "Anteilige Verteilung der Abweichung auf Bestände und Umsatzkosten.",
  },
  {
    value: "naechste-periode",
    label: "Aktivierung als Rechnungsabgrenzung für die nächste Periode.",
  },
  {
    value: "ignorieren",
    label: "Abweichung wird nicht verrechnet.",
  },
];

export function KostenabweichungComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<KostenabwParams, KostenabwSolution>) {
  const [raw, setRaw] = React.useState(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateKostenabweichungInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: KostenabwAnswer = {
      art: raw.art,
      diff: parseLocaleNumber(raw.diff),
      writeoff: raw.writeoff,
    };
    setCheckResult(checkKostenabweichung(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setNum = (k: "diff") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[k];
        return n;
      });
    }
  };

  const artStatus = checkResult?.fields.art;
  const writeoffStatus = checkResult?.fields.writeoff;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="kostenabweichungsanalyse"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Kostenabweichungsanalyse"
      description="Über-/Unterdeckung bestimmen und Writeoff Approach erläutern."
      buildPromptText={() => buildKostenabweichungPrompt(params)}
      problem={
        <div className="space-y-1 text-sm">
          <p>
            Plan-Gemeinkostenzuschlagssatz: <strong>{pct(params.planSatz)}</strong>
          </p>
          <p>
            Tatsächliche Einzelkosten (Bezugsgröße): <strong>{eur(params.istEinzelkosten)}</strong>
          </p>
          <p>
            Ist-Gemeinkosten der Periode: <strong>{eur(params.istGemeinkosten)}</strong>
          </p>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="\text{Verrechnete GK} = \text{Ist-EK}\cdot \text{Plan-Zuschlagssatz}" />
          <Formula expr="\Delta = \text{Verrechnete GK} - \text{Ist-GK}" />
          <p className="text-xs text-muted-foreground">
            Δ &gt; 0: Überdeckung (zu viel verrechnet) · Δ &lt; 0: Unterdeckung (zu wenig
            verrechnet). Beim Writeoff Approach wird Δ vollständig über die Umsatzkosten
            verrechnet.
          </p>
        </>
      }
      form={
        <div className="space-y-4">
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Art der Abweichung
            </legend>
            <div className="space-y-1.5">
              {ART_OPTIONS.map((u) => {
                const isCorrect = artStatus && u.value === artStatus.expected;
                const isWrongPick =
                  artStatus && !artStatus.ok && raw.art === u.value;
                return (
                  <label
                    key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.art === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name="art"
                      value={u.value}
                      checked={raw.art === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, art: u.value }));
                        if (inputErrors.art) {
                          setInputErrors((s) => {
                            const n = { ...s };
                            delete n.art;
                            return n;
                          });
                        }
                      }}
                    />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.art && (
                <p className="text-xs text-destructive">{inputErrors.art}</p>
              )}
            </div>
          </fieldset>

          <FieldRow
            id="diff"
            label="Differenzbetrag |Δ| (€)"
            value={raw.diff}
            onChange={setNum("diff")}
            inputError={inputErrors.diff}
            checkStatus={checkResult?.fields.diff}
            format={eur}
          />

          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Vorgehensweise „Writeoff Approach"
            </legend>
            <div className="space-y-1.5">
              {WRITEOFF_OPTIONS.map((u) => {
                const isCorrect =
                  writeoffStatus && u.value === writeoffStatus.expected;
                const isWrongPick =
                  writeoffStatus && !writeoffStatus.ok && raw.writeoff === u.value;
                return (
                  <label
                    key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.writeoff === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name="writeoff"
                      value={u.value}
                      checked={raw.writeoff === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, writeoff: u.value }));
                        if (inputErrors.writeoff) {
                          setInputErrors((s) => {
                            const n = { ...s };
                            delete n.writeoff;
                            return n;
                          });
                        }
                      }}
                    />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.writeoff && (
                <p className="text-xs text-destructive">{inputErrors.writeoff}</p>
              )}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<KostenabweichungSolutionView solution={solution} />}
    />
  );
}

export function KostenabweichungSolutionView({
  solution,
}: {
  solution: KostenabwSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>
        Verrechnete Gemeinkosten: <strong>{eur(solution.verrechneteGk)}</strong>
      </p>
      <p>
        Δ (verrechnet − ist): <strong>{eur(solution.signedDiff)}</strong>
      </p>
      <p>
        Art:{" "}
        <strong>
          {solution.art === "ueberdeckung" ? "Kostenüberdeckung" : "Kostenunterdeckung"}
        </strong>
        {" "}· |Δ| = <strong>{eur(solution.diff)}</strong>
      </p>
      <p>
        Writeoff Approach: vollständige Verrechnung der Abweichung über die
        Umsatzkosten der Periode.
      </p>
    </div>
  );
}
