const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Orders = require('../models/Orders');

router.get('/new', async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ isAccept: false, isReject: false })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/orders", {
                    user: user,
                    orders: orders,
                    accept: req.flash("order-accept"),
                    reject: req.flash("order-reject"),
                    title: "الطلبات الجديدة",
                    done: req.flash("order-done"),
                    reject_from_accept: req.flash("reject-from-accept"),
                    done_order: req.flash("order-done-alert"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Orders.findOne({ _id: req.params.id })

        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/order", {
                    data: data,
                    user: user
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})


router.put("/accept/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isAccept: true }
            })

            req.flash("order-accept", " success ")
            res.redirect("/admin/orders/new")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/reject/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isReject: true }
            })

            req.flash("order-reject", " success ")
            res.redirect("/admin/orders/new")
        }
    } catch (error) {
        console.log(error);
    }
})


router.get("/rejected", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ isAccept: false, isReject: true })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/orders", {
                    user: user,
                    orders: orders,
                    accept: req.flash("order-accept"),
                    reject: req.flash("order-reject"),
                    title: "الطلبات المرفوضة",
                    done: req.flash("order-done"),
                    reject_from_accept: req.flash("reject-from-accept"),
                    done_order: req.flash("order-done-alert"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/accept-from-reject/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isAccept: true, isReject: false }
            })

            req.flash("order-accept", " success ")
            res.redirect("/admin/orders/rejected")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/accepted", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ isAccept: true, isComming: false, isDone: false })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/orders", {
                    user: user,
                    orders: orders,
                    accept: req.flash("order-accept"),
                    reject: req.flash("order-reject"),
                    title: "الطلبات المقبولة",
                    done: req.flash("order-done"),
                    reject_from_accept: req.flash("reject-from-accept"),
                    done_order: req.flash("order-done-alert"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/comming/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isComming: true },
            })

            req.flash("order-done", " success ")
            res.redirect("/admin/orders/accepted")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/reject-from-accept/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isReject: true, isAccept: false },
            })

            req.flash("reject-from-accept", " success ")
            res.redirect("/admin/orders/accepted")
        }
    } catch (error) {
        console.log(error);
    }
})


router.get("/comming", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ isComming: true, isDone: false })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/orders", {
                    user: user,
                    orders: orders,
                    accept: req.flash("order-accept"),
                    reject: req.flash("order-reject"),
                    title: "الطلبات الجاهزة للشحن",
                    done: req.flash("order-done"),
                    reject_from_accept: req.flash("reject-from-accept"),
                    done_order: req.flash("order-done-alert"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/done/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Orders.updateOne({ _id: req.params.id }, {
                $set: { isDone: true },
            })

            req.flash("order-done-alert", " success ")
            res.redirect("/admin/orders/comming")
        }
    } catch (error) {
        console.log(error);
    }
})


router.get("/done", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ isDone: true })
        if (user) {
            if (user.isAdmin == true) {
                res.render("admin/orders/orders", {
                    user: user,
                    orders: orders,
                    accept: req.flash("order-accept"),
                    reject: req.flash("order-reject"),
                    title: "سجل الفواتير",
                    done: req.flash("order-done"),
                    reject_from_accept: req.flash("reject-from-accept"),
                    done_order: req.flash("order-done-alert"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router