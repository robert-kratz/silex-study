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
import { Formula } from "@/components/Formula";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { MaterialbewertungParams } from "./generate";
import type { MaterialbewertungSolution } from "./solve";
import {
  checkMaterialbewertung,
  type MaterialbewertungAnswer,
} from "./check";
import { buildMaterialbewertungPrompt } from "./prompt";
import { validateMaterialbewertungInput } from "./validate";

type Field = keyof MaterialbewertungAnswer;
const BLANK: Record<Field, string> = {
  fifoVerbrauch: "",
  fifoEndbestand: "",
  lifoVerbrauch: "",
  lifoEndbestand: "",
  avgPeriodVerbrauch: "",
  avgPeriodEndbestand: "",
  avgGleitendVerbrauch: "",
  avgGleitendEndbestand: "",
};

type Variante = "fifo-lifo" | "durchschnitt";

export function MaterialbewertungComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<MaterialbewertungParams, MaterialbewertungSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);
  const [variante, setVariante] = React.useState<Variante>("fifo-lifo");

  const onSubmit = () => {
    const errs = validateMaterialbewertungInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: MaterialbewertungAnswer = {
      fifoVerbrauch: parseLocaleNumber(raw.fifoVerbrauch),
      fifoEndbestand: parseLocaleNumber(raw.fifoEndbestand),
      lifoVerbrauch: parseLocaleNumber(raw.lifoVerbrauch),
      lifoEndbestand: parseLocaleNumber(raw.lifoEndbestand),
      avgPeriodVerbrauch: parseLocaleNumber(raw.avgPeriodVerbrauch),
      avgPeriodEndbestand: parseLocaleNumber(raw.avgPeriodEndbestand),
      avgGleitendVerbrauch: parseLocaleNumber(raw.avgGleitendVerbrauch),
      avgGleitendEndbestand: parseLocaleNumber(raw.avgGleitendEndbestand),
    };
    setCheckResult(checkMaterialbewertung(solution, ans));
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
      taskKind="materialbewertung"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Verbrauch und Endbestand"
      description="Materialbewertung mit FIFO, permanentem LIFO sowie nachträglichem und gleitendem Durchschnittspreis."
      buildPromptText={() => buildMaterialbewertungPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Vorgang</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead className="text-right">Preis (€/St.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.buchungen.map((b, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {b.type === "AB"
                    ? "Anfangsbestand"
                    : b.type === "Z"
                      ? "Zugang"
                      : "Abgang"}
                </TableCell>
                <TableCell className="text-right tabular-nums">{fmt(b.menge)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {b.type === "A" ? "—" : eur(b.preis)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      learnHelp={
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>FIFO: ältester Bestand zuerst verbraucht; Endbestand mit jüngsten Preisen bewertet.</li>
          <li>Permanentes LIFO: pro Abgang den jüngsten verfügbaren Bestand verbrauchen.</li>
          <li>Nachträglicher ∅-Preis: ein einziger Periodendurchschnitt bewertet alle Abgänge.</li>
          <li>Gleitender ∅-Preis: nach jedem Zugang neu rechnen; Abgänge mit dem zuvor gültigen Preis.</li>
          <li>
            Kontrolle:
            <Formula expr="\text{Verbrauch} + \text{Endbestand} = \sum \text{Zugänge (inkl. AB)}" />
          </li>
        </ul>
      }
      form={
        <div className="space-y-4">
          <div role="tablist" aria-label="Verfahren wählen" className="flex flex-wrap gap-2">
            {(
              [
                { v: "fifo-lifo", label: "FIFO / LIFO" },
                { v: "durchschnitt", label: "Durchschnittsverfahren" },
              ] as { v: Variante; label: string }[]
            ).map((t) => (
              <button
                key={t.v}
                role="tab"
                type="button"
                aria-selected={variante === t.v}
                onClick={() => setVariante(t.v)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  variante === t.v
                    ? "border-primary bg-primary/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Felder beider Reiter werden gemeinsam ausgewertet. Toleranz Durchschnittsverfahren ±1,50&nbsp;€
            (Rundung des Durchschnittspreises).
          </p>
          {variante === "fifo-lifo" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow
                id="fifoVerbrauch"
                label="Verbrauchswert FIFO (€)"
                value={raw.fifoVerbrauch}
                onChange={setField("fifoVerbrauch")}
                inputError={inputErrors.fifoVerbrauch}
                checkStatus={checkResult?.fields.fifoVerbrauch}
                format={eur}
              />
              <FieldRow
                id="fifoEndbestand"
                label="Endbestand FIFO (€)"
                value={raw.fifoEndbestand}
                onChange={setField("fifoEndbestand")}
                inputError={inputErrors.fifoEndbestand}
                checkStatus={checkResult?.fields.fifoEndbestand}
                format={eur}
              />
              <FieldRow
                id="lifoVerbrauch"
                label="Verbrauchswert LIFO (€)"
                value={raw.lifoVerbrauch}
                onChange={setField("lifoVerbrauch")}
                inputError={inputErrors.lifoVerbrauch}
                checkStatus={checkResult?.fields.lifoVerbrauch}
                format={eur}
              />
              <FieldRow
                id="lifoEndbestand"
                label="Endbestand LIFO (€)"
                value={raw.lifoEndbestand}
                onChange={setField("lifoEndbestand")}
                inputError={inputErrors.lifoEndbestand}
                checkStatus={checkResult?.fields.lifoEndbestand}
                format={eur}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow
                id="avgPeriodVerbrauch"
                label="Verbrauchswert ∅ nachträglich (€)"
                value={raw.avgPeriodVerbrauch}
                onChange={setField("avgPeriodVerbrauch")}
                inputError={inputErrors.avgPeriodVerbrauch}
                checkStatus={checkResult?.fields.avgPeriodVerbrauch}
                format={eur}
              />
              <FieldRow
                id="avgPeriodEndbestand"
                label="Endbestand ∅ nachträglich (€)"
                value={raw.avgPeriodEndbestand}
                onChange={setField("avgPeriodEndbestand")}
                inputError={inputErrors.avgPeriodEndbestand}
                checkStatus={checkResult?.fields.avgPeriodEndbestand}
                format={eur}
              />
              <FieldRow
                id="avgGleitendVerbrauch"
                label="Verbrauchswert ∅ gleitend (€)"
                value={raw.avgGleitendVerbrauch}
                onChange={setField("avgGleitendVerbrauch")}
                inputError={inputErrors.avgGleitendVerbrauch}
                checkStatus={checkResult?.fields.avgGleitendVerbrauch}
                format={eur}
              />
              <FieldRow
                id="avgGleitendEndbestand"
                label="Endbestand ∅ gleitend (€)"
                value={raw.avgGleitendEndbestand}
                onChange={setField("avgGleitendEndbestand")}
                inputError={inputErrors.avgGleitendEndbestand}
                checkStatus={checkResult?.fields.avgGleitendEndbestand}
                format={eur}
              />
            </div>
          )}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <MaterialbewertungSolutionView solution={solution} />
      }
    />
  );
}

export function MaterialbewertungSolutionView({
  solution,
}: {
  solution: MaterialbewertungSolution;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Verfahren</TableHead>
          <TableHead className="text-right">Verbrauchswert</TableHead>
          <TableHead className="text-right">Endbestand</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>FIFO</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.fifoVerbrauch)}</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.fifoEndbestand)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>LIFO (permanent)</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.lifoVerbrauch)}</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.lifoEndbestand)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>∅ nachträglich (periodisch)</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.avgPeriodVerbrauch)}</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.avgPeriodEndbestand)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>∅ gleitend (permanent)</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.avgGleitendVerbrauch)}</TableCell>
          <TableCell className="text-right tabular-nums">{eur(solution.avgGleitendEndbestand)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
