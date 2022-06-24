const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Orders = require('../models/Orders');
const moment = require('moment');
const router = express.Router()

router.put("/add/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ _id: req.params.id })
        const unique = await User.find({ _id: userID, cart: { $elemMatch: { name: data.name } } })
        if (user) {
            if (unique.length > 0) {
                req.flash("unique", "error")
                res.redirect("back")
            } else {

                await User.updateOne({ _id: userID }, {
                    $push: { cart: { name: data.name, price: data.price, qty: 1, image: data.image } }
                })
                req.flash("suc", "success")
                res.redirect("back")
            }
        } else {
            req.flash("err", "error")
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user) {
            res.render("cart/cart", {
                user: user,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})


router.put("/plus/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user) {
            await User.updateOne({ _id: userID, "cart.name": `${req.params.name}` }, {
                $inc: { "cart.$.qty": +1 }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/min/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const check = await User.findOne({ _id: user }, {
            cart: { $elemMatch: { name: req.params.name } }
        })
        const num = check.cart.map(x => x.qty)
        if (user) {
            if (num[0] > 1) {
                await User.updateOne({ _id: userID, "cart.name": `${req.params.name}` }, {
                    $inc: { "cart.$.qty": -1 }
                })
            } else {
                await User.updateOne({ _id: userID, "cart.name": `${req.params.name}` }, {
                    $pull: { cart: { name: req.params.name } }
                })
            }
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/confirm", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, location, area, phone } = user
        if (user) {
            const newOrder = [
                new Orders({
                    userID: userID,
                    order: user.cart,
                    Date: moment().locale("ar-kw").format("l"),
                    name: name,
                    location: location,
                    area: area,
                    phone: phone,
                })
            ]
            newOrder.forEach((data) => {
                data.save()
            })

            await User.updateOne({ _id: userID }, {
                $set: { cart: [] }
            })

            req.flash("order-suc", "suc")
            res.redirect("/profile/orders")
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router