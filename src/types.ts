export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string; 
  status: TaskStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  email: string;
}


