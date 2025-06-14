import merge from "lodash.merge";

import type { ReactNode } from "react";
import { core, z } from "zod/v4";

import { createServerContext } from "../../base/context/create-server-context";
import { CreateServerContextWithZodOptions, ServerContextWithZod } from "../types";

export const createServerContextWithZod = <
  TParams extends core.$ZodLooseShape = {},
  TSearchParams extends core.$ZodLooseShape = {},
  TSlots extends readonly string[] = []
>(
  options: CreateServerContextWithZodOptions<TParams, TSearchParams> = {},
  ...slots: TSlots
): ServerContextWithZod<TParams, TSearchParams, TSlots> => {
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
        {} as Record<TSlots[number], z.ZodType<ReactNode>>
      )
    );

  const schema = pageSchema.extend(layoutSchema);

  const pageCtx = createServerContext<z.infer<z.ZodObject<TParams>>, false, z.infer<z.ZodObject<TSearchParams>>>([
    data => pageSchema.parse(data) as any
  ]);
  const layoutCtx = createServerContext<z.infer<z.ZodObject<TParams>>, true, TSlots>([
    data => layoutSchema.parse(data) as any
  ]);

  return {
    page: pageCtx,
    layout: layoutCtx,
    extend(newOptions, ...newSlots) {
      return createServerContextWithZod(merge(options, newOptions) as any, ...slots, ...newSlots);
    },
    get() {
      const pageData = pageCtx.get();
      const layoutData = layoutCtx.get();
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
