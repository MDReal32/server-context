export interface Middleware<TData> {
  (data: TData): TData | undefined;
}
