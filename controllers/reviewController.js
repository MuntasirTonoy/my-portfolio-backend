const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public (Filter by published) / Admin (All)
const getReviews = async (req, res) => {
  try {
    const { all } = req.query; // Admin can request ?all=true
    const filter = all === 'true' ? {} : { isPublished: true };
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  const { name, role, review, avatar, rating } = req.body;
  try {
    const newReview = await Review.create({ name, role, review, avatar, rating });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review (isPublished)
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : review.isPublished;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
