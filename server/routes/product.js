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

router.post("/products", (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let findArgs= {};
    for(let key in req.body.filters){
            if(req.body.filters[key].length > 0){
                findArgs[key] = req.body.filters[key];
            }
        }
    

    console.log('findArgs', findArgs)

    Product.find(findArgs) 
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({ success: false, err })
            
            return res.status(200).json({ 
                    success: true, 
                    productInfo,
                    postSize:productInfo.length })
        })
})

module.exports = router