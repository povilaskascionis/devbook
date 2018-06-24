const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const Router = express.Router();

// @route GET to api/userauth/test
// @desc test userAuth route
// @access Public

Router.get('/test', (req, res) => res.json({ msg: 'User auth route works' }));

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
module.exports = Router;
