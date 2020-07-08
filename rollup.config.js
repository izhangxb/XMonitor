import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
    input: 'src/index.js',
    output: {
        file: './dist/bundle.js',
        format: 'umd',
        name: 'XMonitor'
    },
    plugins: [
        resolve(),
        babel({
            externalHelpers: true,
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        commonJs(),
        uglify({},minify)
    ],
    // 指出应将哪些模块视为外部模块, 不会与你的库打包在一起
    external: [

    ]
};
