import { type AxiosResponse } from 'axios'
export const defaultRequestInterceptor = function () {
  //todo:
}

export const defaultResponseInterceptor = function (response: AxiosResponse) {
  if (!response.data) throw new Error('response.data is null')
  if (response.data && response.data.code !== 'ok') throw new Error(response.data.message)
  return response.data
}
