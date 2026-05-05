"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { QuizParams, QuizSolution } from "./generate";
import { checkTheorieQuiz, type QuizAnswer } from "./check";
import { buildTheorieQuizPrompt } from "./prompt";
import { validateTheorieQuizInput } from "./validate";
import { getItem } from "./solve";

export function TheorieQuizComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<QuizParams, QuizSolution>) {
  const initial = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    params.itemIds.forEach((_, i) => (o[`q${i}`] = ""));
    return o;
  }, [params.itemIds]);

  const [raw, setRaw] = React.useState<Record<string, string>>(initial);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const handleSubmit = () => {
    const errs = validateTheorieQuizInput(raw, params);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: QuizAnswer = params.itemIds.map((_, i) => {
      const v = raw[`q${i}`];
      return v === "" ? null : Number(v);
    });
    setCheckResult(checkTheorieQuiz(solution, answer));
  };

  const handleReset = () => {
    setRaw(initial);
    setInputErrors({});
    setCheckResult(null);
  };

  const setAnswer = (qi: number, value: string) => {
    setRaw((s) => ({ ...s, [`q${qi}`]: value }));
    if (inputErrors[`q${qi}`]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[`q${qi}`];
        return n;
      });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="theorie-quiz"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Antworten markieren"
      description="Multiple-Choice-Fragen zur Theorie des internen Rechnungswesens."
      buildPromptText={() => buildTheorieQuizPrompt(params)}
      problem={
        <p>
          Beantworte die folgenden {params.itemIds.length} Multiple-Choice-Fragen.
          Pro Frage ist genau eine Antwort korrekt; nach dem Prüfen werden Erklärungen
          eingeblendet.
        </p>
      }
      form={
        <div className="space-y-6">
          {params.itemIds.map((id, qi) => {
            const item = getItem(id);
            const order = params.optionOrder[qi];
            const fieldErr = inputErrors[`q${qi}`];
            const status = checkResult?.fields[`q${qi}`];
            const selected = raw[`q${qi}`];
            return (
              <fieldset key={qi} className="space-y-2 rounded-lg border p-4">
                <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Frage {qi + 1} · {item.cluster}
                </legend>
                <p className="text-sm leading-relaxed">{item.question}</p>
                <div className="space-y-1.5">
                  {order.map((origIdx, j) => {
                    const optionValue = String(j);
                    const isCorrect = status && Number(optionValue) === status.expected;
                    const isSelectedWrong =
                      status && !status.ok && selected === optionValue;
                    return (
                      <label
                        key={j}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                          selected === optionValue && "border-primary bg-primary/5",
                          isCorrect && "border-success bg-success/5",
                          isSelectedWrong && "border-destructive bg-destructive/5",
                        )}
                      >
                        <input
                          type="radio"
                          className="mt-1"
                          name={`q${qi}`}
                          value={optionValue}
                          checked={selected === optionValue}
                          onChange={() => setAnswer(qi, optionValue)}
                        />
                        <span>
                          <span className="mr-1 font-medium">
                            {String.fromCharCode(65 + j)})
                          </span>
                          {item.options[origIdx]}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {fieldErr && <p className="text-xs text-destructive">{fieldErr}</p>}
                {status && (
                  <p
                    className={cn(
                      "text-xs",
                      status.ok ? "text-success" : "text-destructive",
                    )}
                  >
                    {status.ok ? "Korrekt." : "Falsch."} {item.explanation}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>
      }
      onSubmit={handleSubmit}
      onReset={handleReset}
      checkResult={checkResult}
      solutionView={<TheorieQuizSolutionView params={params} solution={solution} />}
    />
  );
}

export function TheorieQuizSolutionView({
  params,
  solution,
}: {
  params: QuizParams;
  solution: QuizSolution;
}) {
  return (
    <ol className="list-decimal space-y-3 pl-5 text-sm">
      {params.itemIds.map((id, qi) => {
        const item = getItem(id);
        const order = params.optionOrder[qi];
        const correctOptionIdx = solution.correctIndex[qi];
        return (
          <li key={qi} className="space-y-1">
            <p className="font-medium">{item.question}</p>
            <p>
              Korrekt: {String.fromCharCode(65 + correctOptionIdx)}){" "}
              {item.options[order[correctOptionIdx]]}
            </p>
            <p className="text-muted-foreground">{item.explanation}</p>
          </li>
        );
      })}
    </ol>
  );
}
