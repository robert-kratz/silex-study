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
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { VollTeilkostenParams } from "./generate";
import type { VollTeilkostenSolution } from "./solve";
import { checkVollTeilkosten, type VollTeilkostenAnswer } from "./check";
import { buildVollTeilkostenPrompt } from "./prompt";
import { validateVollTeilkostenInput } from "./validate";

const URSACHEN = [
  {
    value: "fixkosten-aktivierung",
    label:
      "Fixkosten werden in der Vollkostenrechnung mit dem Bestand aktiviert.",
  },
  {
    value: "variable-kosten",
    label: "Die variablen Kosten werden anders bewertet.",
  },
  {
    value: "vertriebskosten",
    label: "Die Vertriebskosten werden in der Teilkostenrechnung doppelt erfasst.",
  },
  {
    value: "rundung",
    label: "Die Differenz ergibt sich nur aus Rundung.",
  },
];

const BLANK = { gewinnVoll: "", gewinnTeil: "", deltaG: "", ursache: "" };

export function VollTeilkostenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<VollTeilkostenParams, VollTeilkostenSolution>) {
  const [raw, setRaw] = React.useState(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateVollTeilkostenInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: VollTeilkostenAnswer = {
      gewinnVoll: parseLocaleNumber(raw.gewinnVoll),
      gewinnTeil: parseLocaleNumber(raw.gewinnTeil),
      deltaG: parseLocaleNumber(raw.deltaG),
      ursache: raw.ursache,
    };
    setCheckResult(checkVollTeilkosten(solution, ans));
  };

  const onReset = () => { setRaw(BLANK); setInputErrors({}); setCheckResult(null); };

  const setField = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
  };

  const ursacheStatus = checkResult?.fields.ursache;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="voll-teilkosten"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Voll- vs. Teilkostenrechnung"
      description="Gewinnvergleich Voll-/Teilkostenrechnung und Erklärung der Differenz."
      buildPromptText={() => buildVollTeilkostenPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead className="text-right">Produktion</TableHead>
              <TableHead className="text-right">Absatz</TableHead>
              <TableHead className="text-right">Preis</TableHead>
              <TableHead className="text-right">k_var HK</TableHead>
              <TableHead className="text-right">K_fix HK</TableHead>
              <TableHead className="text-right">k_var Vt</TableHead>
              <TableHead className="text-right">K_fix Vt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.produkte.map((x) => (
              <TableRow key={x.name}>
                <TableCell className="font-medium">{x.name}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(x.produktion)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(x.absatz)}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(x.preis)}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(x.kVarHK)}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(x.KFixHK)}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(x.kVarVt)}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(x.KFixVt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      learnHelp={
        <>
          <Formula expr="G_{Voll} = E - \sum HK_{je\,Stk}\cdot A - K_{Vt}" />
          <Formula expr="G_{Teil} = E - \sum k_{var}^{HK}\cdot A - \sum k_{var}^{Vt}\cdot A - K_{fix}" />
          <Formula expr="\Delta G = \sum \Delta B \cdot \dfrac{K_{fix}^{HK}}{M}" />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FieldRow id="gewinnVoll" label="Gewinn Vollkosten (€)"
              value={raw.gewinnVoll} onChange={setField("gewinnVoll")}
              inputError={inputErrors.gewinnVoll}
              checkStatus={checkResult?.fields.gewinnVoll} format={eur} />
            <FieldRow id="gewinnTeil" label="Gewinn Teilkosten (€)"
              value={raw.gewinnTeil} onChange={setField("gewinnTeil")}
              inputError={inputErrors.gewinnTeil}
              checkStatus={checkResult?.fields.gewinnTeil} format={eur} />
            <FieldRow id="deltaG" label="Differenz ΔG (€)"
              value={raw.deltaG} onChange={setField("deltaG")}
              inputError={inputErrors.deltaG}
              checkStatus={checkResult?.fields.deltaG} format={eur} />
          </div>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ursache der Differenz
            </legend>
            <div className="space-y-1.5">
              {URSACHEN.map((u) => {
                const isCorrect = ursacheStatus && u.value === ursacheStatus.expected;
                const isWrongPick = ursacheStatus && !ursacheStatus.ok && raw.ursache === u.value;
                return (
                  <label
                    key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.ursache === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}
                  >
                    <input type="radio" className="mt-1" name="ursache" value={u.value}
                      checked={raw.ursache === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, ursache: u.value }));
                        if (inputErrors.ursache) setInputErrors((s) => { const n = { ...s }; delete n.ursache; return n; });
                      }} />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.ursache && (
                <p className="text-xs text-destructive">{inputErrors.ursache}</p>
              )}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<VollTeilkostenSolutionView solution={solution} />}
    />
  );
}

export function VollTeilkostenSolutionView({
  solution,
}: {
  solution: VollTeilkostenSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>Gewinn Vollkosten = <strong>{eur(solution.gewinnVoll)}</strong></p>
      <p>Gewinn Teilkosten = <strong>{eur(solution.gewinnTeil)}</strong></p>
      <p>ΔG = <strong>{eur(solution.deltaG)}</strong></p>
      <p>
        Ursache: Fixe Herstellkosten werden in der Vollkostenrechnung anteilig
        im Bestand aktiviert; bei Lageraufbau verbleiben sie in der Bilanz und
        belasten den Gewinn dieser Periode nicht.
      </p>
    </div>
  );
}
