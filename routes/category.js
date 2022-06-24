const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const User = require("../models/User")
const Product = require("../models/Product")


router.get("/category", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.find({}).sort({ Date: -1 })

        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/category/category", {
                    err: req.flash("cat-error"),
                    category: category,
                    del: req.flash("cat-del"),
                    edit_suc: req.flash("edit-success"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/category/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const catName = req.body.name

        if (user.isAdmin == true) {
            const check = await Category.findOne({ name: catName })
            if (check) {
                req.flash("cat-error", "err")
            } else {
                const newCategory = [
                    new Category({
                        name: req.body.name
                    })
                ]

                newCategory.forEach((data) => {
                    data.save()
                })
            }

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.delete("/category/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Category.deleteOne({ _id: req.params.id })
            req.flash("cat-del", "success")
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.find({}).sort({ Date: -1 })
        const data = await Category.findOne({ _id: req.params.id })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/category/edit", {
                    err: req.flash("cat-error"),
                    category: category,
                    del: req.flash("cat-del"),
                    data: data,
                    edit_err: req.flash("edit-err"), 
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const name = req.body.name;
        const check = await Category.findOne({ name: name })
        const data = await Category.findOne({ _id: req.params.id})

        if (user.isAdmin == true) {
            if (check) {
                req.flash("edit-err", "error")
                res.redirect("back")
            } else if(name == ""){
                res.redirect("/admin/category")
            } else {
                await Product.updateMany({ category: data.name }, {
                    $set: {
                        category: name,
                    }
                })
                await Category.updateOne({ _id: req.params.id }, {
                    $set: { name: name }
                })

                req.flash("edit-success", "success")
                res.redirect("/admin/category")
            }
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router