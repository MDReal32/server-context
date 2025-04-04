import { ZodRawShape, z } from "zod";

import { Data, ServerContext } from "../../types";
import { CreateServerContextWithZodOptions } from "./create-server-context-with-zod.options";

export interface ServerContextWithZod<TParams, TSearchParams extends object, TSlots extends readonly string[]> {
  page: ServerContext<TParams, false, TSearchParams>;
  layout: ServerContext<TParams, true, TSlots>;
  extend<TNewParams extends ZodRawShape, TNewSearchParams extends ZodRawShape, TNewSlots extends readonly string[]>(
    newOptions: CreateServerContextWithZodOptions<TNewParams, TNewSearchParams>,
    ...newSlots: TNewSlots
  ): ServerContextWithZod<
    TParams & z.infer<z.ZodObject<TNewParams>>,
    TSearchParams & z.infer<z.ZodObject<TNewSearchParams>>,
    [...TSlots, ...TNewSlots]
  >;
  get(): Data<TParams, true, TSlots> & Data<TParams, false, TSearchParams>;
  getOrThrow(): Data<TParams, true, TSlots> & Data<TParams, false, TSearchParams>;
}
