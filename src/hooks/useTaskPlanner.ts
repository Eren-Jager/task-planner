import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskFilters } from '../types';
import { StorageService } from '../services/storageService';
import { getTaskStatus } from '../utils/utils';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const useTaskPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setTasks(StorageService.loadTasks());
    setIsDarkMode(StorageService.loadTheme());
  }, []);

  const addTask = useCallback((taskData: Partial<Task>): boolean => {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || '',
      description: taskData.description || '',
      taskDate: taskData.taskDate || '',
      time: taskData.time || '09:00',
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: getTaskStatus(taskData as Task),
      priority: taskData.priority || 'medium',
    };

    setTasks((prevTasks) => {
      const newTasks = [...prevTasks, newTask];
      StorageService.saveTasks(newTasks);
      return newTasks;
    });
    return true;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    try {
      setTasks((prevTasks) => {
        const taskIndex = prevTasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) return prevTasks;

        const newTasks = [...prevTasks];
        const currentTask = newTasks[taskIndex];

        const updatedTask = {
          ...currentTask,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        if (updatedTask.dueDate && updatedTask.taskDate) {
          updatedTask.dueDate = format(
            new Date(
              Math.max(
                new Date(updatedTask.taskDate).getTime(),
                new Date(updatedTask.dueDate).getTime(),
              ),
            ),
            'yyyy-MM-dd',
          );
        }

        updatedTask.status = getTaskStatus(updatedTask);
        newTasks[taskIndex] = updatedTask;

        StorageService.saveTasks(newTasks);
        return newTasks;
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== taskId);
      StorageService.saveTasks(newTasks);
      return newTasks;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      StorageService.saveTheme(newValue);
      return newValue;
    });
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term),
      );
    }

    if (filters.status?.length) {
      result = result.filter((task) => filters.status?.includes(task.status));
    }

    if (filters.priority?.length) {
      result = result.filter((task) =>
        filters.priority?.includes(task.priority),
      );
    }

    return result;
  }, [tasks, searchTerm, filters]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    addTask,
    updateTask,
    deleteTask,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    isDarkMode,
    toggleDarkMode,
  };
};
