import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    //压缩
    //minify: false,
    rollupOptions: {
      //忽略不需要打包的文件
      external: ['vue', /\.scss/, 'axios', '@microsoft/fetch-event-source'],
      input: ['index.ts'],
      output: [
        {
          //打包格式
          format: 'es',
          //打包后文件名
          entryFileNames: '[name].mjs',
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: 'named',
          //配置打包根目录
          dir: 'es'
        },
        {
          //打包格式
          format: 'cjs',
          //打包后文件名
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: 'named',
          //配置打包根目录
          dir: 'lib'
        }
      ]
    },
    lib: {
      entry: './index.ts',
      name: '@v3ms/utils'
    }
  },

  plugins: [
    dts({
      entryRoot: '.',
      outDir: ['es', 'lib'],
      exclude: ['node-modules', 'vite.config.ts'],
      tsconfigPath: '../../tsconfig.json'
    })
  ]
})
