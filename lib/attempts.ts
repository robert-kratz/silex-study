"use client";

import { useCallback, useEffect, useState } from "react";

export interface TaskAttempt {
  /** Seed of the attempted task instance. */
  seed: number;
  /** Schema version when the attempt was recorded. */
  v: number;
  /** Total checked fields. */
  max: number;
  /** Correct fields. */
  score: number;
  /** Whether the entire task was solved. */
  passed: boolean;
  /** Whether this attempt was skipped in learn mode. */
  skipped?: boolean;
  /** Unix ms timestamp. */
  ts: number;
}

const KEY_PREFIX = "silex-study:attempts";

function storageKey(courseId: string, taskKind: string): string {
  return `${KEY_PREFIX}:${courseId}:${taskKind}`;
}

function safeRead(key: string): TaskAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is TaskAttempt =>
        a &&
        typeof a.seed === "number" &&
        typeof a.score === "number" &&
        typeof a.max === "number" &&
        typeof a.passed === "boolean" &&
        (a.skipped === undefined || typeof a.skipped === "boolean") &&
        typeof a.ts === "number",
    );
  } catch {
    return [];
  }
}

function safeWrite(key: string, value: TaskAttempt[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {
    // ignore quota / privacy errors
  }
}

export interface AttemptStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  successRate: number; // 0..100
  failedRate: number; // 0..100
  skippedRate: number; // 0..100
  scoreRate: number; // 0..100, fraction of correct fields across attempts
  lastAttempt?: TaskAttempt;
}

export function summarize(attempts: TaskAttempt[]): AttemptStats {
  if (attempts.length === 0) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      successRate: 0,
      failedRate: 0,
      skippedRate: 0,
      scoreRate: 0,
    };
  }
  const skipped = attempts.filter((a) => a.skipped).length;
  const passed = attempts.filter((a) => a.passed && !a.skipped).length;
  const failed = attempts.length - passed - skipped;
  const totalScore = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalMax = attempts.reduce((acc, a) => acc + a.max, 0);
  const last = attempts.reduce((a, b) => (a.ts > b.ts ? a : b));
  return {
    total: attempts.length,
    passed,
    failed,
    skipped,
    successRate: Math.round((passed / attempts.length) * 100),
    failedRate: Math.round((failed / attempts.length) * 100),
    skippedRate: Math.round((skipped / attempts.length) * 100),
    scoreRate: totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 100),
    lastAttempt: last,
  };
}

export function readAttempts(courseId: string, taskKind: string): TaskAttempt[] {
  return safeRead(storageKey(courseId, taskKind));
}

export function recordTaskAttempt(
  courseId: string,
  taskKind: string,
  attempt: Omit<TaskAttempt, "ts">,
): TaskAttempt[] {
  const key = storageKey(courseId, taskKind);
  const next: TaskAttempt = { ...attempt, ts: Date.now() };
  const list = [...safeRead(key), next].slice(-200);
  safeWrite(key, list);
  return list;
}

export function useTaskAttempts(courseId: string, taskKind: string) {
  const key = storageKey(courseId, taskKind);
  const [attempts, setAttempts] = useState<TaskAttempt[]>([]);

  useEffect(() => {
    setAttempts(safeRead(key));
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key !== key) return;
      setAttempts(safeRead(key));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const record = useCallback(
    (attempt: Omit<TaskAttempt, "ts">) => {
      const list = recordTaskAttempt(courseId, taskKind, attempt);
      setAttempts(list);
    },
    [courseId, taskKind],
  );

  const reset = useCallback(() => {
    safeWrite(key, []);
    setAttempts([]);
  }, [key]);

  return { attempts, record, reset, stats: summarize(attempts) };
}
