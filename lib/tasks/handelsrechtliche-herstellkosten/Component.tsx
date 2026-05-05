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
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { Formula } from "@/components/Formula";
import { eur, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { HgbHerstellkostenParams, HgbKategorie } from "./generate";
import type { HgbHerstellkostenSolution } from "./solve";
import {
  checkHgbHerstellkosten,
  type HgbHerstellkostenAnswer,
} from "./check";
import { buildHgbHerstellkostenPrompt } from "./prompt";
import { validateHgbHerstellkostenInput } from "./validate";

const BLANK = { untergrenze: "", obergrenze: "" };

const KAT_LABEL: Record<HgbKategorie, string> = {
  pflicht: "Pflicht",
  wahlrecht: "Wahlrecht",
  verbot: "Verbot",
};

export function HgbHerstellkostenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<HgbHerstellkostenParams, HgbHerstellkostenSolution>) {
  const [raw, setRaw] = React.useState(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateHgbHerstellkostenInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: HgbHerstellkostenAnswer = {
      untergrenze: parseLocaleNumber(raw.untergrenze),
      obergrenze: parseLocaleNumber(raw.obergrenze),
    };
    setCheckResult(checkHgbHerstellkosten(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[k];
        return n;
      });
    }
  };

  const showCategories = !!checkResult;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="handelsrechtliche-herstellkosten"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Wertunter- und Wertobergrenze"
      description="Handelsrechtliche Herstellkosten gemäß § 255 Abs. 2 HGB."
      buildPromptText={() => buildHgbHerstellkostenPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Betrag</TableHead>
              {showCategories && <TableHead>Kategorie</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.bloecke.map((b, i) => (
              <TableRow key={i}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell>{b.label}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(b.betrag)}</TableCell>
                {showCategories && (
                  <TableCell className="text-xs uppercase tracking-wide text-muted-foreground">
                    {KAT_LABEL[b.kategorie]}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      learnHelp={
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Pflicht:</strong> MEK, FEK, Sondereinzelkosten Fertigung, MGK, FGK,
            Werteverzehr Anlagevermögen Fertigung.
          </li>
          <li>
            <strong>Wahlrecht:</strong> Verwaltungskosten, herstellungsbezogene
            Fremdkapitalkosten, freiwillige soziale Leistungen, Altersvorsorge.
          </li>
          <li>
            <strong>Verboten:</strong> Forschungskosten, Vertriebskosten, kalkulatorische
            Kosten (Zinsen, Unternehmerlohn).
          </li>
          <li>
            <Formula expr="\text{Untergrenze} = \sum \text{Pflicht}" />
            <Formula expr="\text{Obergrenze} = \text{Untergrenze} + \sum \text{Wahlrecht}" />
          </li>
        </ul>
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            id="untergrenze"
            label="Wertuntergrenze (€)"
            value={raw.untergrenze}
            onChange={setField("untergrenze")}
            inputError={inputErrors.untergrenze}
            checkStatus={checkResult?.fields.untergrenze}
            format={eur}
          />
          <FieldRow
            id="obergrenze"
            label="Wertobergrenze (€)"
            value={raw.obergrenze}
            onChange={setField("obergrenze")}
            inputError={inputErrors.obergrenze}
            checkStatus={checkResult?.fields.obergrenze}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <HgbHerstellkostenSolutionView params={params} solution={solution} />
      }
    />
  );
}

export function HgbHerstellkostenSolutionView({
  params,
  solution,
}: {
  params: HgbHerstellkostenParams;
  solution: HgbHerstellkostenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.bloecke.map((b, i) => (
            <TableRow key={i}>
              <TableCell>{b.label}</TableCell>
              <TableCell>{KAT_LABEL[b.kategorie]}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(b.betrag)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>
        <strong>Wertuntergrenze:</strong> {eur(solution.untergrenze)} (Σ Pflicht)
      </p>
      <p>
        <strong>Wertobergrenze:</strong> {eur(solution.obergrenze)} (Pflicht + Wahlrecht)
      </p>
      <p className="text-muted-foreground">
        Σ verbotener Bestandteile: {eur(solution.verbotSumme)} – fließen weder in
        Unter- noch Obergrenze ein.
      </p>
    </div>
  );
}
