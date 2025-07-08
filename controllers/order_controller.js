const Order = require("../models/order_model");
const Cart = require("../models/cart_model");

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = new Order({
      user: req.user.id,
      products: cart.items.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
        price: product.price,
      })),
      totalAmount,
      status: "placed", 
    });

    await order.save();

    // Clear cart after placing order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: "Order placement failed", detail: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const orders = await Order.find({ user: req.user.id })
      .populate("products.product")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", detail: err.message });
  }
};
