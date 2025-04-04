import { Plugin } from "vite";

export const serverOnlyPlugin = (): Plugin => {
  return {
    name: "mdreal:core-plugins:server-only",
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


