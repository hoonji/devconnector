const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
const strategy = require('./config/passportStrategy');
passport.use(strategy);

// Connect to MongoDB
const mongoURI = require('./config/keys').mongoURI;
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
