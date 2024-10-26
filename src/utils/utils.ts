import { isToday, isPast } from 'date-fns';
import { NewTaskData, Task, TaskStatus } from '../types';

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
  if (status === 'completed') {
    return isDarkMode ? 'bg-green-900/50' : 'bg-green-100';
  }

  switch (status) {
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
