const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Champion = require('../models/Champion')
const multer = require('multer')
const moment = require('moment');
const Orders = require('../models/Orders');

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


router.get("/admin/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user && user.isAdmin == true) {
            res.render("admin/champion/add")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/admin/add", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user && user.isAdmin == true) {
            const { name, limit, des, price, start_date } = req.body
            const newChampion = [
                new Champion({
                    title: name,
                    limit: limit,
                    des: des,
                    price: price,
                    Date: moment().locale("ar-kw").format("l"),
                    start_date: start_date,
                    image: req.file.filename
                })
            ]

            newChampion.forEach((data) => {
                data.save()
            })

            res.redirect("/champion/admin/panel")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/panel", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const champion = await Champion.find({}).sort({ Date: -1 })
        if (user && user.isAdmin == true) {
            res.render("admin/champion/panel", {
                champion: champion
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Champion.findOne({ _id: req.params.id })

        if (user && user.isAdmin == true) {
            res.render("admin/champion/data", {
                data: data,
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const champion = await Champion.find({}).sort({ start_date: -1 })
        res.render("champion/panel", {
            champion: champion,
            user: user
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Champion.findOne({ _id: req.params.id })
        const check = await Champion.find({ _id: req.params.id, players: { $elemMatch: { userID: userID } } })

        var detect = false

        if (check.length > 0) {
            detect = true
        }

        res.render("champion/get", {
            data: data,
            user: user,
            detect: detect,
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/:id/add-player", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Champion.findOne({ _id: req.params.id }).sort({ Date: -1 })
        const check = await Champion.find({ _id: req.params.id, players: { $elemMatch: { userID: userID } } })
        var detect = false

        if (check.length > 0) {
            detect = true
        }

        if (user && detect == false) {
            res.render("champion/add-player", {
                user: user,
                data: data,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/:id/add-player", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const champion = await Champion.findOne({ _id: req.params.id })
        const check = await Champion.find({ _id: req.params.id, players: { $elemMatch: { userID: userID } } })
        var detect = false

        if (check.length > 0) {
            detect = true
        }

        if (user && champion.isStock == true && detect == false) {
            if (champion.players.length < champion.limit) {
                await Champion.updateOne({ _id: req.params.id }, {
                    $push: {
                        players: {
                            name: user.name,
                            phone: user.phone,
                            location: user.location,
                            Date: `${moment().locale("ar-kw").format("l")}`,
                            userID: userID,
                            stage: 1,
                        }
                    },
                })

                if (champion.players.length == champion.limit - 1) {
                    await Champion.updateOne({ _id: req.params.id }, {
                        $set: {
                            isStock: false,
                        }
                    })
                }

                const order = { name: champion.title, price: champion.price, image: champion.image }

                const newOrder = [
                    new Orders({
                        userID: userID,
                        name: user.name,
                        location: user.location,
                        area: user.area,
                        phone: user.phone,
                        order: order,
                        isChampion: true,
                        Date: moment().locale("ar-kw").format("l"),
                    })
                ]

                newOrder.forEach((data) => {
                    data.save()
                })

                res.redirect("/profile/champions")

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

router.put("/admin/:id/close", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Champion.updateOne({ _id: req.params.id }, {
                $set: {
                    isStock: false,
                }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/:id/open", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Champion.updateOne({ _id: req.params.id }, {
                $set: {
                    isStock: true,
                }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/:id/remove/:player_id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user.isAdmin == true) {
            await Champion.updateOne({ _id: req.params.id }, {
                $pull: {
                    players: { userID: req.params.player_id }
                }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/:id/start", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const champion = await Champion.findOne({ _id: req.params.id })

        if (user) {
            if (user.isAdmin == true) {
                var rounds = [];
                var num = champion.players.length
                rounds.push(num)
                for (let i = 0; i < champion.players.length; i++) {
                    num = num / 2
                    rounds.push(num)
                    if (num == 1) {
                        break;
                    }
                }

                rounds.forEach(async (data) => {
                    await Champion.updateOne({ _id: req.params.id }, {
                        $push: {
                            rounds: data
                        }
                    })
                })

                await Champion.updateOne({ _id: req.params.id }, {
                    $set: {
                        start: true,
                    },
                })

                res.redirect("back")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})


router.put("/admin/:champion_id/next-stage/:player_id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { champion_id, player_id } = req.params
            const champ = await Champion.findOne({ _id: champion_id })

            const check = await Champion.findOne({ _id: champion_id }, {
                players: { $elemMatch: { userID: player_id } }
            })

            const num = check.players.map(x => x.stage)

            if (num[0] < champ.rounds.length) {
                await Champion.updateMany({ _id: champion_id, "players.userID": player_id }, {
                    $inc: { "players.$.stage": +1 }
                })
            }

            res.redirect("back")
        }

    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/:champion_id/back-stage/:player_id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { champion_id, player_id } = req.params
            const champ = await Champion.findOne({ _id: champion_id })

            const check = await Champion.findOne({ _id: champion_id }, {
                players: { $elemMatch: { userID: player_id } }
            })

            const num = check.players.map(x => x.stage)

            if (num[0] > 1) {
                await Champion.updateMany({ _id: champion_id, "players.userID": player_id }, {
                    $inc: { "players.$.stage": -1 }
                })
            }

            res.redirect("back")
        }

    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/:id/done", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Champion.findOne({ _id: req.params.id })

        const winner = data.players.map(x => x.stage)
        var largest = winner[0];

        for (var i = 0; i < winner.length; i++) {
            if (largest < winner[i]) {
                largest = winner[i];
            }
        }

        const getWinner = await Champion.findOne({ _id: req.params.id }, {
            players: { $elemMatch: { stage: largest } }
        })

        const winnerName = getWinner.players.map(y => y.name)
        const winnerID = getWinner.players.map(y => y.userID)

        if (user.isAdmin == true) {
            res.render("admin/champion/done", {
                user: user,
                data: data,
                winner: winnerName[0],
                winnerID: winnerID[0]
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/:id/:winner/:winnerID/done", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { id, winner, winnerID } = req.params
            await Champion.updateOne({ _id: id }, {
                $set: {
                    winner: winner,
                    winnerID: winnerID,
                    finshed: true,
                }
            })

            res.redirect(`/champion/get/${id}`)
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const data = await Champion.findOne({ _id: req.params.id })
            res.render("admin/champion/edit", {
                data: data
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { name, limit, des, price, start_date } = req.body
            if (typeof req.file === "undefined") {
                await Champion.updateOne({ _id: req.params.id }, {
                    $set: {
                        title: name,
                        limit: limit,
                        des: des,
                        price: price,
                        start_date: start_date,
                    }
                })
            } else {
                await Champion.updateOne({ _id: req.params.id }, {
                    $set: {
                        title: name,
                        limit: limit,
                        des: des,
                        price: price,
                        Date: moment().locale("ar-kw").format("l"),
                        start_date: start_date,
                        image: req.file.filename
                    }
                })
            }

            res.redirect("/champion/admin/panel")
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router