# Design Document: Pomodoro Productivity Web App

## Overview

The Pomodoro Productivity Web App is a single-page application built with vanilla HTML, CSS, and JavaScript that runs entirely in the browser. It combines three core features: a Pomodoro timer for time management, a task list for tracking to-do items, and a quick links manager for bookmarking frequently visited websites. All data persists in the browser's Local Storage, requiring no backend server.

The application prioritizes simplicity and focus, with a clean, minimal interface that emphasizes the timer as the primary visual element. The design supports responsive layouts for desktop and mobile devices, and includes optional features for customization (light/dark mode, custom greeting names, adjustable timer duration, duplicate prevention, and task sorting).

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              HTML Document (index.html)              │   │
│  │  - Semantic structure for all UI sections            │   │
│  │  - Accessibility attributes                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         CSS Styling (css/style.css)                  │   │
│  │  - Layout and responsive design                      │   │
│  │  - Color schemes (light/dark mode)                   │   │
│  │  - Typography and spacing                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      JavaScript Application (js/app.js)             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  State Management                              │  │   │
│  │  │  - App state object                            │  │   │
│  │  │  - Timer state (running, paused, time)         │  │   │
│  │  │  - Tasks array                                 │  │   │
│  │  │  - Quick links array                           │  │   │
│  │  │  - User preferences                            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Timer Module                                  │  │   │
│  │  │  - Countdown logic                             │  │   │
│  │  │  - Start/stop/reset operations                 │  │   │
│  │  │  - Completion detection                        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Task Management Module                        │  │   │
│  │  │  - Add/edit/delete tasks                       │  │   │
│  │  │  - Mark complete/incomplete                    │  │   │
│  │  │  - Sort and filter logic                       │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Quick Links Module                            │  │   │
│  │  │  - Add/delete quick links                      │  │   │
│  │  │  - Open links in new tabs                      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Local Storage Module                          │  │   │
│  │  │  - Save/load all data                          │  │   │
│  │  │  - Sync state with storage                     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  UI Rendering Module                           │  │   │
│  │  │  - Update DOM elements                         │  │   │
│  │  │  - Event listener management                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Local Storage (Browser API)                 │   │
│  │  - Tasks data                                        │   │
│  │  - Quick links data                                 │   │
│  │  - User preferences                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initialization**: App loads, retrieves data from Local Storage, initializes state
2. **User Interaction**: User interacts with UI (clicks buttons, types input)
3. **State Update**: JavaScript updates application state
4. **Storage Sync**: State changes are persisted to Local Storage
5. **UI Render**: DOM is updated to reflect new state
6. **Timer Loop**: Timer updates every second when running

## Components and Interfaces

### 1. Greeting Section Component

**Purpose**: Display current time, date, and time-of-day greeting

**Responsibilities**:
- Display current time in HH:MM format
- Display current date in readable format (e.g., "Monday, January 15, 2024")
- Display appropriate greeting based on current hour
- Update time display every minute
- Support optional custom user name in greeting

**HTML Structure**:
```html
<section class="greeting-section">
  <div class="greeting-text">
    <h1 id="greeting-message">Good Morning</h1>
    <p id="current-time">10:30</p>
    <p id="current-date">Monday, January 15, 2024</p>
  </div>
  <div class="greeting-settings" id="greeting-settings">
    <!-- Optional: Custom name input -->
  </div>
</section>
```

**Key Functions**:
- `updateGreeting()`: Updates time, date, and greeting message
- `getGreetingMessage(hour)`: Returns appropriate greeting based on hour
- `formatTime(date)`: Formats time as HH:MM
- `formatDate(date)`: Formats date with day name and full date

### 2. Pomodoro Timer Component

**Purpose**: Display and manage the Pomodoro timer

**Responsibilities**:
- Display timer in MM:SS format
- Start/stop/reset timer functionality
- Update display every second when running
- Detect completion and trigger notification
- Support optional adjustable duration

**HTML Structure**:
```html
<section class="timer-section">
  <div class="timer-display">
    <div id="timer-value" class="timer-value">25:00</div>
    <div id="timer-status" class="timer-status">Ready</div>
  </div>
  <div class="timer-controls">
    <button id="start-btn" class="btn btn-primary">Start</button>
    <button id="stop-btn" class="btn btn-secondary" disabled>Stop</button>
    <button id="reset-btn" class="btn btn-secondary" disabled>Reset</button>
  </div>
  <div class="timer-settings" id="timer-settings">
    <!-- Optional: Duration adjustment controls -->
  </div>
</section>
```

**Key Functions**:
- `startTimer()`: Begin countdown
- `stopTimer()`: Pause countdown
- `resetTimer()`: Return to initial duration
- `updateTimerDisplay()`: Update MM:SS display
- `completeTimer()`: Handle timer completion
- `setTimerDuration(minutes)`: Set custom duration

### 3. Task List Component

**Purpose**: Display and manage tasks

**Responsibilities**:
- Display all tasks with checkbox, text, edit, and delete buttons
- Add new tasks with validation
- Mark tasks as complete/incomplete
- Edit task text
- Delete tasks
- Display empty state when no tasks
- Support optional sorting and duplicate prevention

**HTML Structure**:
```html
<section class="task-section">
  <h2>Tasks</h2>
  <div class="task-input-group">
    <input type="text" id="task-input" placeholder="Add a new task...">
    <button id="add-task-btn" class="btn btn-primary">Add</button>
  </div>
  <div class="task-controls" id="task-controls">
    <!-- Optional: Sort dropdown -->
  </div>
  <ul id="task-list" class="task-list">
    <!-- Tasks rendered here -->
  </ul>
  <div id="empty-tasks-message" class="empty-state">No tasks yet</div>
</section>
```

