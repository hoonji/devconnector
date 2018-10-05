const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.post('/register', async (req, res) => {
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
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ email: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.json({ msg: 'Success' });
  } else {
    return res.status(400).json({ password: 'Passowrd incorrect' });
  }
});

module.exports = router;
