import nextConfig from 'eslint-config-next';
import prettier from 'eslint-plugin-prettier';

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '.vscode/**',
      '*.log',
      '.DS_Store',
    ],
  },
  ...nextConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default config;
