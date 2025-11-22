export type Nullable<T> = null | undefined | T

export type Id = string | number
export type OmitId<T> = Omit<T, 'id'>
