import { isToday, isPast } from 'date-fns';
import { NewTaskData, Task, TaskPriority, TaskStatus } from '../types';

export const getTaskStatus = (task: Task | NewTaskData): TaskStatus => {
  if ('completed' in task && task.completed) return 'completed';
  else if (task.dueDate && isToday(task.dueDate)) return 'due-soon';
  else if (task.dueDate && isPast(task.dueDate)) return 'overdue';
  return 'upcoming';
};

export const updateTaskStatus = (tasks: Task[]): Task[] => {
  return tasks.map((task) => ({
    ...task,
    status: getTaskStatus(task),
  }));
};

export const getStatusClasses = (status: TaskStatus, isDarkMode: boolean) => {
  switch (status) {
    case 'completed':
      return isDarkMode ? 'bg-green-900/50' : 'bg-green-100';
    case 'upcoming':
      return isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100';
    case 'due-soon':
      return isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100';
    case 'overdue':
      return isDarkMode ? 'bg-red-900/50' : 'bg-red-100';
    default:
      return isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100';
  }
};

export const getPriorityClasses = (
  priority: TaskPriority,
  isDarkMode: boolean,
) => {
  switch (priority) {
    case 'low':
      return isDarkMode ? 'border-green-500' : 'border-green-400';
    case 'medium':
      return isDarkMode ? 'border-yellow-500' : 'border-yellow-400';
    case 'high':
      return isDarkMode ? 'border-red-400' : 'border-red-500';
    default:
      return isDarkMode ? 'border-green-500' : 'border-green-400';
  }
};

export const getPriorityColors = (
  isDarkMode: boolean,
): Record<TaskPriority, string> => ({
  low: `${getPriorityClasses('low', isDarkMode)} ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`,
  medium: `${getPriorityClasses('medium', isDarkMode)} ${isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100'}`,
  high: `${getPriorityClasses('high', isDarkMode)} ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`,
});
