const Cart = require("../models/cart_model");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { product, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const index = cart.items.findIndex((item) => item.product.equals(product));
  if (index > -1) cart.items[index].quantity += quantity;
  else cart.items.push({ product, quantity });

  await cart.save();
  res.json(cart);
};

exports.updateCart = async (req, res) => {
  const { product, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.items.find((i) => i.product.equals(product));
  if (item) item.quantity = quantity;
  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { product } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter((i) => !i.product.equals(product));
  await cart.save();
  res.json(cart);
};
