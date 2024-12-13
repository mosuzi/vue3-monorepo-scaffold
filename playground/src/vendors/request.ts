import {
  createAxiosInstance,
  defaultResponseInterceptor,
  addResponseInterceptor
} from '@v3ms/utils'
import { type AxiosInstance } from 'axios'

export const axiosInstance: AxiosInstance = createAxiosInstance({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

addResponseInterceptor(defaultResponseInterceptor)
