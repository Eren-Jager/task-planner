import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AddTaskModal from '../components/AddTaskModal';
import CalendarHeader from '../components/CalendarHeader';
import EditTaskModal from '../components/EditTaskModal';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import SearchFilter from '../components/SearchFilter';
import WeekView from '../components/WeekView/WeekView';
import { useTaskPlanner } from '../hooks/useTaskPlanner';
import { NewTaskData, Task } from '../types';
import { format, addDays } from 'date-fns';
import { theme } from '../config/theme';
import MonthView from '../components/MonthView/MonthView';
import { pageVariants } from '../utils/transitions';
import { getTaskStatus } from '../utils/utils';

const TaskPlanner: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    setSearchTerm,
    setFilters,
    isDarkMode,
    toggleDarkMode,
  } = useTaskPlanner();

  const currentTheme = theme[isDarkMode ? 'dark' : 'light'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthView, setIsMonthView] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.code) {
          case 'ArrowRight':
            e.preventDefault();
            nextPeriod();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            prevPeriod();
            break;
          case 'KeyV':
            e.preventDefault();
            handleViewChange(!isMonthView);
            break;
          case 'KeyT':
            e.preventDefault();
            setCurrentDate(new Date());
            break;
          case 'KeyN':
            e.preventDefault();
            setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
            setIsAddingTask(true);
            break;
          case 'KeyD':
            e.preventDefault();
            toggleDarkMode();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextPeriod = useCallback(() => {
    setCurrentDate((prevDate) =>
      isMonthView
        ? new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        : addDays(prevDate, 7),
    );
  }, [isMonthView]);

  const prevPeriod = useCallback(() => {
    setCurrentDate((prevDate) =>
      isMonthView
        ? new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
        : addDays(prevDate, -7),
    );
  }, [isMonthView]);

  const handleAddTask = (date: string, time?: string) => {
    setNewTaskDate(date);
    setNewTaskTime(time || '');
    setIsAddingTask(true);
  };

  const handleTaskSubmit = (taskData: NewTaskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      taskDate: newTaskDate,
      time: newTaskTime || taskData.time,
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: getTaskStatus(taskData),
      priority: taskData.priority || 'medium',
    };

    addTask(newTask);
    setIsAddingTask(false);
    setNewTaskTime('');
  };

  const handleViewChange = (isMonth: boolean) => {
    setIsMonthView(isMonth);
  };

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, { ...task, completed: !task.completed });
      }
    },
    [tasks, updateTask],
  );

  return (
    <div
      className={`${currentTheme.background} ${currentTheme.text} min-h-screen`}
      role="application"
      aria-label="Task Planner Calendar"
    >
      <div className="bg-blue-400 text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Task Planner</h1>
              <p className="text-blue-100 text-sm mt-1">
                Organize your tasks efficiently
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg hover:bg-blue-700 ${
                currentTheme.isDarkMode && 'hover:bg-blue-900'
              } transition-colors duration-200`}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="mb-8 space-y-6">
          <div className="flex justify-between items-center">
            <CalendarHeader
              currentDate={currentDate}
              isMonthView={isMonthView}
              onViewChange={setIsMonthView}
              onPrevPeriod={prevPeriod}
              onNextPeriod={nextPeriod}
            />
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              theme={currentTheme}
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isMonthView ? (
              <motion.div
                key={format(currentDate, 'yyyy-MM')}
                variants={pageVariants}
                initial="enter"
                animate="in"
                exit="out"
                aria-live="polite"
                aria-label={`Displaying tasks for ${format(currentDate, 'MMMM yyyy')}`}
              >
                <MonthView
                  currentDate={currentDate}
                  tasks={tasks}
                  theme={currentTheme}
                  onAddTask={handleAddTask}
                  onEditTask={setEditingTask}
                  onDeleteTask={deleteTask}
                  onToggleComplete={handleToggleComplete}
                  onDragStart={setDraggedTask}
                  onDrop={(date, time) => {
                    if (draggedTask) {
                      updateTask(draggedTask.id, {
                        taskDate: date,
                        time: time || draggedTask.time,
                        updatedAt: new Date().toISOString(),
                      });
                      setDraggedTask(null);
                    }
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={format(currentDate, 'yyyy-MM-dd')}
                variants={pageVariants}
                initial="enter"
                animate="in"
                exit="out"
                aria-live="polite"
                aria-label={`Displaying tasks for the week of ${format(currentDate, 'MMM d, yyyy')}`}
              >
                <WeekView
                  currentDate={currentDate}
                  tasks={tasks}
                  theme={currentTheme}
                  onAddTask={handleAddTask}
                  onEditTask={setEditingTask}
                  onDeleteTask={deleteTask}
                  onToggleComplete={handleToggleComplete}
                  onDragStart={setDraggedTask}
                  onDrop={(date, time) => {
                    if (draggedTask) {
                      updateTask(draggedTask.id, {
                        taskDate: date,
                        time: time || draggedTask.time,
                        updatedAt: new Date().toISOString(),
                      });
                      setDraggedTask(null);
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isAddingTask && (
        <AddTaskModal
          isOpen={isAddingTask}
          onClose={() => setIsAddingTask(false)}
          onAdd={handleTaskSubmit}
          initialDate={newTaskDate}
          initialTime={newTaskTime}
          isWeekView={!isMonthView}
          theme={currentTheme}
        />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedTask) => {
            updateTask(updatedTask.id, updatedTask);
            setEditingTask(null);
          }}
          isWeekView={!isMonthView}
          theme={currentTheme}
        />
      )}
      <KeyboardShortcuts theme={currentTheme} />
    </div>
  );
};

export default TaskPlanner;
