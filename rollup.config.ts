import { defineConfig } from 'rollup';
import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import Package from './package.json';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.tsx', '.ts', '.js', '.json'];

export default defineConfig({
  input: resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: 'dist/common.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
      externalLiveBindings: false
    },
    {
      file: 'dist/common.mjs',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
      externalLiveBindings: false
    },
  ],
  plugins: [
    commonjs(),
    pluginResolve({extensions}),
    babel({ babelHelpers: 'bundled', include: ['src/**/*.ts'], extensions, exclude: './node_modules/**', babelrc: true }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
  ],
  external: [].concat(
    Object.keys(Package.peerDependencies),
    Object.keys(Package.dependencies),
  ),
});
