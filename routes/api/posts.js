const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post model
const Post = require('../../models/Post');

//Post input validation
const validatePostInput = require('../../validation/post');

// @route GET api/posts
// @desc  fetsh all posts in an array
// @access Public

Router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post are avaialble' })
    );
});

// @route GET api/posts/:id
// @desc  fetsh post by ID
// @access Public

Router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with this ID' })
    );
});

// @route POST api/posts
// @desc  create a post
// @access Private

Router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //validate input data
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({
      text,
      name,
      avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(err => res.status(500).json(err));
  }
);

// @route DELETE api/posts/:id
// @desc  delete a post
// @access Private

Router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() === req.user.id) {
          post
            .remove()
            .then(() => res.json({ success: 'post deleted' }))
            .catch(err => res.json(err));
        } else res.status(401).json({ authError: 'action not authorized' });
      })
      .catch(err =>
        res.json({ nopostfound: 'post with provided id does not exist' })
      );
  }
);

module.exports = Router;
