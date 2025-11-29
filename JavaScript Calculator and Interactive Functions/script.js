// STEP 1: SETUP - Define Variables


// This object keeps track of which fields are valid (true) or invalid (false)
var validationState = {
  title: false,
  firstName: false,
  lastName: false,
  emailId: false,
  phoneNumber: false,
  zipcode: false,
  address2: true,  // Optional field - default valid
  source: false,
  drinkSelect: false,
  comments: false,
  dynamicFields: {}
};

// Array to store all form submissions
var submissions = [];

// Regular expressions (regex) for validation
var patterns = {
  email: /^[a-zA-Z0-9._%+-]+@northeastern\.edu$/,
  phone: /^\(\d{3}\) \d{3}-\d{4}$/,
  zipcode: /^\d{5}$/,
  name: /^[a-zA-Z0-9\s]+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/
};

// Validation rules configuration
var validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: patterns.name,
    patternMessage: 'Only letters, numbers, and spaces allowed'
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: patterns.name,
    patternMessage: 'Only letters, numbers, and spaces allowed'
  },
  emailId: {
    required: true,
    minLength: 5,
    maxLength: 100,
    pattern: patterns.email,
    patternMessage: 'Must be a valid @northeastern.edu email'
  },
  phoneNumber: {
    required: true,
    minLength: 14,
    maxLength: 14,
    pattern: patterns.phone,
    patternMessage: 'Format: (XXX) XXX-XXXX'
  },
  zipcode: {
    required: true,
    minLength: 5,
    maxLength: 5,
    pattern: patterns.zipcode,
    patternMessage: 'Must be exactly 5 digits'
  },
  address2: {
    required: false,
    minLength: 0,
    maxLength: 100,
    pattern: patterns.alphanumeric,
    patternMessage: 'Only letters, numbers, and spaces allowed'
  },
  comments: {
    required: true,
    minLength: 10,
    maxLength: 500,
    pattern: null,
    patternMessage: ''
  }
};

// STEP 2: VALIDATION FUNCTION

function validateField(fieldName, value) {
  var errorElement = document.getElementById(fieldName + 'Error');
  var isValid = true;
  var errorMessage = '';

  if (fieldName === 'title') {
    var titleRadios = document.querySelectorAll('input[name="title"]');
    var titleChecked = false;
    
    for (var i = 0; i < titleRadios.length; i++) {
      if (titleRadios[i].checked) {
        titleChecked = true;
        break;
      }
    }
    
    isValid = titleChecked;
    errorMessage = isValid ? '' : 'Please select a title';
  }
  
  else if (fieldName === 'source') {
    var checkboxes = document.querySelectorAll('input[name="source"]');
    var anyChecked = false;
    
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        anyChecked = true;
        break;
      }
    }
    
    isValid = anyChecked;
    errorMessage = isValid ? '' : 'Please select at least one option';
  }
  
  else if (fieldName === 'drinkSelect') {
    isValid = value && value !== '';
    errorMessage = isValid ? '' : 'Please select a drink';
  }
  
  else if (validationRules[fieldName]) {
    var rules = validationRules[fieldName];
    
    if (rules.required && (!value || value.trim() === '')) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    else if (rules.minLength && value.length < rules.minLength && value.trim() !== '') {
      isValid = false;
      errorMessage = 'Must be at least ' + rules.minLength + ' characters';
    }
    else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = 'Must be less than ' + rules.maxLength + ' characters';
    }
    else if (rules.pattern && !rules.pattern.test(value) && value.trim() !== '') {
      isValid = false;
      errorMessage = rules.patternMessage;
    }
    
    if (!rules.required && (!value || value.trim() === '')) {
      isValid = true;
      errorMessage = '';
    }
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
  }

  validationState[fieldName] = isValid;
  updateSubmitButton();
  
  return isValid;
}

// STEP 3: UPDATE SUBMIT BUTTON

function updateSubmitButton() {
  var allValid = true;
  
  for (var key in validationState) {
    if (key === 'dynamicFields') {
      for (var dynamicKey in validationState.dynamicFields) {
        if (validationState.dynamicFields[dynamicKey] === false) {
          allValid = false;
          break;
        }
      }
    } else {
      if (validationState[key] === false) {
        allValid = false;
        break;
      }
    }
  }

  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = !allValid;
  }
}

// ========================================
// STEP 4: DISPLAY RESULTS TABLE
// ========================================

