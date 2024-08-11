const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Photo', photoSchema);


