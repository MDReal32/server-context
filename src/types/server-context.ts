import { FC, PropsWithChildren } from "react";

import { Data } from "./data";
import { LayoutParams } from "./layout-params";
import { PageParams } from "./page-params";

export interface ServerContext<TParams, TIsLayout extends boolean, TSecondParam> {
  get(): Data<TParams, TIsLayout, TSecondParam>;
  set<K extends keyof Data<TParams, TIsLayout, TSecondParam>>(
    key: K,
    value: Data<TParams, TIsLayout, TSecondParam>[K]
  ): void;
  getOrThrow(): Data<TParams, TIsLayout, TSecondParam>;
  Wrapper<
    TComponentProps extends TIsLayout extends true
      ? PropsWithChildren<LayoutParams<TParams, TSecondParam>>
      : PageParams<TParams, TSecondParam>
  >(
    Component: FC<TComponentProps>
  ): FC<TComponentProps>;
}
