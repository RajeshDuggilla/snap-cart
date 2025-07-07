const Order = require("../models/order_model");
const Cart = require("../models/cart_model");

exports.placeOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ error: "Cart is empty" });

  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    user: req.user.id,
    products: cart.items,
    totalAmount: total,
  });

  await order.save();
  cart.items = [];
  await cart.save();
  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("products.product");
  res.json(orders);
};
