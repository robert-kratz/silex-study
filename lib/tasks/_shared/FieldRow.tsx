"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldStatus {
  ok: boolean;
  expected: number | string;
  given: number | string | null;
}

export interface FieldRowProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  inputError?: string;
  checkStatus?: FieldStatus;
  format?: (n: number) => string;
  hint?: string;
  className?: string;
}

export function FieldRow({
  id,
  label,
  value,
  onChange,
  onBlur,
  inputError,
  checkStatus,
  format,
  hint,
  className,
}: FieldRowProps) {
  const showInputError = !!inputError;
  const showCheckOk = !showInputError && !!checkStatus?.ok;
  const showCheckErr = !showInputError && !!checkStatus && !checkStatus.ok;

  const fmt = (v: number | string) =>
    typeof v === "number" && format ? format(v) : String(v);

  return (
    <div className={cn("space-y-1.5", className)}>
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
      {hint && !showInputError && !showCheckErr && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {showInputError && <p className="text-xs text-destructive">{inputError}</p>}
      {showCheckErr && (
        <p className="text-xs text-destructive">
          Korrekt wäre: <span className="font-medium">{fmt(checkStatus!.expected)}</span>
        </p>
      )}
      {showCheckOk && <p className="text-xs text-success">Korrekt.</p>}
    </div>
  );
}
