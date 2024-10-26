import React, { useState, useEffect } from 'react';
import { Task, Theme } from '../types';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  isWeekView?: boolean;
  theme: Theme;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  isWeekView,
  theme,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        taskDate: task.taskDate,
        dueDate: task.dueDate,
        time: task.time,
        priority: task.priority,
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (formData.title?.trim()) {
      onSave({
        ...task,
        ...formData,
        updatedAt: new Date().toISOString(),
      } as Task);
      onClose();
    }
  };

  const textEditorClasses = `
    w-full p-2 rounded-md bg-white border ${theme.border}
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
      aria-labelledby="edit-task-modal-title"
    >
      <div
        className={`w-full max-w-2xl p-6 ${theme.background} ${theme.text} ${theme.border}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="edit-task-modal-title" className="text-xl font-semibold">
            Edit Task
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
              value={formData.title || ''}
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
              value={formData.description || ''}
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
                Date *
              </label>
              <input
                id="task-date"
                type="date"
                value={formData.taskDate || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, taskDate: e.target.value }))
                }
                className={textEditorClasses}
                required
              />
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
                value={formData.dueDate || ''}
                min={formData.taskDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className={textEditorClasses}
              />
            </div>
            <div>
              <label
                htmlFor="task-time"
                className="block text-sm font-medium mb-1"
              >
                Time
              </label>
              <input
                id="task-time"
                type="time"
                value={formData.time || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className={textEditorClasses}
              />
            </div>
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
              value={formData.priority || 'medium'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as Task['priority'],
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
            onClick={handleSave}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              theme.isDarkMode && 'hover:bg-blue-400'
            } transition-colors`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
