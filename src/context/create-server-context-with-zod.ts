import _ from "lodash";
import type { ReactNode } from "react";
import "server-only";
import { type ZodRawShape, z } from "zod";

import { Data, ServerContext, createServerContext } from "./create-server-context";

interface Options<TParams extends ZodRawShape, TSearchParams extends ZodRawShape> {
  params?: TParams;
  searchParamsShape?: TSearchParams;
}

interface ServerContextWithZod<TParams, TSearchParams extends object, TSlots extends readonly string[]> {
  page: ServerContext<TParams, false, TSearchParams>;
  layout: ServerContext<TParams, true, TSlots>;
  extend<TNewParams extends ZodRawShape, TNewSearchParams extends ZodRawShape, TNewSlots extends readonly string[]>(
    newOptions: Options<TNewParams, TNewSearchParams>,
    ...newSlots: TNewSlots
  ): ServerContextWithZod<
    TParams & z.infer<z.ZodObject<TNewParams>>,
    TSearchParams & z.infer<z.ZodObject<TNewSearchParams>>,
    [...TSlots, ...TNewSlots]
  >;
  get(): Data<TParams, true, TSlots> & Data<TParams, false, TSearchParams>;
  getOrThrow(): Data<TParams, true, TSlots> & Data<TParams, false, TSearchParams>;
}

export const createServerContextWithZod = <
  TParams extends ZodRawShape,
  TSearchParams extends ZodRawShape,
  TSlots extends readonly string[] = [],
  TInternalParams extends z.infer<z.ZodObject<TParams>> = z.infer<z.ZodObject<TParams>>,
  TInternalSearchParams extends z.infer<z.ZodObject<TSearchParams>> = z.infer<z.ZodObject<TSearchParams>>
>(
  options: Options<TParams, TSearchParams> = {},
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
      return createServerContextWithZod(_.merge(options, newOptions), ...slots, ...newSlots);
    },
    get() {
      const layoutData = layoutCtx.get();
      const pageData = pageCtx.get();
      return _.merge(layoutData || {}, pageData || {});
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
