import { LayoutParams } from "./layout-params";
import { PageParams } from "./page-params";

export type Data<TParams, TIsLayout extends boolean, TSecondParam> = TIsLayout extends true
  ? LayoutParams<TParams, TSecondParam>
  : PageParams<TParams, TSecondParam>;
