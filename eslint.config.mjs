import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    ignores: ["dist/", "token", "mongo.js", "seed.js", "**.mjs", "**.rest", "**.yaml", "node_modules"]
}
];