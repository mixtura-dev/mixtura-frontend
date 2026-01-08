import type { paths } from '@/types/api'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

type ExtractJsonContent<T> = T extends { content: { 'application/json': infer Json } }
  ? Json
  : T extends { content: { '*/*': infer Any } }
    ? Any
    : undefined

type ExtractSuccessResponse<T> = T extends { responses: infer R }
  ? R extends { 200: infer S }
    ? ExtractJsonContent<S>
    : R extends { 201: infer S }
      ? ExtractJsonContent<S>
      : R extends { 202: infer S }
        ? ExtractJsonContent<S>
        : R extends { 204: infer S }
          ? ExtractJsonContent<S>
          : never
  : never

export type SuccessResponse<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path] ? ExtractSuccessResponse<paths[Path][Method]> : never

export type RequestBody<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? paths[Path][Method] extends { requestBody: { content: { 'application/json': infer Json } } }
    ? Json
    : paths[Path][Method] extends { requestBody?: { content: { 'application/json': infer Json } } }
      ? Json | undefined
      : undefined
  : never

export type PathParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? paths[Path][Method] extends { parameters: { path: infer P } }
    ? P
    : never
  : never

export type QueryParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? paths[Path][Method] extends { parameters: { query: infer Q } }
    ? Q
    : never
  : never
