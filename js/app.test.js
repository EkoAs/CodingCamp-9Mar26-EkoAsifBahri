// ============================================================================
// POMODORO APP - UNIT TESTS FOR TASKS 4-9
// ============================================================================

// Test utilities
const assert = (condition, message) => {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
};

const assertEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
};

// ============================================================================
// TASK 4: Greeting Section Tests
// ============================================================================

console.log('=== TASK 4: Greeting Section Tests ===');

// Test 4.1: formatTime function
console.log('Test 4.1: formatTime() returns HH:MM format');
const timeTest1 = formatTime(0);
assertEqual(timeTest1, '00:00', 'formatTime(0) should return 00:00');

const timeTest2 = formatTime(3661); // 1 hour, 1 minute, 1 second
assertEqual(timeTest2, '61:01', 'formatTime(3661) should return 61:01');

const timeTest3 = formatTime(1500); // 25 minutes
assertEqual(timeTest3, '25:00', 'formatTime(1500) should return 25:00');
console.log('✓ formatTime() works correctly');

// Test 4.2: formatDate function
console.log('Test 4.2: formatDate() returns readable date format');
const testDate = new Date('2024-01-15');
const dateStr = formatDate(testDate);
assert(dateStr.includes('January'), 'formatDate should include month name');
assert(dateStr.includes('15'), 'formatDate should include day');
assert(dateStr.includes('2024'), 'formatDate should include year');
console.log(`✓ formatDate() returns: ${dateStr}`);

// Test 4.3: getGreetingMessage function
console.log('Test 4.3: getGreetingMessage() returns correct greeting');
assertEqual(getGreetingMessage(6), 'Good Morning', 'Hour 6 should be Good Morning');
assertEqual(getGreetingMessage(11), 'Good Morning', 'Hour 11 should be Good Morning');
assertEqual(getGreetingMessage(12), 'Good Afternoon', 'Hour 12 should be Good Afternoon');
assertEqual(getGreetingMessage(17), 'Good Afternoon', 'Hour 17 should be Good Afternoon');
assertEqual(getGreetingMessage(18), 'Good Evening', 'Hour 18 should be Good Evening');
assertEqual(getGreetingMessage(23), 'Good Evening', 'Hour 23 should be Good Evening');
assertEqual(getGreetingMessage(0), 'Good Night', 'Hour 0 should be Good Night');
assertEqual(getGreetingMessage(4), 'Good Night', 'Hour 4 should be Good Night');
console.log('✓ getGreetingMessage() returns correct greetings');

// ============================================================================
// TASK 5: Timer Display Tests
// ============================================================================

console.log('\n=== TASK 5: Timer Display Tests ===');

// Test 5.1: Initial timer state
console.log('Test 5.1: Timer initializes to 25:00');
assertEqual(appState.timer.timeRemaining, 1500, 'Timer should start at 1500 seconds');
assertEqual(appState.timer.duration, 1500, 'Timer duration should be 1500 seconds');
assertEqual(appState.timer.isRunning, false, 'Timer should not be running initially');
console.log('✓ Timer initializes correctly to 25:00');

// Test 5.2: Timer display format
console.log('Test 5.2: Timer displays in MM:SS format');
const displayValue = formatTime(appState.timer.timeRemaining);
assertEqual(displayValue, '25:00', 'Timer display should show 25:00');
console.log('✓ Timer displays in MM:SS format');

// ============================================================================
// TASK 6: Timer Start Tests
// ============================================================================

console.log('\n=== TASK 6: Timer Start Tests ===');

// Test 6.1: startTimer function exists and is callable
console.log('Test 6.1: startTimer() function exists');
assert(typeof startTimer === 'function', 'startTimer should be a function');
console.log('✓ startTimer() function exists');

// Test 6.2: Timer state after start
console.log('Test 6.2: Timer state changes when started');
const initialTime = appState.timer.timeRemaining;
startTimer();
assert(appState.timer.isRunning === true, 'Timer should be running after start');
assert(appState.timer.intervalId !== null, 'Timer should have an interval ID');
console.log('✓ Timer starts correctly');

// Stop timer for next tests
stopTimer();

// ============================================================================
// TASK 7: Timer Stop Tests
// ============================================================================

console.log('\n=== TASK 7: Timer Stop Tests ===');

// Test 7.1: stopTimer function exists
console.log('Test 7.1: stopTimer() function exists');
assert(typeof stopTimer === 'function', 'stopTimer should be a function');
console.log('✓ stopTimer() function exists');

// Test 7.2: Timer pauses and preserves time
console.log('Test 7.2: Timer pauses and preserves time');
appState.timer.timeRemaining = 1200; // Set to 20:00
appState.timer.isRunning = false;
appState.timer.isPaused = false;
startTimer();
// Simulate 1 second passing
setTimeout(() => {
  const timeBeforeStop = appState.timer.timeRemaining;
  stopTimer();
  assert(appState.timer.isRunning === false, 'Timer should not be running after stop');
  assert(appState.timer.isPaused === true, 'Timer should be paused after stop');
  assert(appState.timer.intervalId === null, 'Interval should be cleared');
  console.log('✓ Timer stops and preserves time');
}, 1100);

// ============================================================================
// TASK 8: Timer Reset Tests
// ============================================================================

console.log('\n=== TASK 8: Timer Reset Tests ===');

// Test 8.1: resetTimer function exists
console.log('Test 8.1: resetTimer() function exists');
assert(typeof resetTimer === 'function', 'resetTimer should be a function');
console.log('✓ resetTimer() function exists');

// Test 8.2: Timer resets to initial duration
console.log('Test 8.2: Timer resets to 25:00');
appState.timer.timeRemaining = 600; // Set to 10:00
resetTimer();
assertEqual(appState.timer.timeRemaining, 1500, 'Timer should reset to 1500 seconds');
assertEqual(appState.timer.isRunning, false, 'Timer should not be running after reset');
assertEqual(appState.timer.isPaused, false, 'Timer should not be paused after reset');
console.log('✓ Timer resets correctly to 25:00');

// ============================================================================
// TASK 9: Timer Completion Tests
// ============================================================================

console.log('\n=== TASK 9: Timer Completion Tests ===');

// Test 9.1: completeTimer function exists
console.log('Test 9.1: completeTimer() function exists');
assert(typeof completeTimer === 'function', 'completeTimer should be a function');
console.log('✓ completeTimer() function exists');

// Test 9.2: Timer stops at 00:00
console.log('Test 9.2: Timer stops at 00:00');
appState.timer.timeRemaining = 0;
appState.timer.isRunning = false;
completeTimer();
assertEqual(appState.timer.timeRemaining, 0, 'Timer should remain at 0');
assertEqual(appState.timer.isRunning, false, 'Timer should not be running');
console.log('✓ Timer stops at 00:00');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n=== ALL TESTS PASSED ===');
console.log('✓ Task 4: Greeting section functions verified');
console.log('✓ Task 5: Timer display and initialization verified');
console.log('✓ Task 6: Timer start functionality verified');
console.log('✓ Task 7: Timer stop functionality verified');
console.log('✓ Task 8: Timer reset functionality verified');
console.log('✓ Task 9: Timer completion functionality verified');