**Task Item HTML**:
```html
<li class="task-item" data-task-id="[id]">
  <input type="checkbox" class="task-checkbox">
  <span class="task-text">[task text]</span>
  <button class="btn-edit">Edit</button>
  <button class="btn-delete">Delete</button>
</li>
```

**Key Functions**:
- `addTask(text)`: Add new task with validation
- `deleteTask(id)`: Remove task
- `editTask(id, newText)`: Update task text
- `toggleTaskComplete(id)`: Mark complete/incomplete
- `renderTasks()`: Update task list display
- `sortTasks(criteria)`: Sort tasks by criteria
- `checkDuplicate(text)`: Check for duplicate tasks

### 4. Quick Links Manager Component

**Purpose**: Display and manage quick links

**Responsibilities**:
- Display all quick links as clickable buttons
- Add new quick links with validation
- Delete quick links
- Open links in new tabs
- Display empty state when no links

**HTML Structure**:
```html
<section class="quick-links-section">
  <h2>Quick Links</h2>
  <div class="quick-link-input-group">
    <input type="text" id="link-name-input" placeholder="Link name">
    <input type="url" id="link-url-input" placeholder="https://example.com">
    <button id="save-link-btn" class="btn btn-primary">Save</button>
  </div>
  <div id="quick-links-container" class="quick-links-container">
    <!-- Quick links rendered here -->
  </div>
  <div id="empty-links-message" class="empty-state">No quick links yet</div>
</section>
```

**Quick Link Item HTML**:
```html
<div class="quick-link-item" data-link-id="[id]">
  <button class="quick-link-btn" data-url="[url]">[name]</button>
  <button class="btn-delete">Delete</button>
</div>
```

**Key Functions**:
- `addQuickLink(name, url)`: Add new link with validation
- `deleteQuickLink(id)`: Remove link
- `openQuickLink(url)`: Open link in new tab
- `renderQuickLinks()`: Update links display

## Data Models

### Local Storage Schema

All data is stored as JSON strings in the browser's Local Storage. The app uses the following keys:

#### 1. Tasks Storage
**Key**: `pomodoro_tasks`
**Structure**:
```json
[
  {
    "id": "unique-id-1",
    "text": "Complete project report",
    "completed": false,
    "createdAt": 1705334400000,
    "editedAt": 1705334400000
  },
  {
    "id": "unique-id-2",
    "text": "Review code changes",
    "completed": true,
    "createdAt": 1705334200000,
    "editedAt": 1705334500000
  }
]
```

#### 2. Quick Links Storage
**Key**: `pomodoro_quick_links`
**Structure**:
```json
[
  {
    "id": "link-id-1",
    "name": "GitHub",
    "url": "https://github.com",
    "createdAt": 1705334400000
  },
  {
    "id": "link-id-2",
    "name": "MDN Docs",
    "url": "https://developer.mozilla.org",
    "createdAt": 1705334200000
  }
]
```

#### 3. User Preferences Storage
**Key**: `pomodoro_preferences`
**Structure**:
```json
{
  "timerDuration": 25,
  "customName": "John",
  "darkMode": false,
  "sortBy": "dateAdded",
  "duplicatePrevention": true
}
```

### State Management Object

The application maintains a single state object in memory:

```javascript
const appState = {
  // Timer state
  timer: {
    isRunning: false,
    isPaused: false,
    timeRemaining: 1500, // in seconds (25 minutes)
    duration: 1500,
    intervalId: null
  },
  
  // Tasks
  tasks: [],
  
  // Quick links
  quickLinks: [],
  
  // User preferences
  preferences: {
    timerDuration: 25,
    customName: "",
    darkMode: false,
    sortBy: "dateAdded",
    duplicatePrevention: true
  },
  
  // UI state
  ui: {
    editingTaskId: null,
    sortOrder: "dateAdded"
  }
};
```

### ID Generation Strategy

- **Task IDs**: Generated using `Date.now() + Math.random()` for uniqueness
- **Quick Link IDs**: Generated using `Date.now() + Math.random()` for uniqueness
- **Timestamps**: Stored as milliseconds since epoch for sorting and comparison

## Timer Implementation

### Timer Countdown Logic

The timer uses `setInterval()` to update every second. The countdown logic follows this flow:

```
1. User clicks Start
   ↓
2. Set isRunning = true, disable Start button, enable Stop/Reset
   ↓
3. Create interval that fires every 1000ms
   ↓
4. Each interval:
   - Decrement timeRemaining by 1 second
   - Update display with MM:SS format
   - Check if timeRemaining === 0
   ↓
5. If timeRemaining === 0:
   - Stop interval
   - Set isRunning = false
   - Display completion notification
   - Enable Start button
   - Keep display at 00:00
   ↓
6. User can click Stop to pause (preserves timeRemaining)
   ↓
7. User can click Reset to return to duration
```

### Time Formatting

**MM:SS Format Conversion**:
```javascript
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
```

### Timer State Transitions

