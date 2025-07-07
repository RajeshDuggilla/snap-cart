const router = require("express").Router();
const { placeOrder, getOrders } = require("../controllers/order_controller");

const { auth, authorize } = require("../middleware/auth_middleware");

router.post("/place", auth, authorize(["customer"]), placeOrder);
router.get("/my", auth, authorize(["customer"]), getOrders);

module.exports = router;

