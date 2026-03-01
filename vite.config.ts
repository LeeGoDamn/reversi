import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/reversi/',
  build: {
    outDir: 'docs',
    emptyDirBeforeWrite: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
