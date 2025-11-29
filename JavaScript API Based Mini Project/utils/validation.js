const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFullName = (name) => {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one digit, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  validateEmail,
  validateFullName,
  validatePassword
};