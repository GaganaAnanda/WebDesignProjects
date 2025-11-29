# Part B: Event Stopwatch with Session Logging

## Description
A feature-rich stopwatch application that allows users to time events, associate them with specific dates, and maintain a persistent history of all timed sessions stored in localStorage.

## Features Implemented
- **Timer Functionality**
  - Large, prominent display (72px font) in HH:MM:SS format
  - Precise timing using setInterval
  - Start, Pause/Resume, Stop & Save, and Reset controls
  - Real-time updates every second

- **Event Management**
  - Date picker with default to today's date
  - Event name input with comprehensive validation
  - Fields disabled during timer operation
  - Required fields before starting timer

- **Validation System**
  - Date field cannot be empty
  - Event name: 3-100 characters
  - Only letters, numbers, spaces, hyphens, and apostrophes allowed
  - Real-time error messages below fields
  - Errors clear on focus
  - No pop-up alerts

- **Session History**
  - All sessions saved to localStorage
  - Display: Date, Event Name, Duration (HH:MM:SS)
  - Most recent sessions shown first
  - Filter sessions by date
  - Clear filter functionality
  - Animated session entries

- **Statistics**
  - Total sessions count
  - Total time across all sessions
  - Real-time updates

- **Modern JavaScript**
  - Async/await for timer operations
  - Promises for session saving
  - setInterval/clearInterval for timing
  - ES6+ arrow functions

## Technologies Used
- HTML5 (Date input type)
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Async/Await, Promises, Arrow Functions)
- jQuery 3.6.0
- localStorage API

## How to Run
1. Download all files to a single directory
2. Open `stopwatch.html` in a web browser
3. Enter event details (date and name)
4. Click "Start" to begin timing
5. Use Pause/Resume to control the timer
6. Click "Stop & Save" to save the session
7. View history and statistics below
8. Filter sessions by date as needed

## File Structure
```
PartB/
├── stopwatch.html
├── stopwatch.css
├── stopwatch.js
└── README.md
```

## Key Requirements Met
- ✅ Async/await with Promises for stopwatch logic
- ✅ setInterval and clearInterval for timing
- ✅ jQuery for all validations and DOM manipulation
- ✅ localStorage for persistent session storage
- ✅ No pop-up alerts
- ✅ Responsive design (mobile-friendly)
- ✅ Large timer display (72px minimum)
- ✅ Color-coded buttons
- ✅ Professional styling with animations
- ✅ Filter by date functionality
- ✅ Statistics display

## Usage Tips
- The date picker is for organizing when you're timing an activity
- Example: "Study Session on October 23, 2025"
- This allows tracking activities over time
- Sessions persist across browser sessions
- Use the filter to view sessions from specific dates
- Statistics update automatically when sessions are saved