```
┌─────────────────────────────────────────────────────────┐
│                    TIMER STATES                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐                                       │
│  │   STOPPED    │ (initial state)                       │
│  │  (00:00)     │                                       │
│  └──────┬───────┘                                       │
│         │ click Start                                   │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │   RUNNING    │                                       │
│  │  (25:00 → 0) │                                       │
│  └──────┬───────┘                                       │
│         │ click Stop                                    │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │   PAUSED     │                                       │
│  │  (time held) │                                       │
│  └──────┬───────┘                                       │
│         │ click Start                                   │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │   RUNNING    │                                       │
│  │  (resume)    │                                       │
│  └──────┬───────┘                                       │
│         │ timer reaches 0                              │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │  COMPLETED   │                                       │
│  │  (00:00)     │                                       │
│  └──────┬───────┘                                       │
│         │ click Reset                                   │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │   STOPPED    │                                       │
│  │  (25:00)     │                                       │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Completion Notification

When the timer reaches 00:00:
1. Stop the interval
2. Add visual indicator (e.g., "Session Complete!" message)
3. Optional: Play a subtle sound or show browser notification
4. Enable Start button for new session
5. Keep display at 00:00 until Reset is clicked

## Local Storage Operations

### CRUD Operations

#### Tasks CRUD

**Create (Add Task)**:
```javascript
function addTask(text) {
  // Validate: not empty, not whitespace-only
  if (!text || !text.trim()) return false;
  
  // Optional: Check for duplicates
  if (isDuplicate(text)) return false;
  
  // Create task object
  const task = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
    editedAt: Date.now()
  };
  
  // Add to state
  appState.tasks.push(task);
  
  // Persist to storage
  saveTasksToStorage();
  
  return true;
}
```

**Read (Load Tasks)**:
```javascript
function loadTasksFromStorage() {
  const stored = localStorage.getItem('pomodoro_tasks');
  if (stored) {
    appState.tasks = JSON.parse(stored);
  }
}
```

**Update (Edit Task)**:
```javascript
function editTask(id, newText) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.text = newText.trim();
    task.editedAt = Date.now();
    saveTasksToStorage();
    return true;
  }
  return false;
}
```

**Delete (Remove Task)**:
```javascript
function deleteTask(id) {
  appState.tasks = appState.tasks.filter(t => t.id !== id);
  saveTasksToStorage();
}
```

**Toggle Complete**:
```javascript
function toggleTaskComplete(id) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.editedAt = Date.now();
    saveTasksToStorage();
    return true;
  }
  return false;
}
```

#### Quick Links CRUD

**Create (Add Link)**:
```javascript
function addQuickLink(name, url) {
  // Validate: not empty
  if (!name || !name.trim() || !url || !url.trim()) return false;
  
  const link = {
    id: generateId(),
    name: name.trim(),
    url: url.trim(),
    createdAt: Date.now()
  };
  
  appState.quickLinks.push(link);
  saveQuickLinksToStorage();
  return true;
}
```

**Read (Load Links)**:
```javascript
function loadQuickLinksFromStorage() {
  const stored = localStorage.getItem('pomodoro_quick_links');
  if (stored) {
    appState.quickLinks = JSON.parse(stored);
  }
}
```

**Delete (Remove Link)**:
```javascript
function deleteQuickLink(id) {
  appState.quickLinks = appState.quickLinks.filter(l => l.id !== id);
  saveQuickLinksToStorage();
}
```

#### Preferences CRUD

**Save Preferences**:
```javascript
function savePreferences() {
  localStorage.setItem('pomodoro_preferences', JSON.stringify(appState.preferences));
}
```

**Load Preferences**:
```javascript
function loadPreferences() {
  const stored = localStorage.getItem('pomodoro_preferences');
  if (stored) {
    appState.preferences = { ...appState.preferences, ...JSON.parse(stored) };
  }
}
```

### Storage Synchronization

**Save All Data**:
```javascript
function saveAllData() {
  saveTasksToStorage();
  saveQuickLinksToStorage();
  savePreferences();
}
```

**Load All Data**:
```javascript
function loadAllData() {
  loadTasksFromStorage();
  loadQuickLinksFromStorage();
  loadPreferences();
}
```

### Error Handling

- **Storage Quota Exceeded**: Catch `QuotaExceededError` and display user-friendly message
- **Corrupted Data**: Validate JSON parsing, fall back to empty state if parsing fails
- **Missing Keys**: Check for existence before accessing, use default values

## UI/UX Design

### Layout Structure

**Desktop Layout** (1024px and above):
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / SETTINGS                    │
│  (Theme toggle, custom name input - optional)           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         GREETING SECTION                         │   │
│  │  Good Morning, John                              │   │
│  │  10:30 | Monday, January 15, 2024                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         TIMER SECTION (PROMINENT)                │   │
│  │                                                  │   │
│  │              25:00                               │   │
│  │                                                  │   │
│  │  [Start] [Stop] [Reset]                          │   │
│  │  (Optional: Duration adjustment)                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         TASKS SECTION                            │   │
│  │  [Input field] [Add button]                      │   │
│  │  (Optional: Sort dropdown)                       │   │
│  │  ☐ Task 1                    [Edit] [Delete]     │   │
│  │  ☑ Task 2 (completed)        [Edit] [Delete]     │   │
│  │  ☐ Task 3                    [Edit] [Delete]     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         QUICK LINKS SECTION                      │   │
│  │  [Name input] [URL input] [Save button]          │   │
│  │  [GitHub] [MDN Docs] [Stack Overflow]            │   │
│  │  [Delete] [Delete] [Delete]                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Mobile Layout** (below 768px):
- Single column layout
- Sections stack vertically
- Timer remains prominent and large
- Buttons and inputs scale for touch
- Reduced padding and margins for space efficiency

### Responsive Design Approach

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

**Responsive Techniques**:
- CSS Flexbox for flexible layouts
- CSS Grid for section organization
- Media queries for breakpoint-specific styles
- Relative units (rem, em) for scalability
- Touch-friendly button sizes (minimum 44x44px)

### Color Scheme

**Light Mode**:
- Background: #FFFFFF (white)
- Text Primary: #1A1A1A (dark gray)
- Text Secondary: #666666 (medium gray)
- Accent: #4A90E2 (blue)
- Success: #2ECC71 (green)
- Danger: #E74C3C (red)
- Border: #E0E0E0 (light gray)

**Dark Mode**:
- Background: #1A1A1A (dark gray)
- Text Primary: #FFFFFF (white)
- Text Secondary: #CCCCCC (light gray)
- Accent: #5BA3F5 (lighter blue)
- Success: #27AE60 (darker green)
- Danger: #C0392B (darker red)
- Border: #333333 (dark border)

### Typography

- **Font Family**: System stack (e.g., -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Timer Display**: 72px, bold, monospace (for precise alignment)
- **Headings**: 24px, bold
- **Body Text**: 16px, regular
- **Small Text**: 14px, regular

### Button Styling

**Primary Button** (Start, Add, Save):
- Background: Accent color
- Text: White
- Padding: 10px 20px
- Border-radius: 4px
- Cursor: pointer
- Hover: Darker shade of accent

**Secondary Button** (Stop, Reset, Edit, Delete):
- Background: Light gray
- Text: Dark gray
- Padding: 10px 20px
- Border-radius: 4px
- Cursor: pointer
- Hover: Darker gray

**Disabled Button**:
- Opacity: 0.5
- Cursor: not-allowed

### Input Field Styling

- Border: 1px solid border color
- Padding: 10px
- Border-radius: 4px
- Font-size: 16px (prevents zoom on iOS)
- Focus: Blue outline or border highlight

### Spacing and Padding

- Section padding: 20px
- Element margin: 10px
- Button spacing: 8px between buttons
- Input group spacing: 8px between input and button

## Optional Features Integration

### 1. Light/Dark Mode Toggle

**Implementation**:
- Add theme toggle button in header
- Store preference in `appState.preferences.darkMode`
- Apply `dark-mode` class to body element
- CSS uses CSS variables or separate stylesheets for theme colors
- Load preference on app initialization

**Storage Key**: `pomodoro_preferences.darkMode` (boolean)

### 2. Custom User Name in Greeting

**Implementation**:
- Add optional name input field in greeting section
- Store name in `appState.preferences.customName`
- Update greeting message to include name: "Good Morning, [Name]"
- If name is empty, display default greeting without name
- Load preference on app initialization

**Storage Key**: `pomodoro_preferences.customName` (string)

### 3. Adjustable Pomodoro Timer Duration

**Implementation**:
- Add duration controls (input field or +/- buttons) in timer section
- Allow duration range: 1-60 minutes
- Store duration in `appState.preferences.timerDuration`
- Update timer display when duration changes
- If timer is running, stop and reset to new duration
- Load preference on app initialization

**Storage Key**: `pomodoro_preferences.timerDuration` (number in minutes)

### 4. Duplicate Task Prevention

**Implementation**:
- Before adding task, check if task text (trimmed, case-insensitive) exists
- If duplicate found, display error message: "Task already exists"
- Store preference in `appState.preferences.duplicatePrevention`
- Can be toggled on/off via settings

**Comparison Logic**:
```javascript
function isDuplicate(newText) {
  const normalized = newText.trim().toLowerCase();
  return appState.tasks.some(task => 
    task.text.trim().toLowerCase() === normalized
  );
}
```

**Storage Key**: `pomodoro_preferences.duplicatePrevention` (boolean)

### 5. Task Sorting Functionality

**Implementation**:
- Add sort dropdown in task section with options:
  - "By Date Added" (default, oldest first)
  - "Alphabetically" (A-Z)
  - "Completed First" (completed tasks first)
  - "Incomplete First" (incomplete tasks first)
- Store sort preference in `appState.preferences.sortBy`
- Sorting is display-only; underlying storage order unchanged
- Load preference on app initialization

**Sort Logic**:
```javascript
function getSortedTasks() {
  const sorted = [...appState.tasks];
  
  switch(appState.preferences.sortBy) {
    case 'alphabetically':
      return sorted.sort((a, b) => a.text.localeCompare(b.text));
    case 'completedFirst':
      return sorted.sort((a, b) => b.completed - a.completed);
    case 'incompleteFirst':
      return sorted.sort((a, b) => a.completed - b.completed);
    case 'dateAdded':
    default:
      return sorted.sort((a, b) => a.createdAt - b.createdAt);
  }
}
```

**Storage Key**: `pomodoro_preferences.sortBy` (string)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time Display Format

*For any* current time, the greeting section should display the time in HH:MM format with leading zeros for both hours and minutes.

**Validates: Requirements 1.1, 2.2**

### Property 2: Date Formatting

*For any* date, the greeting section should display it in a readable format including the day name and full date (e.g., "Monday, January 15, 2024").

**Validates: Requirements 1.2**

### Property 3: Greeting Message Selection

*For any* hour value, the greeting message should match the correct time-of-day category: "Good Morning" (5-11), "Good Afternoon" (12-17), "Good Evening" (18-23), or "Good Night" (0-4).

**Validates: Requirements 1.3**

### Property 4: Initial Timer Display

*For any* app initialization, the timer should display "25:00" as the initial state.

**Validates: Requirements 2.1**

### Property 5: Timer Start Begins Countdown

*For any* timer in stopped state, clicking Start should transition the timer to running state and begin decrementing the time value.

**Validates: Requirements 3.1**

### Property 6: Start Button Disabled When Running

*For any* timer in running state, the Start button should be disabled and the Stop button should be enabled.

**Validates: Requirements 3.2, 3.3**

### Property 7: Timer Pause Preserves Time

*For any* running timer, clicking Stop should pause the countdown and preserve the current time value without further decrement.

**Validates: Requirements 4.1, 4.4**

### Property 8: Stop Button Disabled When Paused

*For any* paused timer, the Stop button should be disabled and the Start button should be enabled.

**Validates: Requirements 4.2, 4.3**

### Property 9: Reset Returns to Initial Duration

*For any* timer state (running, paused, or stopped), clicking Reset should return the timer to the initial 25:00 duration and stop any running countdown.

**Validates: Requirements 5.1, 5.2**

### Property 10: Reset Button Disabled After Reset

*For any* timer after reset, the Reset button should be disabled and the Start button should be enabled.

**Validates: Requirements 5.3, 5.4**

### Property 11: Timer Auto-Stops at Zero

*For any* running timer, when the time reaches 00:00, the countdown should stop automatically and the timer should remain at 00:00.

**Validates: Requirements 6.1, 6.4**

### Property 12: Completion Notification Displayed

*For any* timer that reaches 00:00, a completion notification or visual indicator should be displayed to the user.

**Validates: Requirements 6.2**

### Property 13: Task Addition Increases List

*For any* task list and valid (non-empty, non-whitespace) task text, adding the task should increase the task list length by one.

**Validates: Requirements 7.1, 7.2**

### Property 14: Empty Task Rejected

*For any* task input that is empty or contains only whitespace, attempting to add it should not modify the task list.

**Validates: Requirements 7.5**

### Property 15: Task Input Cleared After Addition

*For any* task addition, the task input field should be cleared after the task is successfully added.

**Validates: Requirements 7.3**

### Property 16: Task Persisted to Storage

*For any* task added to the list, querying Local Storage should return the task with matching text and metadata.

**Validates: Requirements 7.4, 15.1**

### Property 17: Tasks Loaded on Initialization

*For any* app initialization with previously saved tasks in Local Storage, the task list should display all saved tasks.

**Validates: Requirements 8.1**

### Property 18: Task Display Elements

*For any* task in the task list, the rendered task should include a checkbox, task text, edit button, and delete button.

**Validates: Requirements 8.2**

### Property 19: Empty State Message

*For any* empty task list, an empty state message should be displayed to the user.

**Validates: Requirements 8.3, 11.4**

### Property 20: Task Order Preservation

*For any* sequence of tasks added to the list, the display order should match the insertion order (oldest first).

**Validates: Requirements 8.4**

### Property 21: Task Completion Toggle

*For any* task, clicking the checkbox should toggle the completion state between complete and incomplete.

**Validates: Requirements 9.1, 9.4**

### Property 22: Completed Task Visual Indicator

*For any* completed task, the task text should display with a visual indicator (e.g., strikethrough or different color).

**Validates: Requirements 9.2, 9.5**

### Property 23: Completion State Persisted

*For any* task with a changed completion state, the completion state should be saved to Local Storage.

**Validates: Requirements 9.3**

### Property 24: Task Edit Mode Activation

*For any* task, clicking the Edit button should transition the task to edit mode with an editable input field.

**Validates: Requirements 10.1, 10.2**

### Property 25: Task Edit Save Updates Text

*For any* task in edit mode, saving changes should update the task text in the task list.

**Validates: Requirements 10.3**

### Property 26: Edited Task Persisted

*For any* edited task, the updated text should be saved to Local Storage.

**Validates: Requirements 10.4**

### Property 27: Task Edit Cancel Reverts Changes

*For any* task in edit mode, canceling should return the task to display mode with the original text unchanged.

**Validates: Requirements 10.5**

### Property 28: Task Deletion Removes from List

*For any* task, clicking the Delete button should remove the task from the task list.

**Validates: Requirements 11.1, 11.3**

### Property 29: Deleted Task Removed from Storage

*For any* deleted task, the task should no longer exist in Local Storage.

**Validates: Requirements 11.2**

### Property 30: Quick Link Addition Increases List

*For any* quick links list and valid (non-empty) name and URL, adding the link should increase the quick links list length by one.

**Validates: Requirements 12.1, 12.2**

### Property 31: Empty Quick Link Rejected

*For any* quick link input with empty or missing name or URL, attempting to save should not modify the quick links list.

**Validates: Requirements 12.4**

### Property 32: Quick Link Persisted to Storage

*For any* quick link added to the list, querying Local Storage should return the link with matching name and URL.

**Validates: Requirements 12.3, 15.2**

### Property 33: Quick Links Loaded on Initialization

*For any* app initialization with previously saved quick links in Local Storage, the quick links display should show all saved links.

**Validates: Requirements 12.5**

### Property 34: Quick Link Opens in New Tab

*For any* quick link, clicking the link button should open the associated URL in a new browser tab.

**Validates: Requirements 13.1**

### Property 35: Quick Link Click Preserves Data

*For any* quick link, clicking the link should not modify the link's name or URL data.

**Validates: Requirements 13.2**

### Property 36: Quick Link Deletion Removes from List

*For any* quick link, clicking the Delete button should remove the link from the quick links display.

**Validates: Requirements 14.1, 14.3**

### Property 37: Deleted Quick Link Removed from Storage

*For any* deleted quick link, the link should no longer exist in Local Storage.

**Validates: Requirements 14.2**

### Property 38: Empty Quick Links State

*For any* empty quick links list, an empty state message should be displayed to the user.

**Validates: Requirements 14.4**

### Property 39: Data Persistence Round Trip

*For any* task or quick link added to the app, closing and reopening the app should display the same data.

**Validates: Requirements 15.3, 15.4**

### Property 40: All Sections Rendered on Load

*For any* app initialization, all major sections (Greeting, Timer, Tasks, Quick Links) should be present in the DOM.

**Validates: Requirements 17.2**

### Property 41: Local Storage API Available

*For any* app execution, the Local Storage API should be available and functional for read/write operations.

**Validates: Requirements 18.5**

### Property 42: No External HTTP Requests

*For any* app execution (excluding quick link opens), no HTTP requests should be made to external servers.

**Validates: Requirements 27.2**

### Property 43: Local Storage Only Persistence

*For any* data persistence operation, only the Local Storage API should be used for saving data.

**Validates: Requirements 27.3**

### Property 44: Dark Mode Toggle Switches Theme

*For any* dark mode toggle, clicking the toggle should switch the app between light and dark color schemes.

**Validates: Requirements 20.2**

### Property 45: Dark Mode Preference Persisted

*For any* dark mode preference change, the selected mode should be saved to Local Storage.

**Validates: Requirements 20.3**

### Property 46: Dark Mode Loaded on Initialization

*For any* app initialization with a saved dark mode preference, the app should apply the previously selected mode.

**Validates: Requirements 20.4**

### Property 47: Custom Name in Greeting

*For any* custom name saved, the greeting message should include the name (e.g., "Good Morning, [Name]").

**Validates: Requirements 21.2**

### Property 48: Custom Name Persisted

*For any* custom name change, the name should be saved to Local Storage.

**Validates: Requirements 21.3**

### Property 49: Custom Name Loaded on Initialization

*For any* app initialization with a saved custom name, the greeting should display the previously saved name.

**Validates: Requirements 21.4**

### Property 50: Custom Name Cleared Reverts Greeting

*For any* custom name cleared and saved, the greeting should revert to the default format without a name.

**Validates: Requirements 21.5**

### Property 51: Timer Duration Update Changes Display

*For any* timer duration adjustment, the timer display should update to show the new duration.

**Validates: Requirements 22.2**

### Property 52: New Duration Used on Start

*For any* new timer duration set, clicking Start should count down from the new duration.

**Validates: Requirements 22.3**

### Property 53: Timer Duration Persisted

*For any* timer duration change, the new duration should be saved to Local Storage.

**Validates: Requirements 22.4**

### Property 54: Timer Duration Loaded on Initialization

*For any* app initialization with a saved timer duration, the timer should use the previously saved duration.

**Validates: Requirements 22.5**

### Property 55: Duration Change Stops Running Timer

*For any* running timer, adjusting the duration should stop the timer and reset it to the new duration.

**Validates: Requirements 22.6**

### Property 56: Duplicate Task Rejected

*For any* task with text identical (case-insensitive, whitespace-trimmed) to an existing task, attempting to add it should not modify the task list.

**Validates: Requirements 23.1, 23.3, 23.4**

### Property 57: Duplicate Rejection Message Displayed

*For any* duplicate task rejection, an error message should be displayed indicating the task already exists.

**Validates: Requirements 23.2**

### Property 58: Tasks Sorted by Selected Criteria

*For any* sort option selected, the task list display should be ordered according to the selected criteria.

**Validates: Requirements 24.2**

### Property 59: Sort Preference Persisted

*For any* sort preference change, the selected sort option should be saved to Local Storage.

**Validates: Requirements 24.4**

### Property 60: Sort Preference Loaded on Initialization

*For any* app initialization with a saved sort preference, the task list should display tasks in the previously selected sort order.

**Validates: Requirements 24.5**

### Property 61: Sort Does Not Modify Storage Order

*For any* task sorting operation, the underlying task data order in Local Storage should remain unchanged.

**Validates: Requirements 24.3**

## Error Handling

### Input Validation

**Task Input**:
- Reject empty strings
- Reject whitespace-only strings
- Trim leading/trailing whitespace before saving
- Optional: Check for duplicates (if feature enabled)

**Quick Link Input**:
- Reject empty name or URL
- Trim whitespace before saving
- Validate URL format (basic check for http/https or www)

**Timer Duration Input**:
- Accept only positive integers
- Enforce minimum: 1 minute
- Enforce maximum: 60 minutes
- Reject non-numeric input

### Storage Error Handling

**Quota Exceeded**:
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    displayError('Storage limit exceeded. Please delete some data.');
  }
}
```

