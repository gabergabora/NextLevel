const express = require('express');
const User = require('../models/User');
const router = express.Router();


router.get("/", async (req, res) => {
    const uesrID = req.cookies.id
    const user = await User.findOne({ _id: uesrID })
    res.render("reservation/category", {
        user: user,
    })
})

router.get("/admin/add", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const user = await User.findOne({ _id: uesrID })

        if(user.isAdmin == true){
            res.render("admin/reservation/add")
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router