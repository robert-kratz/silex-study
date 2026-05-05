"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Spaced-repetition state for a single card (= one task kind).
 * SM-2 inspired: ease factor + interval (in days) + repetition count.
 */
export interface SRSCardState {
  /** Task kind acts as the card identifier within a course. */
  taskKind: string;
  /** Current interval in days. 0 = not yet studied. */
  interval: number;
  /** Successful review streak (resets to 0 on "Nochmal"). */
  repetitions: number;
  /** SM-2 ease factor (>= 1.3). */
  easeFactor: number;
  /** Unix ms when the card becomes due. 0 = due immediately (new). */
  nextDue: number;
  /** Unix ms of last review (undefined = never reviewed). */
  lastReviewed?: number;
  /** True until the card has been reviewed at least once. */
  newCard: boolean;
}

/** SRS rating: 0=Nochmal, 3=Gut, 5=Einfach. */
export type SRSRating = 0 | 3 | 5;

export interface SRSStats {
  total: number;
  newCards: number;
  due: number;
  learning: number;
  mastered: number;
  newToday: number;
}

const KEY_PREFIX = "silex-study:srs";
const SETTINGS_KEY_PREFIX = "silex-study:srs-settings";
const DAY_MS = 86_400_000;
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

/** Default and minimum/maximum bounds for the daily new-card goal. */
export const DEFAULT_MAX_NEW_PER_DAY = 10;
export const MIN_MAX_NEW_PER_DAY = 1;
export const MAX_MAX_NEW_PER_DAY = 100;

/** A card is "mastered" once interval reaches this many days. */
const MASTERED_INTERVAL = 21;

function storageKey(courseId: string): string {
  return `${KEY_PREFIX}:${courseId}`;
}

function settingsKey(courseId: string): string {
  return `${SETTINGS_KEY_PREFIX}:${courseId}`;
}

/** Read the per-course daily new-card goal from localStorage. */
export function readDailyGoal(courseId: string): number {
  if (typeof window === "undefined") return DEFAULT_MAX_NEW_PER_DAY;
  try {
    const raw = window.localStorage.getItem(settingsKey(courseId));
    if (!raw) return DEFAULT_MAX_NEW_PER_DAY;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.maxNewPerDay === "number" && parsed.maxNewPerDay >= MIN_MAX_NEW_PER_DAY) {
      return Math.min(parsed.maxNewPerDay, MAX_MAX_NEW_PER_DAY);
    }
  } catch {
    // ignore
  }
  return DEFAULT_MAX_NEW_PER_DAY;
}

/** Persist the per-course daily new-card goal. */
export function writeDailyGoal(courseId: string, maxNewPerDay: number): void {
  if (typeof window === "undefined") return;
  const key = settingsKey(courseId);
  try {
    window.localStorage.setItem(key, JSON.stringify({ maxNewPerDay }));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {
    // ignore
  }
}

function isCardState(x: unknown): x is SRSCardState {
  if (!x || typeof x !== "object") return false;
  const c = x as Record<string, unknown>;
  return (
    typeof c.taskKind === "string" &&
    typeof c.interval === "number" &&
    typeof c.repetitions === "number" &&
    typeof c.easeFactor === "number" &&
    typeof c.nextDue === "number" &&
    typeof c.newCard === "boolean"
  );
}

function safeReadRaw(key: string): SRSCardState[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCardState);
  } catch {
    return [];
  }
}

