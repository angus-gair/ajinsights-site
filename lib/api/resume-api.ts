// API client for resume operations

export interface ResumeData {
  id?: string
  userId?: string
  jobDescription?: File | string
  jobText?: string
  jobFileName?: string
  jobFileSize?: number
  sourceDocuments: File[]
  generationConfig: {
    aiModel?: string
    template?: string
    language?: string
    wordLimit?: number
    emphasis?: string[]
  }
  generatedResume?: string
  finalResume?: string
  createdAt?: string
  updatedAt?: string
  status?: 'DRAFT' | 'GENERATING' | 'GENERATED' | 'REVIEWING' | 'FINALIZED' | 'EXPORTED'
}

export interface SavedDocument {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl?: string
  fileContent?: string
  uploadedAt: string
}

export interface SavedResumeData extends Omit<ResumeData, 'sourceDocuments'> {
  id: string
  sourceDocuments: SavedDocument[]
  createdAt: string
  updatedAt: string
}

class ResumeAPI {
  private baseUrl = '/api/resumes'

  // Create a new resume
  async createResume(data: ResumeData): Promise<SavedResumeData> {
    try {
      // Convert File objects to serializable format
      // In production, you would upload files to cloud storage first
      const serializedData = {
        ...data,
        sourceDocuments: await Promise.all(
          data.sourceDocuments.map(async (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            // In production: upload file and get URL
            // const url = await uploadToCloudStorage(file)
            // return { ...fileData, url }
          }))
        )
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create resume')
      }

      const result = await response.json()
      return result.resume
    } catch (error) {
      console.error('Error creating resume:', error)
      throw error
    }
  }

  // Get a specific resume by ID
  async getResume(id: string): Promise<SavedResumeData> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch resume')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching resume:', error)
      throw error
    }
  }

  // Get all resumes with pagination
  async getAllResumes(options?: {
    page?: number
    limit?: number
    userId?: string
  }): Promise<{
    resumes: SavedResumeData[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }> {
    try {
      const params = new URLSearchParams()
      if (options?.page) params.append('page', options.page.toString())
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.userId) params.append('userId', options.userId)

      const response = await fetch(`${this.baseUrl}?${params}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch resumes')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching resumes:', error)
      throw error
    }
  }

  // Update an existing resume
  async updateResume(id: string, data: Partial<ResumeData>): Promise<SavedResumeData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update resume')
      }

      const result = await response.json()
      return result.resume
    } catch (error) {
      console.error('Error updating resume:', error)
      throw error
    }
  }

  // Delete a resume
  async deleteResume(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      throw error
    }
  }

  // Save current progress (convenience method)
  async saveProgress(resumeId: string | undefined, data: ResumeData): Promise<SavedResumeData> {
    if (resumeId) {
      return this.updateResume(resumeId, data)
    } else {
      return this.createResume(data)
    }
  }
}

// Export singleton instance
export const resumeAPI = new ResumeAPI()
