import React, { useState } from 'react';
import { Theme } from '../types';

interface ShortcutProps {
  theme: Theme;
}

const KeyboardShortcuts: React.FC<ShortcutProps> = ({ theme }) => {
  const { background, border, isDarkMode } = theme;
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Alt + →', description: 'Next period' },
    { key: 'Alt + ←', description: 'Previous period' },
    { key: 'Alt + V', description: 'Toggle view' },
    { key: 'Alt + T', description: 'Today' },
    { key: 'Alt + N', description: 'New task' },
    { key: 'Alt + D', description: 'Toggle dark mode' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-lg shadow-lg
          ${background} ${border}
          hover:opacity-80 transition-opacity
          flex items-center gap-2
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
