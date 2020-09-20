const express = require('express');
const router = express.Router();
const multer  = require('multer');
const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product");


//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
var upload = multer({ storage: storage }).single("file")

router.post("/image", auth, (req, res) => {
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post("/", auth, (req, res) => {
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

///api/product/products
router.post("/products", (req, res) => {
    Product.find() 
        .populate("writer")
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ success: true, productInfo })
        })
})


module.exports = router