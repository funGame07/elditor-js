import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',       // Entry point
  output: [
    {
      file: 'dist/elditor-js.esm.js',
      format: 'es',            // For `import`
    },
    {
      file: 'dist/elditor-js.cjs.js',
      format: 'cjs',           // For `require`
    },
    {
      file: 'dist/elditor-js.umd.js',
      format: 'umd',           // For <script src="">
      name: 'Elditor-js',       // Global variable
    },
    {
      file: 'dist/elditor-js.iife.min.js',
      format: 'iife',          // For old browsers
      name: 'ElditorJs',
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(), 
    commonjs(),
    postcss({
      inject: true,      
      minimize: true,     // Minify CSS
      sourceMap: true
    })
  ],
};