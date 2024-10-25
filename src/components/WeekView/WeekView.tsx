import React from 'react';
import { addDays, startOfWeek } from 'date-fns';
import { Task, Theme } from '../../types';
import WeekGrid from './WeekGrid';
import WeekHeader from './WeekHeader';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  theme: Theme;
  onAddTask: (date: string, time: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDrop: (date: string, time?: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
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
  const generateDays = () =>
    Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i));

  return (
    <div
      className="h-[calc(100vh-270px)] overflow-y-auto custom-scrollbar border-r overflow-x-hidden"
      role="region"
      aria-label="Weekly calendar view"
    >
      <div className="relative">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          <WeekHeader currentDate={currentDate} theme={theme} />
          <WeekGrid
            days={generateDays()}
            tasks={tasks}
            theme={theme}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default WeekView;
