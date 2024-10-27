import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, Theme } from '../../types';
import { getPriorityClasses, getStatusClasses } from '../../utils/utils';

interface TaskItemProps {
  task: Task;
  top: number;
  width: string;
  left: string;
  zIndex: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  theme: Theme;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  top,
  width,
  left,
  zIndex,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  theme,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart(task);
    setIsDragging(true);
  };

  const handleDragEnd = () => setIsDragging(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isDragging
          ? '0 8px 16px rgba(0,0,0,0.12)'
          : '0 2px 4px rgba(0,0,0,0.05)',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`absolute rounded-lg shadow-sm border-l-4 ${getStatusClasses(task.status, theme.isDarkMode)} ${getPriorityClasses(task.priority, theme.isDarkMode)} cursor-move group transition-all duration-200 ${
        isDragging ? 'opacity-50 ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      style={{
        top: `${top}px`,
        width,
        left,
        height: '46px',
        zIndex: isDragging ? 9999 : 9999 - zIndex,
      }}
      role="button"
      aria-label={`${task.title} task, Priority: ${task.priority}`}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => onEdit(task)}
        aria-label={`Drag ${task.title}`}
      >
        <div className="px-2 py-1 h-full flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              aria-label={`Mark ${task.title} as ${
                task.completed ? 'incomplete' : 'complete'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-medium truncate ${
                  task.completed
                    ? `line-through text-gray-500 ${
                        theme.isDarkMode && 'text-gray-400'
                      }`
                    : ''
                } transition-colors duration-200`}
              >
                {task.title}
              </div>
              <div
                className={`text-xs text-gray-600 ${
                  theme.isDarkMode && 'dark:text-gray-400'
                } truncate`}
              >
                {task.time}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className={`opacity-0 group-hover:opacity-100 p-1 text-red-500 
                hover:text-red-700 ${
                  theme.isDarkMode && 'text-red-400 hover:text-red-300'
                } transition-opacity`}
              aria-label="Delete task"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
