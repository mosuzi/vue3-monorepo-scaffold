import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source'
import { combineURLs } from '../string'

export class RetriableError extends Error {}
export class FatalError extends Error {}

export type BeforeSendFunc = (sRC: StreamRequestConfig) => StreamRequestConfig | void

export type StreamRequestConfig = {
  url?: string
  base?: string
  headers?: { [key: string]: string }
  abortController?: AbortController
  beforeSend?: BeforeSendFunc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  method?: string
  responseType?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onmessage?: (data: Record<string, any> | string) => void
  onclose?: () => void
  onopen?: () => void
  onerror?: (error: Error) => void
}

export type StreamRequest = StreamRequestConfig & {
  url: string
}

const defaultStreamRequestConfig: StreamRequestConfig = {
  base: '',
  url: '',
  headers: { 'Content-Type': 'application/json' },
  method: 'get',
  responseType: 'json'
}

const streamRequestConfig: StreamRequestConfig = {
  url: ''
}

export const setStreamRequestConfig = function (sRC: StreamRequestConfig) {
  Object.assign(streamRequestConfig, sRC)
}

export const sendStreamRequest = function (sRC?: StreamRequest) {
  const newSRC = {
    ...defaultStreamRequestConfig,
    ...streamRequestConfig,
    ...(sRC || {})
  } as StreamRequest
  if (newSRC.beforeSend instanceof Function) {
    const r = newSRC.beforeSend(newSRC)
    if (r) Object.assign(newSRC, r)
  }
  if (!newSRC.url && !newSRC.base) return
  const validBody = newSRC.body ? JSON.stringify(newSRC.body) : undefined
  fetchEventSource(newSRC.base ? combineURLs(newSRC.base, newSRC.url) : newSRC.url, {
    method: newSRC.method,
    headers: newSRC.headers,
    body: validBody,
    signal: newSRC.abortController?.signal,
    async onopen(response) {
      if (response.ok && response.headers.get('content-type')?.includes(EventStreamContentType)) {
        if (newSRC.onopen instanceof Function) {
          newSRC.onopen()
        }
        return // everything's good
      } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        // client-side errors are usually non-retriable:
        throw new FatalError()
      } else {
        throw new RetriableError()
      }
    },
    onmessage(msg) {
      // if the server emits an error message, throw an exception
      // so it gets handled by the onerror callback below:
      if (msg.event === 'FatalError') {
        throw new FatalError(msg.data)
      }
      if (newSRC.onmessage instanceof Function) {
        if (newSRC.responseType === 'json') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newSRC.onmessage(JSON.parse(msg.data) as Record<string, any>)
        } else {
          newSRC.onmessage(msg.data as string)
        }
      }
    },
    onclose() {
      if (newSRC.onclose instanceof Function) {
        newSRC.onclose()
      }
      // if the server closes the connection unexpectedly, retry:
      //   throw new RetriableError()
    },
    onerror(err) {
      if (newSRC.onerror instanceof Function) {
        newSRC.onerror(err)
      } else {
        // do not retry
        throw err
      }
      // if (err instanceof FatalError) {
      //   throw err // rethrow to stop the operation
      // } else {
      //   // do nothing to automatically retry. You can also
      //   // return a specific retry interval here.
      // }
    }
  })
}
