const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const userAuth = require('./routes/api/userAuth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

//DB connection
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('DB connection established'))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport.js')(passport);

//use route files
app.use('/api/userAuth', userAuth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
