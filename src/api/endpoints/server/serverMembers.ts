import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const addRestriction = (
  serverId: ServerID,
  memberId: string,
  data: RequestBody<'/api/server/{server_id}/members/{member_id}/restrictions', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}/restrictions', 'post'>> =>
  baseApi
    .post(`/api/server/${serverId}/members/${memberId}/restrictions`, data)
    .then((res) => res.data)

export const getRestrictions = (
  serverId: ServerID,
  memberId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}/restrictions', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/members/${memberId}/restrictions`).then((res) => res.data)

export const removeRestriction = (
  serverId: ServerID,
  memberId: string,
  restrictionId: string,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/members/{member_id}/restrictions/{member_restriction_id}',
    'delete'
  >
> =>
  baseApi
    .delete(`/api/server/${serverId}/members/${memberId}/restrictions/${restrictionId}`)
    .then((res) => res.data)

export const createVirtualMember = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}/members/virtual', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/members/virtual', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/members/virtual`, data).then((res) => res.data)

export const getMember = (
  serverId: ServerID,
  memberId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/members/${memberId}`).then((res) => res.data)

export const kickMember = (
  serverId: ServerID,
  memberId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}', 'delete'>> =>
  baseApi.delete(`/api/server/${serverId}/members/${memberId}`).then((res) => res.data)

export const updateMember = (
  serverId: ServerID,
  memberId: string,
  data: RequestBody<'/api/server/{server_id}/members/{member_id}', 'patch'>,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}', 'patch'>> =>
  baseApi.patch(`/api/server/${serverId}/members/${memberId}`, data).then((res) => res.data)

export const joinServer = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}/members/', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/members/', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/members/`, data).then((res) => res.data)

export const listMembers = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/members/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/members/`).then((res) => res.data)

export const migrateMember = (
  serverId: ServerID,
  memberId: string,
  data: RequestBody<'/api/server/{server_id}/members/{member_id}/migrate', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/members/{member_id}/migrate', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/members/${memberId}/migrate`, data).then((res) => res.data)

export const getCurrentMember = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/members/me', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/members/me`).then((res) => res.data)
