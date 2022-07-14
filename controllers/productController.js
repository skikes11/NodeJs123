const { Product } = require("../model/productModel");
const { AuditLog } = require("../model/auditLogModel")
const productController = {

    addProduct: async (req, res, idUser) => {
        try {
            const product = await new Product({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                total_quantity: req.body.total_quantity,
                brand: req.body.brand,
                origin: req.body.origin,
                description: req.body.description
            });

            await product.save().then(() => {

               const auditLog = new AuditLog();
                auditLog.method = req.method
                // SAVE OLD ITEM
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                //CREATE AUDIT LOG
                auditLog.User_ID = idUser
                auditLog.newItem = product
                auditLog.url = fullUrl
                auditLog.save();
                console.log("save product successfully")
            });
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllProduct: async (req, res) => {
        try {
            const product = await Product.find();
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },

    GetAllProductsExits: async (req, res) => {
        try {

            const products = await Product.find({ total_quantity: { $gt: 0 } })

            if (products) {
                res.status(200).json(products)
            } else {
                res.status(401).json({
                    "message": "no product found"
                })
            }


        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": err.message
            });

        }
    },
    updateProduct: async (req, res, id, idUser) => {
        try {
            const product = await Product.findById(id);
            const oldProduct = await Product.findById(id);
            if (!product) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
            if(req.body.name)
                product.name = req.body.name
            if(req.body.price)
                product.price = req.body.price
            if(req.body.image)
                product.image = req.body.image
            if(req.body.brand)
                product.brand = req.body.brand
            if(req.body.total_quantity)
                product.total_quantity = req.body.total_quantity
            if(req.body.origin)
                roduct.origin = req.body.origin
            if(req.body.description)
                product.description = req.body.description

            await product.save().then(()=>{

               const auditLog = new AuditLog(); 
               auditLog.method = req.method
                // SAVE OLD ITEM
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                //CREATE AUDIT LOG
                auditLog.User_ID = idUser
                auditLog.oldItem = oldProduct
                auditLog.newItem = product
                auditLog.url = fullUrl
                auditLog.save();

                console.log("update product successfully")
            });
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    deleteProduct: async (req, res, id, idUser) => {
        try {

            const product = await Product.findById(id)

            if (product) {
                Product.findByIdAndDelete(id).then(()=>{

                   const auditLog = new AuditLog();
                    auditLog.method = req.method
                    // SAVE OLD ITEM
                    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                    //CREATE AUDIT LOG
                    auditLog.User_ID = idUser
                    auditLog.oldItem = product
                    auditLog.url = fullUrl
                    auditLog.save();
    
                })
                res.status(200).json("DELETE PRODUCT SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
        } catch (err) {
            res.status(400).json(err.message);

        }
    },

}

module.exports = productController;