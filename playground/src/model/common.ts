export type PageQueryDto<T> = T & {
  page: number
  page_size: number
  search_word: string
}

export type PageResponseDto<T> = {
  code: string
  data: T
  message: string
  total: number
}