function displayResults() {
  var container = document.getElementById('resultsContainer');
  
  var tableHTML = '<h2>Submitted Feedback</h2>';
  tableHTML += '<table id="resultsTable">';
  tableHTML += '<thead><tr>';
  tableHTML += '<th>Title</th>';
  tableHTML += '<th>First Name</th>';
  tableHTML += '<th>Last Name</th>';
  tableHTML += '<th>Email</th>';
  tableHTML += '<th>Phone</th>';
  tableHTML += '<th>Zip Code</th>';
  tableHTML += '<th>Address 2</th>';
  tableHTML += '<th>Source</th>';
  tableHTML += '<th>Drink</th>';
  tableHTML += '<th>Large Drink</th>';
  tableHTML += '<th>Reason</th>';
  tableHTML += '<th>Comments</th>';
  tableHTML += '</tr></thead>';
  tableHTML += '<tbody>';

  for (var i = 0; i < submissions.length; i++) {
    var submission = submissions[i];
    tableHTML += '<tr>';
    tableHTML += '<td>' + submission.title + '</td>';
    tableHTML += '<td>' + submission.firstName + '</td>';
    tableHTML += '<td>' + submission.lastName + '</td>';
    tableHTML += '<td>' + submission.emailId + '</td>';
    tableHTML += '<td>' + submission.phoneNumber + '</td>';
    tableHTML += '<td>' + submission.zipcode + '</td>';
    tableHTML += '<td>' + submission.address2 + '</td>';
    tableHTML += '<td>' + submission.source + '</td>';
    tableHTML += '<td>' + submission.drink + '</td>';
    tableHTML += '<td>' + submission.largeDrink + '</td>';
    tableHTML += '<td>' + submission.largeDrinkReason + '</td>';
    tableHTML += '<td>' + submission.comments + '</td>';
    tableHTML += '</tr>';
  }

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;
}

