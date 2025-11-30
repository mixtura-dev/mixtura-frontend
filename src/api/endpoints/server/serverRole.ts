import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const getRoleSet = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/servers/{server_id}/role-set/', 'get'>> =>
  baseApi.get(`/api/servers/${serverId}/role-set/`).then((res) => res.data)

export const createRole = (
  serverId: ServerID,
  roleSetId: string,
  data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}/roles', 'post'>,
): Promise<SuccessResponse<'/api/servers/{server_id}/role-set/{role_set_id}/roles', 'post'>> =>
  baseApi.post(`/api/servers/${serverId}/role-set/${roleSetId}/roles`, data).then((res) => res.data)

export const deleteRole = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}', 'delete'>
> =>
  baseApi
    .delete(`/api/servers/${serverId}/role-set/${roleSetId}/roles/${roleId}`)
    .then((res) => res.data)

export const updateRole = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
  data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}', 'patch'>,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}', 'patch'>
> =>
  baseApi
    .patch(`/api/servers/${serverId}/role-set/${roleSetId}/roles/${roleId}`, data)
    .then((res) => res.data)

export const updateRoleIcon = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
  data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}/icon', 'put'>,
): Promise<
  SuccessResponse<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}/icon', 'put'>
> =>
  baseApi
    .put(`/api/servers/${serverId}/role-set/${roleSetId}/roles/${roleId}/icon`, data)
    .then((res) => res.data)

export const updateRoleSet = (
  serverId: ServerID,
  roleSetId: string,
  data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}', 'patch'>,
): Promise<SuccessResponse<'/api/servers/{server_id}/role-set/{role_set_id}', 'patch'>> =>
  baseApi.patch(`/api/servers/${serverId}/role-set/${roleSetId}`, data).then((res) => res.data)
