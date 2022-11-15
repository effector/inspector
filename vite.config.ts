import babel from '@rollup/plugin-babel';
import legacy from '@vitejs/plugin-legacy';
import {defineConfig} from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  root: './usage',
  plugins: [
    babel({extensions: ['.ts', '.tsx'], babelrc: true}) as any,
    legacy({
      targets: ['last 4 versions', 'not IE 11'],
    }),
    solid(),
  ],
  resolve: {
    alias: [{find: '~', replacement: './src'}],
  },
});
