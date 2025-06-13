import type { ZodRawShape } from "zod/v4";

export interface CreateServerContextWithZodOptions<TParams extends ZodRawShape, TSearchParams extends ZodRawShape> {
  params?: TParams;
  searchParamsShape?: TSearchParams;
}
