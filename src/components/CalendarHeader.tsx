import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  isMonthView: boolean;
  onViewChange: (isMonth: boolean) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  isMonthView,
  onViewChange,
  onPrevPeriod,
  onNextPeriod,
}) => {
  return (
    <div
      className="mb-4 flex justify-between items-center"
      aria-label="Calendar Header"
      role="region"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewChange(true)}
          className={`p-2 ${isMonthView && 'bg-blue-500 text-white'} rounded`}
          aria-pressed={isMonthView}
          aria-label="Switch to Month View"
        >
          <Calendar className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => onViewChange(false)}
          className={`p-2 ${!isMonthView && 'bg-blue-500 text-white'} rounded`}
          aria-pressed={!isMonthView}
          aria-label="Switch to Week View"
        >
          <Clock className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevPeriod}
          className="p-2"
          aria-label="Previous Period"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <h2 className="text-xl font-bold" aria-live="polite">
          {format(
            currentDate,
            isMonthView ? 'MMMM yyyy' : "'Week of' MMM d, yyyy",
          )}
        </h2>
        <button onClick={onNextPeriod} className="p-2" aria-label="Next Period">
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
