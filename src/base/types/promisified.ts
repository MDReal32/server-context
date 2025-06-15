export type Promisified<T> = T extends object ? { [K in keyof T]: Promise<T[K]> } : T;
