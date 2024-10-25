import React from 'react';
import { format } from 'date-fns';
import { Task, Theme } from '../../types';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';

interface WeekGridProps {
  days: Date[];
  tasks: Task[];
  theme: Theme;
  onAddTask: (date: string, time: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDrop: (date: string, time?: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const WeekGrid: React.FC<WeekGridProps> = ({
  days,
  tasks,
  theme,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDrop,
  onToggleComplete,
}) => {
  return (
    <>
      <TimeColumn theme={theme} />
      {days.map((day) => (
        <DayColumn
          key={format(day, 'yyyy-MM-dd')}
          day={day}
          tasks={tasks.filter(
            (task) => task.taskDate === format(day, 'yyyy-MM-dd'),
          )}
          theme={theme}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onToggleComplete={onToggleComplete}
          aria-label={`Day column for ${format(day, 'EEEE, MMMM do')}`}
        />
      ))}
    </>
  );
};

export default WeekGrid;
