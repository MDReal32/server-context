export class LocalStorage<TData> {
  constructor(private readonly data: TData) {}

  getAll(): TData {
    return this.data;
  }

  get<TKey extends keyof TData>(key: TKey): TData[TKey] {
    return this.data[key];
  }

  set<TKey extends keyof TData>(key: TKey, value: TData[TKey]): LocalStorage<TData>;
  set<TKey extends string, TValue>(key: TKey, value: TValue): LocalStorage<TData & Record<TKey, TValue>>;
  set(key: string, value: any): LocalStorage<any> {
    // @ts-ignore
    this.data[key] = value;
    return this;
  }

  remove<TKey extends keyof TData>(key: TKey): LocalStorage<Omit<TData, TKey>> {
    // @ts-ignore
    delete this.data[key];
    return this;
  }

  clear(): LocalStorage<{}> {
    for (const key in this.data) {
      this.remove(key);
    }
    return this as any;
  }
}
