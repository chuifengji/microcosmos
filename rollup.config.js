import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/microcosmos.js',
            format: 'es',
            sourcemap: true,
            name: 'microcosmos'
        }
    ],
    plugins: [
        replace({
            __DEV__: process.env.NODE_ENV !== 'production'
        }),
        typescript({
            tsconfig: 'tsconfig.json',
            removeComments: true,
            useTsconfigDeclarationDir: true,
        }),
    ]
}
