import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const createRating = (
  serverId: ServerID,
  ratingSetId: string,
  data: RequestBody<'/api/servers/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>
> =>
  baseApi
    .post(`/api/servers/${serverId}/rating-set/${ratingSetId}/ratings`, data)
    .then((res) => res.data)

export const listCustoms = (
  serverId: ServerID,
  memberId: string,
): Promise<SuccessResponse<'/api/servers/{server_id}/members/{member_id}/customs/', 'get'>> =>
  baseApi.get(`/api/servers/${serverId}/members/${memberId}/customs/`).then((res) => res.data)

export const deleteCustom = (
  serverId: ServerID,
  memberId: string,
  customId: string,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/members/{member_id}/customs/{custom_id}', 'delete'>
> =>
  baseApi
    .delete(`/api/servers/${serverId}/members/${memberId}/customs/${customId}`)
    .then((res) => res.data)

export const getCustom = (
  serverId: ServerID,
  memberId: string,
  customId: string,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/members/{member_id}/customs/{custom_id}', 'get'>
> =>
  baseApi
    .get(`/api/servers/${serverId}/members/${memberId}/customs/${customId}`)
    .then((res) => res.data)

export const updateRatingValue = (
  serverId: ServerID,
  memberId: string,
  customId: string,
  gameRoleId: string,
  data: RequestBody<
    '/api/servers/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
    'put'
  >,
): Promise<
  SuccessResponse<
    '/api/servers/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
    'put'
  >
> =>
  baseApi
    .put(
      `/api/servers/${serverId}/members/${memberId}/customs/${customId}/ratings/${gameRoleId}`,
      data,
    )
    .then((res) => res.data)
