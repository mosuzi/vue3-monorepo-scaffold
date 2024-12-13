import { type RouteRecordRaw } from 'vue-router'
const subRoutes = [
  {
    path: 'dynamic-form',
    name: 'dynamic-form',
    title: '动态表单',
    component: () => import('../views/DynamicFormView.vue')
  },
  {
    path: 'test-request',
    name: 'test-request',
    title: '测试请求',
    component: () => import('../views/TestRequestView.vue')
  }
] as (RouteRecordRaw & {
  title: string
  name: string
  children?: (RouteRecordRaw & { title: string; name: string })[]
})[]

export default subRoutes
