const router = require("express").Router();
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cart_controller");

const { auth, authorize } = require("../middleware/auth_middleware");

router.get("/", auth, authorize(["customer"]), getCart);
router.post("/add", auth, authorize(["customer"]), addToCart);
router.put("/update", auth, authorize(["customer"]), updateCart);
router.delete("/remove", auth, authorize(["customer"]), removeFromCart);

module.exports = router;


