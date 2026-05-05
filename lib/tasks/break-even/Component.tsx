"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import { CollapsibleCard } from "@/components/collapsible-card";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { Formula } from "@/components/Formula";
import { useTaskAttempts } from "@/lib/attempts";
import { cn } from "@/lib/utils";
import type { TaskComponentProps } from "@/lib/tasks/types";
import type { BreakEvenParams, BreakEvenSolution } from "./generate";
import { checkBreakEven, type BreakEvenAnswer } from "./check";
import { buildBreakEvenPrompt } from "./prompt";
import { validateBreakEvenInput } from "./validate";

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
const currencyFormat = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
const fmt = (n: number) => numberFormat.format(n);
const eur = (n: number) => currencyFormat.format(n);

function parseLocaleNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, "").replace(/\./g, "").replace(",", ".");
  if (cleaned === "") return null;
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : Number.NaN;
}

type FieldKey = keyof BreakEvenAnswer;
const BLANK: Record<FieldKey, string> = { d: "", xb: "", Ub: "", xZG: "" };

export function BreakEvenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<BreakEvenParams, BreakEvenSolution>) {
  const [raw, setRaw] = React.useState<Record<FieldKey, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  const recordedFor = React.useRef<number | null>(null);

  const { record } = useTaskAttempts(courseId, "break-even");

  const parsed: BreakEvenAnswer = React.useMemo(
    () => ({
      d: parseLocaleNumber(raw.d),
      xb: parseLocaleNumber(raw.xb),
      Ub: parseLocaleNumber(raw.Ub),
      xZG: parseLocaleNumber(raw.xZG),
    }),
    [raw],
  );

  const checkResult = React.useMemo(
    () => (submitted ? checkBreakEven(solution, parsed) : null),
    [submitted, parsed, solution],
  );

  React.useEffect(() => {
    if (!checkResult) return;
    if (recordedFor.current === seed) return;
    recordedFor.current = seed;
    record({
      seed,
      v: 1,
      score: checkResult.score,
      max: checkResult.max,
      passed: checkResult.passed,
    });
  }, [checkResult, record, seed]);

  const setField = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [key]: e.target.value }));
    // Clear per-field validation error as soon as the user edits.
    if (inputErrors[key]) {
      setInputErrors((s) => { const n = { ...s }; delete n[key]; return n; });
    }
  };

  const onBlur = (key: FieldKey) => () => {
    const errs = validateBreakEvenInput(raw as Record<string, string>);
    if (errs[key]) setInputErrors((s) => ({ ...s, [key]: errs[key] }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateBreakEvenInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<FieldKey, string>>);
    if (Object.keys(errs).length > 0) return; // abort if format invalid
    recordedFor.current = null;
    setSubmitted(true);
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setSubmitted(false);
    setShowSolution(false);
    recordedFor.current = null;
  };

  return (
    <div className="space-y-6">
      {/* Aufgabenstellung */}
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>Aufgabenstellung</CardTitle>
            <CardDescription>Einprodukt-Break-Even-Analyse mit Zielgewinn.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton
              text={() => buildBreakEvenPrompt(params)}
              label="Aufgabe kopieren"
              copiedLabel="Aufgabe kopiert"
            />
            <CopyButton text={shareUrl} label="Link teilen" copiedLabel="Link kopiert" variant="ghost" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            Ein Unternehmen produziert ein einzelnes Produkt. Bestimme den
            Stückdeckungsbeitrag, die Break-Even-Menge, den Break-Even-Umsatz
            sowie die Menge zur Erreichung des Zielgewinns.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Größe</TableHead>
                <TableHead className="text-right">Wert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Verkaufspreis pro Stück (p)</TableCell>
                <TableCell className="text-right tabular-nums">{eur(params.p)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Variable Stückkosten (kᵥ)</TableCell>
                <TableCell className="text-right tabular-nums">{eur(params.kv)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Periodische Fixkosten (K_f)</TableCell>
                <TableCell className="text-right tabular-nums">{eur(params.Kf)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Zielgewinn (ZG)</TableCell>
                <TableCell className="text-right tabular-nums">{eur(params.ZG)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lernhilfe (zugeklappt) */}
      <CollapsibleCard title="Lernhilfe" description="Variablen, Formeln & Bedeutung (zum Aufklappen)">
        <LearnLegend
          intro="Break-Even-Analyse für ein Einprodukt-Unternehmen: Ab welcher Menge deckt der Umsatz die Gesamtkosten? Wie viele Stücke sind nötig, um zusätzlich einen Zielgewinn zu erreichen?"
          variables={[
            { sym: "p", desc: "Verkaufspreis pro Stück (€)" },
            { sym: "k_v", desc: "Variable Stückkosten (€/Stück)" },
            { sym: "d", desc: "Stückdeckungsbeitrag = p − k_v (€/Stück)" },
            { sym: "K_f", desc: "Periodische Fixkosten (€)" },
            { sym: "x_b", desc: "Break-Even-Menge – Gewinnschwelle (Stück)" },
            { sym: "U_b", desc: "Break-Even-Umsatz (€)" },
            { sym: "ZG", desc: "Zielgewinn der Periode (€)" },
            { sym: "x_{ZG}", desc: "Menge zur Erreichung des Zielgewinns (Stück)" },
          ]}
          formulas={[
            { expr: "d = p - k_v", desc: "Stückdeckungsbeitrag: Beitrag, den jedes verkaufte Stück zur Deckung der Fixkosten leistet." },
            { expr: "x_b = \\frac{K_f}{d}", desc: "Break-Even-Menge: ab dieser Menge sind alle Fixkosten gedeckt." },
            { expr: "U_b = x_b \\cdot p", desc: "Break-Even-Umsatz: Umsatz an der Gewinnschwelle." },
            { expr: "x_{ZG} = \\frac{K_f + ZG}{d}", desc: "Zielmenge: Fixkosten plus Zielgewinn werden gemeinsam durch den Stückdeckungsbeitrag gedeckt." },
          ]}
        />
      </CollapsibleCard>

      {/* Eingabeformular */}
      <Card>
        <CardHeader>
          <CardTitle>Lösung eingeben</CardTitle>
          <CardDescription>Komma oder Punkt als Dezimaltrennzeichen (z. B. 1.234,56).</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
            <FieldRow
              id="d"
              label="Stückdeckungsbeitrag d (€/Stück)"
              value={raw.d}
              onChange={setField("d")}
              onBlur={onBlur("d")}
              inputError={inputErrors.d}
              checkStatus={checkResult?.fields.d}
              format={eur}
            />
            <FieldRow
              id="xb"
              label="Break-Even-Menge xᵦ (Stück)"
              value={raw.xb}
              onChange={setField("xb")}
              onBlur={onBlur("xb")}
              inputError={inputErrors.xb}
              checkStatus={checkResult?.fields.xb}
              format={(n) => `${fmt(n)} Stück`}
            />
            <FieldRow
              id="Ub"
              label="Break-Even-Umsatz Uᵦ (€)"
              value={raw.Ub}
              onChange={setField("Ub")}
              onBlur={onBlur("Ub")}
              inputError={inputErrors.Ub}
              checkStatus={checkResult?.fields.Ub}
              format={eur}
            />
            <FieldRow
              id="xZG"
              label="Menge für Zielgewinn x_ZG (Stück)"
              value={raw.xZG}
              onChange={setField("xZG")}
              onBlur={onBlur("xZG")}
              inputError={inputErrors.xZG}
              checkStatus={checkResult?.fields.xZG}
              format={(n) => `${fmt(n)} Stück`}
            />

            <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-2">
              <Button type="submit">Prüfen</Button>
              <Button type="button" variant="outline" onClick={onReset}>Zurücksetzen</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => { window.location.href = window.location.pathname; }}
              >
                Neue Aufgabe
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowSolution((s) => !s)}
              >
                {showSolution ? "Lösung verbergen" : "Lösung anzeigen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Ergebnis-Alert */}
      {checkResult && (
        <Alert variant={checkResult.passed ? "success" : "destructive"}>
          <AlertTitle>
            {checkResult.passed
              ? `Alle ${checkResult.max} Punkte erreicht.`
              : `${checkResult.score} / ${checkResult.max} Felder korrekt.`}
          </AlertTitle>
          <AlertDescription>
            {checkResult.passed
              ? 'Saubere Lösung. Klicke auf „Neue Aufgabe", um zu wiederholen.'
              : "Vergleiche deine Eingaben mit den eingeblendeten Soll-Werten oder zeige die Musterlösung."}
          </AlertDescription>
        </Alert>
      )}

      {/* Musterlösung */}
      {showSolution && (
        <Card>
          <CardHeader>
            <CardTitle>Musterlösung</CardTitle>
            <CardDescription>Schritte und Endergebnisse</CardDescription>
          </CardHeader>
          <CardContent>
            <BreakEvenSolutionView params={params} solution={solution} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ────────────── Shared sub-components ────────────── */

interface FieldRowProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  /** Zod format error shown before submission. */
  inputError?: string;
  /** Check result after submission. */
  checkStatus?: { ok: boolean; expected: number | string; given: number | string | null };
  format: (n: number) => string;
}

function FieldRow({
  id,
  label,
  value,
  onChange,
  onBlur,
  inputError,
  checkStatus,
  format,
}: FieldRowProps) {
  // inputError (format) takes precedence; checkStatus shown only when no format error.
  const showInputError = !!inputError;
  const showCheckOk = !showInputError && !!checkStatus?.ok;
  const showCheckErr = !showInputError && !!checkStatus && !checkStatus.ok;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
        aria-invalid={showInputError || showCheckErr}
        className={cn(
          showInputError && "border-destructive focus-visible:ring-destructive",
          showCheckOk && "border-success focus-visible:ring-success",
          showCheckErr && "border-destructive focus-visible:ring-destructive",
        )}
      />
      {showInputError && (
        <p className="text-xs text-destructive">{inputError}</p>
      )}
      {showCheckErr && (
        <p className="text-xs text-destructive">
          Korrekt wäre:{" "}
          <span className="font-medium">
            {typeof checkStatus!.expected === "number"
              ? format(checkStatus!.expected)
              : checkStatus!.expected}
          </span>
        </p>
      )}
      {showCheckOk && (
        <p className="text-xs text-success">Korrekt.</p>
      )}
    </div>
  );
}

export function BreakEvenSolutionView({
  params,
  solution,
}: {
  params: BreakEvenParams;
  solution: BreakEvenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula expr={`d = ${params.p} - ${params.kv} = ${solution.d}`} />
      <Formula expr={`x_b = \\frac{${params.Kf}}{${solution.d}} = ${solution.xb}`} />
      <Formula expr={`U_b = ${solution.xb} \\cdot ${params.p} = ${solution.Ub}`} />
      <Formula
        expr={`x_{ZG} = \\frac{${params.Kf} + ${params.ZG}}{${solution.d}} = ${solution.xZG}`}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Größe</TableHead>
            <TableHead className="text-right">Lösung</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Stückdeckungsbeitrag d</TableCell>
            <TableCell className="text-right tabular-nums">{eur(solution.d)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Break-Even-Menge xᵦ</TableCell>
            <TableCell className="text-right tabular-nums">{fmt(solution.xb)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Break-Even-Umsatz Uᵦ</TableCell>
            <TableCell className="text-right tabular-nums">{eur(solution.Ub)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Menge für Zielgewinn x_ZG</TableCell>
            <TableCell className="text-right tabular-nums">{fmt(solution.xZG)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
