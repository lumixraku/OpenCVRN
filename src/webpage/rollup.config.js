import typescript from 'rollup-plugin-typescript2';
export default {
    input: './src/index.ts',
    watch: {
        exclude: 'node_modules/**'
    },
    plugins: [
        typescript(/*{ plugin options }*/),
    ],
    output: {
        file: './dist/index.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            'pixi.js':'PIXI',
            'pixi-fps': 'PixiFps'
        }
    },

}