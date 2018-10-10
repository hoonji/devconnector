const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const keys = require('../../config/keys');
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ email: 'Email already exists' });

  const { name, email, password } = req.body;
  let newUser = new User({
    name,
    email,
    password: await new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          resolve(hash);
        });
      });
    }),
    avatar: gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })
  });

  try {
    newUser = await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.log(err);
  }
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ email: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // User matched

    const { id, name, avatar } = user;
    const payload = { id, name, avatar };

    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
    res.json({
      success: true,
      token: `Bearer ${token}`
    });
  } else {
    return res.status(400).json({ password: 'Passowrd incorrect' });
  }
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      name,
      email
    });
  }
);

module.exports = router;
