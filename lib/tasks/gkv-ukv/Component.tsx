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
import type { GkvUkvParams } from "./generate";
import type { GkvUkvSolution } from "./solve";
import { checkGkvUkv, type GkvUkvAnswer } from "./check";
import { buildGkvUkvPrompt } from "./prompt";
import { validateGkvUkvInput } from "./validate";

const N = 2;

const blank = (): Record<string, string> => {
  const o: Record<string, string> = { gewinnGKV: "", gewinnUKV: "" };
  for (let i = 0; i < N; i++) {
    o[`bestandsWert${i}`] = "";
    o[`HKAbsatz${i}`] = "";
  }
  return o;
};

export function GkvUkvComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<GkvUkvParams, GkvUkvSolution>) {
  const [raw, setRaw] = React.useState<Record<string, string>>(blank());
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateGkvUkvInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: GkvUkvAnswer = {
      bestandsWert: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`bestandsWert${i}`])),
      HKAbsatz: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`HKAbsatz${i}`])),
      gewinnGKV: parseLocaleNumber(raw.gewinnGKV),
      gewinnUKV: parseLocaleNumber(raw.gewinnUKV),
    };
    setCheckResult(checkGkvUkv(solution, ans));
  };

  const onReset = () => { setRaw(blank()); setInputErrors({}); setCheckResult(null); };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="gkv-ukv"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="GKV vs. UKV – Eingabe"
      description="Periodenerfolg nach Gesamtkosten- und Umsatzkostenverfahren."
      buildPromptText={() => buildGkvUkvPrompt(params)}
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
        <LearnLegend
          intro="Gesamtkostenverfahren (GKV) und Umsatzkostenverfahren (UKV) ermitteln denselben Periodenerfolg auf zwei Wegen. GKV stellt alle Kosten den Erträgen inkl. Bestandsveränderungen gegenüber, UKV nur die Herstellkosten der abgesetzten Menge."
          variables={[
            { sym: "M", desc: "Produzierte Menge der Periode (Stück)" },
            { sym: "A", desc: "Abgesetzte Menge der Periode (Stück)" },
            { sym: "\\Delta B", desc: "Bestandsveränderung in Stück (Mehrung > 0, Minderung < 0)" },
            { sym: "k_{var}^{HK}", desc: "Variable Herstellkosten je Stück (€/Stück)" },
            { sym: "K_{fix}^{HK}", desc: "Fixe Herstellkosten der Periode (€)" },
            { sym: "HK_{je\\,Stk}", desc: "Vollkosten-Herstellkosten pro Stück (€/Stück)" },
            { sym: "E", desc: "Erlöse / Umsatz (€)" },
            { sym: "K_{gesamt}", desc: "Gesamte angefallene Kosten der Periode (€)" },
            { sym: "K_{Vertrieb}", desc: "Vertriebs- und Verwaltungskosten der Periode (€)" },
            { sym: "G", desc: "Periodenerfolg / Gewinn (€)" },
          ]}
          formulas={[
            { expr: "HK_{je\\,Stk} = \\dfrac{k_{var}^{HK}\\cdot M + K_{fix}^{HK}}{M}", desc: "Vollkosten-Herstellkosten je Stück: variable plus fixe HK auf die Produktionsmenge umgelegt." },
            { expr: "\\text{GKV: } G = E + \\sum \\Delta B \\cdot HK_{je\\,Stk} - K_{gesamt}", desc: "Gesamtkostenverfahren: Umsatz plus aktivierte Bestandsmehrung (bzw. minus Bestandsminderung) minus alle Periodenkosten." },
            { expr: "\\text{UKV: } G = E - \\sum HK_{je\\,Stk}\\cdot A - K_{Vertrieb}", desc: "Umsatzkostenverfahren: Umsatz minus Herstellkosten der abgesetzten Menge minus Verwaltungs-/Vertriebskosten." },
          ]}
        />
      }
      form={
        <div className="space-y-4">
          {params.produkte.map((x, i) => (
            <fieldset key={x.name} className="space-y-2 rounded-lg border p-4">
              <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {x.name}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow id={`bestandsWert${i}`} label="Bestandswert (€, ±)"
                  value={raw[`bestandsWert${i}`]} onChange={setField(`bestandsWert${i}`)}
                  inputError={inputErrors[`bestandsWert${i}`]}
                  checkStatus={checkResult?.fields[`bestandsWert${i}`]} format={eur} />
                <FieldRow id={`HKAbsatz${i}`} label="HK des Absatzes (€)"
                  value={raw[`HKAbsatz${i}`]} onChange={setField(`HKAbsatz${i}`)}
                  inputError={inputErrors[`HKAbsatz${i}`]}
                  checkStatus={checkResult?.fields[`HKAbsatz${i}`]} format={eur} />
              </div>
            </fieldset>
          ))}
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow id="gewinnGKV" label="Periodenerfolg GKV (€)"
              value={raw.gewinnGKV} onChange={setField("gewinnGKV")}
              inputError={inputErrors.gewinnGKV}
              checkStatus={checkResult?.fields.gewinnGKV} format={eur} />
            <FieldRow id="gewinnUKV" label="Periodenerfolg UKV (€)"
              value={raw.gewinnUKV} onChange={setField("gewinnUKV")}
              inputError={inputErrors.gewinnUKV}
              checkStatus={checkResult?.fields.gewinnUKV} format={eur} />
          </div>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<GkvUkvSolutionView params={params} solution={solution} />}
    />
  );
}

export function GkvUkvSolutionView({
  params,
  solution,
}: {
  params: GkvUkvParams;
  solution: GkvUkvSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            <TableHead className="text-right">HK je Stk.</TableHead>
            <TableHead className="text-right">ΔBestand</TableHead>
            <TableHead className="text-right">Bestandswert</TableHead>
            <TableHead className="text-right">HK des Absatzes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.produkte.map((x, i) => (
            <TableRow key={x.name}>
              <TableCell className="font-medium">{x.name}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].HKjeStk)}</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(solution.rows[i].bestandsAenderung)}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].bestandsWert)}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].HKAbsatz)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>
        Erlöse = <strong>{eur(solution.erloeseSumme)}</strong>; Vertrieb gesamt =&nbsp;
        <strong>{eur(solution.vertriebTotal)}</strong>; Gesamtkosten (HK + Vertrieb) =&nbsp;
        <strong>{eur(solution.gesamtkostenSumme)}</strong>.
      </p>
      <p>Periodenerfolg (GKV = UKV) = <strong>{eur(solution.gewinn)}</strong>.</p>
    </div>
  );
}
