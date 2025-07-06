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

export interface Todo {
  id: string;
  text: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

export interface DevLogEntry {
  id: string;
  title?: string;
  description?: string;
  entry: string;
  date: string;
}

export interface Doc {
  id: string;
  type: 'Model' | 'Route' | 'API' | 'Util' | 'ENV' | 'Auth' | 'Runtime' | 'Framework';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'demo' | 'docs' | 'other';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  
  // Notes Section
  notes: string;
  todos: Todo[];
  devLog: DevLogEntry[];
  
  // NEW: Documentation Templates
  docs: Doc[];
  
  // Settings Section
  stagingEnvironment: 'development' | 'staging' | 'production';
  links: Link[];
  color: string;
  category: string;
  tags: string[];
  
  // Existing fields
  isArchived: boolean;
  isShared: boolean;
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
  notes?: string;
  stagingEnvironment?: 'development' | 'staging' | 'production';
  color?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  notes?: string;
  stagingEnvironment?: 'development' | 'staging' | 'production';
  color?: string;
  category?: string;
  tags?: string[];
}

export interface CreateTodoData {
  text: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTodoData {
  text?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export interface CreateDevLogData {
  title?: string;
  description?: string;
  entry: string;
}

export interface UpdateDevLogData {
  title?: string;
  description?: string;
  entry: string;
}

export interface CreateDocData {
  type: 'Model' | 'Route' | 'API' | 'Util' | 'ENV' | 'Auth' | 'Runtime' | 'Framework';
  title: string;
  content: string;
}

export interface UpdateDocData {
  type?: 'Model' | 'Route' | 'API' | 'Util' | 'ENV' | 'Auth' | 'Runtime' | 'Framework';
  title?: string;
  content?: string;
}

export interface CreateLinkData {
  title: string;
  url: string;
  type?: 'github' | 'demo' | 'docs' | 'other';
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
  
  archive: (id: string, isArchived: boolean): Promise<ProjectResponse> =>
    apiClient.patch(`/projects/${id}/archive`, { isArchived }).then(res => res.data),
  
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${id}`).then(res => res.data),
  
  // Todo management
  createTodo: (projectId: string, data: CreateTodoData): Promise<{ message: string; todo: Todo }> =>
    apiClient.post(`/projects/${projectId}/todos`, data).then(res => res.data),
  
  updateTodo: (projectId: string, todoId: string, data: UpdateTodoData): Promise<{ message: string; todo: Todo }> =>
    apiClient.put(`/projects/${projectId}/todos/${todoId}`, data).then(res => res.data),
  
  deleteTodo: (projectId: string, todoId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/todos/${todoId}`).then(res => res.data),
  
  // Dev log management
  createDevLogEntry: (projectId: string, data: CreateDevLogData): Promise<{ message: string; entry: DevLogEntry }> =>
    apiClient.post(`/projects/${projectId}/devlog`, data).then(res => res.data),
  
  updateDevLogEntry: (projectId: string, entryId: string, data: UpdateDevLogData): Promise<{ message: string; entry: DevLogEntry }> =>
    apiClient.put(`/projects/${projectId}/devlog/${entryId}`, data).then(res => res.data),
  
  deleteDevLogEntry: (projectId: string, entryId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/devlog/${entryId}`).then(res => res.data),
  
  // NEW: Docs management
  createDoc: (projectId: string, data: CreateDocData): Promise<{ message: string; doc: Doc }> =>
    apiClient.post(`/projects/${projectId}/docs`, data).then(res => res.data),
  
  updateDoc: (projectId: string, docId: string, data: UpdateDocData): Promise<{ message: string; doc: Doc }> =>
    apiClient.put(`/projects/${projectId}/docs/${docId}`, data).then(res => res.data),
  
  deleteDoc: (projectId: string, docId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/docs/${docId}`).then(res => res.data),
  
  // Links management
  createLink: (projectId: string, data: CreateLinkData): Promise<{ message: string; link: Link }> =>
    apiClient.post(`/projects/${projectId}/links`, data).then(res => res.data),

  deleteLink: (projectId: string, linkId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/links/${linkId}`).then(res => res.data),
};