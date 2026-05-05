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
import { eur, pct, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { DiffZuschlagsParams } from "./generate";
import type { DiffZuschlagsSolution } from "./solve";
import {
  checkDiffZuschlag,
  fieldKey,
  type DiffZuschlagsAnswer,
} from "./check";
import { buildDiffZuschlagPrompt } from "./prompt";
import { validateDiffZuschlagInput } from "./validate";

const STEP_KEYS = [
  "materialkosten",
  "fertigungskosten",
  "herstellkosten",
  "selbstkosten",
] as const;

const STEP_LABELS: Record<(typeof STEP_KEYS)[number], string> = {
  materialkosten: "Materialkosten",
  fertigungskosten: "Fertigungskosten",
  herstellkosten: "Herstellkosten",
  selbstkosten: "Selbstkosten",
};

export function DiffZuschlagComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<DiffZuschlagsParams, DiffZuschlagsSolution>) {
  const blank = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    params.produkte.forEach((_, i) => {
      STEP_KEYS.forEach((k) => (o[fieldKey(i, k)] = ""));
    });
    return o;
  }, [params.produkte]);

  const [raw, setRaw] = React.useState<Record<string, string>>(blank);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const validator = React.useMemo(() => validateDiffZuschlagInput(params), [params]);

  const onSubmit = () => {
    const errs = validator(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: DiffZuschlagsAnswer = {
      produkte: params.produkte.map((_, i) => ({
        materialkosten: parseLocaleNumber(raw[fieldKey(i, "materialkosten")]),
        fertigungskosten: parseLocaleNumber(raw[fieldKey(i, "fertigungskosten")]),
        herstellkosten: parseLocaleNumber(raw[fieldKey(i, "herstellkosten")]),
        selbstkosten: parseLocaleNumber(raw[fieldKey(i, "selbstkosten")]),
      })),
    };
    setCheckResult(checkDiffZuschlag(solution, ans));
  };

  const onReset = () => {
    setRaw(blank);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRaw((s) => ({ ...s, [key]: v }));
    if (inputErrors[key]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[key];
        return n;
      });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="differenzierte-zuschlagskalkulation"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Selbstkosten Schritt für Schritt"
      description="Differenzierte Zuschlagskalkulation: Material-, Fertigungs-, Herstell- und Selbstkosten je Produkt."
      buildPromptText={() => buildDiffZuschlagPrompt(params)}
      problem={
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zuschlagssatz</TableHead>
                <TableHead className="text-right">Wert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Materialgemeinkosten (auf MEK)</TableCell>
                <TableCell className="text-right tabular-nums">{pct(params.mgkSatz)}</TableCell>
              </TableRow>
              {params.fgkSatz.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>Fertigungsgemeinkosten Stufe {i + 1} (auf FEK{i + 1})</TableCell>
                  <TableCell className="text-right tabular-nums">{pct(s)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Verwaltungsgemeinkosten (auf HK)</TableCell>
                <TableCell className="text-right tabular-nums">{pct(params.vwgkSatz)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Vertriebsgemeinkosten (auf HK)</TableCell>
                <TableCell className="text-right tabular-nums">{pct(params.vtgkSatz)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                {params.produkte.map((p) => (
                  <TableHead key={p.name} className="text-right">{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Materialeinzelkosten (MEK)</TableCell>
                {params.produkte.map((p) => (
                  <TableCell key={p.name} className="text-right tabular-nums">{eur(p.mek)}</TableCell>
                ))}
              </TableRow>
              {params.fgkSatz.map((_, fi) => (
                <TableRow key={fi}>
                  <TableCell>Fertigungseinzelkosten Stufe {fi + 1}</TableCell>
                  {params.produkte.map((p) => (
                    <TableCell key={p.name} className="text-right tabular-nums">
                      {eur(p.fek[fi])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Sondereinzelkosten Fertigung</TableCell>
                {params.produkte.map((p) => (
                  <TableCell key={p.name} className="text-right tabular-nums">{eur(p.sekFert)}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Sondereinzelkosten Vertrieb</TableCell>
                {params.produkte.map((p) => (
                  <TableCell key={p.name} className="text-right tabular-nums">{eur(p.sekVt)}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <div className="space-y-2">
          <Formula expr="\text{Materialkosten} = MEK + MEK\cdot MGK\%" />
          <Formula expr="\text{Fertigungskosten} = \sum_i\bigl(FEK_i + FEK_i\cdot FGK\%_i\bigr) + SEK_F" />
          <Formula expr="HK = \text{Materialkosten} + \text{Fertigungskosten}" />
          <Formula expr="SK = HK + HK\cdot VwGK\% + HK\cdot VtGK\% + SEK_{Vt}" />
          <p className="text-xs text-muted-foreground">Toleranz pro Feld ±0,50&nbsp;€.</p>
        </div>
      }
      form={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schritt</TableHead>
                {params.produkte.map((p) => (
                  <TableHead key={p.name} className="text-right">{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {STEP_KEYS.map((step) => (
                <TableRow key={step}>
                  <TableCell className="align-top">{STEP_LABELS[step]}</TableCell>
                  {params.produkte.map((_, i) => {
                    const key = fieldKey(i, step);
                    return (
                      <TableCell key={key} className="p-1.5 align-top">
                        <FieldRow
                          id={key}
                          label=""
                          value={raw[key]}
                          onChange={setField(key)}
                          inputError={inputErrors[key]}
                          checkStatus={checkResult?.fields[key]}
                          format={eur}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<DiffZuschlagSolutionView solution={solution} />}
    />
  );
}

export function DiffZuschlagSolutionView({
  solution,
}: {
  solution: DiffZuschlagsSolution;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            {solution.produkte.map((p) => (
              <TableHead key={p.name} className="text-right">{p.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(["materialkosten", "fertigungskosten", "herstellkosten", "selbstkosten"] as const).map(
            (k) => (
              <TableRow key={k}>
                <TableCell>{STEP_LABELS[k]}</TableCell>
                {solution.produkte.map((p) => (
                  <TableCell key={p.name} className="text-right tabular-nums">
                    {eur(p[k])}
                  </TableCell>
                ))}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
