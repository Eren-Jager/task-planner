# Task Planner Application

A dynamic calendar-based task management application built with React, TypeScript, and styled using Tailwind CSS.

## 🚀 Features

- Interactive Month and Week views
- Drag-and-drop task management
- Real-time task updates
- Dark mode support
- Keyboard shortcuts
- Priority-based task categorization

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React in-built state management
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Type Checking**: TypeScript
- **Code Formatting**: Prettier
- **Linting**: ESLint

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm

## 🏗️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Eren-Jager/task-planner.git
   cd task-planner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏛️ Architecture

The application follows a component-based architecture with the following main structure:

```
/src
│   ├── components
│   │   ├── MonthView
│   │   │   └── MonthView.tsx
│   │   ├── WeekView
│   │   │   ├── DayColumn.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TimeColumn.tsx
│   │   │   ├── TimeSlot.tsx
│   │   │   ├── WeekGrid.tsx
│   │   │   ├── WeekHeader.tsx
│   │   │   ├── WeekView.tsx
│   │   ├── AccessibilityProvider.tsx
│   │   ├── AddTaskModal.tsx
│   │   ├── CalendarHeader.tsx
│   │   ├── EditTaskModal.tsx
│   │   ├── KeyboardShortcuts.tsx
│   │   ├── SearchFilter.tsx
│   ├── config
│   │   └── theme.ts
│   ├── hooks
│   │   └── useTaskPlanner.ts
│   ├── pages
│   │   └── TaskPlannerPage.tsx
│   ├── services
│   │   └── storageService.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   └── transitions.ts
├── App.css
├── App.test.tsx
├── App.tsx
├── index.css
├── index.tsx
```

### Key Components

- **TaskPlanner**: Main component orchestrating the entire application
- **MonthView/WeekView**: Calendar view components
- **TaskItem**: Reusable task component
- **AddTaskModal/EditTaskModal**: Task management modals

### State Management

- Uses React Context for global state management
- Implements custom hooks for business logic
- Maintains theme consistency across components

### Keyboard Shortcuts

- `Alt + →`: Next period
- `Alt + ←`: Previous period
- `Alt + V`: Toggle view (Month/Week)
- `Alt + T`: Today
- `Alt + N`: New task
- `Alt + D`: Toggle dark mode

### Task Management

- Click on any time slot to add a task
- Drag and drop tasks to reschedule
- Click on a task to edit
- Use checkboxes to mark tasks as complete
