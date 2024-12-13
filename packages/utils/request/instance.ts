import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { type Ref } from 'vue'

export const axiosContext: {
  axiosInstance: AxiosInstance | null
} = {
  axiosInstance: null
}

export const createAxiosInstance = function (createOptions: CreateAxiosDefaults): AxiosInstance {
  if (axiosContext.axiosInstance) return axiosContext.axiosInstance
  const axiosInstance = axios.create(createOptions)
  axiosContext.axiosInstance = axiosInstance
  return axiosInstance
}

export const getAxiosInstance = function (): AxiosInstance {
  if (!axiosContext.axiosInstance) throw new Error('Axios instance not initialized')
  return axiosContext.axiosInstance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addRequestInterceptor = function (...args: any[]) {
  const instance = getAxiosInstance()
  instance.interceptors.request.use(...args)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addResponseInterceptor = function (...args: any[]) {
  const instance = getAxiosInstance()
  instance.interceptors.response.use(...args)
}

export const sendRequest = function (options: AxiosRequestConfig, requestLoading?: Ref<boolean>) {
  // 融合params和data参数，源类型中params和data均为any，因此暂时不需要做类型转换
  if (options.method && options.method.toLocaleLowerCase() !== 'get') {
    if (options.params) {
      options.data = options.params
      delete options.params
    }
  }
  requestLoading && (requestLoading.value = true)
  return getAxiosInstance()
    .request(options)
    .finally(() => {
      requestLoading && (requestLoading.value = false)
    })
}

export const useData = function <T>(promisedResponse: Promise<AxiosResponse>) {
  return promisedResponse.then(resp => resp.data as T)
}
