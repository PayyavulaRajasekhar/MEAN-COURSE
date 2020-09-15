const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const user = require('../models/user');

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'user created',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    })
  })
});

router.post('/login', (req, res) => {
  console.log('login request');
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign(
      { email: fetchedUser.email, id: fetchedUser._id },
      "secret_should_be_longer",
      { expiresIn: '1hr' }
      );
      res.status(200).json({
        token: token
      });
  }).catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

module.exports = router;
