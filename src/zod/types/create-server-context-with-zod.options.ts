import type { ZodRawShape } from "zod";

export interface CreateServerContextWithZodOptions<TParams extends ZodRawShape, TSearchParams extends ZodRawShape> {
  params?: TParams;
  searchParamsShape?: TSearchParams;
}
