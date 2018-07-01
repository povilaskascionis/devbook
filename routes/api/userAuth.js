const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const Router = express.Router();

// @route GET to api/userauth/register
// @desc new user registration
// @access Public

Router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'email already exists' });
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
            .catch(err => console.log(err))
            .then(user => res.json(user));
        });
      });
    }
  });
});

// @route GET to api/userauth/login
// @desc return the JWT
// @access Public

Router.post('/login', (req, res) => {
  const { email, password } = req.body;

  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      res.status(404).json({ email: 'User with this email does not exist' });
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
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
        return res.status(400).json({ password: 'password is incorrect' });
      }
    });
  });
});
module.exports = Router;
