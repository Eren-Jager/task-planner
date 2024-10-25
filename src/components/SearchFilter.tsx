import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { TaskFilters, TaskStatus, TaskPriority } from '../types';

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: TaskFilters) => void;
  theme: any;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  theme,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const statusOptions: TaskStatus[] = [
    'upcoming',
    'completed',
    'overdue',
    'due-soon',
  ];
  const priorityOptions: TaskPriority[] = ['low', 'medium', 'high'];

  return (
    <div className="mb-4 flex items-center gap-4 relative">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.background} ${theme.border} focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
          aria-hidden="true"
        />
      </div>

      <div ref={filterRef} className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2 rounded-lg ${theme.border} ${
            !theme.isDarkMode ? 'hover:bg-gray-50' : 'hover:bg-gray-800'
          }`}
          aria-haspopup="dialog"
          aria-expanded={isFilterOpen}
          aria-controls="filter-options"
          aria-label="Toggle filter options"
        >
          <Filter size={20} aria-hidden="true" />
        </button>

        {isFilterOpen && (
          <div
            id="filter-options"
            className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg ${theme.background} ${theme.border} p-4 z-50`}
            role="dialog"
            aria-labelledby="filter-heading"
            aria-modal="true"
          >
            <h2 id="filter-heading" className="font-medium mb-4">
              Filter Options
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status)}
                      onChange={(e) => {
                        const currentStatus = filters.status || [];
                        updateFilters({
                          status: e.target.checked
                            ? [...currentStatus, status]
                            : currentStatus.filter((s) => s !== status),
                        });
                      }}
                      className="rounded border-gray-300"
                      aria-checked={filters.status?.includes(status)}
                    />
                    <span>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <h3 className="font-medium mb-2">Priority</h3>
                {priorityOptions.map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority)}
                      onChange={(e) => {
                        const currentPriority = filters.priority || [];
                        updateFilters({
                          priority: e.target.checked
                            ? [...currentPriority, priority]
                            : currentPriority.filter((p) => p !== priority),
                        });
                      }}
                      className="rounded border-gray-300"
                      aria-checked={filters.priority?.includes(priority)}
                    />
                    <span>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
