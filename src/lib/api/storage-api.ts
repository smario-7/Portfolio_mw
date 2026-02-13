import { apiRequest } from './client'

export interface UploadFileResponse {
  path: string
  label: string
  type?: string
}

export async function uploadProjectFile(
  projectId: number,
  file: File
): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadFileResponse>(`/api/projects/${projectId}/upload`, {
    method: 'POST',
    body: formData,
  })
}
