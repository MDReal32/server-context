import { FC, PropsWithChildren, Usable, use } from "react";

import { Data, LayoutParams, Middleware, PageParams, ServerContext } from "../../types";
import { Promisified } from "../types/promisified";
import { LocalStorage } from "../utils/local-storage";

export const createServerContext = <
  TParams,
  TIsLayout extends boolean,
  TSecondParam extends readonly string[] | object,
  TWrapperComponentProps = TIsLayout extends true
    ? PropsWithChildren<LayoutParams<TParams, TSecondParam>>
    : PageParams<TParams, TSecondParam>
>(
  middlewares: Middleware<Data<TParams, TIsLayout, TSecondParam>>[] = []
): ServerContext<TParams, TIsLayout, TSecondParam, TWrapperComponentProps> => {
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
    Wrapper<TComponentProps>(Component: FC<TWrapperComponentProps & TComponentProps>) {
      const WrapperComponent: FC<
        TIsLayout extends true ? TWrapperComponentProps : Promisified<TWrapperComponentProps> & TComponentProps
      > = props => {
        const isClient = typeof window !== "undefined";

        const { params, searchParams } = props as any;

        if (isClient) {
          const parsedParams = use(params as Usable<TParams>);
          const parsedSearchParams = use(searchParams as Usable<TSecondParam>);

          ctx.set("params", parsedParams);
          ctx.set("searchParams", parsedSearchParams);

          return <Component {...({ ...props, params: parsedParams, searchParams: parsedSearchParams } as any)} />;
        } else {
          return Promise.all([params, searchParams]).then(([params, searchParams]) => {
            ctx.set("params", params);
            ctx.set("searchParams", searchParams);

            return <Component {...({ ...props, params, searchParams } as any)} />;
          });
        }
      };

      if (process.env.NODE_ENV === "development") {
        WrapperComponent.displayName = `ServerContextWrapper(${Component.displayName || Component.name})`;
      }

      return WrapperComponent;
    }
  };
};
