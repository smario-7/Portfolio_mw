import {
  countAllStorageFiles as countAllStorageFilesApi,
  listProjectFilePaths as listProjectFilePathsApi,
  uploadProjectFile as uploadProjectFileApi,
  deleteProjectFile as deleteProjectFileApi,
  deleteProjectStorage as deleteProjectStorageApi,
  initProjectStorage as initProjectStorageApi,
} from '@/lib/api/storage-api'

export type { UploadFileResponse } from '@/lib/api/storage-api'

export async function countAllStorageFiles(): Promise<number> {
  return countAllStorageFilesApi()
}

export async function listProjectFilePaths(projectId: number): Promise<string[]> {
  return listProjectFilePathsApi(projectId)
}

export async function uploadProjectFile(projectId: number, file: File) {
  return uploadProjectFileApi(projectId, file)
}

export async function deleteProjectFile(projectId: number, path: string): Promise<void> {
  return deleteProjectFileApi(projectId, path)
}

export async function deleteProjectStorage(projectId: number): Promise<void> {
  return deleteProjectStorageApi(projectId)
}

export async function initProjectStorage(projectId: number): Promise<void> {
  return initProjectStorageApi(projectId)
}
