export const theme = {
  light: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    isDarkMode: false,
    taskColors: {
      overdue: 'bg-red-50 border-red-500',
      upcoming: 'bg-blue-50 border-blue-500',
      completed: 'bg-green-50 border-green-500',
      'due-soon': 'bg-yellow-50 border-yellow-500',
    },
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    isDarkMode: true,
    taskColors: {
      overdue: 'bg-red-900/50 border-red-500',
      upcoming: 'bg-blue-900/50 border-blue-500',
      completed: 'bg-green-900/50 border-green-500',
      'due-soon': 'bg-yellow-900/50 border-yellow-500',
    },
  },
};
