"use client";

import { createContext, useContext } from "react";

/**
 * When true, components that normally show multiple questions/items
 * should reduce to a single item per render (Anki learn mode).
 */
export const LearnModeContext = createContext<boolean>(false);

export function useLearnMode(): boolean {
  return useContext(LearnModeContext);
}
