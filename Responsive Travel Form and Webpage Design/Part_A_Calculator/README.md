# Part A: Calculator with User Login

## Description
A secure two-page web application featuring user authentication and a basic calculator. Users must log in with valid Northeastern credentials before accessing the calculator functionality.

## Features Implemented
- **Login Page**
  - Email and password validation with real-time feedback
  - Northeastern email domain verification (@northeastern.edu)
  - Remember Me functionality (localStorage vs sessionStorage)
  - Dynamic login button (disabled until validation passes)
  - jQuery animations for success messages
  - No pop-up alerts - all errors display below fields
  - Automatic redirect after successful login

- **Calculator Page**
  - Session authentication check on page load
  - Personalized welcome message
  - Four basic operations (Add, Subtract, Multiply, Divide)
  - Real-time input validation
  - Single arrow function handles all calculations
  - Division by zero error handling
  - Smooth logout with fade animation
  - Result field with visual feedback

## Technologies Used
- HTML5
- CSS3 (Flexbox and Grid)
- JavaScript ES6+ (Arrow Functions)
- jQuery 3.6.0

## How to Run
1. Download all files to a single directory
2. Open `login.html` in a web browser
3. Use demo credentials to login:
   - Email: `ananda@northeastern.edu` | Password: `Password123`
   - Email: `indira@northeastern.edu` | Password: `SecurePass456`
   - Email: `davan@northeastern.edu` | Password: `MyPass789`
4. Access the calculator after successful login

## File Structure
```
PartA/
├── login.html
├── calculator.html
├── styles.css
├── login.js
├── calculator.js
└── README.md
```

## Key Requirements Met
- ✅ Single arrow function for all calculations
- ✅ jQuery for all validations and DOM manipulation
- ✅ No pop-up alerts
- ✅ Responsive design
- ✅ Session management with localStorage/sessionStorage
- ✅ Real-time validation on keyup and blur events
- ✅ Professional CSS styling with animations