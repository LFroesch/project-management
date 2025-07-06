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
  theme: string; // NEW: User's preferred theme
}

// NEW: Individual note interface
export interface Note {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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

// Tech stack interfaces
export interface SelectedTechnology {
  category: 'styling' | 'database' | 'framework' | 'runtime' | 'deployment' | 'testing' | 'tooling';
  name: string;
  version: string;
}

export interface SelectedPackage {
  category: 'ui' | 'state' | 'routing' | 'forms' | 'animation' | 'utility' | 'api' | 'auth' | 'data';
  name: string;
  version: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  
  // Notes Section - UPDATED: Now an array of individual notes
  notes: Note[];
  todos: Todo[];
  devLog: DevLogEntry[];
  
  // Documentation Templates
  docs: Doc[];
  
  // Tech Stack & Packages
  selectedTechnologies: SelectedTechnology[];
  selectedPackages: SelectedPackage[];
  
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
  theme?: string; // NEW: Optional theme on registration
}

export interface CreateProjectData {
  name: string;
  description: string;
  stagingEnvironment?: 'development' | 'staging' | 'production';
  color?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  stagingEnvironment?: 'development' | 'staging' | 'production';
  color?: string;
  category?: string;
  tags?: string[];
  selectedTechnologies?: SelectedTechnology[];
  selectedPackages?: SelectedPackage[];
}

// NEW: Note data interfaces
export interface CreateNoteData {
  title: string;
  description?: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  description?: string;
  content?: string;
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

export interface UpdateLinkData {
  title?: string;
  url?: string;
  type?: 'github' | 'demo' | 'docs' | 'other';
}

// Tech stack data interfaces
export interface CreateTechnologyData {
  category: 'styling' | 'database' | 'framework' | 'runtime' | 'deployment' | 'testing' | 'tooling';
  name: string;
  version?: string;
}

export interface CreatePackageData {
  category: 'ui' | 'state' | 'routing' | 'forms' | 'animation' | 'utility' | 'api' | 'auth' | 'data';
  name: string;
  version?: string;
  description?: string;
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
  
  updateTheme: (theme: string): Promise<{ message: string; user: User }> =>
    apiClient.patch('/auth/theme', { theme }).then(res => res.data),
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
  
  // NEW: Notes management
  createNote: (projectId: string, data: CreateNoteData): Promise<{ message: string; note: Note }> =>
    apiClient.post(`/projects/${projectId}/notes`, data).then(res => res.data),
  
  updateNote: (projectId: string, noteId: string, data: UpdateNoteData): Promise<{ message: string; note: Note }> =>
    apiClient.put(`/projects/${projectId}/notes/${noteId}`, data).then(res => res.data),
  
  deleteNote: (projectId: string, noteId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/notes/${noteId}`).then(res => res.data),
  
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
  
  // Docs management
  createDoc: (projectId: string, data: CreateDocData): Promise<{ message: string; doc: Doc }> =>
    apiClient.post(`/projects/${projectId}/docs`, data).then(res => res.data),
  
  updateDoc: (projectId: string, docId: string, data: UpdateDocData): Promise<{ message: string; doc: Doc }> =>
    apiClient.put(`/projects/${projectId}/docs/${docId}`, data).then(res => res.data),
  
  deleteDoc: (projectId: string, docId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/docs/${docId}`).then(res => res.data),
  
  // Links management
  createLink: (projectId: string, data: CreateLinkData): Promise<{ message: string; link: Link }> =>
    apiClient.post(`/projects/${projectId}/links`, data).then(res => res.data),

  updateLink: (projectId: string, linkId: string, data: UpdateLinkData): Promise<{ message: string; link: Link }> =>
    apiClient.put(`/projects/${projectId}/links/${linkId}`, data).then(res => res.data),

  deleteLink: (projectId: string, linkId: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/links/${linkId}`).then(res => res.data),
  
  // Tech stack management
  addTechnology: (projectId: string, data: CreateTechnologyData): Promise<{ message: string; technology: SelectedTechnology }> =>
    apiClient.post(`/projects/${projectId}/technologies`, data).then(res => res.data),
  
  removeTechnology: (projectId: string, category: string, name: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/technologies/${category}/${encodeURIComponent(name)}`).then(res => res.data),
  
  // Packages management
  addPackage: (projectId: string, data: CreatePackageData): Promise<{ message: string; package: SelectedPackage }> =>
    apiClient.post(`/projects/${projectId}/packages`, data).then(res => res.data),
  
  removePackage: (projectId: string, category: string, name: string): Promise<{ message: string }> =>
    apiClient.delete(`/projects/${projectId}/packages/${category}/${encodeURIComponent(name)}`).then(res => res.data),
};