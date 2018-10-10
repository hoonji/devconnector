const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  let errors = {};

  Object.keys(data).forEach(attr => (data[attr] = data[attr] || ''));

  ['email', 'password'].forEach(field => {
    if (Validator.isEmpty(data[field])) {
      errors[field] = `${field} field is required`;
    }
  });

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = 'password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
