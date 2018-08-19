const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const Router = express.Router();

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route POST to api/userauth/register
// @desc new user registration
// @access Public

Router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' //default avatar
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET to api/userauth/login
// @desc return the JWT
// @access Public

Router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  }
  const { email, password } = req.body;

  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User with this email does not exist';
      res.status(404).json(errors);
    }

    //check password
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          //password is correct, create payload to include in JWT
          const { id, name, avatar } = user;
          const payload = { id, name, avatar };
          //generate JWT
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 86400 },
            (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          );
        } else {
          errors.password = 'Password is incorrect';
          return res.status(400).json(errors);
        }
      })
      .catch(err => console.log(err));
  });
});

// @route GET to api/userauth/current
// @desc return currently logged in user
// @access Private
Router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, name, avatar } = req.user;
    res.json({ id, name, avatar });
  }
);
module.exports = Router;
