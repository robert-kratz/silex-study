"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CopyButton } from "@/components/copy-button";
import { CollapsibleCard } from "@/components/collapsible-card";
import { useTaskAttempts } from "@/lib/attempts";
import type { CheckResult } from "@/lib/tasks/types";

export interface TaskShellProps {
  courseId: string;
  taskKind: string;
  schemaVersion: number;
  seed: number;
  shareUrl: string;
  title: string;
  description: string;
  buildPromptText: () => string;
  problem: React.ReactNode;
  learnHelp?: React.ReactNode;
  form: React.ReactNode;
  onSubmit: () => void;
  onReset: () => void;
  checkResult: CheckResult | null;
  successMessage?: string;
  failureMessage?: string;
  solutionView: React.ReactNode;
}

export function TaskShell({
  courseId,
  taskKind,
  schemaVersion,
  seed,
  shareUrl,
  title,
  description,
  buildPromptText,
  problem,
  learnHelp,
  form,
  onSubmit,
  onReset,
  checkResult,
  successMessage,
  failureMessage,
  solutionView,
}: TaskShellProps) {
  const [showSolution, setShowSolution] = React.useState(false);
  const recordedFor = React.useRef<number | null>(null);

  const { record } = useTaskAttempts(courseId, taskKind);

  React.useEffect(() => {
    if (!checkResult) return;
    if (recordedFor.current === seed) return;
    recordedFor.current = seed;
    record({
      seed,
      v: schemaVersion,
      score: checkResult.score,
      max: checkResult.max,
      passed: checkResult.passed,
    });
  }, [checkResult, record, seed, schemaVersion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordedFor.current = null;
    onSubmit();
  };

  const handleReset = () => {
    setShowSolution(false);
    recordedFor.current = null;
    onReset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>Aufgabenstellung</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton
              text={buildPromptText}
              label="Aufgabe kopieren"
              copiedLabel="Aufgabe kopiert"
            />
            <CopyButton
              text={shareUrl}
              label="Link teilen"
              copiedLabel="Link kopiert"
              variant="ghost"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">{problem}</CardContent>
      </Card>

      {learnHelp && (
        <CollapsibleCard
          title="Lernhilfe"
          description="Relevante Formeln (zum Aufklappen)"
        >
          {learnHelp}
        </CollapsibleCard>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Komma oder Punkt als Dezimaltrennzeichen (z.&nbsp;B. 1.234,56).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {form}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button type="submit">Prüfen</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Zurücksetzen
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  window.location.href = window.location.pathname;
                }}
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

      {checkResult && (
        <Alert variant={checkResult.passed ? "success" : "destructive"}>
          <AlertTitle>
            {checkResult.passed
              ? `Alle ${checkResult.max} Punkte erreicht.`
              : `${checkResult.score} / ${checkResult.max} Felder korrekt.`}
          </AlertTitle>
          <AlertDescription>
            {checkResult.passed
              ? successMessage ??
                'Saubere Lösung. Klicke auf „Neue Aufgabe", um zu wiederholen.'
              : failureMessage ??
                "Vergleiche deine Eingaben mit den eingeblendeten Soll-Werten oder zeige die Musterlösung."}
          </AlertDescription>
        </Alert>
      )}

      {showSolution && (
        <Card>
          <CardHeader>
            <CardTitle>Musterlösung</CardTitle>
            <CardDescription>Schritte und Endergebnisse</CardDescription>
          </CardHeader>
          <CardContent>{solutionView}</CardContent>
        </Card>
      )}
    </div>
  );
}
