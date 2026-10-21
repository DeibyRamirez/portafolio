import { fileURLToPath } from 'node:url';
import path from 'node:path';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: [".next/**", ".open-next/**", ".wrangler/**", "node_modules/**", "out/**"],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
