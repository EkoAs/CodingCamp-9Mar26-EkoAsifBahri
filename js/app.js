// ============================================================================
// POMODORO PRODUCTIVITY WEB APP - Main Application File
// ============================================================================

// ============================================================================
// 1. STATE MANAGEMENT
// ============================================================================

/**
 * Centralized application state object
 * Contains all data needed for the app to function
 */
const appState = {
  // Timer state
  timer: {
    isRunning: false,
    isPaused: false,
    timeRemaining: 1500, // in seconds (25 minutes)
    duration: 1500,
    intervalId: null
  },

  // Tasks array
  tasks: [],

  // Quick links array
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

// ============================================================================
// 2. UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID using timestamp and random number
 * @returns {string} Unique identifier
 */
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Format seconds into MM:SS format with leading zeros
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "25:00")
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format a date object into readable format with day name and full date
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "Monday, January 15, 2024")
 */
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ============================================================================
// 3.5. OPTIONAL FEATURES MODULE
// ============================================================================

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  appState.preferences.darkMode = !appState.preferences.darkMode;
  applyTheme();
  savePreferences();
}

/**
 * Apply theme based on preferences
 */
function applyTheme() {
  const body = document.body;
  if (appState.preferences.darkMode) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

/**
 * Set custom name for greeting
 * @param {string} name - Custom name
 */
function setCustomName(name) {
  appState.preferences.customName = name.trim();
  savePreferences();
  updateGreeting();
}

/**
 * Set timer duration
 * @param {number} minutes - Duration in minutes
 */
function setTimerDuration(minutes) {
  if (minutes < 1 || minutes > 60) return;

  appState.preferences.timerDuration = minutes;
  appState.timer.duration = minutes * 60;

  // If timer is running, stop and reset
  if (appState.timer.isRunning) {
    if (appState.timer.intervalId) {
      clearInterval(appState.timer.intervalId);
      appState.timer.intervalId = null;
    }
    appState.timer.isRunning = false;
    appState.timer.isPaused = false;
  }

  appState.timer.timeRemaining = appState.timer.duration;
  updateTimerDisplay();
  savePreferences();

  // Update button states
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;
}

/**
 * Set sort order for tasks
 * @param {string} criteria - Sort criteria
 */
function setSortOrder(criteria) {
  appState.preferences.sortBy = criteria;
  savePreferences();
  renderTasks();
}

// ============================================================================
// 4. EVENT LISTENER ATTACHMENT FUNCTION
// ============================================================================

/**
 * Attach all event listeners to DOM elements
 * Called during initialization to set up user interactions
 */
function attachEventListeners() {
  // Theme toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleDarkMode);
  }

  // Custom name
  const saveNameBtn = document.getElementById('save-name-btn');
  const customNameInput = document.getElementById('custom-name-input');
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      setCustomName(customNameInput.value);
    });
  }
  if (customNameInput) {
    customNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        setCustomName(customNameInput.value);
      }
    });
  }

  // Duration control
  const setDurationBtn = document.getElementById('set-duration-btn');
  const durationInput = document.getElementById('duration-input');
  if (setDurationBtn) {
    setDurationBtn.addEventListener('click', () => {
      const minutes = parseInt(durationInput.value);
      if (minutes >= 1 && minutes <= 60) {
        setTimerDuration(minutes);
      }
    });
  }
  if (durationInput) {
    durationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const minutes = parseInt(durationInput.value);
        if (minutes >= 1 && minutes <= 60) {
          setTimerDuration(minutes);
        }
      }
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      setSortOrder(e.target.value);
    });
  }

  // Timer button listeners
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (stopBtn) stopBtn.addEventListener('click', stopTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  // Task input listeners
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');

  if (addTaskBtn) addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value;
    addTask(text);
    if (taskInput) taskInput.value = '';
  });

  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = taskInput.value;
        addTask(text);
        taskInput.value = '';
      }
    });
  }

  // Quick links input listeners
  const saveLinkBtn = document.getElementById('save-link-btn');
  const linkNameInput = document.getElementById('link-name-input');
  const linkUrlInput = document.getElementById('link-url-input');

  if (saveLinkBtn) {
    saveLinkBtn.addEventListener('click', () => {
      const name = linkNameInput.value;
      const url = linkUrlInput.value;
      addQuickLink(name, url);
      if (linkNameInput) linkNameInput.value = '';
      if (linkUrlInput) linkUrlInput.value = '';
    });
  }
}

