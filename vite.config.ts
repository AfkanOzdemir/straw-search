/// <reference types="node" />
import { defineConfig, UserConfig, LibraryOptions, BuildOptions } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

const libConfig: LibraryOptions = {
  entry: resolve(__dirname, 'src/bin/cli.ts'),
  name: 'StrawSearch',
  fileName: (format: string) => `strawsearch.${format === 'cjs' ? 'cjs' : format}.js`,
  formats: ['es', 'cjs', 'umd'] as const
};

const buildOptions: BuildOptions = {
  lib: libConfig,
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
    external: [
      /^node:.*/,
      'fs', 'path', 'url', 'util', 'events', 'stream', 'buffer', 
      'http', 'https', 'zlib', 'child_process', 'net', 'fs/promises', 
      'buffer', 'worker_threads', 'stream/web'
    ],
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
      format: 'cjs', // Node.js için uyumlu format
    },
  },
};

const config: UserConfig = {
  build: buildOptions,
  optimizeDeps: {
    // Node.js modüllerini dışarıda bırak
    exclude: ['fs', 'path', 'os', 'util', 'events', 'child_process', 'fs/promises']
  },
  // Node.js ortamı için yapılandırma
  ssr: {
    target: 'node',
    noExternal: []
  },
};

export default defineConfig(config);
