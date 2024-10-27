import React from 'react';
import { TaskStatus, TaskPriority } from '../types';
import { getPriorityColors, getStatusClasses } from '../utils/utils';

interface LegendItem {
  label: string;
  classes: string;
}

interface LegendProps {
  isDarkMode: boolean;
}

export const StatusLegend: React.FC<LegendProps> = ({ isDarkMode }) => {
  const priorityColors = getPriorityColors(isDarkMode);
  const statusItems: Array<LegendItem & { status: TaskStatus }> = [
    {
      status: 'completed',
      label: 'Completed',
      classes: getStatusClasses('completed', isDarkMode),
    },
    {
      status: 'overdue',
      label: 'Overdue',
      classes: getStatusClasses('overdue', isDarkMode),
    },
    {
      status: 'due-soon',
      label: 'Due Soon',
      classes: getStatusClasses('due-soon', isDarkMode),
    },
    {
      status: 'upcoming',
      label: 'Upcoming',
      classes: getStatusClasses('upcoming', isDarkMode),
    },
  ];

  const priorityItems: Array<LegendItem & { priority: TaskPriority }> = [
    {
      priority: 'low',
      label: 'Low Priority',
      classes: priorityColors.low,
    },
    {
      priority: 'medium',
      label: 'Medium Priority',
      classes: priorityColors.medium,
    },
    {
      priority: 'high',
      label: 'High Priority',
      classes: priorityColors.high,
    },
  ];

  const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const headerColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className="flex flex-row gap-4 p-2">
      <div className="flex flex-col items-center">
        <h3 className={`text-sm font-medium mb-2 ${headerColor}`}>Priority</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          {priorityItems.map(({ priority, label, classes }) => (
            <div key={priority} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded border-l-4 ${classes}`}
                aria-hidden="true"
              />
              <span className={textColor}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h3 className={`text-sm font-medium mb-2 ${headerColor}`}>Status</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          {statusItems.map(({ status, label, classes }) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded border ${classes}`}
                aria-hidden="true"
              />
              <span className={textColor}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
