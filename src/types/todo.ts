export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  number: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
} 