const router = require("express").Router()

const cartsController = require('../controllers/cartsController')

// update cart /api/carts/update [POST]
router.post("/update", cartsController.updateCarts);

// get carts /api/carts/get [GET]
router.get("/get", cartsController.getCarts);

module.exports = router;
