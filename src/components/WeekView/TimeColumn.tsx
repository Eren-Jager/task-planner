import React from 'react';
import { Theme } from '../../types';

interface TimeColumnProps {
  theme: Theme;
}

const TimeColumn: React.FC<TimeColumnProps> = ({ theme }) => {
  return (
    <div
      className={`sticky left-0 z-20 ${theme.background}`}
      aria-label="Time column"
    >
      {Array.from({ length: 24 }, (_, hour) => (
        <div
          key={hour}
          className="h-[60px] pr-2 text-sm text-right border-r border-b flex items-center justify-end"
          role="presentation"
          aria-label={`${hour.toString().padStart(2, '0')}:00`}
        >
          {`${hour.toString().padStart(2, '0')}:00`}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
