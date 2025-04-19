import type { ZodRawShape } from "zod-next";

export interface CreateServerContextWithZodOptions<TParams extends ZodRawShape, TSearchParams extends ZodRawShape> {
  params?: TParams;
  searchParamsShape?: TSearchParams;
}
