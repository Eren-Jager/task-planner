export interface Task {
  id: string;
  title: string;
  description: string;
  taskDate: string;
  time?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskStatus = 'upcoming' | 'due-soon' | 'overdue' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface NewTaskData {
  title: string;
  description?: string;
  taskDate: string;
  time?: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  dateRange?: [Date | null, Date | null];
  searchTerm?: string;
}

export interface Theme {
  background: string;
  text: string;
  border: string;
  hover: string;
  taskColors: Record<string, string>;
  isDarkMode: boolean;
}

export interface ThemeConfig {
  light: Theme;
  dark: Theme;
}
