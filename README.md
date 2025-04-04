# `nextjs-server-context`

[![npm version](https://img.shields.io/npm/v/nextjs-server-context?style=flat-square)](https://www.npmjs.com/package/nextjs-server-context)
[![license](https://img.shields.io/npm/l/nextjs-server-context?style=flat-square)](LICENSE)
[![types](https://img.shields.io/npm/types/nextjs-server-context?style=flat-square)](https://www.npmjs.com/package/nextjs-server-context)
[![build](https://img.shields.io/github/actions/workflow/status/MDReal32/server-context/ci.yml?style=flat-square)](https://github.com/MDReal32/server-context/actions)

A lightweight, **TypeScript-first** utility for managing **server-side context** in Next.js App Router apps. It uses **Zod** for safe validation of route and search parameters, and provides a clean way to share context between pages and layouts.

---

## ✨ Features

- ✅ Type-safe server context for layouts and pages
- 🛡️ Zod validation with a dedicated `./zod` export
- ⚛️ Simple React integration via `.page.Wrapper` and `.layout.Wrapper`
- 🔒 Server-only access via `.get()` and `.getOrThrow()`
- 📦 ESM-ready with proper `exports` mapping

---

## 📦 Installation

```bash
yarn add nextjs-server-context
# or
npm install nextjs-server-context
```

---

## 🧠 Usage with Zod

```ts
// lib/server-context.ts
import { createServerContextWithZod } from "nextjs-server-context/zod";
import { z } from "zod";

export const serverContext = createServerContextWithZod(
  {
    params: {
      id: z.string()
    },
    searchParamsShape: {
      tab: z.string().optional()
    }
  },
  "sidebar" // Optional layout slots; 'children' is added automatically
);
```

---

## ⚛️ In `layout.tsx`

```tsx
import { serverContext } from "@/lib/server-context";

const Layout = serverContext.layout.Wrapper(({ children, sidebar }) => {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
});

export default Layout;
```

---

## ⚛️ In `page.tsx`

```tsx
import { serverContext } from "@/lib/server-context";

const Page = serverContext.page.Wrapper(({ params, searchParams }) => {
  return (
    <div>
      <h1>User ID: {params.id}</h1>
      <p>Tab: {searchParams?.tab ?? "none"}</p>
    </div>
  );
});

export default Page;
```

---

## 🧩 API

### `createServerContext()`

Create a raw context without validation.

```ts
import { createServerContext } from "nextjs-server-context";

const ctx = createServerContext();
ctx.set("params", { id: "abc" });
ctx.getOrThrow(); // safe access
```

---

### `createServerContextWithZod(options, ...slots)`

```ts
import { createServerContextWithZod } from "nextjs-server-context/zod";
```

- `params`: Zod schema for dynamic route params
- `searchParamsShape`: Optional Zod schema for query params
- `...slots`: Optional layout slot names (e.g. `'sidebar'`, `'header'`)
- `'children'` is always auto-included for layouts

Returns:

- `page.Wrapper(Component)`
- `layout.Wrapper(Component)`
- `get()`, `getOrThrow()`, `set(...)`

---

## 🛠️ Scripts

| Script                | Description                   |
| --------------------- | ----------------------------- |
| `yarn build`          | Builds the library using Vite |
| `yarn prepublishOnly` | Ensures build before publish  |

---

## 🧪 Tech Stack

- ⚙️ Built with [Vite](https://vitejs.dev/)
- ✨ Typed and validated with [Zod](https://zod.dev/)

---

## 📄 License

Apache License 2.0 – see [LICENSE](./LICENSE)

---

## 👤 Author

Maintained by [**MDReal Aliyev**](https://github.com/MDReal32)
