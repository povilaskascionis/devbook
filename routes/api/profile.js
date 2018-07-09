const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Router = express.Router();
//Load profile model
const Profile = require('../../models/Profile');
//Load User model
const User = require('../../models/User');

// @route GET to api/profile
// @desc Get currently logged in user details
// @access Private
Router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'This user has no valid profile';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST to api/profile
// @desc Post profile details to create new profile
// @access Private
Router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //get form fields from request
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
  }
);

module.exports = Router;
