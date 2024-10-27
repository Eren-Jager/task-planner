import React, { useEffect, useState } from 'react';
import { Theme } from '../types';
import { StatusLegend } from './StatusLegend';
import { format } from 'date-fns';

interface ShortcutProps {
  theme: Theme;
  handlePeriodChange: (direction: 'next' | 'prev') => void;
  handleAddTask: (date: string) => void;
  setTaskDetails: React.Dispatch<React.SetStateAction<any>>;
  toggleDarkMode: () => void;
}

const KeyboardShortcuts: React.FC<ShortcutProps> = ({
  theme,
  handlePeriodChange,
  handleAddTask,
  setTaskDetails,
  toggleDarkMode,
}) => {
  const { background, border, isDarkMode } = theme;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.code) {
          case 'ArrowRight':
            e.preventDefault();
            handlePeriodChange('next');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handlePeriodChange('prev');
            break;
          case 'KeyV':
            e.preventDefault();
            setTaskDetails((prev: { isMonthView: any }) => ({
              ...prev,
              isMonthView: !prev.isMonthView,
            }));
            break;
          case 'KeyT':
            e.preventDefault();
            setTaskDetails((prev: any) => ({
              ...prev,
              currentDate: new Date(),
            }));
            break;
          case 'KeyN':
            e.preventDefault();
            handleAddTask(format(new Date(), 'yyyy-MM-dd'));
            break;
          case 'KeyD':
            e.preventDefault();
            toggleDarkMode();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePeriodChange, handleAddTask, toggleDarkMode]);

  const shortcuts = [
    { key: 'Alt + →', description: 'Next period' },
    { key: 'Alt + ←', description: 'Previous period' },
    { key: 'Alt + V', description: 'Toggle view' },
    { key: 'Alt + T', description: 'Today' },
    { key: 'Alt + N', description: 'New task' },
    { key: 'Alt + D', description: 'Toggle dark mode' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center">
      <StatusLegend isDarkMode={isDarkMode} />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-lg shadow-lg
          ${background} ${border}
          hover:opacity-80 transition-opacity
          flex items-center gap-2
          h-fit
        `}
        aria-expanded={isOpen}
        aria-controls="shortcut-list"
        aria-label="Toggle keyboard shortcuts"
      >
        <span className="text-lg">⌨️</span>
        <span className="text-sm font-medium">Shortcuts</span>
      </button>

      {isOpen && (
        <div
          id="shortcut-list"
          className={`
            absolute bottom-full right-0 mb-2 p-4 rounded-lg shadow-lg
            ${theme.background} ${theme.border}
            w-72 transform
            animate-fade-in-up
          `}
          role="dialog"
          aria-labelledby="shortcut-title"
          aria-modal="true"
        >
          <div className="space-y-3">
            <h3
              id="shortcut-title"
              className={`font-medium mb-3 pb-2 ${
                !isDarkMode ? 'border-b' : 'border-gray-700'
              }`}
            >
              Keyboard Shortcuts
            </h3>
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center justify-between">
                <kbd
                  className={`
                  px-2 py-1 rounded text-sm
                  ${
                    !isDarkMode
                      ? 'bg-gray-100 border-gray-200'
                      : 'bg-gray-800 border-gray-700'
                  }
                  border  
                  shadow-sm
                `}
                >
                  {key}
                </kbd>
                <span className="text-sm">{description}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className={`
              absolute top-2 right-2
              p-1 rounded-full
              ${!isDarkMode ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}
              transition-colors
            `}
            aria-label="Close shortcuts"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyboardShortcuts;
