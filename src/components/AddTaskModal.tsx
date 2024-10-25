import React, { useState } from 'react';
import { NewTaskData, Theme } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (taskData: NewTaskData) => void;
  initialDate: string;
  initialTime?: string;
  isWeekView?: boolean;
  theme: Theme;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialDate,
  initialTime,
  isWeekView,
  theme,
}) => {
  const [formData, setFormData] = useState<NewTaskData>({
    title: '',
    description: '',
    taskDate: initialDate,
    time: initialTime || '09:00',
    priority: 'medium',
  });

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onAdd({ ...formData, time: formData.time || initialTime || '09:00' });
      onClose();
    }
  };

  const textEditorClasses = `
    w-full p-2 rounded-md
    bg-white border ${theme.border}
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      theme.isDarkMode &&
      'dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:ring-blue-400'
    }
    outline-none
  `;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-modal-title"
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-xl ${theme.background} ${theme.text} ${theme.border}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="add-task-modal-title" className="text-xl font-semibold">
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              theme.isDarkMode && 'hover:bg-gray-800'
            } transition-colors`}
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium mb-1"
            >
              Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={textEditorClasses}
              autoFocus
              required
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={textEditorClasses}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-date"
                className="block text-sm font-medium mb-1"
              >
                Task Date *
              </label>
              <input
                id="task-date"
                type="date"
                value={formData.taskDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, taskDate: e.target.value }))
                }
                className={textEditorClasses}
                required
              />
            </div>

            <div>
              <label
                htmlFor="task-time"
                className="block text-sm font-medium mb-1"
              >
                Start Time
              </label>
              <input
                id="task-time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className={textEditorClasses}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="task-due-date"
              className="block text-sm font-medium mb-1"
            >
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className={textEditorClasses}
              min={formData.taskDate}
            />
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as NewTaskData['priority'],
                }))
              }
              className={textEditorClasses}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 ${
              theme.isDarkMode && 'hover:text-gray-200 text-gray-400'
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              theme.isDarkMode && 'hover:bg-blue-400'
            } transition-colors`}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
