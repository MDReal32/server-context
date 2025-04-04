import { FC, PropsWithChildren } from "react";

import { Data } from "./data";

export interface ServerContext<
  TParams,
  TIsLayout extends boolean,
  TSecondParam,
  TData = Data<TParams, TIsLayout, TSecondParam>
> {
  get(): TData;
  set<K extends keyof TData>(key: K, value: TData[K]): void;
  getOrThrow(): TData;
  Wrapper<TComponentProps extends TIsLayout extends true ? PropsWithChildren<TData> : TData>(
    Component: FC<TComponentProps>
  ): FC<TComponentProps>;
}
