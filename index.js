const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

const authRoutes = require("./routes/auth_route");
const productRoutes = require("./routes/product_route");
const cartRoutes = require("./routes/cart_route");
const orderRoutes = require("./routes/order_route");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));
// app.get("/", (req, res) => {
//   res.send("Welcome to the SnapShop API");
// });

const PORT = process.env.PORT || 3000;
console.log(PORT);
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

module.exports = app; 