**Corrupted Data**:
```javascript
try {
  const data = JSON.parse(stored);
  // validate data structure
} catch (e) {
  console.error('Failed to parse stored data');
  // Fall back to empty state
  appState.tasks = [];
}
```

**Missing Local Storage**:
- Check if `localStorage` is available before use
- Gracefully degrade if not available
- Display message: "Local Storage not available"

### User Feedback

**Success Messages**:
- Task added successfully (implicit: appears in list)
- Task deleted successfully (implicit: removed from list)
- Quick link saved successfully (implicit: appears in list)

**Error Messages**:
- "Task already exists" (duplicate prevention)
- "Please enter a task description"
- "Please enter a name and URL for the quick link"
- "Storage limit exceeded"

**Visual Feedback**:
- Button hover states
- Input focus states
- Disabled button states
- Completion notification on timer finish

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Test empty task list behavior
- Test timer completion notification
- Test quick link opening
- Test storage quota errors
- Test invalid input rejection

**Property-Based Tests**: Verify universal properties across all inputs
- Test that all valid tasks are persisted
- Test that timer countdown is monotonically decreasing
- Test that sorting doesn't modify underlying data
- Test that completion state toggles correctly
- Test that data survives app reload

### Unit Testing

Unit tests should focus on:
1. **Specific Examples**: Concrete test cases with known inputs/outputs
2. **Edge Cases**: Boundary conditions and special cases
3. **Error Conditions**: Invalid inputs and error states
4. **Integration Points**: Component interactions

