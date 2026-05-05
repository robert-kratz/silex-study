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
import { eur, pct, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { PreiskalkulationParams, PreiskalkulationSolution } from "./generate";
import {
  checkPreiskalkulation,
  type PreiskalkulationAnswer,
} from "./check";
import { buildPreiskalkulationPrompt } from "./prompt";
import { validatePreiskalkulationInput } from "./validate";

type Field = keyof PreiskalkulationAnswer;
const BLANK: Record<Field, string> = {
  selbstkosten: "",
  gewinnBetrag: "",
  barverkaufspreis: "",
  zielverkaufspreis: "",
  listenverkaufspreis: "",
};

export function PreiskalkulationComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<PreiskalkulationParams, PreiskalkulationSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validatePreiskalkulationInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: PreiskalkulationAnswer = {
      selbstkosten: parseLocaleNumber(raw.selbstkosten),
      gewinnBetrag: parseLocaleNumber(raw.gewinnBetrag),
      barverkaufspreis: parseLocaleNumber(raw.barverkaufspreis),
      zielverkaufspreis: parseLocaleNumber(raw.zielverkaufspreis),
      listenverkaufspreis: parseLocaleNumber(raw.listenverkaufspreis),
    };
    setCheckResult(checkPreiskalkulation(solution, answer));
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
      taskKind="preiskalkulation"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Schrittweise progressive Preiskalkulation."
      buildPromptText={() => buildPreiskalkulationPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Größe</TableHead>
              <TableHead className="text-right">Wert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Herstellkosten (HK)</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.HK)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>VwGK-Zuschlag</TableCell>
              <TableCell className="text-right tabular-nums">{pct(params.vwgk)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>VtGK-Zuschlag</TableCell>
              <TableCell className="text-right tabular-nums">{pct(params.vtgk)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gewinnaufschlag</TableCell>
              <TableCell className="text-right tabular-nums">{pct(params.gewinn)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Skonto</TableCell>
              <TableCell className="text-right tabular-nums">{pct(params.skonto)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rabatt</TableCell>
              <TableCell className="text-right tabular-nums">{pct(params.rabatt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
      learnHelp={
        <LearnLegend
          intro="Vorwärtskalkulation vom Listenverkaufspreis: Ausgehend von den Herstellkosten werden über Zuschläge die Selbstkosten gebildet, dann Gewinn, Skonto und Rabatt aufgeschlagen."
          variables={[
            { sym: "HK", desc: "Herstellkosten des Auftrags (€)" },
            { sym: "VwGK", desc: "Verwaltungsgemeinkostenzuschlag (in % der HK)" },
            { sym: "VtGK", desc: "Vertriebsgemeinkostenzuschlag (in % der HK)" },
            { sym: "SK", desc: "Selbstkosten = HK + Verw./Vertriebsanteil (€)" },
            { sym: "g", desc: "Gewinnzuschlag in % der Selbstkosten" },
            { sym: "BVP", desc: "Barverkaufspreis (€); Preis bei sofortiger Zahlung" },
            { sym: "ZVP", desc: "Zielverkaufspreis (€); Preis nach Skontogewährung" },
            { sym: "LVP", desc: "Listenverkaufspreis (€); offiziell ausgewiesener Listenpreis" },
            { sym: "\\text{Skonto}", desc: "Nachlass für frühzeitige Zahlung (in %)" },
            { sym: "\\text{Rabatt}", desc: "Mengen-/Kundenrabatt (in %)" },
          ]}
          formulas={[
            { expr: "\\text{Selbstkosten} = HK\\cdot(1 + VwGK + VtGK)", desc: "Selbstkosten: Herstellkosten plus prozentuale Verwaltungs- und Vertriebszuschläge." },
            { expr: "\\text{Gewinn} = SK\\cdot g", desc: "Gewinnaufschlag in Prozent der Selbstkosten." },
            { expr: "\\text{Barverkaufspreis} = SK + \\text{Gewinn}", desc: "BVP = Selbstkosten plus Gewinn (Preis ohne Preisnachlässe)." },
            { expr: "\\text{Zielverkaufspreis} = \\frac{\\text{BVP}}{1 - \\text{Skonto}}", desc: "Rückwärtsrechnung des Skontos: BVP entspricht (1 − Skonto) des ZVP." },
            { expr: "\\text{Listenverkaufspreis} = \\frac{\\text{ZVP}}{1 - \\text{Rabatt}}", desc: "Rückwärtsrechnung des Rabatts: ZVP entspricht (1 − Rabatt) des LVP." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(BLANK) as Field[]).map((k) => (
            <FieldRow
              key={k}
              id={k}
              label={`${labelFor(k)} (€)`}
              value={raw[k]}
              onChange={setField(k)}
              inputError={inputErrors[k]}
              checkStatus={checkResult?.fields[k]}
              format={eur}
            />
          ))}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<PreiskalkulationSolutionView params={params} solution={solution} />}
    />
  );
}

function labelFor(k: keyof PreiskalkulationAnswer): string {
  return {
    selbstkosten: "Selbstkosten",
    gewinnBetrag: "Gewinnbetrag",
    barverkaufspreis: "Barverkaufspreis",
    zielverkaufspreis: "Zielverkaufspreis",
    listenverkaufspreis: "Listenverkaufspreis",
  }[k];
}

export function PreiskalkulationSolutionView({
  params,
  solution,
}: {
  params: PreiskalkulationParams;
  solution: PreiskalkulationSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula
        expr={`\\text{SK} = ${params.HK}\\cdot(1 + ${params.vwgk} + ${params.vtgk}) = ${solution.selbstkosten}`}
      />
      <Formula
        expr={`\\text{Gewinn} = ${solution.selbstkosten}\\cdot ${params.gewinn} = ${solution.gewinnBetrag}`}
      />
      <Formula
        expr={`\\text{BVP} = ${solution.selbstkosten} + ${solution.gewinnBetrag} = ${solution.barverkaufspreis}`}
      />
      <Formula
        expr={`\\text{ZVP} = \\frac{${solution.barverkaufspreis}}{1 - ${params.skonto}} = ${solution.zielverkaufspreis}`}
      />
      <Formula
        expr={`\\text{LVP} = \\frac{${solution.zielverkaufspreis}}{1 - ${params.rabatt}} = ${solution.listenverkaufspreis}`}
      />
    </div>
  );
}
