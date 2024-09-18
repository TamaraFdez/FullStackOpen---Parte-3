import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,  
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, 
      'indent': ['error', 2], 
      'linebreak-style': ['error', 'unix'], 
      'quotes': ['error', 'single'], 
      'semi': ['error', 'never'], 
      'no-unused-vars': ['warn'], 
      'no-undef': ['error'],
    }
  },
  {
    ignores: ["dist/", "token", "mongo.js", "seed.js", "**.mjs", "**.rest", "**.yaml", "node_modules"]
}
];