**Example Unit Tests**:
- Empty task list displays empty state message
- Timer displays "00:00" when completed
- Quick link opens with correct URL
- Duplicate task is rejected with error message
- Storage quota error is caught and displayed

### Property-Based Testing

Property-based tests should verify universal properties using randomized inputs. Each property test should:

1. **Generate Random Inputs**: Use a PBT library to generate test data
2. **Execute Operation**: Perform the operation being tested
3. **Verify Property**: Check that the property holds true
4. **Run Multiple Iterations**: Minimum 100 iterations per test

**Property Test Configuration**:
- Minimum iterations: 100
- Seed: Optional (for reproducibility)
- Timeout: 5 seconds per test
- Tag format: `Feature: pomodoro-web-app, Property {number}: {property_text}`

**Example Property Tests**:

```javascript
// Property 13: Task Addition Increases List
// For any task list and valid task text, adding the task should increase list length by 1
test('Property 13: Task Addition Increases List', () => {
  fc.assert(
    fc.property(
      fc.array(fc.object()),
      fc.string().filter(s => s.trim().length > 0),
      (existingTasks, newTaskText) => {
        appState.tasks = existingTasks;
        const initialLength = appState.tasks.length;
        addTask(newTaskText);
        return appState.tasks.length === initialLength + 1;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 39: Data Persistence Round Trip
// For any task added, closing and reopening should display the same data
test('Property 39: Data Persistence Round Trip', () => {
  fc.assert(
    fc.property(
      fc.string().filter(s => s.trim().length > 0),
      (taskText) => {
        // Clear state
        appState.tasks = [];
        localStorage.clear();
        
        // Add task
        addTask(taskText);
        saveTasksToStorage();
        
        // Simulate reload
        appState.tasks = [];
        loadTasksFromStorage();
        
        // Verify task exists
        return appState.tasks.some(t => t.text === taskText.trim());
      }
    ),
    { numRuns: 100 }
  );
});

// Property 44: Dark Mode Toggle Switches Theme
// For any dark mode toggle, clicking should switch between light and dark
test('Property 44: Dark Mode Toggle Switches Theme', () => {
  fc.assert(
    fc.property(
      fc.boolean(),
      (initialMode) => {
        appState.preferences.darkMode = initialMode;
        toggleDarkMode();
        return appState.preferences.darkMode === !initialMode;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 56: Duplicate Task Rejected
// For any task with identical text (case-insensitive), adding should be rejected
test('Property 56: Duplicate Task Rejected', () => {
  fc.assert(
    fc.property(
      fc.string().filter(s => s.trim().length > 0),
      (taskText) => {
        appState.tasks = [];
        
        // Add first task
        addTask(taskText);
        const initialLength = appState.tasks.length;
        
        // Try to add duplicate (with different case/whitespace)
        const duplicate = '  ' + taskText.toUpperCase() + '  ';
        addTask(duplicate);
        
        // Should not add duplicate
        return appState.tasks.length === initialLength;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Goals

- **Core Functionality**: 100% coverage of timer, task, and quick link operations
- **State Management**: 100% coverage of state transitions
- **Storage Operations**: 100% coverage of CRUD operations
- **Optional Features**: 100% coverage of each enabled feature
- **Error Handling**: 100% coverage of error paths

### Testing Tools

**Recommended Libraries**:
- **Unit Testing**: Jest or Vitest
- **Property-Based Testing**: fast-check (JavaScript)
- **DOM Testing**: Testing Library or jsdom
- **Assertions**: Chai or Jest built-in assertions

### Test Organization

```
tests/
├── unit/
│   ├── timer.test.js
│   ├── tasks.test.js
│   ├── quickLinks.test.js
│   ├── storage.test.js
│   └── ui.test.js
├── properties/
│   ├── timer.properties.test.js
│   ├── tasks.properties.test.js
│   ├── quickLinks.properties.test.js
│   ├── storage.properties.test.js
│   └── features.properties.test.js
└── integration/
    └── app.integration.test.js
