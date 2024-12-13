# Vue3-monorepo-scaffold

> **本项目需要 nodejs >= `18.19.0`**
>
> <div style="font-size:12px;">因为在18.19.0才修复了`readdirSync()`方法的第二个选项参数使用`{ withFileTypes: true, recursive: true }`会引起的bug</div>

> 项目相关外部资源
>
> [Arco Design Vue](https://arco.design/vue/component/overflow)

## 子项目

### icons

包含所有自定义的 icon 的 SVG 文件和生成的 Vue 文件，对应的包名为 `@v3ms/icons` ，对应文件夹 `packages/icons`

原型中的图标，如果不特别标注，一般认为是 Arco Design 中的图标，这种图标在使用时只需要直接引入。如：

```typescript
import { IconDown } from '@arco-design/web-vue/es/icon'
```

如果是自定义的图标，需要先在 `packages/icons/assets` 文件夹下创建对应的 SVG 文件，务必以 `icon-` 开头，然后执行 `@v3ms/icons/` 项目中的 `build` 命令（或者全局的 `build:icons` 命令），脚本将自动生成打包后的lib文件夹，然后在其他项目中就可以直接引入使用了。如：

```typescript
import { IconChatSend } from '@v3ms/icons'
```

### ui

包含所有自定义组件的vue文件，对应的包名为 `@v3ms/ui`，对应文件夹 `packages/ui`

这个包中的组件均为有通用意义的简单组件，且不应包含业务逻辑

#### 开发组件

1. 创建组件文件夹，如 `packages/ui/src/chat`
2. 创建并开发组件Vue文件，如 `packages/ui/src/chat/Chat.vue`
3. 创建组件导出入口文件，如 `packages/ui/src/chat/index.ts`，并按如下格式填充：

```typescript
import _Chat from './Chat.vue'
import { withInstall } from '@v3ms/utils'

export const Chat = withInstall(_Chat)
export default Chat
```

4. 在组件全局入口文件中添加新组件的导出
5. 在包全局组件类型声明文件 `types/components.d.ts` 中添加新组件的声明，如

```typescript
// types/components.d.ts

import * as components from '../src/index'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // other components
    // 添加如下代码：
    Chat: typeof components.Chat
  }
}
export {}
```

### utils

包含所有自定义的工具函数的 TS 文件，对应的包名为 `@v3ms/utils`，对应文件夹 `packages/utils`

### playground

包含部分组件的快速预览页面、函数测试代码等 demo 的项目，仅用于本地开发，不对外发布，不对应产品文档的任何部分。对应的包名为 `@v3ms/playground`，对应文件夹 `playground`，可以引用上述所有项目和包

项目结构

- assets
  - img 所有静态图片资源
  - scss 所有公共 SCSS 文件
- mock 所有本地 mock 文件，参见 `其他开发说明` 中的 `本地mock`
- public 所有全局非图片静态资源
- src
  - apis 所有接口
  - components 所有非全 monorepo 公用的组件，可以包含业务逻辑
  - controller 接口请求
  - layouts 布局组件
  - model 全局类型、常量
  - router 路由
  - stores 所有 store
  - vendors 第三方库引入逻辑
  - views 所有页面
  - App.vue 根 Vue
  - main.ts 入口文件

## 其他开发说明

1. 如无必要，禁止使用any

对于 Map 类型的对象，可以使用 `Record<string, string>` 来代替

2. 推荐使用 console.log 时需要搭配环境变量 VITE_DEBUG 使用，如：

```typescript
import.meta.env.VITE_DEBUG && console.log('debug')
```

3. 直接进行类型断言失败时，可以先将源变量断言为 `unknown` 然后再断言为目标类型

### 自定义本地环境变量

如果需要定义本地环境变量，首先，在子项目根目录下的 .env[.<NODE_ENV>] 文件中，增加以 `VITE_` 开头的变量定义，如：

```env
VITE_MOCK=true
```

然后在 `.env.d.ts` 文件中 `ImportMetaEnv` 接口中增加对新环境变量的类型定义，如：

```typescript
// .env.d.ts
interface ImportMetaEnv {
  // other env variables` type definition
  readonly VITE_MOCK: string
}
```

在使用时，则直接从 `import.meta.env` 中即可读取，如：

```typescript
import.meta.env.VITE_MOCK
```

### 自定义挂载在 window 的属性

给window中增加自定义的属性后，需要在 `.env.d.ts` 中的 `Window` 接口中增加对该属性的定义，如：

```typescript
interface Window {
  $lodash: Record<string, function>
}
```

### 本地 mock

如果需要本地 mock 数据，则需要增加一个本地 mock 的配置文件，如：`mock/loadModel.ts`，该文件需要导出一个 `getMockData()` 函数，在需要使用该 mock 数据的文件中，根据 `VITE_MOCK` 环境变量的值动态引入该 mock 文件并在导入后执行 `getMockData()` 函数，如：

```typescript
import { ref } from 'vue'
const tableData = ref(Array<Model>())
import.meta.env.VITE_MOCK &&
  import('./mock/loadModel.ts').then(({ getMockData }) => {
    tableData.value = getMockData() as unknown as Array<Model>
  })
