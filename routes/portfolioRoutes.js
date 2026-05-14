const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPortfolio);

router.route('/:section')
  .put(protect, updatePortfolio);

module.exports = router;
