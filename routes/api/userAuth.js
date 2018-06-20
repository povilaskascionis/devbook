const express = require("express");

const Router = express.Router();

// @route GET to api/userauth/test
// @desc test userAuth route
// @access Public

Router.get("/test", (req, res) => res.json({ msg: "User auth route works" }));

module.exports = Router;
