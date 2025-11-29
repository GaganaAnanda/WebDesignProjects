// Clear any previous session when visiting login page
//sessionStorage.removeItem('userSession');
//localStorage.removeItem('userSession');
$(document).ready(function() {
    // Hardcoded users
    const validUsers = [
        { email: 'ananda@northeastern.edu', password: 'Password123' },
        { email: 'indira@northeastern.edu', password: 'SecurePass456' },
        { email: 'davan@northeastern.edu', password: 'MyPass789' }
    ];

    // Validation state
    let isEmailValid = false;
    let isPasswordValid = false;

    // Email validation function
    function validateEmail() {
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        $('#emailError').text('');
        
        if (email === '') {
            $('#emailError').text('Please enter a valid Northeastern email');
            isEmailValid = false;
            return false;
        }
        
        if (!emailRegex.test(email)) {
            $('#emailError').text('Please enter a valid Northeastern email');
            isEmailValid = false;
            return false;
        }
        
        if (!email.endsWith('@northeastern.edu')) {
            $('#emailError').text('Please enter a valid Northeastern email');
            isEmailValid = false;
            return false;
        }
        
        isEmailValid = true;
        return true;
    }

    // Password validation function
    function validatePassword() {
        const password = $('#password').val();
        
        $('#passwordError').text('');
        
        if (password === '') {
            $('#passwordError').text('Password cannot be empty');
            isPasswordValid = false;
            return false;
        }
        
        if (password.length < 8) {
            $('#passwordError').text('Password must be at least 8 characters');
            isPasswordValid = false;
            return false;
        }
        
        isPasswordValid = true;
        return true;
    }

    // Update login button state
    function updateLoginButton() {
        if (isEmailValid && isPasswordValid) {
            $('#loginBtn').prop('disabled', false);
        } else {
            $('#loginBtn').prop('disabled', true);
        }
    }

    // Email field events
    $('#email').on('keyup', function() {
        validateEmail();
        updateLoginButton();
    });

    $('#email').on('blur', function() {
        validateEmail();
        updateLoginButton();
    });

    $('#email').on('focus', function() {
        $('#emailError').text('');
        $('#loginError').text('');
    });

    // Password field events
    $('#password').on('keyup', function() {
        validatePassword();
        updateLoginButton();
    });

    $('#password').on('blur', function() {
        validatePassword();
        updateLoginButton();
    });

    $('#password').on('focus', function() {
        $('#passwordError').text('');
        $('#loginError').text('');
    });

    // Form submission
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        $('#loginError').text('');
        $('#successMessage').text('');
        
        // Validate fields
        const emailValid = validateEmail();
        const passwordValid = validatePassword();
        
        if (!emailValid || !passwordValid) {
            return;
        }
        
        // Get form values
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');
        
        // Check credentials
        const user = validUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Extract username from email
            const username = email.split('@')[0].replace('.', ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            // Create session data
            const sessionData = {
                username: username,
                email: email,
                loginTimestamp: new Date().toISOString(),
                isLoggedIn: true
            };
            
            // Store in sessionStorage or localStorage
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('userSession', JSON.stringify(sessionData));
            
            // Show success message with animation
            $('#successMessage')
                .text('Login successful! Redirecting...')
                .hide()
                .fadeIn(500);
            
            // Redirect after 2 seconds
            setTimeout(function() {
                window.location.href = 'calculator.html';
            }, 2000);
            
        } else {
            $('#loginError').text('Invalid email or password');
        }
    });

    // Check if already logged in
    const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            if (session.isLoggedIn) {
                window.location.href = 'calculator.html';
            }
        } catch (e) {
            // Invalid session data, clear it
            sessionStorage.removeItem('userSession');
            localStorage.removeItem('userSession');
        }
    }
});