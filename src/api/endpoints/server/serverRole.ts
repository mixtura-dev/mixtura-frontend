import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const getRoleSet = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/role-set/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/role-set/`).then((res) => res.data)

export const createRole = (
  serverId: ServerID,
  roleSetId: string,
  data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}/role', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}/role', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/role-set/${roleSetId}/role`, data).then((res) => res.data)

export const deleteRole = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
): Promise<
  SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}/roles/{role_id}', 'delete'>
> =>
  baseApi
    .delete(`/api/server/${serverId}/role-set/${roleSetId}/roles/${roleId}`)
    .then((res) => res.data)

export const updateRole = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
  data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}/role/{role_id}', 'patch'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}/role/{role_id}', 'patch'>
> =>
  baseApi
    .patch(`/api/server/${serverId}/role-set/${roleSetId}/role/${roleId}`, data)
    .then((res) => res.data)

export const updateRoleIcon = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
  icon: File,
): Promise<
  SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}/roles/{role_id}/icon', 'put'>
> => {
  const formData = new FormData()
  formData.append('icon', icon)
  return baseApi
    .put(`/api/server/${serverId}/role-set/${roleSetId}/roles/${roleId}/icon`, formData)
    .then((res) => res.data)
}

export const deleteRoleIcon = (
  serverId: ServerID,
  roleSetId: string,
  roleId: string,
): Promise<
  SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}/roles/{role_id}/icon', 'delete'>
> =>
  baseApi
    .delete(`/api/server/${serverId}/role-set/${roleSetId}/roles/${roleId}/icon`)
    .then((res) => res.data)

export const updateRoleSet = (
  serverId: ServerID,
  roleSetId: string,
  data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}', 'patch'>,
): Promise<SuccessResponse<'/api/server/{server_id}/role-set/{role_set_id}', 'patch'>> =>
  baseApi.patch(`/api/server/${serverId}/role-set/${roleSetId}`, data).then((res) => res.data)
