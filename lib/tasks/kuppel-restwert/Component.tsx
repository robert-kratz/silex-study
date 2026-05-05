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
import type { KuppelRestwertParams } from "./generate";
import type { KuppelRestwertSolution } from "./solve";
import {
  checkKuppelRestwert,
  type KuppelRestwertAnswer,
} from "./check";
import { buildKuppelRestwertPrompt } from "./prompt";
import { validateKuppelRestwertInput } from "./validate";

type Field = keyof KuppelRestwertAnswer;
const BLANK: Record<Field, string> = { kostendeckung: "", HK_HP: "", k_HP: "" };

export function KuppelRestwertComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<KuppelRestwertParams, KuppelRestwertSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateKuppelRestwertInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: KuppelRestwertAnswer = {
      kostendeckung: parseLocaleNumber(raw.kostendeckung),
      HK_HP: parseLocaleNumber(raw.HK_HP),
      k_HP: parseLocaleNumber(raw.k_HP),
    };
    setCheckResult(checkKuppelRestwert(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="kuppel-restwert"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Restwertmethode – Eingabe"
      description="Kostendeckungsanteil, HK Hauptprodukt und Stückkosten."
      buildPromptText={() => buildKuppelRestwertPrompt(params)}
      problem={
        <div className="space-y-2">
          <p className="text-sm">Kuppelkosten K = <strong>{eur(params.K)}</strong>.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead className="text-right">Menge</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead className="text-right">Direkte Kosten</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.produkte.map((x) => (
                <TableRow key={x.name}>
                  <TableCell className="font-medium">{x.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(x.menge)}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.preis)}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.direkt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Kuppelkalkulation – Restwertmethode: Erlöse der Nebenprodukte (abzüglich ihrer Direktkosten) verringern als „negative Kosten“ die Herstellkosten des Hauptprodukts."
          variables={[
            { sym: "K", desc: "Gesamte Kuppelkosten der Periode (€)" },
            { sym: "\\text{Erlös}_{NB}", desc: "Erlös des jeweiligen Nebenprodukts (€)" },
            { sym: "k_{direkt,NB}", desc: "Direkt zurechenbare Weiterverarbeitungs-/Vertriebskosten des Nebenprodukts (€)" },
            { sym: "k_{direkt,HP}", desc: "Direkt zurechenbare Kosten des Hauptprodukts (€)" },
            { sym: "HK_{HP}", desc: "Herstellkosten des Hauptprodukts insgesamt (€)" },
            { sym: "Menge_{HP}", desc: "Produzierte Menge des Hauptprodukts" },
            { sym: "k_{HP}", desc: "Stückkosten des Hauptprodukts (€/Stück)" },
          ]}
          formulas={[
            { expr: "\\text{Kostendeckung} = \\sum_{NB} (\\text{Erlös}_{NB} - k_{direkt,NB})", desc: "Beitrag aller Nebenprodukte zur Deckung der Kuppelkosten." },
            { expr: "HK_{HP} = K - \\text{Kostendeckung} + k_{direkt,HP}", desc: "Verbleibende Herstellkosten, die das Hauptprodukt zu tragen hat." },
            { expr: "k_{HP} = \\dfrac{HK_{HP}}{Menge_{HP}}", desc: "Stückkosten = Herstellkosten dividiert durch die Hauptproduktmenge." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldRow id="kostendeckung" label="Kostendeckungsanteil (€)"
            value={raw.kostendeckung} onChange={setField("kostendeckung")}
            inputError={inputErrors.kostendeckung}
            checkStatus={checkResult?.fields.kostendeckung} format={eur} />
          <FieldRow id="HK_HP" label="HK Hauptprodukt (€)"
            value={raw.HK_HP} onChange={setField("HK_HP")}
            inputError={inputErrors.HK_HP}
            checkStatus={checkResult?.fields.HK_HP} format={eur} />
          <FieldRow id="k_HP" label="Stückkosten Hauptprodukt (€)"
            value={raw.k_HP} onChange={setField("k_HP")}
            inputError={inputErrors.k_HP}
            checkStatus={checkResult?.fields.k_HP} format={eur} />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<KuppelRestwertSolutionView params={params} solution={solution} />}
    />
  );
}

export function KuppelRestwertSolutionView({
  params,
  solution,
}: {
  params: KuppelRestwertParams;
  solution: KuppelRestwertSolution;
}) {
  const HP = params.produkte[0];
  return (
    <div className="space-y-3 text-sm">
      <p>
        Kostendeckungsanteil =&nbsp;
        {params.produkte
          .slice(1)
          .map((x) => `(${fmt(x.menge)}·${eur(x.preis)} − ${eur(x.direkt)})`)
          .join(" + ")} = <strong>{eur(solution.kostendeckung)}</strong>.
      </p>
      <p>
        HK Hauptprodukt = {eur(params.K)} − {eur(solution.kostendeckung)} + {eur(HP.direkt)} =&nbsp;
        <strong>{eur(solution.HK_HP)}</strong>.
      </p>
      <p>
        Stückkosten Hauptprodukt = {eur(solution.HK_HP)} / {fmt(HP.menge)} =&nbsp;
        <strong>{eur(solution.k_HP)}</strong>.
      </p>
    </div>
  );
}
