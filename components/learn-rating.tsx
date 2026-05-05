"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SRSRating } from "@/lib/srs";

interface LearnRatingProps {
  /** Rating proposed by automatic checking — visually highlighted. */
  suggestedRating?: SRSRating;
  onRate: (rating: SRSRating) => void;
  disabled?: boolean;
}

interface RatingOption {
  rating: SRSRating;
  label: string;
  hint: string;
  className: string;
}

const OPTIONS: RatingOption[] = [
  {
    rating: 0,
    label: "Nochmal",
    hint: "morgen erneut",
    className:
      "border-destructive/40 text-destructive hover:bg-destructive/10",
  },
  {
    rating: 3,
    label: "Gut",
    hint: "Standard-Intervall",
    className:
      "border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10",
  },
  {
    rating: 5,
    label: "Einfach",
    hint: "längeres Intervall",
    className:
      "border-sky-500/40 text-sky-700 dark:text-sky-400 hover:bg-sky-500/10",
  },
];

export function LearnRating({
  suggestedRating,
  onRate,
  disabled,
}: LearnRatingProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Wie ist dir die Aufgabe gefallen?
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const suggested = opt.rating === suggestedRating;
          return (
            <Button
              key={opt.rating}
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => onRate(opt.rating)}
              className={cn(
                "h-auto flex-col gap-0.5 py-3",
                opt.className,
                suggested && "ring-2 ring-offset-1 ring-offset-background",
              )}
            >
              <span className="text-sm font-semibold">
                {opt.label}
                {suggested ? " ★" : ""}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {opt.hint}
              </span>
            </Button>
          );
        })}
      </div>
      {suggestedRating !== undefined ? (
        <p className="text-[11px] text-muted-foreground">
          ★ Vorschlag basierend auf deiner Lösung — du kannst frei wählen.
        </p>
      ) : null}
    </div>
  );
}
