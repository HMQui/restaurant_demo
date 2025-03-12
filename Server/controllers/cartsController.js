const cartsModel = require('../models/Carts')

const updateCarts = async (req, res) => {
    const userId = req.userId;
    const productId = req.body.productId;
    const newQuantity = Number(req.body.quantity);
    const state = req.body.state;

    try {
        if (!userId || !productId || isNaN(newQuantity) || newQuantity <= 0 || !state) {
            return res.status(400).json({ error: 1, message: "Missing or invalid fields" });
        }

        const existCart = await cartsModel.findOne({ userId, productId }).lean();

        if (!existCart) {
            if (state === 'dec') {
                return res.status(400).json({ error: 1, message: "This cart does not exist!" });
            }

            await cartsModel.create({ userId, productId, quantity: newQuantity });
            return res.json({ error: 0, message: "Successfully added to cart" });
        }

        let updatedQuantity = existCart.quantity;

        if (state === 'inc') {
            updatedQuantity += newQuantity;
        } else if (state === 'dec') {
            updatedQuantity -= newQuantity;
        } else {
            updatedQuantity = newQuantity;
        }

        if (updatedQuantity <= 0) {
            await cartsModel.deleteOne({ userId, productId });
            return res.json({ error: 0, message: "Product removed from cart" });
        }

        await cartsModel.updateOne({ userId, productId }, { $set: { quantity: updatedQuantity } });

        return res.json({ error: 0, message: "Successfully updated cart" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 1, message: "Internal server error" });
    }
};

const getCarts = async (req, res) => {
    const userId = req.userId

    try {
        const carts = await cartsModel.find({ userId }).lean();

        return res.json({ error: 0, carts })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 1, message: "Internal server error" });
    }
}

module.exports = {
    updateCarts,
    getCarts,
}
