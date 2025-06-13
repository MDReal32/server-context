import { z } from "zod/v4";

import { Data, ServerContext } from "../../types";
import { CreateServerContextWithZodOptions } from "./create-server-context-with-zod.options";

export interface ServerContextWithZod<
  TParams extends z.core.$ZodLooseShape,
  TSearchParams extends z.core.$ZodLooseShape,
  TSlots extends readonly string[]
> {
  page: ServerContext<z.infer<z.ZodObject<TParams>>, false, z.infer<z.ZodObject<TSearchParams>>>;
  layout: ServerContext<z.infer<z.ZodObject<TParams>>, true, TSlots>;
  extend<
    TNewParams extends z.core.$ZodLooseShape,
    TNewSearchParams extends z.core.$ZodLooseShape,
    TNewSlots extends readonly string[]
  >(
    newOptions: CreateServerContextWithZodOptions<TNewParams, TNewSearchParams>,
    ...newSlots: TNewSlots
  ): ServerContextWithZod<TParams & TNewParams, TSearchParams & TNewSearchParams, [...TSlots, ...TNewSlots]>;
  get(): Data<z.infer<z.ZodObject<TParams>>, true, TSlots> &
    Data<z.infer<z.ZodObject<TParams>>, false, z.infer<z.ZodObject<TSearchParams>>>;
  getOrThrow(): Data<z.infer<z.ZodObject<TParams>>, true, TSlots> &
    Data<z.infer<z.ZodObject<TParams>>, false, z.infer<z.ZodObject<TSearchParams>>>;
}
