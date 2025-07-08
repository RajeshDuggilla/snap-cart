const Cart = require("../models/cart_model");

exports.getCart = async (req, res) => {
   try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json( cart || { items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", detail: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { product, quantity } = req.body;

if (!product || quantity <= 0) {
  return res.status(400).json({ error: "Valid product and quantity required" });
}

let cart = await Cart.findOne({ user: req.user.id });
if (!cart) {
  cart = new Cart({ user: req.user.id, items: [] });
}

const index = cart.items.findIndex((item) => item.product.equals(product));

if (index > -1) {
  // Product already in cart → increment quantity
  cart.items[index].quantity += quantity;
} else {
  // New product → push to cart
  cart.items.push({ product, quantity });
}

await cart.save();
res.status(200).json({ message: "Cart updated", cart });

};

exports.updateCart = async (req, res) => {
  const { product, quantity } = req.body;

  if (!product || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Valid product ID and non-negative quantity required" });
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const item = cart.items.find((i) => i.product.equals(product));
  if (!item) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  if (quantity === 0) {
    // Remove item if quantity is zero
    cart.items = cart.items.filter((i) => !i.product.equals(product));
  } else {
    // Update quantity
    item.quantity = quantity;
  }

  await cart.save();
  res.status(200).json(cart);
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((i) => !i.product.equals(product));

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    await cart.save();
    res.status(200).json({ message: "Product removed", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove product", detail: err.message });
  }
};
