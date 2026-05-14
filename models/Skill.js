const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    icon: String,
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
