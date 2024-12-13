import { LOAD_LOCAL_PROJECT_JSON, GET_INFO } from '../apis'
import { sendRequest, useData } from '@v3ms/utils'
import { type Ref } from 'vue'

export const loadLocalProjectJsonController = function (
  requestLoading?: Ref<boolean>
): ReturnType<typeof sendRequest> {
  return sendRequest(LOAD_LOCAL_PROJECT_JSON, requestLoading).then(response => {
    return { ...response, moment: Date.now().toString() }
  })
}

export const localInfo = function (requestLoading?: Ref<boolean>): ReturnType<typeof sendRequest> {
  return useData(sendRequest(GET_INFO, requestLoading))
}
