const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  let errors = {};

  Object.keys(data).forEach(attr => (data[attr] = data[attr] || ''));

  ['name', 'email', 'password'].forEach(field => {
    if (Validator.isEmpty(data[field])) {
      errors[field] = `${field} field is required`;
    }
  });

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = 'password must be at least 6 characters';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
