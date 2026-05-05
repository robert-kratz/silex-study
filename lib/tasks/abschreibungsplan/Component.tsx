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
import { Input } from "@/components/ui/input";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import {
  ABSCHREIBUNGS_METHODEN,
  METHODE_LABEL,
  type AbschreibungsMethode,
  type AbschreibungsplanParams,
} from "./generate";
import type { AbschreibungsplanSolution } from "./solve";
import {
  checkAbschreibungsplan,
  fieldKey,
  type AbschreibungsplanAnswer,
} from "./check";
import { buildAbschreibungsplanPrompt } from "./prompt";
import { validateAbschreibungsplanInput } from "./validate";

export function AbschreibungsplanComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<AbschreibungsplanParams, AbschreibungsplanSolution>) {
  const blank = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    ABSCHREIBUNGS_METHODEN.forEach((m) => {
      for (let t = 0; t < params.T; t++) o[fieldKey(m, t)] = "";
    });
    return o;
  }, [params.T]);

  const [raw, setRaw] = React.useState<Record<string, string>>(blank);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateAbschreibungsplanInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: AbschreibungsplanAnswer = {
      linear: [],
      geometrisch: [],
      arithmetisch: [],
      leistung: [],
    };
    ABSCHREIBUNGS_METHODEN.forEach((m) => {
      for (let t = 0; t < params.T; t++) {
        answer[m].push(parseLocaleNumber(raw[fieldKey(m, t)]));
      }
    });
    setCheckResult(checkAbschreibungsplan(solution, answer));
  };

  const onReset = () => {
    setRaw(blank);
    setInputErrors({});
    setCheckResult(null);
  };

  const setCell = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const total = params.leistung.reduce((a, b) => a + b, 0);

  return (
    <TaskShell
      courseId={courseId}
      taskKind="abschreibungsplan"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="AfA pro Verfahren und Jahr"
      description="Trage die Abschreibungsbeträge in die Tabelle ein."
      buildPromptText={() => buildAbschreibungsplanPrompt(params)}
      problem={
        <div className="space-y-2">
          <p>
            AW = <strong>{eur(params.AW)}</strong>, RW = <strong>{eur(params.RW)}</strong>, T = <strong>{params.T} Jahre</strong>, geom.-degr. Satz q = <strong>{fmt(params.q * 100)} %</strong>.
          </p>
          <p className="text-sm">
            Leistung pro Jahr:{" "}
            {params.leistung
              .map((l, i) => `t=${i + 1}: ${fmt(l)}`)
              .join(" · ")}{" "}
            (Σ = {fmt(total)}).
          </p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Abschreibungsplan: Verteilung des Werteverzehrs einer Anlage über die Nutzungsdauer. Je nach Verfahren werden gleiche, fallende oder leistungsabhängige Beiträge gebildet."
          variables={[
            { sym: "AW", desc: "Anschaffungswert der Anlage (€)" },
            { sym: "RW", desc: "Restwert am Ende der Nutzungsdauer (€)" },
            { sym: "T", desc: "Nutzungsdauer (Perioden)" },
            { sym: "BW_{t-1}", desc: "Buchwert am Ende der Vorperiode (€)" },
            { sym: "q", desc: "Konstanter Abschreibungssatz beim geometrisch-degressiven Verfahren" },
            { sym: "d", desc: "Degressionsbetrag beim arithmetisch-degressiven Verfahren" },
            { sym: "L_t", desc: "In Periode t erbrachte Leistung" },
            { sym: "\\text{AfA}_t", desc: "Abschreibungsbetrag der Periode t (€)" },
          ]}
          formulas={[
            { expr: "\\text{Linear: }\\;\\text{AfA} = \\dfrac{AW - RW}{T}", desc: "Linear: gleicher AfA-Betrag pro Periode – abschreibbarer Betrag durch Nutzungsdauer." },
            { expr: "\\text{Geom.-degr.: }\\;\\text{AfA}_t = q\\cdot BW_{t-1}", desc: "Geometrisch-degressiv: konstanter Prozentsatz auf den jeweiligen Buchwert; AfA-Betrag sinkt im Zeitverlauf." },
            { expr: "\\text{Arith.-degr.: }\\;d = \\dfrac{AW - RW}{\\sum_{i=1}^{T} i},\\; \\text{AfA}_t = (T - t + 1)\\cdot d", desc: "Arithmetisch-degressiv: konstanter Degressionsbetrag d, AfA fällt linear („Digitalmethode“)." },
            { expr: "\\text{Leistung: }\\;\\text{AfA}_t = \\dfrac{AW - RW}{\\text{Gesamtleistung}}\\cdot L_t", desc: "Leistungsabhängig: Wertminderung proportional zur tatsächlich erbrachten Leistung." },
          ]}
        />
      }
      form={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verfahren</TableHead>
                {Array.from({ length: params.T }, (_, t) => (
                  <TableHead key={t} className="text-right">
                    AfA Jahr {t + 1} (€)
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ABSCHREIBUNGS_METHODEN.map((m) => (
                <TableRow key={m}>
                  <TableCell className="font-medium">{METHODE_LABEL[m]}</TableCell>
                  {Array.from({ length: params.T }, (_, t) => {
                    const key = fieldKey(m, t);
                    const status = checkResult?.fields[key];
                    const inputErr = inputErrors[key];
                    return (
                      <TableCell key={t} className="p-1.5">
                        <Input
                          inputMode="decimal"
                          value={raw[key]}
                          onChange={setCell(key)}
                          className={cn(
                            "h-8 text-right text-sm tabular-nums",
                            inputErr && "border-destructive",
                            status?.ok && "border-success",
                            status &&
                              !status.ok &&
                              !inputErr &&
                              "border-destructive",
                          )}
                        />
                        {status && !status.ok && !inputErr && (
                          <p className="mt-0.5 text-[10px] text-destructive">
                            {eur(Number(status.expected))}
                          </p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-xs text-muted-foreground">
            Toleranz pro Zelle ±0,01 €.
          </p>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <AbschreibungsplanSolutionView params={params} solution={solution} />
      }
    />
  );
}

export function AbschreibungsplanSolutionView({
  params,
  solution,
}: {
  params: AbschreibungsplanParams;
  solution: AbschreibungsplanSolution;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Verfahren</TableHead>
            {Array.from({ length: params.T }, (_, t) => (
              <TableHead key={t} className="text-right">
                Jahr {t + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ABSCHREIBUNGS_METHODEN.map((m: AbschreibungsMethode) => (
            <TableRow key={m}>
              <TableCell>{METHODE_LABEL[m]}</TableCell>
              {solution.afa[m].map((v, i) => (
                <TableCell key={i} className="text-right tabular-nums">
                  {eur(v)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
