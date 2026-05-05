"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  text: string | (() => string);
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  text,
  label = "Kopieren",
  copiedLabel = "Kopiert",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onClick = async () => {
    const value = typeof text === "function" ? text() : text;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: do nothing visible — clipboard might be blocked.
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span>{copied ? copiedLabel : label}</span>
    </Button>
  );
}
