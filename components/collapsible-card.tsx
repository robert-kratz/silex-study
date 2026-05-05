"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CollapsibleCardProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleCard({
  title,
  description,
  defaultOpen = false,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40 rounded-t-lg"
          >
            <CardHeader className="flex-1 p-0 space-y-1">
              <CardTitle>{title}</CardTitle>
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </CardHeader>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="collapsible-content overflow-hidden">
          <CardContent className="space-y-3 pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
