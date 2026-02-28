import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  countAllStorageFiles,
  listProjectFilePaths,
  uploadProjectFile,
  deleteProjectFile,
  deleteProjectStorage,
  initProjectStorage,
} from '@/lib/services/storage-service'
import * as storageApi from '@/lib/api/storage-api'

vi.mock('@/lib/api/storage-api', () => ({
  countAllStorageFiles: vi.fn(),
  listProjectFilePaths: vi.fn(),
  uploadProjectFile: vi.fn(),
  deleteProjectFile: vi.fn(),
  deleteProjectStorage: vi.fn(),
  initProjectStorage: vi.fn(),
}))

describe('storage-service', () => {
  beforeEach(() => {
    vi.mocked(storageApi.countAllStorageFiles).mockReset()
    vi.mocked(storageApi.listProjectFilePaths).mockReset()
    vi.mocked(storageApi.uploadProjectFile).mockReset()
    vi.mocked(storageApi.deleteProjectFile).mockReset()
    vi.mocked(storageApi.deleteProjectStorage).mockReset()
    vi.mocked(storageApi.initProjectStorage).mockReset()
  })

  describe('countAllStorageFiles', () => {
    it('returns count from API', async () => {
      vi.mocked(storageApi.countAllStorageFiles).mockResolvedValue(7)
      const result = await countAllStorageFiles()
      expect(storageApi.countAllStorageFiles).toHaveBeenCalledTimes(1)
      expect(result).toBe(7)
    })
  })

  describe('listProjectFilePaths', () => {
    it('returns paths from API for project id', async () => {
      const paths = ['1/screenshot.png', '1/readme.md']
      vi.mocked(storageApi.listProjectFilePaths).mockResolvedValue(paths)
      const result = await listProjectFilePaths(1)
      expect(storageApi.listProjectFilePaths).toHaveBeenCalledWith(1)
      expect(result).toEqual(paths)
    })
  })

  describe('uploadProjectFile', () => {
    it('calls API with projectId and file and returns response', async () => {
      const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' })
      const response = { path: '1/doc.pdf', label: 'doc.pdf', type: 'pdf' }
      vi.mocked(storageApi.uploadProjectFile).mockResolvedValue(response)
      const result = await uploadProjectFile(2, file)
      expect(storageApi.uploadProjectFile).toHaveBeenCalledWith(2, file)
      expect(result).toEqual(response)
    })
  })

  describe('deleteProjectFile', () => {
    it('calls API with projectId and path', async () => {
      vi.mocked(storageApi.deleteProjectFile).mockResolvedValue(undefined)
      await deleteProjectFile(1, '1/screenshot.png')
      expect(storageApi.deleteProjectFile).toHaveBeenCalledWith(1, '1/screenshot.png')
    })
  })

  describe('deleteProjectStorage', () => {
    it('calls API with projectId', async () => {
      vi.mocked(storageApi.deleteProjectStorage).mockResolvedValue(undefined)
      await deleteProjectStorage(3)
      expect(storageApi.deleteProjectStorage).toHaveBeenCalledWith(3)
    })
  })

  describe('initProjectStorage', () => {
    it('calls API with projectId', async () => {
      vi.mocked(storageApi.initProjectStorage).mockResolvedValue(undefined)
      await initProjectStorage(5)
      expect(storageApi.initProjectStorage).toHaveBeenCalledWith(5)
    })
  })
})
