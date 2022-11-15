const { resolve } = require('path');
const pluginResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const babelConfig = require('./babel.config');

const extensions = ['.tsx', '.ts', '.js', '.json'];

function createBuild(input, format) {
  return {
    input: resolve(__dirname, `src/${input}.ts`),
    output: {
      file: `${input}.${format === 'esm' ? 'mjs' : 'js'}`,
      format,
      plugins: [terser()],
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      pluginResolve({ extensions }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      babel({
        babelHelpers: 'bundled',
        extensions,
        skipPreflightCheck: true,
        babelrc: false,
        ...babelConfig.generateConfig({
          isEsm: format === 'esm',
        }),
      }),
    ],
  };
}

const inputs = ['index'];
const formats = ['cjs', 'esm'];

const configs = inputs.map((input) => formats.map((format) => createBuild(input, format))).flat();

module.exports = configs;
