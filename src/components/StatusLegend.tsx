export const StatusLegend = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const legendItems = [
    {
      status: 'completed',
      label: 'Completed',
      classes: isDarkMode ? 'bg-green-900/50' : 'bg-green-100',
    },
    {
      status: 'overdue',
      label: 'Overdue',
      classes: isDarkMode ? 'bg-red-900/50' : 'bg-red-100',
    },
    {
      status: 'due-soon',
      label: 'Due Soon',
      classes: isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100',
    },
    {
      status: 'upcoming',
      label: 'Upcoming',
      classes: isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100',
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 p-2 text-sm">
      {legendItems.map(({ status, label, classes }) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${classes}`} aria-hidden="true" />
          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};
