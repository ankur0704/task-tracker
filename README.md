# Task Tracker & Notes Application

A modern, full-stack **Task Management and Notes Application** built with React, TypeScript, and a comprehensive UI component library. This application combines task tracking functionality with a notes system in a single, elegant web application.

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com) <!-- Replace with your actual demo URL -->

## 📱 Features

### ✅ Task Management
- **Create, Edit, Delete Tasks**: Full CRUD operations with inline editing
- **Task Completion**: Toggle tasks between active and completed states
- **Smart Filtering**: View all tasks, active tasks, or completed tasks
- **Real-time Statistics**: Live metrics showing total, active, completed tasks, and completion percentage
- **Visual Feedback**: Animated cards with hover effects and completion states

### 📝 Notes System
- **Rich Note Creation**: Add notes with titles and detailed content
- **Advanced Search**: Search through notes by title, content, or tags
- **Pin System**: Pin important notes to the top for quick access
- **Inline Editing**: Edit notes directly in the interface
- **Persistent Storage**: All notes automatically saved to browser storage

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Custom CSS animations for enhanced user experience
- **Glass-morphism Effects**: Modern backdrop blur and semi-transparent cards
- **Dark/Light Mode Support**: Complete theming system
- **Professional Aesthetics**: Clean, modern design with gradient backgrounds

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** as the build tool and development server
- **React Router DOM** for client-side routing

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library (comprehensive set of Radix UI components)
- **Lucide React** for icons
- Custom design system with gradients, animations, and modern aesthetics

### State Management & Data
- **React Query (TanStack Query)** for server state management
- **Local Storage** for data persistence
- **React Hook Form** with Zod validation

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** with Autoprefixer

## 📁 Application Structure & Routing

### Entry Point Chain
```
index.html → main.tsx → App.tsx → Index.tsx/Notes.tsx → TaskTracker.tsx
```

### Routing System
The app uses **React Router** to switch between two main sections:

```typescript
// App.tsx - Main routing setup
<Routes>
  <Route path="/" element={<Index />} />        // Task Tracker
  <Route path="/notes" element={<Notes />} />   // Notes System
  <Route path="*" element={<NotFound />} />     // 404 page
</Routes>
```

### Component Architecture
- **Layout.tsx**: Navigation header with routing between Tasks and Notes
- **TaskTracker.tsx**: Main task management logic and statistics
- **TaskCard.tsx**: Individual task display with inline editing
- **TaskInput.tsx**: Form for adding new tasks
- **TaskFilter.tsx**: Filter buttons for task views
- **Notes.tsx**: Complete notes management system

## 🔧 Task Management System (`/` route)

### Data Structure
```typescript
interface Task {
  id: string;           // Unique identifier (crypto.randomUUID())
  title: string;        // Task description
  completed: boolean;   // Completion status
  createdAt: Date;      // Creation timestamp
}
```

### Core Operations

#### Adding a Task
```typescript
const addTask = (title: string) => {
  const newTask: Task = {
    id: crypto.randomUUID(),    // Generate unique ID
    title,
    completed: false,
    createdAt: new Date()
  };
  setTasks(prev => [newTask, ...prev]);  // Add to beginning of array
};
```

#### Toggling Completion
```typescript
const toggleTask = (id: string) => {
  setTasks(prev => prev.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  ));
};
```

#### Statistics Calculation
```typescript
const taskStats = useMemo(() => {
  const all = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = all - completed;
  const completionRate = all > 0 ? Math.round((completed / all) * 100) : 0;
  
  return { all, active, completed, completionRate };
}, [tasks]);
```

#### Filtering System
```typescript
const filteredTasks = useMemo(() => {
  switch (filter) {
    case 'active': return tasks.filter(task => !task.completed);
    case 'completed': return tasks.filter(task => task.completed);
    default: return tasks;
  }
}, [tasks, filter]);
```

## 📝 Notes System (`/notes` route)

