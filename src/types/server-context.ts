import { FC, PropsWithChildren } from "react";

import { Promisified } from "../base/types/promisified";
import { Data } from "./data";
import { LayoutParams } from "./layout-params";
import { PageParams } from "./page-params";

export interface ServerContext<
  TParams,
  TIsLayout extends boolean,
  TSecondParam,
  TWrapperComponentProps = TIsLayout extends true
    ? PropsWithChildren<LayoutParams<TParams, TSecondParam>>
    : PageParams<TParams, TSecondParam>
> {
  get(): Data<TParams, TIsLayout, TSecondParam>;
  set<K extends keyof Data<TParams, TIsLayout, TSecondParam>>(
    key: K,
    value: Data<TParams, TIsLayout, TSecondParam>[K]
  ): void;
  getOrThrow(): Data<TParams, TIsLayout, TSecondParam>;
  Wrapper<TComponentProps>(
    Component: FC<TWrapperComponentProps & TComponentProps>
  ): FC<TIsLayout extends true ? TWrapperComponentProps : Promisified<TWrapperComponentProps> & TComponentProps>;
}
