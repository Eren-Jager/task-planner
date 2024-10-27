import React, { useState, useEffect } from 'react';
import { NewTaskData, Task, Theme } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Task | NewTaskData) => void;
  initialTask?: Task | null;
  initialDate?: string;
  initialTime?: string;
  theme: Theme;
}

interface FormErrors {
  title?: string;
  taskDate?: string;
  dueDate?: string;
  time?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  initialDate,
  initialTime,
  theme,
}) => {
  const isEditMode = !!initialTask;

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    taskDate: initialDate || '',
    time: initialTime || '09:00',
    priority: 'medium' as const,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        taskDate: initialTask.taskDate,
        dueDate: initialTask.dueDate,
        time: initialTask.time,
        priority: initialTask.priority,
      });
    } else if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        taskDate: initialDate,
        time: initialTime || '09:00',
      }));
    }
    setErrors({});
    setTouched({});
  }, [initialTask, initialDate, initialTime]);

  if (!isOpen) return null;

  const validateField = (name: string, value: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else {
          delete newErrors.title;
        }
        break;

      case 'taskDate':
        if (!value) {
          newErrors.taskDate = 'Task date is required';
        } else {
          delete newErrors.taskDate;
          if (formData.dueDate && formData.dueDate < value) {
            newErrors.dueDate = 'Due date must be after task date';
          } else {
            delete newErrors.dueDate;
          }
        }
        break;

      case 'dueDate':
        if (value && formData.taskDate && value < formData.taskDate) {
          newErrors.dueDate = 'Due date must be after task date';
        } else {
          delete newErrors.dueDate;
        }
        break;

      case 'time':
        if (!value) {
          newErrors.time = 'Start time is required';
        } else {
          delete newErrors.time;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = () => {
    const allFields = {
      title: formData.title || '',
      taskDate: formData.taskDate || '',
      time: formData.time || '',
      dueDate: formData.dueDate || '',
    };

    setTouched(
      Object.keys(allFields).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
    );

    const isValid = Object.entries(allFields).every(([key, value]) =>
      validateField(key, value),
    );

    if (isValid) {
      if (isEditMode && initialTask) {
        onSubmit({
          ...initialTask,
          ...formData,
          updatedAt: new Date().toISOString(),
        } as Task);
      } else {
        onSubmit({
          ...formData,
          time: formData.time || initialTime || '09:00',
        } as NewTaskData);
      }
      onClose();
    }
  };

  const textEditorClasses = `
    w-full p-2 rounded-md
    bg-white border ${theme.border}
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${theme.isDarkMode && 'dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:ring-blue-400'}
    outline-none
  `;

  const errorClasses = 'text-red-500 text-sm mt-1';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-xl ${theme.background} ${theme.text} ${theme.border}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="task-modal-title" className="text-xl font-semibold">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
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
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${textEditorClasses} ${errors.title && touched.title ? 'border-red-500' : ''}`}
              autoFocus
            />
            {errors.title && touched.title && (
              <p className={errorClasses}>{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              className={textEditorClasses}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="taskDate"
                className="block text-sm font-medium mb-1"
              >
                Task Date *
              </label>
              <input
                id="taskDate"
                name="taskDate"
                type="date"
                value={formData.taskDate || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${textEditorClasses} ${errors.taskDate && touched.taskDate ? 'border-red-500' : ''}`}
              />
              {errors.taskDate && touched.taskDate && (
                <p className={errorClasses}>{errors.taskDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">
                Start Time *
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${textEditorClasses} ${errors.time && touched.time ? 'border-red-500' : ''}`}
              />
              {errors.time && touched.time && (
                <p className={errorClasses}>{errors.time}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${textEditorClasses} ${errors.dueDate && touched.dueDate ? 'border-red-500' : ''}`}
              min={formData.taskDate}
            />
            {errors.dueDate && touched.dueDate && (
              <p className={errorClasses}>{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority || 'medium'}
                onChange={handleInputChange}
                className={`${textEditorClasses} pl-8`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                  formData.priority === 'low'
                    ? 'bg-blue-500'
                    : formData.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                aria-hidden="true"
              />
            </div>
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
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
