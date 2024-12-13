const {
  readdirSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  rmSync
} = require('node:fs')
const path = require('node:path')
const { optimize } = require('svgo')

const resolve = path.resolve
const sep = path.sep

function dash2Camel(dash, pascal = false) {
  if (dash) {
    if (pascal) {
      const data = dash.trim()
      dash = data.replace(data[0], data[0].toUpperCase())
    }
    return dash.replace(/-(.)/gi, (m, p1) => {
      return p1.toUpperCase()
    })
  }
  return ''
}

function dash2Pascal(dash) {
  return dash2Camel(dash, true)
}

const PWD = process.cwd()

const sourcePath = 'assets'
const target = 'src'
const iconIndexTsTemplate = function (pascalName) {
  return `import _${pascalName} from './${pascalName}.vue'
import { withInstall } from '@v3ms/utils'
export const ${pascalName} = withInstall(_${pascalName})
export default ${pascalName}
`
}

const getSrcIndexExportLine = function (pureName) {
  return `export * from './${pureName}'`
}

const componentsTemplate = function (pascalNameList) {
  const group = function (pascalName) {
    return `    ${pascalName}: typeof components.${pascalName}`
  }

  return (
    `import * as components from './src/index'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
` +
    pascalNameList.map(group).join('\n') +
    `
  }
}
export {}
`
  )
}

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: {
            minify: false
          }
        }
      }
    }
  ]
}

const allFiles = readdirSync(sourcePath, { withFileTypes: true, recursive: true })

const srcExportList = new Set()
const pascalNameList = new Set()

// 清空src文件夹
rmSync(target, { force: true, recursive: true })
mkdirSync(target)

allFiles.forEach(direct => {
  // 排除文件夹、非 SVG 文件、非以`icon-`开头的文件
  if (!direct.isFile()) return
  if (!direct.name.endsWith('.svg')) return
  if (!direct.name.startsWith('icon-')) return
  const filePath = direct.path + sep + direct.name
  // 取svg文件名
  const pureName = direct.name.replace(/\.svg$/, '')
  const iconName = pureName.replace(/^icon-/, '')
  // 记录有哪些svg
  srcExportList.add(pureName)
  const fileContent = readFileSync(resolve(PWD + sep + filePath), { encoding: 'utf-8' })
  let defaultSize = 20
  const optimizedContent = optimize(fileContent, svgoConfig)

  // 回写压缩后的结果
  writeFileSync(resolve(PWD + sep + filePath), optimizedContent.data, { encoding: 'utf-8' })

  const optimizedVueContent = optimize(optimizedContent.data, {
    plugins: [
      ...svgoConfig.plugins,
      {
        name: 'replaceSize',
        fn() {
          return {
            element: {
              enter: (node, parentNode) => {
                // only process root
                if (node.name === 'svg' && parentNode.type === 'root') {
                  if (node.attributes.width || node.attributes.height) {
                    const width = Number(node.attributes.width) || 20
                    const height = Number(node.attributes.height) || 20
                    defaultSize = Math.min(width, height)
                  }
                  delete node.attributes.width
                  delete node.attributes.height
                  node.attributes[':width'] = 'props.size'
                  node.attributes[':height'] = 'props.size'
                  node.attributes['class'] = `v3ms-svg v3ms-svg-${iconName}`
                }
              }
            }
          }
        }
      }
    ]
  })
  const targetFilePath = target + sep + pureName
  if (!existsSync(targetFilePath)) mkdirSync(targetFilePath)
  const filePascalName = dash2Pascal(pureName)
  pascalNameList.add(filePascalName)
  // 根据svg文件写vue文件，即用<template>标签包裹
  writeFileSync(
    targetFilePath + sep + filePascalName + '.vue',
    `<template>
    ${optimizedVueContent.data}
</template>
<script setup lang="ts">
defineOptions({
  name: '${filePascalName}'
})
const props = defineProps({
  size: {
    type: Number,
    default: ${defaultSize}
  }
})
</script>
`,
    { encoding: 'utf8' }
  )

  // 写该icon文件的导出文件 index.ts
  writeFileSync(targetFilePath + sep + 'index.ts', iconIndexTsTemplate(filePascalName), {
    encoding: 'utf8'
  })
})

// 写总导出文件
const srcIndexContent = [...srcExportList].map(getSrcIndexExportLine).join('\n') + '\n'
writeFileSync(target + sep + 'index.ts', srcIndexContent, { encoding: 'utf8' })
writeFileSync('index.d.ts', componentsTemplate([...pascalNameList]), { encoding: 'utf8' })
