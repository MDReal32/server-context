import { FC, PropsWithChildren, Usable, use } from "react";

import { Data, LayoutParams, Middleware, PageParams, ServerContext } from "../../types";
import { LocalStorage } from "../utils/local-storage";

export const createServerContext = <
  TParams,
  TIsLayout extends boolean,
  TSecondParam extends readonly string[] | object
>(
  middlewares: Middleware<Data<TParams, TIsLayout, TSecondParam>>[] = []
): ServerContext<TParams, TIsLayout, TSecondParam> => {
  const ctx = new LocalStorage({} as Data<TParams, TIsLayout, TSecondParam>);

  const handleMiddleware = (data: Data<TParams, TIsLayout, TSecondParam>) => {
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
    set<K extends keyof Data<TParams, TIsLayout, TSecondParam>>(
      key: K,
      value: Data<TParams, TIsLayout, TSecondParam>[K]
    ) {
      ctx.set(key, value);
    },
    getOrThrow() {
      const value = this.get();
      if (!value) {
        throw new Error("Server context is not initialized");
      }
      return value;
    },
    Wrapper<
      TComponentProps extends TIsLayout extends true
        ? PropsWithChildren<LayoutParams<TParams, TSecondParam>>
        : PageParams<TParams, TSecondParam>
    >(Component: FC<TComponentProps>) {
      const WrapperComponent: FC<TComponentProps> = props => {
        if (typeof window === "undefined") {
          Object.entries(props).forEach(([key, value]) => {
            ctx.set(key, value || {});
          });

          return <Component {...(props as any)} />;
        } else {
          const { params, searchParams } = props;

          const parsedParams = use(params as Usable<TParams>);
          const parsedSearchParams = use(searchParams as Usable<TSecondParam>);

          ctx.set("params", parsedParams);
          ctx.set("searchParams", parsedSearchParams);

          return <Component {...(props as any)} />;
        }
      };

      if (process.env.NODE_ENV === "development") {
        WrapperComponent.displayName = `ServerContextWrapper(${Component.displayName || Component.name})`;
      }

      return WrapperComponent;
    }
  };
};
