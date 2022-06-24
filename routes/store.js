const express = require('express');
const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const user = await User.findOne({ _id: uesrID })
        const cat = await Category.find({}).sort({ Date: -1 })
        const products = await Product.find({}).sort({ Date: -1 }).limit(11)
        res.render("store/store", {
            user: user,
            category: cat,
            products: products
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/product/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const user = await User.findOne({ _id: uesrID })
        const data = await Product.findOne({ _id: req.params.id })
        const cat = await Category.findOne({ name: data.category})
        const products = await Product.find({ category: data.category })
        res.render("store/product", {
            user: user,
            category: cat,
            data: data,
            products: products,
            suc: req.flash("suc"),
            err: req.flash("err"),
            unique: req.flash("unique"),
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/category/:name", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const user = await User.findOne({ _id: uesrID })
        const products = await Product.find({ category: req.params.name })
        res.render("store/products", {
            user: user,
            products: products,
            cat: req.params.name
        })
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;