// ============================================================================
// 4. TIMER MODULE
// ============================================================================

/**
 * Start the Pomodoro timer countdown
 */
function startTimer() {
  if (appState.timer.isRunning) return;

  appState.timer.isRunning = true;
  appState.timer.isPaused = false;

  // Update button states
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;
  if (resetBtn) resetBtn.disabled = false;

  // Create interval for countdown
  appState.timer.intervalId = setInterval(() => {
    appState.timer.timeRemaining--;
    updateTimerDisplay();

    // Check if timer reached zero
    if (appState.timer.timeRemaining <= 0) {
      completeTimer();
    }
  }, 1000);
}

/**
 * Stop (pause) the Pomodoro timer
 */
function stopTimer() {
  if (!appState.timer.isRunning) return;

  appState.timer.isRunning = false;
  appState.timer.isPaused = true;

  // Clear the interval
  if (appState.timer.intervalId) {
    clearInterval(appState.timer.intervalId);
    appState.timer.intervalId = null;
  }

  // Update button states
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = false;
}

/**
 * Reset the Pomodoro timer to initial duration
 */
function resetTimer() {
  // Stop any running timer
  if (appState.timer.isRunning) {
    if (appState.timer.intervalId) {
      clearInterval(appState.timer.intervalId);
      appState.timer.intervalId = null;
    }
  }

  // Reset state
  appState.timer.isRunning = false;
  appState.timer.isPaused = false;
  appState.timer.timeRemaining = appState.timer.duration;

  // Update display
  updateTimerDisplay();

  // Update button states
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;
}

/**
 * Update the timer display with current time remaining
 */
function updateTimerDisplay() {
  const timerValue = document.getElementById('timer-value');
  if (timerValue) {
    timerValue.textContent = formatTime(appState.timer.timeRemaining);
  }
}

/**
 * Handle timer completion
 */
function completeTimer() {
  // Stop the interval
  if (appState.timer.intervalId) {
    clearInterval(appState.timer.intervalId);
    appState.timer.intervalId = null;
  }

  appState.timer.isRunning = false;
  appState.timer.timeRemaining = 0;

  // Update display
  updateTimerDisplay();

  // Update button states
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;

  // Display completion notification
  const timerStatus = document.getElementById('timer-status');
  if (timerStatus) {
    timerStatus.textContent = 'Session Complete!';
  }
}

// ============================================================================
// 5. TASK MANAGEMENT MODULE
// ============================================================================

/**
 * Add a new task to the task list
 * @param {string} text - Task text to add
 * @returns {boolean} True if task was added, false otherwise
 */
function addTask(text) {
  // Validate input
  if (!text || !text.trim()) return false;

  // Check for duplicates if enabled
  if (appState.preferences.duplicatePrevention && isDuplicate(text)) {
    return false;
  }

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

  // Update display
  renderTasks();

  return true;
}

/**
 * Delete a task from the task list
 * @param {string} id - Task ID to delete
 */
function deleteTask(id) {
  appState.tasks = appState.tasks.filter(t => t.id !== id);
  saveTasksToStorage();
  renderTasks();
}

/**
 * Edit a task's text
 * @param {string} id - Task ID to edit
 * @param {string} newText - New task text
 * @returns {boolean} True if task was edited, false otherwise
 */
function editTask(id, newText) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.text = newText.trim();
    task.editedAt = Date.now();
    saveTasksToStorage();
    renderTasks();
    return true;
  }
  return false;
}

/**
 * Toggle a task's completion state
 * @param {string} id - Task ID to toggle
 * @returns {boolean} True if task was toggled, false otherwise
 */
function toggleTaskComplete(id) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.editedAt = Date.now();
    saveTasksToStorage();
    renderTasks();
    return true;
  }
  return false;
}

/**
 * Check if a task text is a duplicate (case-insensitive)
 * @param {string} text - Task text to check
 * @returns {boolean} True if duplicate exists, false otherwise
 */
