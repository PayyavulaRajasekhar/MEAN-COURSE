const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const mongoURL = 'mongodb+srv://raja:hCGrjZrG1S5KWVbq@mean-zrc5r.mongodb.net/MEAN_APP?retryWrites=true&w=majority';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log("Database Connected");
  }).catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join('backend/images')));

app.use(cors());

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
