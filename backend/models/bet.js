const mongoose = require('mongoose');

const betSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  private: {
    type: Boolean,
    default: false
  },
  comments: {
    type: Boolean,
    default: false
  },

  prize: {
    type: String,
    required: true
  },
  participants: {
    type: []
  }
});

module.exports = mongoose.model('Bet', betSchema);