```

### 接口请求

接口请求定义在 `apis` 文件夹中，并以每一个独立的请求定义导出，如：

```typescript
// model/requestOptions.ts

export type RequestOptions = {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  disabledMessage?: string
}

// apis/model.ts

import type { RequestOptions } from '@/model/requestOptions.ts'
export const LOAD_MODEL: RequestOptions = {
  url: '/v3ms/query/loadModel',
  method: 'post'
}
```

需要用 `controller` 定义一个方法对接口的数据进行处理，如：

```typescript
// controller/loadRequestController.ts

import type { RequestOptions } from '@/model/requestOptions.ts'
import { LOAD_MODEL } from '@/apis'
import { gid } from '@v3ms/utils'
import { getRequest } from '@/vendors/request.ts'
export const loadModelController = function (
  data: AppInfo,
  requestLoading?: Ref<boolean>,
  requestOptions: RequestOptions = LOAD_MODEL
) {
  return getRequest(data, requestOptions, requestLoading).then(
    (resp: RequestResult<Array<Model>>) => {
      return resp.data.map((model: Model) => {
        return {
          ...model,
          modelName: model.name,
          modelId: model.modelId || gid()
        }
      })
    }
  )
}
```

执行请求中，需要引入对应的 controller 并传入数据并接收接口返回的数据，如：

```typescript
// HelloWorld.vue

import { loadModelController } from '@/controller/loadRequestController.ts'
const loadModel = function () {
  loadModelController(appInfo.value, loading).then((data: Array<Model>) => {
    modelList.value = data
  })
}
```

### 代码报错

如果类型检查报错，而且确认不是开发的问题，则需要进行如下排查：

1. VSCode 的 TypeScript 服务是否在使用本项目指定的 TypeScript 版本，即5.2.2，如果不是，则需要在 VSCode 右下角的状态栏中修改 VSCode 的 TypeScript 服务配置，指定为 5.2.2
2. 如果是 Vue 文件的类型检查报错，则确认本项目的 Volar 使用的是本项目指定的 TypeScript 版本，确认使用的版本正常后若报错还未消除，则输入 VSCode 的命令 `Volar:Reload Project` 重启 Volar 的校验
3. 最后，如果完全确认不是开发的问题，而且重启 VSCode 和 TS 服务都没有消除的报错，可以直接使用注释快速关闭下一行的 TS 校验

```typescript
// @ts-ignore
```

### docs

开发中遇到的问题及解决方案，可以记录在 `/docs/` 文件夹中，内容随意，后续可以整理成文档项目

## 开发规范

文件夹：中划线命名

```shell
# good case
**/store-dir/**

# base cases
**/StoreDir/**
**/storeDir/**
**/store_dir/**
```

CSS 类名: 中划线命名

```js
// good case
class="edit-modal"

// base cases
class="EditModal"
class="editModal"
class="edit_modal"
```

Vue 文件名：帕斯卡命名

```shell
# good case
EditModal.vue

# base cases
edit-modal.vue
editModal.vue
edit_modal.vue
```

Vue 文件 name 名前缀：(-)

```js
// EditModal.vue

// good case
defineOptions({
  name: 'EditModal'
})

// bad case
defineOptions({
  name: 'EditModal'
})
```

Vue 文件主类名前缀：(-)

```html
<!-- EditModal.vue -->

<!-- good case -->
<template>
  <div class="edit-modal"></div>
</template>

<!-- bad case -->
<template>
  <div class="edit-modal"></div>
</template>
```

TS 文件名、变量、函数名：驼峰命名

```ts
// good cases
const rerankModel = ref<Model>({} as Model)
import('../loadModal.ts')

// bad cases
const rerank_model = ref<Model>({} as model)
const RerankModel = function () {}
import('../load-modal.ts')
```

template 中的 Vue 组件名：帕斯卡命名

```html
<!-- good case -->
<template>
  <EditModal />
</template>

<!-- bad case -->
<template>
  <edit-modal />
</template>
```

template 中的属性名：中划线命名

```html
<!-- good case -->
<template>
  <EditModal hide-dot :modal-info="modalInfo"> some code </EditModal>
</template>

<!-- bad case -->
<template>
  <EditModal hideDot :modalInfo="modalInfo"> some code </EditModal>
</template>
```

style: 默认使用 SCSS 和 scoped

**特殊情况可以使用非 scoped（例如：给 Arco Design 的对话框增加的 `modal-class` 属性，默认无法在使用 scoped 时定义其 CSS 样式）**

```html
<!-- good case -->
<script lang="scss" scoped></script>

<!-- not recommended cases -->
<script lang="scss"></script>

<!-- bad case -->
<script></script>
```

自定义的 SVG 图标源文件名必须以 icon- 开头

```shell
# good case
icon-chat-send.svg

# base case
chat-send.svg
```

**全局定制 Arco 组件样式写在 assets/scss/main.scss 中**
