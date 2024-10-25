import React from 'react';
import { format } from 'date-fns';
import TimeSlot from './TimeSlot';
import TaskItem from './TaskItem';
import { Task, Theme } from '../../types';

interface DayColumnProps {
  day: Date;
  tasks: Task[];
  theme: Theme;
  onAddTask: (date: string, time: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDrop: (date: string, time?: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  day,
  tasks,
  theme,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onDragStart,
  onDrop,
}) => {
  const getTasksByHour = () => {
    const taskMap: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      const hour = task.time?.split(':')[0] || '0';
      if (!taskMap[hour]) taskMap[hour] = [];
      taskMap[hour].push(task);
    });
    return taskMap;
  };

  const calculateTaskLayout = (tasksInSlot: Task[]) =>
    tasksInSlot.map((_, index) => ({
      width: `${Math.max(85 - index * 5, 50)}%`,
      left: `${index * 8}%`,
      zIndex: tasksInSlot.length - index,
    }));

  const tasksByHour = getTasksByHour();

  return (
    <div className="relative border-r last:border-r-0" role="presentation">
      {Array.from({ length: 24 }, (_, hour) => (
        <TimeSlot
          key={hour}
          hour={hour}
          dateStr={format(day, 'yyyy-MM-dd')}
          theme={theme}
          onDrop={onDrop}
          onAddTask={onAddTask}
          aria-label={`Time slot for ${hour}:00`}
        />
      ))}

      {Object.entries(tasksByHour).map(([hour, hourTasks]) => {
        const layouts = calculateTaskLayout(hourTasks);

        return hourTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            top={parseInt(hour) * 60 + 2}
            width={layouts[index].width}
            left={layouts[index].left}
            zIndex={layouts[index].zIndex}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onToggleComplete={onToggleComplete}
            onDragStart={onDragStart}
            theme={theme}
            aria-label={`${task.title}, Priority: ${task.priority}`}
          />
        ));
      })}
    </div>
  );
};

export default DayColumn;
