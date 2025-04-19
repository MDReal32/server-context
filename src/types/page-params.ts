export interface PageParams<TParams, TSearchParams> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}
