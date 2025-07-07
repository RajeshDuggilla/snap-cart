const router = require("express").Router();
const ctrl = require("../controllers/product_controller");
const { auth, authorize } = require("../middleware/auth_middleware");

router.get("/", ctrl.getProducts);
router.post("/", auth, authorize(["admin"]), ctrl.createProduct);
router.put("/:id", auth, authorize(["admin"]), ctrl.updateProduct);
router.delete("/:id", auth, authorize(["admin"]), ctrl.deleteProduct);

module.exports = router;
