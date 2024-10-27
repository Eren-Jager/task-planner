import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarHeader from '../components/CalendarHeader';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import SearchFilter from '../components/SearchFilter';
import WeekView from '../components/WeekView/WeekView';
import MonthView from '../components/MonthView/MonthView';
import { useTaskPlanner } from '../hooks/useTaskPlanner';
import { NewTaskData, Task } from '../types';
import { format, addDays } from 'date-fns';
import { theme } from '../config/theme';
import { v4 as uuidv4 } from 'uuid';
import { pageVariants } from '../utils/transitions';
import { getTaskStatus } from '../utils/utils';
import TaskModal from '../components/TaskModal';

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

  const [taskDetails, setTaskDetails] = useState({
    currentDate: new Date(),
    isMonthView: true,
    draggedTask: null as Task | null,
    modalState: {
      isOpen: false,
      taskToEdit: null as Task | null,
      newTaskDate: '',
      newTaskTime: '',
    },
  });

  const currentTheme = theme[isDarkMode ? 'dark' : 'light'];

  const handlePeriodChange = useCallback((direction: 'next' | 'prev') => {
    setTaskDetails((prev) => ({
      ...prev,
      currentDate: prev.isMonthView
        ? new Date(
            prev.currentDate.getFullYear(),
            prev.currentDate.getMonth() + (direction === 'next' ? 1 : -1),
            1,
          )
        : addDays(prev.currentDate, direction === 'next' ? 7 : -7),
    }));
  }, []);

  const handleTaskModalSubmit = useCallback(
    (taskData: Task | NewTaskData) => {
      const { modalState } = taskDetails;

      if ('id' in taskData) {
        updateTask(taskData.id, taskData);
      } else {
        const newTask: Task = {
          id: uuidv4(),
          title: taskData.title,
          description: taskData.description || '',
          taskDate: modalState.newTaskDate,
          time: modalState.newTaskTime || taskData.time,
          dueDate: taskData.dueDate || '',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: getTaskStatus(taskData),
          priority: taskData.priority || 'medium',
        };
        addTask(newTask);
      }

      setTaskDetails((prev) => ({
        ...prev,
        modalState: {
          isOpen: false,
          taskToEdit: null,
          newTaskDate: '',
          newTaskTime: '',
        },
      }));
    },
    [addTask, updateTask, taskDetails.modalState],
  );

  const handleAddTask = useCallback((date: string, time?: string) => {
    setTaskDetails((prev) => ({
      ...prev,
      modalState: {
        isOpen: true,
        taskToEdit: null,
        newTaskDate: date,
        newTaskTime: time || '',
      },
    }));
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setTaskDetails((prev) => ({
      ...prev,
      modalState: {
        isOpen: true,
        taskToEdit: task,
        newTaskDate: '',
        newTaskTime: '',
      },
    }));
  }, []);

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, { ...task, completed: !task.completed });
      }
    },
    [tasks, updateTask],
  );

  const handleDrop = useCallback(
    (date: string, time?: string) => {
      if (taskDetails.draggedTask) {
        updateTask(taskDetails.draggedTask.id, {
          taskDate: date,
          time: time || taskDetails.draggedTask.time,
          updatedAt: new Date().toISOString(),
        });
        setTaskDetails((prev) => ({ ...prev, draggedTask: null }));
      }
    },
    [taskDetails.draggedTask, updateTask],
  );

  const viewProps = {
    currentDate: taskDetails.currentDate,
    tasks,
    theme: currentTheme,
    onAddTask: handleAddTask,
    onEditTask: handleEditTask,
    onDeleteTask: deleteTask,
    onToggleComplete: handleToggleComplete,
    onDragStart: (task: Task) =>
      setTaskDetails((prev) => ({ ...prev, draggedTask: task })),
    onDrop: handleDrop,
  };

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
              currentDate={taskDetails.currentDate}
              isMonthView={taskDetails.isMonthView}
              onViewChange={(isMonth) =>
                setTaskDetails((prev) => ({ ...prev, isMonthView: isMonth }))
              }
              onPrevPeriod={() => handlePeriodChange('prev')}
              onNextPeriod={() => handlePeriodChange('next')}
            />
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              theme={currentTheme}
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {taskDetails.isMonthView ? (
              <motion.div
                key={format(taskDetails.currentDate, 'yyyy-MM')}
                variants={pageVariants}
                initial="enter"
                animate="in"
                exit="out"
                aria-live="polite"
                aria-label={`Displaying tasks for ${format(taskDetails.currentDate, 'MMMM yyyy')}`}
              >
                <MonthView {...viewProps} />
              </motion.div>
            ) : (
              <motion.div
                key={format(taskDetails.currentDate, 'yyyy-MM-dd')}
                variants={pageVariants}
                initial="enter"
                animate="in"
                exit="out"
                aria-live="polite"
                aria-label={`Displaying tasks for the week of ${format(taskDetails.currentDate, 'MMM d, yyyy')}`}
              >
                <WeekView {...viewProps} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {taskDetails.modalState.isOpen && (
        <TaskModal
          isOpen={taskDetails.modalState.isOpen}
          onClose={() =>
            setTaskDetails((prev) => ({
              ...prev,
              modalState: {
                isOpen: false,
                taskToEdit: null,
                newTaskDate: '',
                newTaskTime: '',
              },
            }))
          }
          onSubmit={handleTaskModalSubmit}
          initialTask={taskDetails.modalState.taskToEdit}
          initialDate={taskDetails.modalState.newTaskDate}
          initialTime={taskDetails.modalState.newTaskTime}
          theme={currentTheme}
        />
      )}

      <KeyboardShortcuts
        theme={currentTheme}
        handlePeriodChange={handlePeriodChange}
        handleAddTask={handleAddTask}
        setTaskDetails={setTaskDetails}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  );
};

export default TaskPlanner;
