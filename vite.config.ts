/// <reference types="node" />
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'StrawSearch',
      fileName: (format) => `strawsearch.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
        ecma: 2015,
      },
      mangle: {
        properties: {
          regex: /^_/,
        }
      },
      format: {
        comments: false,
        ecma: 2015,
      }
    },
    target: 'es2015',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        compact: true,
        inlineDynamicImports: true,
        generatedCode: {
          objectShorthand: true,
          constBindings: true,
        },
        exports: 'named',
        minifyInternalExports: true,
      },
    },
  },
});
