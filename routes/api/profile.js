const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
      .populate('user', ['name', 'avatar'])
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

// @route GET to api/profile/all
// @desc Get profile by handle
// @access Public

Router.get('/all', (req, res) => {
  errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfile = 'No profiles were found';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.json(err));
});

// @route GET to api/profile/handle/{handle}
// @desc Get profile by handle
// @access Public

Router.get('/handle/:handle', (req, res) => {
  errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Such profile does not exist';
        return res.status(404).json(erros);
      }
      res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

// @route GET to api/profile/user/{user_id}
// @desc Get profile by user ID
// @access Public

Router.get('/user/:user_id', (req, res) => {
  errors = {};
  Profile.findOne({ _id: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Such profile does not exist';
        return res.status(404).json(erros);
      }
      res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

// @route POST to api/profile
// @desc Post profile details to create or update new profile
// @access Private
Router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validate profile input
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    //get form fields from request
    const profileFields = {};
    profileFields.social = {};
    profileFields.user = req.user.id;
    requestKeys = Object.keys(req.body); //get the keys of req.body
    for (let i = 0; i < requestKeys.length; i++) {
      // iterate over request body and form profileFields object based on Profile model
      // look for specific keys to assign/modify their value as needed
      if (req.body[requestKeys[i]]) {
        switch (requestKeys[i]) {
          case 'skills':
            profileFields.skills = req.body[requestKeys[i]].split(','); // split skills into skill array
            break;
          //form social object
          case 'youtube':
            profileFields.social.youtube = req.body[requestKeys[i]];
            break;
          case 'linkedin':
            profileFields.social.linkedin = req.body[requestKeys[i]];
            break;
          case 'twitter':
            profileFields.social.twitter = req.body[requestKeys[i]];
            break;
          case 'instagram':
            profileFields.social.instagram = req.body[requestKeys[i]];
            break;
          case 'facebook':
            profileFields.social.facebook = req.body[requestKeys[i]];
            break;
          default:
            profileFields[requestKeys[i]] = req.body[requestKeys[i]];
        }
      }
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //if profile exists update it
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(profile => res.json(profile))
          .catch(err => console.log(err));
      } else {
        //create a new profile/update existing one
        //first check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'User with this handle already exists';
            res.status(400).json(errors);
          }
          //save profile
          new Profile(profileFields)
            .save()
            .then(profile => {
              res.json(profile);
            })
            .catch(err => console.log(err));
        });
      }
    });
  }
);

// @route POST to api/profile/experience
// @desc Add experience to the profile
// @access Private

Router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
      const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
      //add to experience array
      profile.experience.unshift(newExperience);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(500).json(err));
    });
  }
);

// @route POST to api/profile/education
// @desc Add education to the profile
// @access Private

Router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      } = req.body;
      const newEdu = {
        school,
        degree,
        field: fieldOfStudy,
        from,
        to,
        current,
        description
      };
      //add to experience array
      profile.education.unshift(newEdu);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(500).json(err));
    });
  }
);

// @route DELETE to api/profile/experience/:exp_id
// @desc delete an experience from the profile
// @access Private

Router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get index of experience to be removed
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        if (removeIndex === -1)
          return res
            .status(400)
            .json({ error: 'invalid experience id provided in request' });
        //Splice experience from array
        profile.experience.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route DELETE to api/profile/education/:edu_id
// @desc delete an education from the profile
// @access Private
Router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        if (removeIndex === -1) {
          return res
            .status(400)
            .json({ error: 'invalid experience id provided in request' });
        }

        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route DELETE to api/profile
// @desc delete user and profile
// @access Private

Router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findByIdAndRemove({ user: req.user.id }).then(() => {
      User.findByIdAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = Router;
