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
      .catch(() =>
        res.json({ nopostfound: 'post with provided id does not exist' })
      );
  }
);

// @route post api/posts/like/:id
// @desc  add a like to a post with :id
// @access Private

Router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check if current user has already liked the post i.e. if req.user.id is present in post.likes array
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json({
            alreadyliked: 'current user has already liked this post'
          });
        }

        //Add current user to likes array
        post.likes.push({ user: req.user.id });
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(500).json(err));
      })
      .catch(() =>
        res.json({ nopostfound: 'post with provided id does not exist' })
      );
  }
);

// @route post api/posts/unlike/:id
// @desc  add a like to a post with :id
// @access Private

Router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check if current user has already liked the post i.e. if req.user.id is present in post.likes array
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0 //not present in post.likes array
        ) {
          return res.status(400).json({
            notliked: 'current user have not yet liket this post'
          });
        }

        //get remove index for current user's like
        const removeIndex = post.likes
          .map(like => like.user)
          .indexOf(req.user.id);

        // Splice  out of the array
        post.likes.splice(removeIndex, 1);
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(500).json(err));
      })
      .catch(() =>
        res.json({ nopostfound: 'post with provided id does not exist' })
      );
  }
);

// @route POST api/posts/comment/:id
// @desc  add a comment to a post with :id
// @access Private

Router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //validate input data
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const { text, name, avatar } = req.body;
        const newComment = {
          text,
          name,
          avatar,
          user: req.user.id
        };

        //add to comments array
        post.comments.unshift(newComment);
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(500).json(err));
      })
      .catch(err => res.json(err));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc  remove a comment from a post with :id
// @access Private

Router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //find comment index
        commentIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        //check if comment belongs to current user
        console.log(post.comments[commentIndex]);
        if (commentIndex !== -1) {
          if (post.comments[commentIndex].user === req.user.id) {
            post.comments.splice(commentIndex, 1);
            post
              .save()
              .then(post => res.json(post))
              .catch(err => res.json(err));
          } else return res.status(401).json({ error: 'unauthorised' });
        } else return res.status(400).json({ error: 'bad comment id' });
      })
      .catch(err => res.json(err));
  }
);
module.exports = Router;
