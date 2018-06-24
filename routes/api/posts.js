const express = require('express');

const Router = express.Router();

// @route GET to api/posts/test
// @desc test posts route
// @access Public
Router.get('/test', (req, res) => res.json({ msg: 'posts route works' }));

module.exports = Router;
