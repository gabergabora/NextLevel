const express = require('express')
const User = require('../models/User')
const Orders = require('../models/Orders')
const Post = require('../models/Post')
const Champion = require('../models/Champion')
const router = express.Router()

router.get("/", async (req, res) => {
    res.redirect("/profile/posts")
})

router.get("/orders", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ userID: userID }).sort({ Date: -1 })
        const post = await Post.find({ authorID: userID })
        const champion = await Champion.find({ players: { $elemMatch: { userID: userID } } })
        if (user) {
            res.render("profile/profile", {
                user: user,
                orders: true,
                order: orders,
                champions: false,
                champion: champion,
                posts: false,
                post: post,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/orders/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const order = await Orders.findOne({ _id: req.params.id })

        res.render("profile/get-order", {
            user: user,
            data: order,
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/posts", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ userID: userID }).sort({ Date: -1 })
        const post = await Post.find({ authorID: userID }).sort({ Date: -1})
        const champion = await Champion.find({ players: { $elemMatch: { userID: userID } } })
        if (user) {
            res.render("profile/profile", {
                user: user,
                orders: false,
                order: orders,
                champions: false,
                champion: champion,
                posts: true,
                post: post,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/champions", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const orders = await Orders.find({ userID: userID }).sort({ Date: -1 })
        const post = await Post.find({ authorID: userID })
        const champion = await Champion.find({ players: { $elemMatch: { userID: userID } } }).sort({ Date: -1 })
        if (user) {
            res.render("profile/profile", {
                user: user,
                orders: false,
                order: orders,
                champions: true,
                champion: champion,
                posts: false,
                post: post,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/info/edit", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            res.render("profile/edit-user", {
                user: user
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/info/edit", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            const { name, location, phone, area } = req.body
            await User.updateOne({ _id: userID }, {
                $set: {
                    name: name,
                    location: location,
                    phone: phone,
                    area: area,
                }
            })

            await Post.updateMany({ authorID: userID }, {
                $set: {
                    authorName: name
                }
            })

            await Champion.updateMany({ players: { $elemMatch: { userID: userID } } }, {
                $set: {
                    "players.$.name": name,
                }
            })

            await Post.updateMany({ comments: { $elemMatch: { authorID: userID }}}, {
                $set:{
                    "comments.$.name": name
                }
            })

            res.redirect("/profile/posts")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user){
            res.render("profile/submit_delete", {
                user: user,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user) {
            await User.deleteOne({ _id: userID })
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router