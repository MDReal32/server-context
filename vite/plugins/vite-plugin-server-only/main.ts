import { Plugin } from "vite";

export const serverOnlyPlugin = (): Plugin => {
  return {
    name: "oneiro:core-plugins:icon-size",
    enforce: "pre",

    resolveId(id) {
      if (id === "server-only") {
        return id;
      }
    },

    load(id) {
      if (id === "server-only") {
        return `export {};`;
      }
    }
  };
};
