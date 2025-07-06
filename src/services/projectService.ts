
import apiClient from '@/config/api';

export interface Project {
  id: string;
  project_id: string;
  name: string;
  description: string;
  owner: string;
  status: string;
  version: string;
  created_at: string;
  lastUpdated: string;
  uploaded_documents?: any[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  owner?: string;
  is_current?: boolean;
  file: File[];
}

export const projectService = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/api/projects');
    return response.data.result || response.data;
  },

  // Get project by ID
  async getProject(id: string): Promise<Project> {
    const response = await apiClient.get(`/api/project/get?id=${id}`);
    return response.data.result || response.data;
  },

  // Create project with file upload
  async createProject(data: CreateProjectData): Promise<Project> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.owner) formData.append('owner', data.owner);
    if (data.is_current !== undefined) formData.append('is_current', data.is_current.toString());
    
    data.file.forEach((file) => {
      formData.append('file', file);
    });

    const response = await apiClient.post('/api/project/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result || response.data;
  },

  // Update project
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await apiClient.put('/api/project/update', {
      id,
      ...data,
    });
    return response.data.result || response.data;
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/api/project/delete?id=${id}`);
  },
};