```

## File Structure

### Project Organization

```
pomodoro-web-app/
├── index.html              # Main HTML document
├── css/
│   └── style.css          # All styling (single file)
├── js/
│   └── app.js             # All application logic (single file)
├── README.md              # Project documentation
├── .gitignore             # Git ignore file
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Pages deployment workflow
```

### File Descriptions

**index.html**:
- Semantic HTML structure
- Links to single CSS file
- Links to single JavaScript file
- Meta tags for viewport and charset
- Accessibility attributes (ARIA labels, semantic elements)

**css/style.css**:
- All styling for all components
- CSS variables for colors and spacing
- Media queries for responsive design
- Light and dark mode styles
- Print styles (optional)

**js/app.js**:
- All application logic
- State management
- Timer implementation
- Task management
- Quick links management
- Local Storage operations
- UI rendering and event handling
- Initialization code

### Code Organization within app.js

```javascript
// 1. State Management
const appState = { ... };

// 2. Utility Functions
function generateId() { ... }
function formatTime(seconds) { ... }
function formatDate(date) { ... }

// 3. Timer Module
function startTimer() { ... }
function stopTimer() { ... }
function resetTimer() { ... }
function updateTimerDisplay() { ... }

// 4. Task Management Module
function addTask(text) { ... }
function deleteTask(id) { ... }
function editTask(id, newText) { ... }
function toggleTaskComplete(id) { ... }
function renderTasks() { ... }

