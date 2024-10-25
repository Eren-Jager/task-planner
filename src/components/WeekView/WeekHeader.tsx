import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Theme } from '../../types';

interface WeekHeaderProps {
  currentDate: Date;
  theme: Theme;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ currentDate, theme }) => {
  return (
    <div
      className={`sticky top-0 z-30 col-span-full grid grid-cols-[60px_repeat(7,1fr)] ${theme.background}`}
      role="row"
      aria-label="Week header"
      style={{ zIndex: 99999 }}
    >
      <div
        className={`${theme.background} border-r border-b h-16`}
        aria-hidden="true"
      />

      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
        const currentDay = addDays(startOfWeek(currentDate), index);
        return (
          <div
            key={day}
            className={`text-center p-2 border-r border-b border-t last:border-r-0 h-16 ${
              format(currentDay, 'yyyy-MM-dd') ===
              format(new Date(), 'yyyy-MM-dd')
                ? `${!theme.isDarkMode ? 'bg-blue-50' : 'bg-blue-900'}`
                : theme.background
            } transition-colors duration-300`}
            role="columnheader"
            aria-label={`${day}, ${format(currentDay, 'MMMM d')}`}
          >
            <div className="font-bold">{day}</div>
            <div
              className={`text-sm ${
                !theme.isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {format(currentDay, 'MMM d')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekHeader;
