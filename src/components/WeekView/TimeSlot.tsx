import React, { useState } from 'react';
import { Theme } from '../../types';
import { motion } from 'framer-motion';

interface TimeSlotProps {
  hour: number;
  dateStr: string;
  theme: Theme;
  onDrop: (date: string, time?: string) => void;
  onAddTask: (date: string, time: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  hour,
  dateStr,
  theme,
  onAddTask,
  onDrop,
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const timeString = `${hour.toString().padStart(2, '0')}:00`;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => setIsDraggedOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(false);
    onDrop(dateStr, timeString);
  };

  return (
    <motion.div
      className={`relative h-[60px] border-b ${
        hour >= 9 && hour <= 17
          ? `bg-gray-50 ${theme.isDarkMode && 'bg-gray-800/50'}`
          : theme.background
      } ${
        isDraggedOver
          ? `bg-blue-100/70 ${theme.isDarkMode && 'bg-blue-800/50'}`
          : ''
      } group transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onAddTask(dateStr, timeString)}
      whileHover={{ scale: 1.01 }}
      aria-label={`Time slot for ${timeString}`}
      role="button"
    >
      {isDraggedOver && (
        <motion.div
          className={`absolute inset-0 border-2 border-blue-500/50 ${
            theme.isDarkMode && 'border-blue-400/50'
          } rounded pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
};

export default TimeSlot;
