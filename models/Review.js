const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  review: { type: String, required: true },
  avatar: { type: String, default: 'https://i.ibb.co/0Q7SjY0/avatar-placeholder.png' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
