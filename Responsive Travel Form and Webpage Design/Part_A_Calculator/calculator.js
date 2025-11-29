$(document).ready(function() {
    // Check authentication on page load
    const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    
    if (!sessionData) {
        window.location.href = 'login.html';
        return;
    }
    
    let session;
    try {
        session = JSON.parse(sessionData);
        if (!session.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('userSession');
        window.location.href = 'login.html';
        return;
    }
    
    // Display welcome message
    $('#welcomeMessage').text(`Welcome, ${session.username}!`);
    
    // Single arrow function for ALL calculations (REQUIREMENT)
    const calculate = (num1, num2, operation) => {
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);
        
        switch(operation) {
            case 'add':
                return n1 + n2;
            case 'subtract':
                return n1 - n2;
            case 'multiply':
                return n1 * n2;
            case 'divide':
                if (n2 === 0) {
                    return 'Cannot divide by zero';
                }
                return n1 / n2;
            default:
                return 'Invalid operation';
        }
    };
    
    // Validate number input
    function validateNumber(inputId, errorId) {
        const value = $(`#${inputId}`).val().trim();
        const numberRegex = /^-?\d*\.?\d+$/;
        
        $(`#${errorId}`).text('');
        
        if (value === '') {
            $(`#${errorId}`).text('Please enter a valid number');
            return false;
        }
        
        if (!numberRegex.test(value)) {
            $(`#${errorId}`).text('Please enter a valid number');
            return false;
        }
        
        return true;
    }
    
    // Number 1 field events
    $('#number1').on('keyup blur', function() {
        validateNumber('number1', 'number1Error');
    });
    
    $('#number1').on('focus', function() {
        $('#number1Error').text('');
    });
    
    // Number 2 field events
    $('#number2').on('keyup blur', function() {
        validateNumber('number2', 'number2Error');
    });
    
    $('#number2').on('focus', function() {
        $('#number2Error').text('');
    });
    
    // Operation button click handler
    $('.btn-operation').on('click', function() {
        // Clear previous errors
        $('#number1Error').text('');
        $('#number2Error').text('');
        
        // Validate both inputs
        const isNum1Valid = validateNumber('number1', 'number1Error');
        const isNum2Valid = validateNumber('number2', 'number2Error');
        
        if (!isNum1Valid || !isNum2Valid) {
            $('#result').val('');
            return;
        }
        
        // Get values and operation
        const num1 = $('#number1').val().trim();
        const num2 = $('#number2').val().trim();
        const operation = $(this).data('operation');
        
        // Calculate result using the single arrow function
        const result = calculate(num1, num2, operation);
        
        // Display result with jQuery chaining
        $('#result')
            .val(result)
            .css('background-color', '#e8f5e9')
            .animate({ backgroundColor: '#f8f9fa' }, 1000);
    });
    
    // Logout functionality
    $('#logoutBtn').on('click', function() {
        // Clear session from both storages
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('userSession');
        
        // Fade out animation
        $('.calculator-card').addClass('fade-out');
        
        // Redirect after animation
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 500);
    });
    
    // Clear result when inputs change
    $('#number1, #number2').on('input', function() {
        $('#result').val('');
    });
});