import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const createRating = (
  serverId: ServerID,
  ratingSetId: string,
  data: RequestBody<'/api/server/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>> =>
  baseApi
    .post(`/api/server/${serverId}/rating-set/${ratingSetId}/ratings`, data)
    .then((res) => res.data)

export const deleteRating = (
  serverId: ServerID,
  ratingSetId: string,
  ratingId: string,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/rating-set/{rating_set_id}/ratings/{rating_id}',
    'delete'
  >
> =>
  baseApi
    .delete(`/api/server/${serverId}/rating-set/${ratingSetId}/ratings/${ratingId}`)
    .then((res) => res.data)

export const updateRating = (
  serverId: ServerID,
  ratingSetId: string,
  ratingId: string,
  data: RequestBody<
    '/api/server/{server_id}/rating-set/{rating_set_id}/ratings/{rating_id}',
    'patch'
  >,
): Promise<
  SuccessResponse<'/api/server/{server_id}/rating-set/{rating_set_id}/ratings/{rating_id}', 'patch'>
> =>
  baseApi
    .patch(`/api/server/${serverId}/rating-set/${ratingSetId}/ratings/${ratingId}`, data)
    .then((res) => res.data)

export const updateRatingIcon = (
  serverId: ServerID,
  ratingSetId: string,
  ratingId: string,
  icon: File,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/rating-set/{rating_set_id}/ratings/{rating_id}/icon',
    'put'
  >
> => {
  const formData = new FormData()
  formData.append('icon', icon)
  return baseApi
    .put(`/api/server/${serverId}/rating-set/${ratingSetId}/ratings/${ratingId}/icon`, formData)
    .then((res) => res.data)
}

export const updateRatingSet = (
  serverId: ServerID,
  ratingSetId: string,
  data: RequestBody<'/api/server/{server_id}/rating-set/{rating_set_id}', 'patch'>,
): Promise<SuccessResponse<'/api/server/{server_id}/rating-set/{rating_set_id}', 'patch'>> =>
  baseApi.patch(`/api/server/${serverId}/rating-set/${ratingSetId}`, data).then((res) => res.data)

export const listCustoms = (
  serverId: ServerID,
  memberId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}/customs/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/members/${memberId}/customs/`).then((res) => res.data)

export const deleteCustom = (
  serverId: ServerID,
  memberId: string,
  customId: string,
): Promise<
  SuccessResponse<'/api/server/{server_id}/members/{member_id}/customs/{custom_id}', 'delete'>
> =>
  baseApi
    .delete(`/api/server/${serverId}/members/${memberId}/customs/${customId}`)
    .then((res) => res.data)

export const updateRatingValue = (
  serverId: ServerID,
  memberId: string,
  customId: string,
  gameRoleId: string,
  data: RequestBody<
    '/api/server/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
    'put'
  >,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
    'put'
  >
> =>
  baseApi
    .put(
      `/api/server/${serverId}/members/${memberId}/customs/${customId}/ratings/${gameRoleId}`,
      data,
    )
    .then((res) => res.data)
export const getRatingSet = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/rating-set/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/rating-set/`).then((res) => res.data)
