/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    clean: true,
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
  experiments: {
    optimize: {
      bundle: true,
      minify: true,
      target: "es2020",
    },
  },
};