function isDuplicate(text) {
  const normalized = text.trim().toLowerCase();
  return appState.tasks.some(task =>
    task.text.trim().toLowerCase() === normalized
  );
}

/**
 * Get tasks sorted by current sort preference
 * @returns {array} Sorted array of tasks
 */
function getSortedTasks() {
  const sorted = [...appState.tasks];

  switch (appState.preferences.sortBy) {
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

/**
 * Enter edit mode for a task
 * @param {string} id - Task ID to edit
 * @param {string} currentText - Current task text
 */
function enterEditMode(id, currentText) {
  appState.ui.editingTaskId = id;
  renderTasks();
}

/**
 * Save edited task
 * @param {string} id - Task ID
 * @param {string} newText - New task text
 */
function saveEditedTask(id, newText) {
  if (!newText || !newText.trim()) {
    cancelEditMode();
    return;
  }

  editTask(id, newText);
  appState.ui.editingTaskId = null;
}

/**
 * Cancel edit mode
 */
function cancelEditMode() {
  appState.ui.editingTaskId = null;
  renderTasks();
}

/**
 * Render tasks to the DOM
 */
function renderTasks() {
  const taskList = document.getElementById('task-list');
  const emptyMessage = document.getElementById('empty-tasks-message');

  if (!taskList) return;

  // Get sorted tasks
  const tasks = getSortedTasks();

  // Clear current list
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';

  // Render each task
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;

    if (task.completed) {
      li.classList.add('completed');
    }

    // Check if this task is in edit mode
    if (appState.ui.editingTaskId === task.id) {
      li.innerHTML = `
        <input type="text" class="task-edit-input" value="${escapeHtml(task.text)}">
        <button class="btn-save">Save</button>
        <button class="btn-cancel">Cancel</button>
      `;

      const input = li.querySelector('.task-edit-input');
      const saveBtn = li.querySelector('.btn-save');
      const cancelBtn = li.querySelector('.btn-cancel');

      if (input) input.focus();

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          saveEditedTask(task.id, input.value);
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEditMode);
      }

      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            saveEditedTask(task.id, input.value);
          }
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            cancelEditMode();
          }
        });
      }
    } else {
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
      `;

      // Add event listeners
      const checkbox = li.querySelector('.task-checkbox');
      const editBtn = li.querySelector('.btn-edit');
      const deleteBtn = li.querySelector('.btn-delete');

      if (checkbox) {
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
      }

      if (editBtn) {
        editBtn.addEventListener('click', () => {
          enterEditMode(task.id, task.text);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
      }
    }

    taskList.appendChild(li);
  });
}

// ============================================================================
// 6. QUICK LINKS MODULE
// ============================================================================

/**
 * Add a new quick link
 * @param {string} name - Link name
 * @param {string} url - Link URL
 * @returns {boolean} True if link was added, false otherwise
 */
function addQuickLink(name, url) {
  // Validate input
  if (!name || !name.trim() || !url || !url.trim()) return false;

  const link = {
    id: generateId(),
    name: name.trim(),
    url: url.trim(),
    createdAt: Date.now()
  };

  appState.quickLinks.push(link);
  saveQuickLinksToStorage();
  renderQuickLinks();

  return true;
}

/**
 * Delete a quick link
 * @param {string} id - Link ID to delete
 */
function deleteQuickLink(id) {
  appState.quickLinks = appState.quickLinks.filter(l => l.id !== id);
  saveQuickLinksToStorage();
  renderQuickLinks();
}

/**
 * Open a quick link in a new tab
 * @param {string} url - URL to open
 */
function openQuickLink(url) {
  window.open(url, '_blank');
}

/**
 * Render quick links to the DOM
 */
function renderQuickLinks() {
  const container = document.getElementById('quick-links-container');
  const emptyMessage = document.getElementById('empty-links-message');

  if (!container) return;

  // Clear current links
  container.innerHTML = '';

  if (appState.quickLinks.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';

  // Render each link
  appState.quickLinks.forEach(link => {
    const div = document.createElement('div');
    div.className = 'quick-link-item';
    div.dataset.linkId = link.id;

    div.innerHTML = `
      <button class="quick-link-btn" data-url="${escapeHtml(link.url)}">${escapeHtml(link.name)}</button>
      <button class="btn-delete">Delete</button>
    `;

    // Add event listeners
    const linkBtn = div.querySelector('.quick-link-btn');
    const deleteBtn = div.querySelector('.btn-delete');

    if (linkBtn) {
      linkBtn.addEventListener('click', () => openQuickLink(link.url));
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => deleteQuickLink(link.id));
    }

    container.appendChild(div);
  });
}

// ============================================================================
// 7. LOCAL STORAGE MODULE
// ============================================================================

/**
 * Save tasks to Local Storage
 */
function saveTasksToStorage() {
  try {
    localStorage.setItem('pomodoro_tasks', JSON.stringify(appState.tasks));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    }
  }
}

/**
 * Load tasks from Local Storage
 */
function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem('pomodoro_tasks');
    if (stored) {
      appState.tasks = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse stored tasks');
    appState.tasks = [];
  }
}

/**
 * Save quick links to Local Storage
 */
function saveQuickLinksToStorage() {
  try {
    localStorage.setItem('pomodoro_quick_links', JSON.stringify(appState.quickLinks));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    }
  }
}

/**
 * Load quick links from Local Storage
 */
function loadQuickLinksFromStorage() {
  try {
    const stored = localStorage.getItem('pomodoro_quick_links');
    if (stored) {
      appState.quickLinks = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse stored quick links');
    appState.quickLinks = [];
  }
}

/**
 * Save user preferences to Local Storage
 */
function savePreferences() {
  try {
    localStorage.setItem('pomodoro_preferences', JSON.stringify(appState.preferences));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    }
  }
}

/**
 * Load user preferences from Local Storage
 */
function loadPreferences() {
  try {
    const stored = localStorage.getItem('pomodoro_preferences');
    if (stored) {
      appState.preferences = { ...appState.preferences, ...JSON.parse(stored) };
      // Update timer duration from preferences
      appState.timer.duration = appState.preferences.timerDuration * 60;
      appState.timer.timeRemaining = appState.timer.duration;
    }
  } catch (e) {
    console.error('Failed to parse stored preferences');
  }
}

/**
 * Load all data from Local Storage
 */
function loadAllData() {
  loadTasksFromStorage();
  loadQuickLinksFromStorage();
  loadPreferences();
}

// ============================================================================
// 8. UI RENDERING MODULE
// ============================================================================

/**
 * Get appropriate greeting message based on hour
 * @param {number} hour - Hour of day (0-23)
 * @returns {string} Greeting message
 */
function getGreetingMessage(hour) {
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else if (hour >= 18 && hour < 24) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

/**
 * Update greeting section with current time, date, and message
 */
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();

  // Update greeting message
  const greetingMessage = document.getElementById('greeting-message');
  if (greetingMessage) {
    let message = getGreetingMessage(hour);
    if (appState.preferences.customName) {
      message += `, ${appState.preferences.customName}`;
    }
    greetingMessage.textContent = message;
  }

  // Update time
  const currentTime = document.getElementById('current-time');
  if (currentTime) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    currentTime.textContent = timeStr;
  }

  // Update date
  const currentDate = document.getElementById('current-date');
  if (currentDate) {
    currentDate.textContent = formatDate(now);
  }
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// 9. INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 * Called on DOMContentLoaded
 */
function initializeApp() {
  // Load all data from Local Storage
  loadAllData();

  // Apply theme
  applyTheme();

  // Set custom name input value
  const customNameInput = document.getElementById('custom-name-input');
  if (customNameInput) {
    customNameInput.value = appState.preferences.customName;
  }

  // Set duration input value
  const durationInput = document.getElementById('duration-input');
  if (durationInput) {
    durationInput.value = appState.preferences.timerDuration;
  }

  // Set sort select value
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.value = appState.preferences.sortBy;
  }

  // Initialize timer display
  updateTimerDisplay();

  // Initialize greeting
  updateGreeting();

  // Set up greeting update interval (every minute)
  setInterval(updateGreeting, 60000);

  // Render initial UI
  renderTasks();
  renderQuickLinks();

  // Attach event listeners
  attachEventListeners();
}

// ============================================================================
// 10. APP START
// ============================================================================

/**
 * Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initializeApp);
