export type CreateContextInfer<T> = T extends { get: infer G extends (...args: any[]) => any }
  ? ReturnType<G>["params"]
  : never;
