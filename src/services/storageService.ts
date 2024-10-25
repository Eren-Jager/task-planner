import { Task } from '../types';

const STORAGE_KEY = 'task-planner-data';

export class StorageService {
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  }

  static loadTasks(): Task[] {
    try {
      const tasksString = localStorage.getItem(STORAGE_KEY);

      if (!tasksString) return [];

      const tasks = JSON.parse(tasksString);
      return tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }
  static saveTheme(isDark: boolean): void {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  static loadTheme(): boolean {
    return localStorage.getItem('theme') === 'dark';
  }
}
