import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


export default {
  input: `./src/index.ts`,
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "XhbMonitor",
    minify: false // 代码是否压缩
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
      useTsconfigDeclarationDir: true,
    }),
    buble({
      exclude: 'node_modules/**'
    }),
    commonjs({
      sourceMap: false,
      extensions: [".js", ".ts"]
    }),
    (process.env.NODE_ENV === 'production' && terser())
  ]
};