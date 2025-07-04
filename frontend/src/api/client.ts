import axios from 'axios';

// Use relative URL since we're using Vite proxy
const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
});

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  notes: string;
  staging: string;
  roadmap: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ProjectResponse {
  message: string;
  project: Project;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  notes: string;
  staging: string;
  roadmap: string;
}

export interface UpdateProjectData {
  name: string;
  description: string;
  notes: string;
  staging: string;
  roadmap: string;
}

export const authAPI = {
  register: (data: RegisterData): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data).then(res => res.data),
  
  login: (data: LoginData): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then(res => res.data),
  
  logout: (): Promise<{ message: string }> =>
    apiClient.post('/auth/logout').then(res => res.data),
  
  getMe: (): Promise<{ user: User }> =>
    apiClient.get('/auth/me').then(res => res.data),
};

export const projectAPI = {
  create: (data: CreateProjectData): Promise<ProjectResponse> =>
    apiClient.post('/projects', data).then(res => res.data),
  
  getAll: (): Promise<{ projects: Project[] }> =>
    apiClient.get('/projects').then(res => res.data),
  
  getById: (id: string): Promise<{ project: Project }> =>
    apiClient.get(`/projects/${id}`).then(res => res.data),
  
  update: (id: string, data: UpdateProjectData): Promise<ProjectResponse> =>
    apiClient.put(`/projects/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${id}`).then(res => res.data),
};