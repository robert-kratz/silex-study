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
import { eur, parseLocaleNumber, pct } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { KalkZinsenParams } from "./generate";
import type { KalkZinsenSolution } from "./solve";
import { checkKalkZinsen, type KalkZinsenAnswer } from "./check";
import { buildKalkZinsenPrompt } from "./prompt";
import { validateKalkZinsenInput } from "./validate";

const KATEGORIE_LABEL: Record<string, string> = {
  "av-bn": "AV (BN)",
  "uv-bn": "UV (BN)",
  "av-nicht-bn": "AV (nicht BN)",
  "uv-nicht-bn": "UV (nicht BN)",
  abzugskapital: "Abzugskapital",
};

type Field = keyof KalkZinsenAnswer;
const BLANK: Record<Field, string> = {
  bnVermoegen: "",
  abzugskapital: "",
  bnKapital: "",
  zinsen: "",
};

export function KalkZinsenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<KalkZinsenParams, KalkZinsenSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateKalkZinsenInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: KalkZinsenAnswer = {
      bnVermoegen: parseLocaleNumber(raw.bnVermoegen),
      abzugskapital: parseLocaleNumber(raw.abzugskapital),
      bnKapital: parseLocaleNumber(raw.bnKapital),
      zinsen: parseLocaleNumber(raw.zinsen),
    };
    setCheckResult(checkKalkZinsen(solution, ans));
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
      taskKind="kalk-zinsen"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Schrittweise Lösung"
      description="BN-Vermögen → Abzugskapital → BN-Kapital → kalkulatorische Zinsen."
      buildPromptText={() => buildKalkZinsenPrompt(params)}
      problem={
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posten</TableHead>
                <TableHead>Klassifikation</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.posten.map((q, i) => (
                <TableRow key={i}>
                  <TableCell>{q.name}</TableCell>
                  <TableCell className="text-xs">
                    {KATEGORIE_LABEL[q.kategorie]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {eur(q.betrag)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-sm">WACC = <strong>{pct(params.wacc)}</strong></p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Kalkulatorische Zinsen verrechnen die Kapitalbindung im Betrieb mit einem Mischzinssatz (WACC) auf das betriebsnotwendige Kapital."
          variables={[
            { sym: "AV_{BN}", desc: "Betriebsnotwendiges Anlagevermögen (€)" },
            { sym: "UV_{BN}", desc: "Betriebsnotwendiges Umlaufvermögen (€)" },
            { sym: "\\text{Abzugskapital}", desc: "Zinslos zur Verfügung stehendes Kapital (z. B. Lieferantenkredite, €)" },
            { sym: "\\text{WACC}", desc: "Gewichteter durchschnittlicher Kapitalkostensatz (Mischzinssatz)" },
            { sym: "Z_{kalk}", desc: "Kalkulatorische Zinsen der Periode (€)" },
          ]}
          formulas={[
            { expr: "\\text{BN-Vermögen} = AV_{BN} + UV_{BN}", desc: "Summe des betriebsnotwendigen Vermögens." },
            { expr: "\\text{BN-Kapital} = \\text{BN-Vermögen} - \\text{Abzugskapital}", desc: "Tatsächlich zu verzinsendes Kapital nach Abzug zinsfreier Mittel." },
            { expr: "Z_{kalk} = \\text{BN-Kapital}\\cdot \\text{WACC}", desc: "Kalkulatorische Zinsen = BN-Kapital mal Mischzinssatz." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            id="bnVermoegen"
            label="Betriebsnotwendiges Vermögen (€)"
            value={raw.bnVermoegen}
            onChange={setField("bnVermoegen")}
            inputError={inputErrors.bnVermoegen}
            checkStatus={checkResult?.fields.bnVermoegen}
            format={eur}
          />
          <FieldRow
            id="abzugskapital"
            label="Abzugskapital (€)"
            value={raw.abzugskapital}
            onChange={setField("abzugskapital")}
            inputError={inputErrors.abzugskapital}
            checkStatus={checkResult?.fields.abzugskapital}
            format={eur}
          />
          <FieldRow
            id="bnKapital"
            label="Betriebsnotwendiges Kapital (€)"
            value={raw.bnKapital}
            onChange={setField("bnKapital")}
            inputError={inputErrors.bnKapital}
            checkStatus={checkResult?.fields.bnKapital}
            format={eur}
          />
          <FieldRow
            id="zinsen"
            label="Kalkulatorische Zinsen (€)"
            value={raw.zinsen}
            onChange={setField("zinsen")}
            inputError={inputErrors.zinsen}
            checkStatus={checkResult?.fields.zinsen}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<KalkZinsenSolutionView params={params} solution={solution} />}
    />
  );
}

export function KalkZinsenSolutionView({
  params,
  solution,
}: {
  params: KalkZinsenParams;
  solution: KalkZinsenSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <Formula expr={`\\text{BN-Verm\u00f6gen} = \\sum \\text{AV/UV (BN)} = ${solution.bnVermoegen}`} />
      <Formula expr={`\\text{Abzugskapital} = ${solution.abzugskapital}`} />
      <Formula expr={`\\text{BN-Kapital} = ${solution.bnVermoegen} - ${solution.abzugskapital} = ${solution.bnKapital}`} />
      <Formula expr={`Z_{\\text{kalk}} = ${solution.bnKapital} \\cdot ${(params.wacc * 100).toFixed(2)}\\,\\% = ${solution.zinsen}`} />
    </div>
  );
}
