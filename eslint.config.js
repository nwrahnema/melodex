import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

export default [
  perfectionist.configs['recommended-natural'],
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ),
  {
    // TODO: remove eslint.config.js and use allowDefaultProject instead when
    // https://github.com/typescript-eslint/typescript-eslint/commit/48fc3851cc8f161d81d93d394e1c7c80c99fcf40
    // is published
    ignores: ['eslint.config.js', 'dist/'],
  },
];
