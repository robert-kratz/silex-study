import { cn } from "@/lib/utils";
import type { AttemptStats } from "@/lib/attempts";

interface AttemptProgressBarProps {
  stats: Pick<AttemptStats, "total" | "passed" | "failed" | "skipped">;
  className?: string;
}

function pct(value: number, total: number): number {
  return total <= 0 ? 0 : (value / total) * 100;
}

export function AttemptProgressBar({
  stats,
  className,
}: AttemptProgressBarProps) {
  const segments = [
    {
      key: "passed",
      value: stats.passed,
      className: "bg-emerald-500 dark:bg-emerald-400",
    },
    {
      key: "failed",
      value: stats.failed,
      className: "bg-destructive",
    },
    {
      key: "skipped",
      value: stats.skipped,
      className: "bg-amber-400 dark:bg-amber-300",
    },
  ];

  return (
    <div
      aria-label={`${stats.passed} bestanden, ${stats.failed} nicht bestanden, ${stats.skipped} übersprungen`}
      className={cn(
        "flex h-1.5 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      role="img"
    >
      {segments.map((segment) =>
        segment.value > 0 ? (
          <div
            key={segment.key}
            className={cn("h-full transition-[width]", segment.className)}
            style={{ width: `${pct(segment.value, stats.total)}%` }}
          />
        ) : null,
      )}
    </div>
  );
}
