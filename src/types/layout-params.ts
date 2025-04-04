import { ReactNode } from "react";

export type LayoutParams<TParams, TSlots> = { params: TParams } & (TSlots extends readonly string[]
  ? Record<TSlots[number], ReactNode>
  : never);
