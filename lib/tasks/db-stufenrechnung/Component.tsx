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
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { DbStufenParams } from "./generate";
import type { DbStufenSolution } from "./solve";
import { checkDbStufen, type DbStufenAnswer } from "./check";
import { buildDbStufenPrompt } from "./prompt";
import { validateDbStufenInput } from "./validate";

const PRODUKTE = ["P1", "P2", "P3", "P4"] as const;
const GRUPPEN = ["G1", "G2"] as const;
const SPARTEN = ["S1", "S2"] as const;

const blank = (): Record<string, string> => {
  const o: Record<string, string> = { betriebserfolg: "", eliminieren: "" };
  for (const id of PRODUKTE) { o[`dbI_${id}`] = ""; o[`dbII_${id}`] = ""; }
  for (const id of GRUPPEN) o[`dbIII_${id}`] = "";
  for (const id of SPARTEN) o[`dbIV_${id}`] = "";
  return o;
};

export function DbStufenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<DbStufenParams, DbStufenSolution>) {
  const [raw, setRaw] = React.useState<Record<string, string>>(blank());
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateDbStufenInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: DbStufenAnswer = {
      produkt: Object.fromEntries(
        PRODUKTE.map((id) => [id, {
          dbI: parseLocaleNumber(raw[`dbI_${id}`]),
          dbII: parseLocaleNumber(raw[`dbII_${id}`]),
        }]),
      ),
      gruppe: Object.fromEntries(GRUPPEN.map((id) => [id, parseLocaleNumber(raw[`dbIII_${id}`])])),
      sparte: Object.fromEntries(SPARTEN.map((id) => [id, parseLocaleNumber(raw[`dbIV_${id}`])])),
      betriebserfolg: parseLocaleNumber(raw.betriebserfolg),
      eliminieren: raw.eliminieren,
    };
    setCheckResult(checkDbStufen(solution, ans));
  };

  const onReset = () => { setRaw(blank()); setInputErrors({}); setCheckResult(null); };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
  };

  const elimStatus = checkResult?.fields.eliminieren;
  const elimOptions = [
    ...params.sparten.flatMap((s) =>
      s.gruppen.flatMap((g) =>
        g.produkte.map((p) => ({ value: p.id, label: `${p.id} – ${p.name}` })),
      ),
    ),
    { value: "keines", label: "Keines (alle Produkte tragen positiv bei)" },
  ];

  return (
    <TaskShell
      courseId={courseId}
      taskKind="db-stufenrechnung"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Mehrstufige Deckungsbeitragsrechnung"
      description="Stufenweiser Abzug der Fixkostenblöcke und Sortimentsentscheidung."
      buildPromptText={() => buildDbStufenPrompt(params)}
      problem={
        <div className="space-y-3 text-sm">
          <p>Unternehmensfixkosten: <strong>{eur(params.unternehmenFix)}</strong></p>
          {params.sparten.map((s) => (
            <div key={s.id} className="space-y-2">
              <p className="font-medium">
                {s.name} – Sparten-Fix {eur(s.sparteFix)}
              </p>
              {s.gruppen.map((g) => (
                <div key={g.id} className="ml-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {g.name} – Gruppen-Fix {eur(g.pgFix)}
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produkt</TableHead>
                        <TableHead className="text-right">Preis</TableHead>
                        <TableHead className="text-right">Menge</TableHead>
                        <TableHead className="text-right">k_var</TableHead>
                        <TableHead className="text-right">Produktfix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {g.produkte.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.id} – {p.name}</TableCell>
                          <TableCell className="text-right tabular-nums">{eur(p.preis)}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmt(p.menge)}</TableCell>
                          <TableCell className="text-right tabular-nums">{eur(p.kVar)}</TableCell>
                          <TableCell className="text-right tabular-nums">{eur(p.produktFix)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          ))}
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Mehrstufige Deckungsbeitragsrechnung: Schrittweise werden Fixkostenblöcke abgezogen, die der jeweiligen Bezugsebene (Produkt, Produktgruppe, Sparte, Unternehmen) zugerechnet werden können. So bleibt sichtbar, welcher Bereich noch positiv beiträgt."
          variables={[
            { sym: "p, k_{var}, x", desc: "Preis, variable Stückkosten, Absatzmenge je Produkt" },
            { sym: "DB^I", desc: "Produkt-Deckungsbeitrag = Erlös minus variable Kosten (€)" },
            { sym: "K_{fix}^{Produkt}", desc: "Direkt einem Produkt zurechenbare Fixkosten (€)" },
            { sym: "DB^{II}", desc: "DB nach Abzug der produktfixen Kosten (€)" },
            { sym: "K_{fix}^{Produktgruppe}", desc: "Fixkosten einer Produktgruppe (€)" },
            { sym: "DB^{III}", desc: "DB nach Abzug produktgruppenfixer Kosten (€)" },
            { sym: "K_{fix}^{Sparte}", desc: "Spartenfixe Kosten (€)" },
            { sym: "DB^{IV}", desc: "DB nach Abzug spartenfixer Kosten (€)" },
            { sym: "K_{fix}^{Unternehmen}", desc: "Unternehmensfixe Kosten (€)" },
            { sym: "BE", desc: "Betriebsergebnis nach Abzug aller Fixkostenblöcke (€)" },
          ]}
          formulas={[
            { expr: "DB^I = (p - k_{var})\\cdot x", desc: "DB I je Produkt = Stückdeckungsbeitrag mal Absatzmenge." },
            { expr: "DB^{II} = DB^I - K_{fix}^{Produkt}", desc: "DB II: produktfixe Kosten abziehen – zeigt den Beitrag des Produkts." },
            { expr: "DB^{III} = \\sum DB^{II} - K_{fix}^{Produktgruppe}", desc: "DB III: Summe der DB II der Gruppe minus gruppenfixe Kosten." },
            { expr: "DB^{IV} = \\sum DB^{III} - K_{fix}^{Sparte}", desc: "DB IV: Summe der DB III der Sparte minus spartenfixe Kosten." },
            { expr: "BE = \\sum DB^{IV} - K_{fix}^{Unternehmen}", desc: "Betriebsergebnis: Summe aller Sparten-DB IV minus unternehmensfixe Kosten." },
          ]}
        />
      }
      form={
        <div className="space-y-4">
          {params.sparten.map((s) => (
            <fieldset key={s.id} className="space-y-3 rounded-lg border p-4">
              <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.name}
              </legend>
              {s.gruppen.map((g) => (
                <div key={g.id} className="space-y-2 rounded-md border p-3">
                  <p className="text-xs font-medium text-muted-foreground">{g.name}</p>
                  {g.produkte.map((p) => (
                    <div key={p.id} className="grid gap-3 sm:grid-cols-2">
                      <FieldRow id={`dbI_${p.id}`} label={`DB I (${p.id})`}
                        value={raw[`dbI_${p.id}`]} onChange={setField(`dbI_${p.id}`)}
                        inputError={inputErrors[`dbI_${p.id}`]}
                        checkStatus={checkResult?.fields[`dbI_${p.id}`]} format={eur} />
                      <FieldRow id={`dbII_${p.id}`} label={`DB II (${p.id})`}
                        value={raw[`dbII_${p.id}`]} onChange={setField(`dbII_${p.id}`)}
                        inputError={inputErrors[`dbII_${p.id}`]}
                        checkStatus={checkResult?.fields[`dbII_${p.id}`]} format={eur} />
                    </div>
                  ))}
                  <FieldRow id={`dbIII_${g.id}`} label={`DB III (${g.id})`}
                    value={raw[`dbIII_${g.id}`]} onChange={setField(`dbIII_${g.id}`)}
                    inputError={inputErrors[`dbIII_${g.id}`]}
                    checkStatus={checkResult?.fields[`dbIII_${g.id}`]} format={eur} />
                </div>
              ))}
              <FieldRow id={`dbIV_${s.id}`} label={`DB IV (${s.id})`}
                value={raw[`dbIV_${s.id}`]} onChange={setField(`dbIV_${s.id}`)}
                inputError={inputErrors[`dbIV_${s.id}`]}
                checkStatus={checkResult?.fields[`dbIV_${s.id}`]} format={eur} />
            </fieldset>
          ))}
          <FieldRow id="betriebserfolg" label="Betriebserfolg (€)"
            value={raw.betriebserfolg} onChange={setField("betriebserfolg")}
            inputError={inputErrors.betriebserfolg}
            checkStatus={checkResult?.fields.betriebserfolg} format={eur} />
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sortimentsentscheidung – Welches Produkt sofort eliminieren?
            </legend>
            <div className="space-y-1.5">
              {elimOptions.map((u) => {
                const isCorrect = elimStatus && u.value === elimStatus.expected;
                const isWrongPick = elimStatus && !elimStatus.ok && raw.eliminieren === u.value;
                return (
                  <label key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.eliminieren === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}>
                    <input type="radio" className="mt-1" name="eliminieren" value={u.value}
                      checked={raw.eliminieren === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, eliminieren: u.value }));
                        if (inputErrors.eliminieren) setInputErrors((s) => { const n = { ...s }; delete n.eliminieren; return n; });
                      }} />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.eliminieren && (
                <p className="text-xs text-destructive">{inputErrors.eliminieren}</p>
              )}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<DbStufenSolutionView params={params} solution={solution} />}
    />
  );
}

export function DbStufenSolutionView({
  params,
  solution,
}: {
  params: DbStufenParams;
  solution: DbStufenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      {params.sparten.map((s) => (
        <div key={s.id} className="space-y-1">
          <p className="font-medium">
            {s.name}: DB IV = <strong>{eur(solution.sparte[s.id])}</strong>
          </p>
          {s.gruppen.map((g) => (
            <div key={g.id} className="ml-4">
              <p>
                {g.name}: DB III = <strong>{eur(solution.gruppe[g.id])}</strong>
              </p>
              {g.produkte.map((p) => (
                <p key={p.id} className="ml-4">
                  {p.id}: DB I = {eur(solution.produkt[p.id].dbI)}, DB II = {eur(solution.produkt[p.id].dbII)}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
      <p>Betriebserfolg = <strong>{eur(solution.betriebserfolg)}</strong></p>
      <p>
        Sortimentsentscheidung:&nbsp;
        {solution.eliminieren === "keines"
          ? <>Alle Produkte tragen positiv bei – <strong>keines</strong> eliminieren.</>
          : <>Produkt <strong>{solution.eliminieren}</strong> hat einen negativen DB I und sollte eliminiert werden.</>}
      </p>
    </div>
  );
}
