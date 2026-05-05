"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { readAttempts, summarize, type AttemptStats } from "@/lib/attempts";
import { readSRSState, summarizeSRS, buildSession } from "@/lib/srs";

interface SidebarTask {
  kind: string;
  title: string;
  tutorium: string;
}

export interface CourseSidebarProps {
  courseId: string;
  courseTitle: string;
  tasks: SidebarTask[];
}

const SIDEBAR_WIDTH = "w-72";

/** Top-level wrapper: fixed desktop drawer + mobile trigger + sheet. */
export function CourseSidebar(props: CourseSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 top-14 z-20 flex-col border-r bg-sidebar text-sidebar-foreground",
          SIDEBAR_WIDTH,
        )}
      >
        <SidebarBody {...props} />
      </aside>
      <MobileSidebarTrigger {...props} />
    </>
  );
}

function MobileSidebarTrigger(props: CourseSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Auto-close on route change.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden sticky top-14 z-10 flex items-center gap-2 border-b bg-background/80 px-4 py-2 backdrop-blur">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Menu className="size-4" />
            <span>Aufgaben</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground">
          <SheetTitle className="sr-only">Aufgabenliste</SheetTitle>
          <SidebarBody {...props} />
        </SheetContent>
      </Sheet>
      <span className="truncate text-sm font-medium text-muted-foreground">
        {props.courseTitle}
      </span>
    </div>
  );
}

function SidebarBody({ courseId, courseTitle, tasks }: CourseSidebarProps) {
  const pathname = usePathname();
  const [version, setVersion] = React.useState(0);

  React.useEffect(() => {
    const onStorage = () => setVersion((v) => v + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const overviewHref = `/kurs/${courseId}`;
  const learnHref = `/kurs/${courseId}/lernen`;
  const taskKinds = React.useMemo(() => tasks.map((t) => t.kind), [tasks]);
  const srsBadge = React.useMemo(() => {
    // versionKey is unused here directly but the parent re-renders on storage events.
    const cards = readSRSState(courseId, taskKinds);
    const stats = summarizeSRS(cards);
    const sessionSize = buildSession(cards).length;
    return { due: stats.due, sessionSize };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, taskKinds, version]);

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto p-4">
      <div className="px-2 pb-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Kurs
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-tight">{courseTitle}</p>
      </div>
      <Link
        href={overviewHref}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          pathname === overviewHref &&
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        )}
      >
        <span>Übersicht</span>
      </Link>
      <Link
        href={learnHref}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          pathname.startsWith(learnHref) &&
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        )}
      >
        <span>Lernen</span>
        {srsBadge.sessionSize > 0 ? (
          <Badge
            variant={srsBadge.due > 0 ? "destructive" : "secondary"}
            className="shrink-0"
          >
            {srsBadge.sessionSize}
          </Badge>
        ) : null}
      </Link>

      <p className="mt-3 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Aufgaben
      </p>
      <nav className="flex flex-col gap-0.5">
        {tasks.map((task) => {
          const href = `/kurs/${courseId}/aufgabe/${task.kind}`;
          const active = pathname.startsWith(href);
          return (
            <SidebarItem
              key={task.kind}
              courseId={courseId}
              task={task}
              href={href}
              active={active}
              versionKey={version}
            />
          );
        })}
      </nav>
    </div>
  );
}

function SidebarItem({
  courseId,
  task,
  href,
  active,
  versionKey,
}: {
  courseId: string;
  task: SidebarTask;
  href: string;
  active: boolean;
  versionKey: number;
}) {
  const [stats, setStats] = React.useState<AttemptStats | null>(null);
  React.useEffect(() => {
    setStats(summarize(readAttempts(courseId, task.kind)));
  }, [courseId, task.kind, versionKey]);

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("truncate", active && "font-medium")}>{task.title}</span>
        {stats && stats.total > 0 ? (
          <Badge variant={stats.passed > 0 ? "secondary" : "outline"} className="shrink-0">
            {stats.passed}/{stats.total}
          </Badge>
        ) : null}
      </div>
      <span className="text-xs text-muted-foreground">{task.tutorium}</span>
      {stats && stats.total > 0 ? (
        <Progress value={stats.successRate} className="h-1" />
      ) : null}
    </Link>
  );
}
