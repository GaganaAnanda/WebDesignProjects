$(document).ready(function() {
    // Stopwatch state
    let seconds = 0;
    let intervalId = null;
    let isRunning = false;
    let isPaused = false;

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    $('#eventDate').val(today);

    // Load sessions and update statistics on page load
    loadSessions();
    updateStatistics();

    // Format time as HH:MM:SS
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update timer display
    function updateDisplay() {
        $('#timerDisplay').text(formatTime(seconds));
    }

    // Async function to increment timer using Promise
    async function incrementTimer() {
        return new Promise((resolve) => {
            seconds++;
            updateDisplay();
            resolve();
        });
    }

    // Start timer with setInterval
    async function startTimer() {
        intervalId = setInterval(async () => {
            await incrementTimer();
        }, 1000);
    }

    // Stop timer with clearInterval
    function stopTimer() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Validate date field
    function validateDate() {
        const date = $('#eventDate').val();
        $('#dateError').text('');

        if (date === '') {
            $('#dateError').text('Please select a date');
            return false;
        }

        return true;
    }

    // Validate event name field
    function validateEventName() {
        const name = $('#eventName').val().trim();
        const validNameRegex = /^[a-zA-Z0-9\s\-']+$/;

        $('#nameError').text('');

        if (name === '') {
            $('#nameError').text('Event name is required');
            return false;
        }

        if (name.length < 3) {
            $('#nameError').text('Event name must be at least 3 characters');
            return false;
        }

        if (name.length > 100) {
            $('#nameError').text('Event name too long (max 100 characters)');
            return false;
        }

        if (!validNameRegex.test(name)) {
            $('#nameError').text('Event name contains invalid characters');
            return false;
        }

        return true;
    }

    // Event field validations
    $('#eventDate').on('focus', function() {
        $('#dateError').text('');
    });

    $('#eventDate').on('blur', function() {
        if (!isRunning) {
            validateDate();
        }
    });

    $('#eventName').on('focus', function() {
        $('#nameError').text('');
    });

    $('#eventName').on('blur', function() {
        if (!isRunning) {
            validateEventName();
        }
    });

    $('#eventName').on('keyup', function() {
        if (!isRunning) {
            validateEventName();
        }
    });

    // Start button click
    $('#startBtn').on('click', async function() {
        // Validate fields
        const isDateValid = validateDate();
        const isNameValid = validateEventName();

        if (!isDateValid || !isNameValid) {
            return;
        }

        // Start the timer
        isRunning = true;
        isPaused = false;

        await startTimer();

        // Disable event fields
        $('#eventDate').prop('disabled', true);
        $('#eventName').prop('disabled', true);

        // Update button states
        $('#startBtn').prop('disabled', true);
        $('#pauseBtn').prop('disabled', false).text('Pause');
        $('#stopBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
    });

    // Pause/Resume button click
    $('#pauseBtn').on('click', function() {
        if (isPaused) {
            // Resume
            startTimer();
            $(this).text('Pause');
            isPaused = false;
        } else {
            // Pause
            stopTimer();
            $(this).text('Resume');
            isPaused = true;
        }
    });

    // Stop & Save button click
    $('#stopBtn').on('click', async function() {
        stopTimer();
        isRunning = false;
        isPaused = false;

        // Get event details
        const eventDate = $('#eventDate').val();
        const eventName = $('#eventName').val().trim();
        const duration = seconds;

        // Save session to localStorage
        await saveSession(eventDate, eventName, duration);

        // Reset timer
        seconds = 0;
        updateDisplay();

        // Enable event fields
        $('#eventDate').prop('disabled', false);
        $('#eventName').prop('disabled', false);

        // Reset button states
        $('#startBtn').prop('disabled', false);
        $('#pauseBtn').prop('disabled', true).text('Pause');
        $('#stopBtn').prop('disabled', true);
        $('#resetBtn').prop('disabled', true);

        // Clear event name
        $('#eventName').val('');

        // Reload sessions and update statistics
        loadSessions();
        updateStatistics();
    });

    // Reset button click
    $('#resetBtn').on('click', function() {
        stopTimer();
        seconds = 0;
        updateDisplay();
        isRunning = false;
        isPaused = false;

        // Enable event fields
        $('#eventDate').prop('disabled', false);
        $('#eventName').prop('disabled', false);

        // Reset button states
        $('#startBtn').prop('disabled', false);
        $('#pauseBtn').prop('disabled', true).text('Pause');
        $('#stopBtn').prop('disabled', true);
        $('#resetBtn').prop('disabled', true);
    });

    // Save session using async/await and Promise
    async function saveSession(date, name, duration) {
        return new Promise((resolve) => {
            const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
            
            const newSession = {
                id: Date.now(),
                date: date,
                name: name,
                duration: duration,
                timestamp: new Date().toISOString()
            };

            sessions.push(newSession);
            localStorage.setItem('sessions', JSON.stringify(sessions));
            
            resolve();
        });
    }

    // Load and display sessions
    function loadSessions(filterDate = null) {
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        
        // Sort by timestamp (most recent first)
        sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Filter by date if provided
        const filteredSessions = filterDate 
            ? sessions.filter(s => s.date === filterDate)
            : sessions;

        const $historyContainer = $('#sessionHistory');
        $historyContainer.empty();

        if (filteredSessions.length === 0) {
            $historyContainer.html('<p class="no-sessions">No sessions recorded yet</p>');
            return;
        }

        /*filteredSessions.forEach(session => {
            const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }); */

            filteredSessions.forEach(session => {
            // to avoid timezone issues
            const [year, month, day] = session.date.split('-');
            const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const sessionHtml = `
                <div class="session-item">
                    <div class="session-date">${formattedDate}</div>
                    <div class="session-name">${session.name}</div>
                    <div class="session-duration">${formatTime(session.duration)}</div>
                </div>
            `;

            $historyContainer.append(sessionHtml);
        });
    }

    // Update statistics
    function updateStatistics() {
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        
        const totalSessions = sessions.length;
        const totalSeconds = sessions.reduce((sum, session) => sum + session.duration, 0);

        $('#totalSessions').text(totalSessions);
        $('#totalTime').text(formatTime(totalSeconds));
    }

    // Filter by date
    $('#filterDate').on('change', function() {
        const filterDate = $(this).val();
        if (filterDate) {
            loadSessions(filterDate);
        } else {
            loadSessions();
        }
    });

    // Clear filter
    $('#clearFilterBtn').on('click', function() {
        $('#filterDate').val('');
        loadSessions();
    });
});