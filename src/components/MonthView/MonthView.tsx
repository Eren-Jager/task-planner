import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { Task, Theme } from '../../types';

interface CalendarViewProps {
  currentDate: Date;
  tasks: Task[];
  theme: Theme;
  onAddTask: (date: string, time?: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDrop: (date: string, time?: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const MonthView: React.FC<CalendarViewProps> = ({
  currentDate,
  tasks,
  theme,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDrop,
  onToggleComplete,
}) => {
  const generateDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    }
    return days;
  };

  return (
    <div
      className="grid grid-cols-7 gap-1"
      role="grid"
      aria-label="Calendar month view"
    >
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          className={`p-3 text-center font-bold bg-gray-100 ${
            theme.isDarkMode && 'bg-gray-800'
          }`}
          role="columnheader"
          aria-label={day}
        >
          {day}
        </div>
      ))}

      {generateDays().map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayTasks = tasks.filter((task) => task.taskDate === dateStr);
        const isCurrentMonth = isSameMonth(day, currentDate);

        return (
          <div
            key={dateStr}
            className={`min-h-[100px] p-2 border rounded-lg ${
              isCurrentMonth
                ? theme.background
                : theme.isDarkMode
                  ? 'bg-white/10'
                  : 'bg-gray-200'
            } ${
              isSameDay(new Date(), day) ? 'border-blue-400' : theme.border
            } transition-colors duration-200`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(dateStr)}
            role="gridcell"
            aria-label={`Date ${format(day, 'EEEE, MMMM do')}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={isCurrentMonth ? theme.text : 'text-gray-400'}>
                {format(day, 'd')}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTask(dateStr);
                }}
                className={`${
                  !theme.isDarkMode
                    ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                } transition-colors p-1 rounded-full`}
                aria-label={`Add task for ${format(day, 'MMMM do')}`}
              >
                +
              </button>
            </div>

            <div
              className="space-y-1 overflow-y-auto max-h-[80px]"
              aria-label={`Tasks for ${format(day, 'MMMM do')}`}
            >
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(task)}
                  onClick={() => onEditTask(task)}
                  className={`p-1 text-sm rounded cursor-pointer group ${
                    task.completed
                      ? !theme.isDarkMode
                        ? 'bg-green-100'
                        : 'bg-green-900/50'
                      : !theme.isDarkMode
                        ? 'bg-blue-100'
                        : 'bg-blue-900/50'
                  } border-l-4 ${
                    task.priority === 'high'
                      ? `border-red-500 ${theme.isDarkMode && 'border-red-400'}`
                      : task.priority === 'medium'
                        ? `border-yellow-500 ${
                            theme.isDarkMode && 'border-yellow-400'
                          }`
                        : `border-green-500 ${
                            theme.isDarkMode && 'border-green-400'
                          }`
                  } hover:opacity-80 transition-opacity`}
                  aria-label={`${task.title}, Priority: ${task.priority}`}
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-3 w-3"
                      aria-label={`Mark ${task.title} as ${
                        task.completed ? 'incomplete' : 'complete'
                      }`}
                    />
                    <span className={task.completed ? 'line-through' : ''}>
                      {task.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-auto text-red-500 hover:text-red-700"
                      aria-label={`Delete ${task.title}`}
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
