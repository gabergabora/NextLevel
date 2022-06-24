const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Work = require('../models/Work')
const moment = require('moment');

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID})
        res.render("user/index", {
            user: user
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/work", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID})
        res.render("user/work", {
            user: user,
            work_suc: req.flash("work-suc")
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/work/new", async (req, res) => {
    try {
        const { name, phone, location, brand_location, note, email } = req.body

        const newWork = [
            new Work({
                name: name,
                phone: phone,
                location: location,
                brand_location: brand_location,
                note: note,
                email: email,
                Date: moment().locale("ar-kw").format("l")
            })
        ]

        newWork.forEach((data) => {
            data.save()
        })

        req.flash("work-suc", "suc")
        res.redirect("back")
    } catch (error) {
        console.log(error);
    }
})

module.exports = router