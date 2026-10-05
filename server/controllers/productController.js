const Product = require('../models/Product');

// @desc    Fetch all products with search, filter, and sort
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, sort } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let apiQuery = Product.find(query);

    if (sort) {
      if (sort === 'priceAsc') {
        apiQuery = apiQuery.sort({ pricePerKg: 1 });
      } else if (sort === 'priceDesc') {
        apiQuery = apiQuery.sort({ pricePerKg: -1 });
      } else if (sort === 'nameAsc') {
        apiQuery = apiQuery.sort({ name: 1 });
      } else if (sort === 'nameDesc') {
        apiQuery = apiQuery.sort({ name: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, image, pricePerKg, stock } = req.body;

    const product = new Product({
      name,
      description,
      category,
      image: image || '/images/sample-onion.jpg',
      pricePerKg: Number(pricePerKg) || 0,
      stock: Number(stock) || 0,
      dailyPriceHistory: [{ price: Number(pricePerKg) || 0, date: new Date() }],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, image, pricePerKg, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const oldPrice = product.pricePerKg;

      product.name = name || product.name;
      product.description = description !== undefined ? description : product.description;
      product.category = category || product.category;
      product.image = image !== undefined ? image : product.image;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      // If price is changing, also add it to daily price history
      if (pricePerKg !== undefined && Number(pricePerKg) !== oldPrice) {
        const newPrice = Number(pricePerKg);
        product.pricePerKg = newPrice;
        product.dailyPriceHistory.push({ price: newPrice, date: new Date() });
        if (product.dailyPriceHistory.length > 30) {
          product.dailyPriceHistory.shift();
        }
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update daily onion price
// @route   PUT /api/products/:id/daily-price
// @access  Private/Admin
const updateDailyPrice = async (req, res, next) => {
  try {
    const { price } = req.body;

    if (price === undefined || isNaN(price) || Number(price) <= 0) {
      res.status(400);
      return next(new Error('Please provide a valid price greater than 0'));
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const newPrice = Number(price);
      product.pricePerKg = newPrice;
      product.dailyPriceHistory.push({ price: newPrice, date: new Date() });

      // Limit size to last 30 price logs
      if (product.dailyPriceHistory.length > 30) {
        product.dailyPriceHistory.shift();
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update onion stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || isNaN(stock) || Number(stock) < 0) {
      res.status(400);
      return next(new Error('Please provide a valid stock number greater than or equal to 0'));
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.stock = Number(stock);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateDailyPrice,
  updateStock,
};
