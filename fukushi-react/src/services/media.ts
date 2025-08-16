import http from './http'

export interface Media {
  id: number
  filename: string
  media_type: string
  vendor: string
  ext: string
  path: string
  s3_key?: string
  size: number
  created_by: number
  created_at: string
  updated_at: string
}

export const mediaService = {
  // Upload file directly to S3 via backend
  async uploadToS3(file: File): Promise<Media> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await http.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },

  // Get media by ID
  async getById(id: number | string): Promise<Media> {
    const response = await http.get(`/media/${id}`)
    return response.data.data
  },

  // Delete media
  async delete(id: number): Promise<void> {
    await http.delete(`/media/${id}`)
  }
}