// 5. Quick Links Module
function addQuickLink(name, url) { ... }
function deleteQuickLink(id) { ... }
function openQuickLink(url) { ... }
function renderQuickLinks() { ... }

// 6. Local Storage Module
function saveTasksToStorage() { ... }
function loadTasksFromStorage() { ... }
function saveQuickLinksToStorage() { ... }
function loadQuickLinksFromStorage() { ... }
function savePreferences() { ... }
function loadPreferences() { ... }

// 7. UI Rendering Module
function renderGreeting() { ... }
function updateGreeting() { ... }
function renderUI() { ... }

// 8. Event Listeners
function attachEventListeners() { ... }

// 9. Initialization
function initializeApp() { ... }

// 10. App Start
document.addEventListener('DOMContentLoaded', initializeApp);
```

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Technical Considerations

**JavaScript Features Used**:
- ES6+ features (arrow functions, const/let, template literals, destructuring)
- `setInterval()` and `clearInterval()` for timer
- `localStorage` API for persistence
- `Date` object for time/date operations
- `JSON.parse()` and `JSON.stringify()` for serialization
- DOM APIs (querySelector, addEventListener, classList)

**CSS Features Used**:
- Flexbox for layout
- CSS Grid (optional, for advanced layouts)
- CSS Variables for theming
- Media queries for responsive design
- CSS Transitions for smooth interactions
- CSS Custom Properties (--variable-name)

**Browser API Requirements**:
- Local Storage API (required)
- DOM Level 3 Events (required)
- ES6 JavaScript support (required)
- CSS Flexbox support (required)

### Polyfills and Fallbacks

**Local Storage Fallback**:
- Check if `localStorage` is available
- If not available, display message: "Local Storage not available"
- Gracefully degrade to session-only functionality

**CSS Fallbacks**:
- Provide fallback colors for CSS variables
- Use standard properties alongside vendor prefixes if needed
- Test on older browser versions

### Testing Across Browsers

**Manual Testing Checklist**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (iOS/Android)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Firefox (Android)

**Key Areas to Test**:
- Timer countdown accuracy
- Local Storage persistence
- Responsive layout on mobile
- Touch interactions on mobile
- Dark mode switching
- Input validation
- Button states and interactions

### Performance Considerations

**Load Time Optimization**:
- Single HTML file (minimal)
- Single CSS file (minified in production)
- Single JavaScript file (minified in production)
- No external dependencies
- No external API calls (except quick link opens)

**Runtime Performance**:
- Timer updates every 1 second (not every millisecond)
- DOM updates batched where possible
- Event delegation for dynamic elements
- Efficient Local Storage operations

**Memory Usage**:
- Reasonable limits on task and quick link counts
- No memory leaks from event listeners
- Proper cleanup of intervals on app unload

### Accessibility Considerations

**WCAG 2.1 Level AA Compliance**:
- Semantic HTML elements (header, section, button, input)
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratios meet standards
- Focus indicators visible
- Form labels associated with inputs
- Error messages clearly associated with inputs

**Keyboard Navigation**:
- Tab through all interactive elements
- Enter to activate buttons
- Space to toggle checkboxes
- Escape to cancel edit mode

**Screen Reader Support**:
- Semantic HTML for structure
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic updates
- Proper heading hierarchy

## Design Decisions and Rationale

### Single File Architecture

**Decision**: Use single HTML, single CSS, and single JavaScript file

**Rationale**:
- Simplifies project structure and deployment
- Reduces HTTP requests (faster load time)
- Easier to understand and maintain for small projects
- Meets requirement for simple project structure
- Suitable for static file hosting (GitHub Pages)

### Local Storage Only

**Decision**: Use only Local Storage for persistence, no backend server

**Rationale**:
- Meets requirement for no backend server
- Simplifies deployment (static hosting only)
- Faster data access (no network latency)
- User data stays on user's device
- Sufficient for single-user application

### State Management Pattern

**Decision**: Single centralized state object with synchronous updates

**Rationale**:
- Simple and predictable state management
- Easy to debug and understand
- Sufficient for application complexity
- Avoids complexity of Redux or similar libraries
- Synchronous updates ensure consistency

### Timer Implementation

**Decision**: Use `setInterval()` for 1-second updates

**Rationale**:
- Simple and reliable for this use case
- 1-second granularity matches MM:SS display
- Sufficient accuracy for Pomodoro timer
- No need for more complex timing mechanisms
- Works reliably across browsers

### Component Organization

**Decision**: Organize code by feature (Timer, Tasks, QuickLinks) rather than by type

**Rationale**:
- Easier to locate related functionality
- Reduces cognitive load when working on features
- Facilitates feature-based testing
- Aligns with optional feature structure

### Optional Features

**Decision**: Implement optional features as toggles in preferences

**Rationale**:
- Keeps core functionality simple
- Allows users to enable only needed features
- Reduces complexity for users who don't need features
- Easier to test and maintain
- Preferences stored in Local Storage

### Responsive Design Approach

**Decision**: Mobile-first CSS with media queries for larger screens

**Rationale**:
- Ensures good mobile experience (increasingly important)
- Simpler base styles to build upon
- Better performance on mobile devices
- Easier to maintain and extend

### Color Scheme

**Decision**: Limited palette with light and dark modes

**Rationale**:
- Meets requirement for clean, minimal design
- Reduces visual clutter
- Improves focus on timer
- Dark mode reduces eye strain
- Consistent with modern web design practices

### Validation Strategy

**Decision**: Client-side validation only, no server-side validation

**Rationale**:
- No backend server available
- Sufficient for single-user application
- Faster user feedback
- Simpler implementation

### Error Handling

**Decision**: User-friendly error messages with graceful degradation

**Rationale**:
- Improves user experience
- Helps users understand what went wrong
- Graceful degradation ensures app remains usable
- Meets accessibility requirements

