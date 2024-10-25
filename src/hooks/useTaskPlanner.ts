import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../types';
import { StorageService } from '../services/storageService';

export const useTaskPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setTasks(StorageService.loadTasks());
    setIsDarkMode(StorageService.loadTheme());
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.status?.length) {
      filtered = filtered.filter((task) =>
        filters.status?.includes(task.status),
      );
    }

    if (filters.priority?.length) {
      filtered = filtered.filter((task) =>
        filters.priority?.includes(task.priority),
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filters]);

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      taskDate: taskData.taskDate || '',
      time: taskData.time,
      dueDate: taskData.dueDate || taskData.taskDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'upcoming',
      priority: taskData.priority || 'medium',
    };
    setTasks((prev) => {
      const newTaskList = [...prev, newTask];
      StorageService.saveTasks(newTaskList);
      return newTaskList;
    });
    return true;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const newTaskList = prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task,
      );
      StorageService.saveTasks(newTaskList);
      return newTaskList;
    });
    return true;
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => {
      const newTaskList = prev.filter((task) => task.id !== taskId);
      StorageService.saveTasks(newTaskList);
      return newTaskList;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    StorageService.saveTheme(!isDarkMode);
  };

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
