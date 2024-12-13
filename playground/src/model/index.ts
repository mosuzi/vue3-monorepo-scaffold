export * from './common'

export type PartialPart<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
