const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Work = require('../models/Work')

router.get("/admin/panel", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            const work = await Work.find({}).sort({ Date: -1})
            res.render("admin/work/panel", {
                work: work
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/get/:id", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            const work = await Work.findOne({ _id: req.params.id})
            res.render("admin/work/get", {
                work: work
            })
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router