### Data Structure
```typescript
type Note = {
  id: string;           // Unique identifier
  title: string;        // Note title
  content: string;      // Note content
  pinned: boolean;      // Pin status
  tags: string[];       // Tags array (currently unused)
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
};
```

### Key Features

#### Search Functionality
```typescript
const filteredSorted = useMemo(() => {
  const q = search.trim().toLowerCase();
  const byQuery = q
    ? notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    : notes;
    
  return byQuery
    .slice()
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))  // Pinned first
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); // Newest first
}, [notes, search]);
```

#### Inline Editing
- Click "Edit" to enter edit mode
- Modify title and content directly
- Save with Enter key or Save button
- Cancel with Escape key or Cancel button

## 💾 Data Persistence & State Management

### Local Storage System
```typescript
// Storage keys for versioning
const TASK_STORAGE_KEY = "tt:tasks:v1";
const NOTE_STORAGE_KEY = "tt:notes:v1";

// Load data on app start
const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt)  // Convert string back to Date
    })).filter(Boolean) as Task[];
  } catch {
    return [];  // Graceful fallback
  }
};
```

### React State Flow
```
User Action → State Update → useEffect → localStorage → UI Re-render
```

### State Management Pattern
- **Local State**: Each component manages its own state
- **Props Drilling**: Data flows down through props
- **Callbacks**: Actions flow up through callback functions
- **No Global State**: No Redux/Context needed for this scope

## 🎨 User Interface & Interactions

### Task Card Interactions
- **Display Mode**: Shows task with hover buttons
- **Edit Mode**: Shows input field with save/cancel buttons  
- **Completed State**: Strikethrough text, reduced opacity

### Form Interactions
- **Task Input**: Enter key or button click to add
- **Notes Input**: Ctrl/Cmd + Enter keyboard shortcut
- **Inline Editing**: Click to edit, Enter to save, Escape to cancel

### Animation System
```css
/* Custom animations defined in tailwind.config.ts */
"slide-in-up": "0% { opacity: 0, transform: translateY(10px) }"
"fade-in": "0% { opacity: 0 }"
"scale-in": "0% { opacity: 0, transform: scale(0.95) }"
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/task-tracker.git
   cd task-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 User Journey

### Task Management Flow
1. User opens app → Loads tasks from localStorage
2. User types task → Clicks "Add Task" → Task appears at top
3. User clicks checkbox → Task marked complete → Stats update
4. User clicks "Edit" → Input field appears → User modifies → Saves
5. User clicks filter → Tasks filtered → UI updates
6. User refreshes page → All data persists

### Notes Management Flow
1. User clicks "Notes" tab → Notes page loads
2. User types title/content → Clicks "Add Note" → Note appears
3. User types in search → Notes filter in real-time
4. User clicks "Pin" → Note moves to top
5. User clicks "Edit" → Inline editing mode → Saves changes
6. User deletes note → Note removed from list

## ⚡ Performance Optimizations

### React Optimizations
- `useMemo` for expensive calculations (filtering, statistics)
- `useCallback` for stable function references
- Conditional rendering to avoid unnecessary DOM updates

### CSS Optimizations
- CSS custom properties for consistent theming
- Hardware-accelerated animations
- Efficient hover states with CSS transitions

## 🎯 Key Features Summary

- **Immediate Data Persistence**: Everything saves to localStorage automatically
- **Real-time Updates**: UI updates instantly as you interact
- **Smooth User Experience**: Animations and transitions make it feel polished
- **No Backend Required**: Runs entirely in the browser
- **Responsive Design**: Works on desktop and mobile devices

## 🔮 Future Enhancements

- Database integration (SQLite/JSON file)
- Task prioritization levels
- Due dates and reminders
- User authentication
- Mobile app development
- Analytics and reporting
- Recurring tasks
- Dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@https://github.com/ankur0704](https://github.com/your-username)
- Email: sonavaeankur@gmail.com

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the development experience

---

⭐ **Star this repository if you found it helpful!**