// ========================================
// WAIT FOR PAGE TO LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, attaching event listeners');

  // Phone Number Auto-Formatting
  var phoneInput = document.getElementById('phoneNumber');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      var value = e.target.value.replace(/\D/g, '');
      var formattedValue = '';

      if (value.length > 0) {
        formattedValue = '(' + value.substring(0, 3);
        if (value.length >= 3) {
          formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 6) {
          formattedValue += '-' + value.substring(6, 10);
        }
      }

      e.target.value = formattedValue;
      validateField('phoneNumber', formattedValue);
    });
  }

  // Zipcode - Numbers Only
  var zipcodeInput = document.getElementById('zipcode');
  if (zipcodeInput) {
    zipcodeInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
      validateField('zipcode', e.target.value);
    });
  }

  // Character Counter for Address 2
  var address2Input = document.getElementById('address2');
  if (address2Input) {
    address2Input.addEventListener('input', function(e) {
      var counter = document.getElementById('address2Counter');
      var length = e.target.value.length;
      if (counter) {
        counter.textContent = length + '/100 characters used';
      }
      validateField('address2', e.target.value);
    });
  }

  // Real-Time Validation for Text Fields
  var firstNameInput = document.getElementById('firstName');
  if (firstNameInput) {
    firstNameInput.addEventListener('input', function(e) {
      validateField('firstName', e.target.value);
    });
  }

  var lastNameInput = document.getElementById('lastName');
  if (lastNameInput) {
    lastNameInput.addEventListener('input', function(e) {
      validateField('lastName', e.target.value);
    });
  }

  var emailInput = document.getElementById('emailId');
  if (emailInput) {
    emailInput.addEventListener('input', function(e) {
      validateField('emailId', e.target.value);
    });
  }

  var commentsInput = document.getElementById('comments');
  if (commentsInput) {
    commentsInput.addEventListener('input', function(e) {
      validateField('comments', e.target.value);
    });
  }

  // Validate Radio Buttons (Title)
  var titleRadios = document.querySelectorAll('input[name="title"]');
  for (var i = 0; i < titleRadios.length; i++) {
    titleRadios[i].addEventListener('change', function() {
      validateField('title');
    });
  }

  // Validate Checkboxes (Source)
  var sourceCheckboxes = document.querySelectorAll('input[name="source"]');
  for (var i = 0; i < sourceCheckboxes.length; i++) {
    sourceCheckboxes[i].addEventListener('change', function() {
      validateField('source');
    });
  }

  // Drink Dropdown with Dynamic Checkbox
  var drinkSelect = document.getElementById('drinkSelect');
  if (drinkSelect) {
    console.log('Drink select found, attaching change listener');
    drinkSelect.addEventListener('change', function(e) {
      console.log('Drink selected:', e.target.value);
      validateField('drinkSelect', e.target.value);
      
      var container = document.getElementById('dynamicCheckboxContainer');
      if (!container) {
        console.error('dynamicCheckboxContainer not found!');
        return;
      }
      
      container.innerHTML = '';

      if (e.target.value) {
        console.log('Creating dynamic checkbox');
        
        // Define different options for each drink
        var drinkOptions = {
          'Hot Black Tea - Keemun': {
            label: 'Add honey (50¢ extra)',
            placeholder: 'Are you sure? Type Yes or No'
          },
          'Iced Green Tea': {
            label: 'Extra ice (free)',
            placeholder: 'Are you sure? Type Yes or No'
          },
          'Coffee': {
            label: 'Add extra shot (75¢ extra)',
            placeholder: 'Are you sure? Type Yes or No'
          },
          'Lemonade': {
            label: 'Make it pink lemonade (50¢ extra)',
            placeholder: 'Are you sure? Type Yes or No'
          },
          'Smoothie': {
            label: 'Add protein powder ($1.00 extra)',
            placeholder: 'Are you sure? Type Yes or No'
          }
        };
        
        var selectedDrink = e.target.value;
        var option = drinkOptions[selectedDrink];
        
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'dynamic-checkbox-item';
        checkboxDiv.innerHTML = 
          '<input type="checkbox" id="largeDrink" name="largeDrink">' +
          '<label for="largeDrink">' + option.label + '</label>' +
          '<div id="largeDrinkTextField" style="display: none;">' +
            '<input type="text" class="dynamic-textfield" id="largeDrinkReason" placeholder="' + option.placeholder + '" maxlength="100">' +
            '<span class="error-message" id="largeDrinkReasonError"></span>' +
          '</div>';
        
        container.appendChild(checkboxDiv);
        console.log('Dynamic checkbox added for:', selectedDrink);

        var largeDrinkCheckbox = document.getElementById('largeDrink');
        if (largeDrinkCheckbox) {
          largeDrinkCheckbox.addEventListener('change', function(e) {
            console.log('Large drink checkbox changed:', e.target.checked);
            var textFieldDiv = document.getElementById('largeDrinkTextField');
            var textField = document.getElementById('largeDrinkReason');
            
            if (e.target.checked) {
              textFieldDiv.style.display = 'block';
              validationState.dynamicFields.largeDrinkReason = false;
              
              textField.addEventListener('input', function(e) {
                var value = e.target.value.trim();
                var isValid = true;
                var errorMsg = '';
                
                if (!value || value === '') {
                  isValid = false;
                  errorMsg = 'Reason is required';
                }
                else if (value.length < 3) {
                  isValid = false;
                  errorMsg = 'Must be at least 3 characters';
                }
                else if (value.length > 100) {
                  isValid = false;
                  errorMsg = 'Must be less than 100 characters';
                }
                else if (!patterns.alphanumeric.test(value)) {
                  isValid = false;
                  errorMsg = 'Only letters, numbers, and spaces allowed';
                }
                
                validationState.dynamicFields.largeDrinkReason = isValid;
                document.getElementById('largeDrinkReasonError').textContent = errorMsg;
                updateSubmitButton();
              });
            } else {
              textFieldDiv.style.display = 'none';
              delete validationState.dynamicFields.largeDrinkReason;
            }
            updateSubmitButton();
          });
        }
      }
    });
  } else {
    console.error('drinkSelect element not found!');
  }

  // Form Submission
  var form = document.getElementById('feedbackForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = {
        title: document.querySelector('input[name="title"]:checked').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        emailId: document.getElementById('emailId').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        zipcode: document.getElementById('zipcode').value,
        address2: document.getElementById('address2').value || '',
        source: '',
        drink: document.getElementById('drinkSelect').value,
        largeDrink: 'No',
        largeDrinkReason: '',
        comments: document.getElementById('comments').value
      };

      var sourceCheckboxes = document.querySelectorAll('input[name="source"]:checked');
      var sourceArray = [];
      for (var i = 0; i < sourceCheckboxes.length; i++) {
        sourceArray.push(sourceCheckboxes[i].value);
      }
      formData.source = sourceArray.join(', ');

      var largeDrinkCheckbox = document.getElementById('largeDrink');
      if (largeDrinkCheckbox && largeDrinkCheckbox.checked) {
        formData.largeDrink = 'Yes';
        formData.largeDrinkReason = document.getElementById('largeDrinkReason').value;
      }

      submissions.push(formData);
      displayResults();

      document.getElementById('feedbackForm').reset();
      document.getElementById('dynamicCheckboxContainer').innerHTML = '';
      document.getElementById('address2Counter').textContent = '0/100 characters used';
      
      for (var key in validationState) {
        if (key === 'dynamicFields') {
          validationState[key] = {};
        } else if (key === 'address2') {
          validationState[key] = true;
        } else {
          validationState[key] = false;
        }
      }
      
      var errorMessages = document.querySelectorAll('.error-message');
      for (var i = 0; i < errorMessages.length; i++) {
        errorMessages[i].textContent = '';
      }
      
      updateSubmitButton();
    });
  }
    // Reset Button
  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      setTimeout(function() {
        document.getElementById('dynamicCheckboxContainer').innerHTML = '';
        document.getElementById('address2Counter').textContent = '0/100 characters used';
        
        var errorMessages = document.querySelectorAll('.error-message');
        for (var i = 0; i < errorMessages.length; i++) {
          errorMessages[i].textContent = '';
        }
        
        for (var key in validationState) {
          if (key === 'dynamicFields') {
            validationState[key] = {};
          } else if (key === 'address2') {
            validationState[key] = true;
          } else {
            validationState[key] = false;
          }
        }
        
        updateSubmitButton();
      }, 0);
    });
  }
   // AI Assistant Chatbot
  var aiBtn = document.getElementById('aiAssistantBtn');
  var chatWindow = document.getElementById('chatWindow');
  var closeChat = document.getElementById('closeChat');
  var chatInput = document.getElementById('chatInput');
  var sendBtn = document.getElementById('sendBtn');
  var chatMessages = document.getElementById('chatMessages');

  var faqs = {
    email: {
      keywords: ['email', 'mail', 'e-mail', '@'],
      answer: 'You must use your Northeastern email address ending with @northeastern.edu (example: student@northeastern.edu). Email must be 5-100 characters. Other email domains are not accepted.'
    },
    phone: {
      keywords: ['phone', 'number', 'telephone', 'format'],
      answer: 'The phone number must be in the format (XXX) XXX-XXXX. The form will automatically format it as you type. It must be exactly 14 characters.'
    },
    zip: {
      keywords: ['zip', 'zipcode', 'postal', 'code', 'digits'],
      answer: 'The zip code must be exactly 5 digits. Only numbers are allowed.'
    },
    required: {
      keywords: ['required', 'mandatory', 'fields', 'must', 'necessary'],
      answer: 'All fields are required except Street Address 2. Required fields are marked with an asterisk (*). Each field has minimum and maximum length requirements.'
    },
    address: {
      keywords: ['address', 'street', 'optional'],
      answer: 'Street Address 2 is optional (max 100 characters). Only letters, numbers, and spaces are allowed. This field is for apartment numbers, suite numbers, etc.'
    },
    special: {
      keywords: ['special', 'characters', 'symbols', 'alphanumeric'],
      answer: 'Most text fields only accept letters, numbers, and spaces. Special characters like @, #, $, %, etc. are not allowed in name fields, address, and reason fields.'
    },
    name: {
      keywords: ['name', 'first', 'last'],
      answer: 'First and Last names must be 2-50 characters long and can only contain letters, numbers, and spaces. No special characters are allowed.'
    },
    comments: {
      keywords: ['comment', 'feedback', 'message'],
      answer: 'Comments are required and must be between 10 and 500 characters long.'
    }
  };

  if (aiBtn) {
    aiBtn.addEventListener('click', function() {
      if (chatWindow.classList.contains('active')) {
        chatWindow.classList.remove('active');
      } else {
        chatWindow.classList.add('active');
      }
    });
  }

  if (closeChat) {
    closeChat.addEventListener('click', function() {
      chatWindow.classList.remove('active');
    });
  }

  function addMessage(text, isUser) {
    var messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + (isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function findAnswer(question) {
    var lowerQuestion = question.toLowerCase();
    
    for (var key in faqs) {
      var faq = faqs[key];
      
      for (var i = 0; i < faq.keywords.length; i++) {
        if (lowerQuestion.indexOf(faq.keywords[i]) !== -1) {
          return faq.answer;
        }
      }
    }
    
    return "Sorry, I don't know that yet. Please ask about: email requirements, phone format, zip code, required fields, street address, special characters, name fields, or comments.";
  }

  function sendMessage() {
    var message = chatInput.value.trim();
    
    if (message) {
      addMessage(message, true);
      chatInput.value = '';
      
      setTimeout(function() {
        var answer = findAnswer(message);
        addMessage(answer, false);
      }, 500);
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  console.log('All event listeners attached successfully');
});