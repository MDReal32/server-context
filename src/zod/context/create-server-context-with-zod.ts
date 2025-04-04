import merge from "lodash.merge";

import type { ReactNode } from "react";
import "server-only";
import { type ZodRawShape, z } from "zod";

import { createServerContext } from "../../base/context/create-server-context";
import { ServerContext } from "../../types";
import { CreateServerContextWithZodOptions, ServerContextWithZod } from "../types";

export const createServerContextWithZod = <
  TParams extends ZodRawShape,
  TSearchParams extends ZodRawShape,
  TSlots extends readonly string[] = [],
  TInternalParams extends z.infer<z.ZodObject<TParams>> = z.infer<z.ZodObject<TParams>>,
  TInternalSearchParams extends z.infer<z.ZodObject<TSearchParams>> = z.infer<z.ZodObject<TSearchParams>>
>(
  options: CreateServerContextWithZodOptions<TParams, TSearchParams> = {},
  ...slots: TSlots
): ServerContextWithZod<TInternalParams, TInternalSearchParams, TSlots> => {
  const paramsSchema = z.object(options.params || ({} as TParams));

  const pageSchema = z.object({
    params: paramsSchema,
    searchParams: z.object(options.searchParamsShape || ({} as TSearchParams))
  });

  const layoutSchema = z
    .object({ params: paramsSchema, children: z.custom<ReactNode>() })
    .extend(
      slots.reduce(
        (acc, slot) => ({ ...acc, [slot]: z.custom<ReactNode>().optional() }),
        {} as Record<TSlots[number], z.ZodType<ReactNode, any, any>>
      )
    );

  const schema = pageSchema.extend(layoutSchema.shape);

  const pageCtx: ServerContext<TInternalParams, false, TInternalSearchParams> = createServerContext([
    data => pageSchema.parse(data) as any
  ]);
  const layoutCtx: ServerContext<TInternalParams, true, TSlots> = createServerContext([
    data => layoutSchema.parse(data) as any
  ]);

  return {
    page: pageCtx,
    layout: layoutCtx,
    extend(newOptions, ...newSlots) {
      return createServerContextWithZod(merge(options, newOptions), ...slots, ...newSlots);
    },
    get() {
      const layoutData = layoutCtx.get();
      const pageData = pageCtx.get();
      return merge(layoutData || {}, pageData || {});
    },
    getOrThrow() {
      const value = this.get();
      if (!value) {
        throw new Error("Server context is not initialized");
      }
      schema.parse(value);
      return value;
    }
  };
};
