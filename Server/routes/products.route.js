const router = require('express').Router();
const productsController = require('../controllers/productsController');

// Create a product [POST] /products/create
router.post("/create", productsController.createProduct);

// Search products with filters [GET] /products/search
router.get("/search", productsController.searchProducts);

// Change product's data with id [PATCH] /products/change
router.patch("/update/:id", productsController.updateProduct);

// Get many products [GET] /products/get-many
router.post("/get-many", productsController.getManyProducts)

module.exports = router;