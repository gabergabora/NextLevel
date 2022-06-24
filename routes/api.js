const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const moment = require('moment');

router.get("/register", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            res.redirect("/")
        } else {
            res.render("api/register", {
                user: user,
                err: req.flash("email-error")
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, location, area, password } = req.body;
        const check = await User.findOne({ email: email })

        if (check) {
            req.flash("email-error", "error")
            res.redirect("/api/register")
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = [
                new User({
                    name: name,
                    email: email,
                    phone: phone,
                    location: location,
                    area: area,
                    password: hashedPassword,
                })
            ]

            newUser.forEach((data) => {
                data.save()
            })
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error);
    }
})


router.get("/login", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            res.redirect("back")
        } else {
            res.render("api/login", {
                user: user,
                err: req.flash("login-error")
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if (user) {
            const compare = await bcrypt.compare(password, user.password)
            if (compare) {
                res.cookie("id", user.id, { maxAge: moment().add(4, "months") })
                res.redirect("/")
            } else {
                req.flash("login-error", "error")
                res.redirect("back")
            }
        } else {
            req.flash("login-error", "error")
            res.redirect("back")

        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("id")
        res.redirect("/api/login")
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;