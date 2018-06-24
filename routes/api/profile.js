const express = require('express');

const Router = express.Router();

// @route GET to api/profile/test
// @desc test profile route
// @access Public
Router.get('/test', (req, res) => res.json({ msg: 'profile route works' }));

module.exports = Router;