function safeWrite(key: string, value: SRSCardState[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {
    // ignore quota / privacy errors
  }
}

function makeNewCard(taskKind: string): SRSCardState {
  return {
    taskKind,
    interval: 0,
    repetitions: 0,
    easeFactor: DEFAULT_EASE,
    nextDue: 0,
    newCard: true,
  };
}

/** Read SRS state and ensure every taskKind has a card (new ones added). */
export function readSRSState(
  courseId: string,
  taskKinds: readonly string[],
): SRSCardState[] {
  const stored = safeReadRaw(storageKey(courseId));
  const byKind = new Map(stored.map((c) => [c.taskKind, c]));
  const merged: SRSCardState[] = [];
  for (const kind of taskKinds) {
    merged.push(byKind.get(kind) ?? makeNewCard(kind));
  }
  return merged;
}

/** Persist SRS state for a course. */
export function writeSRSState(
  courseId: string,
  cards: SRSCardState[],
): void {
  safeWrite(storageKey(courseId), cards);
}

/** Apply SM-2 update to a single card given the rating. Returns new state. */
export function applyRating(
  card: SRSCardState,
  rating: SRSRating,
  now: number = Date.now(),
): SRSCardState {
  let { interval, repetitions, easeFactor } = card;

  if (rating === 0) {
    // Lapse: reset repetitions, due tomorrow.
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
  } else if (rating === 3) {
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.14);
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.max(1, Math.round(interval * easeFactor));
    repetitions += 1;
  } else {
    // rating === 5 (Einfach)
    easeFactor = easeFactor + 0.1;
    if (repetitions === 0) interval = 4;
    else if (repetitions === 1) interval = 9;
    else interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
    repetitions += 1;
  }

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    lastReviewed: now,
    nextDue: now + interval * DAY_MS,
    newCard: false,
  };
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Build summary statistics for the dashboard. */
export function summarizeSRS(
  cards: readonly SRSCardState[],
  now: number = Date.now(),
): SRSStats {
  const dayStart = startOfDay(now);
  let newCards = 0;
  let due = 0;
  let learning = 0;
  let mastered = 0;
  let newToday = 0;
  for (const c of cards) {
    if (c.newCard) {
      newCards += 1;
      continue;
    }
    if (c.nextDue <= now) due += 1;
    if (c.interval >= MASTERED_INTERVAL) mastered += 1;
    else learning += 1;
    if (c.lastReviewed && c.lastReviewed >= dayStart && c.repetitions === 1) {
      // Card had its first successful review today → counts as a new card consumed.
      newToday += 1;
    }
  }
  return {
    total: cards.length,
    newCards,
    due,
    learning,
    mastered,
    newToday,
  };
}

/**
 * Build today's session queue:
 *   1. All due reviews (ordered by nextDue).
 *   2. Up to (maxNewPerDay − newToday) brand-new cards.
 */
export function buildSession(
  cards: readonly SRSCardState[],
  now: number = Date.now(),
  maxNewPerDay: number = DEFAULT_MAX_NEW_PER_DAY,
): SRSCardState[] {
  const stats = summarizeSRS(cards, now);
  const due = cards
    .filter((c) => !c.newCard && c.nextDue <= now)
    .slice()
    .sort((a, b) => a.nextDue - b.nextDue);
  const remainingNewSlots = Math.max(0, maxNewPerDay - stats.newToday);
  const newCards = cards
    .filter((c) => c.newCard)
    .slice(0, remainingNewSlots);
  return [...due, ...newCards];
}

/** Suggest a rating from an automated check result. */
export function suggestRating(
  score: number,
  max: number,
  passed: boolean,
): SRSRating {
  if (max <= 0) return 3;
  const ratio = score / max;
  if (passed && ratio >= 0.999) return 5;
  if (ratio >= 0.8) return 3;
  return 0;
}

/** React hook providing SRS state + session queue + apply helper. */
export function useSRS(courseId: string, taskKinds: readonly string[]) {
  const key = storageKey(courseId);
  const sKey = settingsKey(courseId);
  const taskKindsKey = useMemo(() => taskKinds.join("|"), [taskKinds]);
  const [cards, setCards] = useState<SRSCardState[]>([]);
  const [now, setNow] = useState<number>(() => Date.now());
  const [maxNewPerDay, setMaxNewPerDayState] = useState<number>(DEFAULT_MAX_NEW_PER_DAY);

  // Initial load + reactive refresh on storage events.
  useEffect(() => {
    const refresh = () => {
      setCards(readSRSState(courseId, taskKinds));
      setMaxNewPerDayState(readDailyGoal(courseId));
      setNow(Date.now());
    };
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key !== key && e.key !== sKey) return;
      refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // taskKindsKey collapses array identity changes; courseId & key cover the rest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, key, sKey, taskKindsKey]);

  const stats = useMemo(() => summarizeSRS(cards, now), [cards, now]);
  const session = useMemo(
    () => buildSession(cards, now, maxNewPerDay),
    [cards, now, maxNewPerDay],
  );

  const rate = useCallback(
    (taskKind: string, rating: SRSRating) => {
      const ts = Date.now();
      const updated = cards.map((c) =>
        c.taskKind === taskKind ? applyRating(c, rating, ts) : c,
      );
      setCards(updated);
      setNow(ts);
      writeSRSState(courseId, updated);
    },
    [cards, courseId],
  );

  const setMaxNewPerDay = useCallback(
    (n: number) => {
      const clamped = Math.max(MIN_MAX_NEW_PER_DAY, Math.min(MAX_MAX_NEW_PER_DAY, n));
      setMaxNewPerDayState(clamped);
      writeDailyGoal(courseId, clamped);
    },
    [courseId],
  );

  const reset = useCallback(() => {
    const fresh = taskKinds.map(makeNewCard);
    setCards(fresh);
    setNow(Date.now());
    writeSRSState(courseId, fresh);
  }, [courseId, taskKinds]);

  return { cards, stats, session, rate, reset, maxNewPerDay, setMaxNewPerDay };
}
