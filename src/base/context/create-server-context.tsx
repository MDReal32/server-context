import type { FC, PropsWithChildren } from "react";
import "server-only";

import type { Data, Middleware, ServerContext } from "../../types";
import { LocalStorage } from "../utils/local-storage";

export const createServerContext = <
  TParams,
  TIsLayout extends boolean,
  TSecondParam extends readonly string[] | object,
  TData extends Data<TParams, TIsLayout, TSecondParam> = Data<TParams, TIsLayout, TSecondParam>
>(
  middlewares: Middleware<TData>[] = []
): ServerContext<TParams, TIsLayout, TSecondParam, TData> => {
  const ctx = new LocalStorage({} as TData);

  const handleMiddleware = (data: TData) => {
    return middlewares.reduce((acc, middleware) => {
      const result = middleware(acc);
      return result || acc;
    }, data);
  };

  return {
    get() {
      const data = ctx.getAll();
      return handleMiddleware(data);
    },
    set<K extends keyof TData>(key: K, value: TData[K]) {
      ctx.set(key, value);
    },
    getOrThrow() {
      const value = this.get();
      if (!value) {
        throw new Error("Server context is not initialized");
      }
      return value;
    },
    Wrapper<TComponentProps extends TIsLayout extends true ? PropsWithChildren<TData> : TData>(
      Component: FC<TComponentProps>
    ) {
      const WrapperComponent: FC<TComponentProps> = props => {
        Object.entries(props!).forEach(([key, value]) => {
          ctx.set(key, value || {});
        });

        return <Component {...(props as any)} />;
      };

      if (process.env.NODE_ENV === "development") {
        WrapperComponent.displayName = `ServerContextWrapper(${Component.displayName || Component.name})`;
      }

      return WrapperComponent;
    }
  };
};
