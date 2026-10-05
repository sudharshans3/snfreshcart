const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create a new product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    if (!rating || !comment || !productId) {
      res.status(400);
      return next(new Error('Please provide rating, comment, and product ID'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      res.status(400);
      return next(new Error('You have already reviewed this product'));
    }

    const review = new Review({
      user: req.user._id,
      userName: req.user.name,
      product: productId,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
};
