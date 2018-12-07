const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = mongoose.model('posts');
const User = mongoose.model('users');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   get api/posts
// @desc    get posts
// @access  public
router.get('/', (req, res) => {
  Post.find()
    .then(posts => res.send(posts))
    .catch(e => res.send(e));
});

// @route   get api/posts/:id
// @desc    get single post
// @access  public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.send(post))
    .catch(e => res.send(e));
});

// @route   post api/posts
// @desc    create post
// @access  public
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.create({ ...req.body, user: req.user.id })
      .then(result => res.send(result))
      .catch(e => res.send(e));
  },
);

// @route   delete api/posts/:id
// @desc    delete post
// @access  public
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      if (!post) return res.status(404).send('Not found');
      console.log(post.user, req.user.id);
      if (post.user != req.user.id) return res.status(403).send('Unauthorized');

      post
        .delete()
        .then(result => res.send(result))
        .catch(e => res.send(e));
    });
  },
);

// @route   POST api/posts/likes/:id
// @desc    add a like to a post
// @access  private
router.post(
  '/:id/likes',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (!post) return res.status(404).send();
        if (
          post.likes.filter(like => like.user.toString() === req.user.id).length
        )
          return res.status(400).send({ message: 'already liked' });

        post.likes.push({ user: req.user.id });
        post.save().then(post => res.send({ message: 'updated likes', post }));
      })
      .catch(e => res.status(500).send(e));
  },
);

module.exports = router;
