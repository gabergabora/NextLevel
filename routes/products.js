const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product')
const User = require('../models/User');
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/upload/images")
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
})

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1024 * 1024 * 1000 * 1000,
    }
})


router.get("/products", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const products = await Product.find({}).sort({ Date: -1 })

        if (user.isAdmin == true) {
            res.render("admin/products/products", {
                products: products,
                del: req.flash("product-del"),
                edit: req.flash("product-edit"),
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})


router.get("/products/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const products = await Product.find({}).sort({ Date: -1 })
        const category = await Category.find({}).sort({ Date: -1 })

        if (user.isAdmin == true) {
            res.render("admin/products/add", {
                products: products,
                category: category,
                suc: req.flash("product-suc")
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/products/add", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            const { name, price, des, minDes, category } = req.body
            const newProduct = [
                new Product({
                    name: name,
                    price: price,
                    des: des,
                    minDes: minDes,
                    category: category,
                    image: req.file.filename
                })
            ]

            newProduct.forEach((data) => {
                data.save()
            })
            req.flash("product-suc", "success")
            res.redirect("back")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.delete("/products/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            await Product.deleteOne({ _id: req.params.id })
            req.flash("product-del", "+")
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/products/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ _id: req.params.id })
        const category = await Category.find({}).sort({ Date: -1 })

        if(user.isAdmin == true){
            res.render("admin/products/edit", {
                data: data,
                category: category
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/products/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, price, des, minDes, category } = req.body
        if(user.isAdmin == true){
            if (typeof req.file === "undefined") {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                        price: price,
                        des: des,
                        minDes: minDes,
                        category: category,
                    }
                })
            } else {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                        price: price,
                        des: des,
                        minDes: minDes,
                        category: category,
                        image: req.file.filename,
                    }
                })
            }

            req.flash("product-edit", "suc")
            res.redirect("/admin/products")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router