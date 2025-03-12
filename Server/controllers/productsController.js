const ProductsModel = require('../models/Products')

const createProduct = async (req, res) => {    
    const newProduct = req.body.newProduct;
    try {
        if (!newProduct.name || !newProduct.title || !newProduct.subTitle || !newProduct.price || !newProduct.category || !newProduct.image) {
            return res.status(400).json({ error: 1, message: "Missing required fields" });
        }

        newProduct.id = newProduct.name.toLowerCase().replace(/ /g, '-');
        newProduct.price = Number(newProduct.price);

        const dataToSave = new ProductsModel(newProduct);
        await dataToSave.save();

        res.status(201).json({ error: 0, message: "Product created successfully" });
    } catch (error) {
        console.log('Something wrong when creating product:', error);
        res.status(500).json({ error: 1, message: "Server error" });
    }
}

const searchProducts = async (req, res) => {    
    try {
        const filter = req.query;        

        for (const key in filter) {
            if (key === 'price') {
                filter[key] = Number(filter[key]);
            }
        }        

        const products = await ProductsModel.find(filter).lean();

        res.status(200).json({ error: 0, products: products });
    } catch (error) {
        console.log('Something wrong when fetching products:', error);
        res.status(500).json({ error: 1, message: "Server error" });
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id
    const changeData = req.body
    
    try {
        if (!id || !changeData) return res.status(400).json({ error: 1, message: 'Missing some required fields' })

        if (changeData.price) {
            changeData.price = Number(changeData.price);
        }
        if (changeData.name) {
            changeData.id = changeData.name.toLowerCase().replace(/\s+/g, "");
        }

        await ProductsModel.updateOne({ id }, { $set: changeData })

        res.status(200).json({ error: 0, message: 'This product has been changed' });
    } catch (error) {
        console.log('Something wrong when changing product data:', error);
        res.status(500).json({ error: 1, message: "Server error" });
    }
}

const getManyProducts = async (req, res) => {
    const id = req.body.productsId

    try {
        if (!Array.isArray(id) || id.length === 0) {
            return res.status(400).json({ error: 1, message: "Invalid productId format" });
        }

        const products = await ProductsModel.find({ id: { $in: id } });

        return res.json({ error: 0, products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server is broken" })
    }
}

module.exports = {
    searchProducts,
    createProduct,
    updateProduct,
    getManyProducts,
}
