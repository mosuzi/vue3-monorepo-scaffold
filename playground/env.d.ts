/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG: string
  readonly VITE_MOCK: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
